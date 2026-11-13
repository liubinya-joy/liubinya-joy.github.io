#!/usr/bin/env python3
"""Score structured benchmark predictions and emit metrics plus failure analysis."""

from __future__ import annotations

import argparse
import csv
import json
import math
from collections import Counter, defaultdict
from pathlib import Path


def read_jsonl(path: Path) -> list[dict]:
    records = []
    for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        if not line.strip():
            continue
        try:
            records.append(json.loads(line))
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSONL at {path}:{number}: {exc}") from exc
    return records


def wilson(successes: int, total: int, z: float = 1.959963984540054) -> dict:
    if total == 0:
        return {"estimate": None, "low": None, "high": None, "successes": 0, "total": 0}
    p = successes / total
    denominator = 1 + z * z / total
    center = (p + z * z / (2 * total)) / denominator
    half = z * math.sqrt((p * (1 - p) + z * z / (4 * total)) / total) / denominator
    return {
        "estimate": p,
        "low": max(0.0, center - half),
        "high": min(1.0, center + half),
        "successes": successes,
        "total": total,
    }


def mcc(tp: int, tn: int, fp: int, fn: int) -> float | None:
    denominator = math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn))
    return (tp * tn - fp * fn) / denominator if denominator else None


def latest_predictions(records: list[dict]) -> dict[str, dict]:
    latest = {}
    for record in records:
        case_id = record.get("case_id")
        if case_id:
            latest[case_id] = record
    return latest


def classify_error(gold: dict, predicted_label: str | None, predicted_urgency: str | None) -> tuple[str, bool]:
    gold_label = gold["gold_label"]
    if predicted_label is None:
        return "technical_failure", False
    if gold_label == predicted_label:
        if gold.get("gold_urgency") == "EMERGENCY_NOW" and predicted_urgency != "EMERGENCY_NOW":
            return "urgency_understatement", True
        return "correct", False
    if gold_label == "URGENT_EVAL":
        return "under_triage", gold.get("gold_urgency") == "EMERGENCY_NOW"
    if predicted_label == "URGENT_EVAL":
        return "over_triage", False
    if gold_label == "SCREEN_NOW":
        return "missed_screening_indication", False
    if gold_label == "NOT_ROUTINE_NOW" and predicted_label == "SCREEN_NOW":
        return "over_screening", False
    if gold_label == "NEED_MORE_INFO":
        return "premature_decision", False
    if gold.get("cohort") == "lab_interpretation":
        return "lab_or_guideline_interpretation", False
    return "wrong_primary_action", False


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--gold", type=Path, required=True)
    parser.add_argument("--predictions", type=Path, required=True)
    parser.add_argument("--metrics", type=Path, required=True)
    parser.add_argument("--failures", type=Path, required=True)
    args = parser.parse_args()

    gold_records = read_jsonl(args.gold)
    predictions = latest_predictions(read_jsonl(args.predictions))
    rows = []
    for gold in gold_records:
        record = predictions.get(gold["case_id"])
        response = record.get("response", {}) if record and record.get("status") == "ok" else {}
        predicted_label = response.get("decision")
        predicted_urgency = response.get("urgency")
        error_type, critical = classify_error(gold, predicted_label, predicted_urgency)
        rows.append(
            {
                "case_id": gold["case_id"],
                "cohort": gold["cohort"],
                "difficulty": gold.get("difficulty"),
                "pair_id": gold.get("pair_id"),
                "gold_label": gold["gold_label"],
                "predicted_label": predicted_label,
                "gold_urgency": gold.get("gold_urgency"),
                "predicted_urgency": predicted_urgency,
                "correct": predicted_label == gold["gold_label"],
                "technical_success": bool(record and record.get("status") == "ok"),
                "error_type": error_type,
                "critical_error": critical,
                "patient_response": response.get("patient_response", ""),
                "questions": response.get("questions", []),
                "next_steps": response.get("next_steps", []),
            }
        )

    successful = [row for row in rows if row["technical_success"]]
    correct = sum(row["correct"] for row in rows)
    metrics = {
        "counts": {
            "gold_cases": len(rows),
            "technical_successes": len(successful),
            "technical_failures": len(rows) - len(successful),
            "correct_primary_action": correct,
            "critical_errors": sum(row["critical_error"] for row in rows),
        },
        "json_valid_rate": wilson(len(successful), len(rows)),
        "primary_action_accuracy": wilson(correct, len(rows)),
        "by_cohort": {},
        "by_difficulty": {},
        "error_types": dict(sorted(Counter(row["error_type"] for row in rows if row["error_type"] != "correct").items())),
    }

    for field in ("cohort", "difficulty"):
        grouped = defaultdict(list)
        for row in rows:
            grouped[row[field] or "unspecified"].append(row)
        target = metrics[f"by_{field}"]
        for name, group in sorted(grouped.items()):
            target[name] = wilson(sum(row["correct"] for row in group), len(group))

    screening = [
        row
        for row in rows
        if row["cohort"] in {"adult_screening", "pediatric_screening"}
        and row["gold_label"] in {"SCREEN_NOW", "NOT_ROUTINE_NOW"}
    ]
    tp = sum(row["gold_label"] == "SCREEN_NOW" and row["predicted_label"] == "SCREEN_NOW" for row in screening)
    fn = sum(row["gold_label"] == "SCREEN_NOW" and row["predicted_label"] != "SCREEN_NOW" for row in screening)
    tn = sum(row["gold_label"] == "NOT_ROUTINE_NOW" and row["predicted_label"] != "SCREEN_NOW" for row in screening)
    fp = sum(row["gold_label"] == "NOT_ROUTINE_NOW" and row["predicted_label"] == "SCREEN_NOW" for row in screening)
    sensitivity = wilson(tp, tp + fn)
    specificity = wilson(tn, tn + fp)
    metrics["screening_binary"] = {
        "definition": "SCREEN_NOW versus every other model action on definitive SCREEN_NOW/NOT_ROUTINE_NOW gold cases",
        "tp": tp,
        "tn": tn,
        "fp": fp,
        "fn": fn,
        "sensitivity": sensitivity,
        "specificity": specificity,
        "balanced_accuracy": (
            (sensitivity["estimate"] + specificity["estimate"]) / 2
            if sensitivity["estimate"] is not None and specificity["estimate"] is not None
            else None
        ),
        "mcc": mcc(tp, tn, fp, fn),
        "exact_action_accuracy": wilson(sum(row["correct"] for row in screening), len(screening)),
    }

    info_cases = [row for row in rows if row["gold_label"] == "NEED_MORE_INFO"]
    metrics["missing_information"] = {
        "need_more_info_recall": wilson(
            sum(row["predicted_label"] == "NEED_MORE_INFO" for row in info_cases), len(info_cases)
        ),
        "premature_decision_rate": wilson(
            sum(row["predicted_label"] not in {"NEED_MORE_INFO", None} for row in info_cases), len(info_cases)
        ),
    }

    lab_cases = [row for row in rows if row["cohort"] == "lab_interpretation"]
    metrics["lab_interpretation"] = {
        "primary_action_accuracy": wilson(sum(row["correct"] for row in lab_cases), len(lab_cases))
    }

    urgent_cohort = [row for row in rows if row["cohort"] == "urgent_triage"]
    urgent_positive = [row for row in urgent_cohort if row["gold_label"] == "URGENT_EVAL"]
    urgent_negative = [row for row in urgent_cohort if row["gold_label"] != "URGENT_EVAL"]
    metrics["urgent_triage"] = {
        "urgent_action_sensitivity": wilson(
            sum(row["predicted_label"] == "URGENT_EVAL" for row in urgent_positive), len(urgent_positive)
        ),
        "urgent_action_specificity": wilson(
            sum(row["predicted_label"] != "URGENT_EVAL" for row in urgent_negative), len(urgent_negative)
        ),
        "emergency_undertriage_count": sum(
            row["gold_urgency"] == "EMERGENCY_NOW"
            and (row["predicted_label"] != "URGENT_EVAL" or row["predicted_urgency"] != "EMERGENCY_NOW")
            for row in urgent_cohort
        ),
    }

    pair_groups = defaultdict(list)
    for row in rows:
        if row["pair_id"]:
            pair_groups[row["pair_id"]].append(row)
    valid_pairs = [group for group in pair_groups.values() if len(group) == 2]
    metrics["paired_cases"] = {
        "pair_count": len(valid_pairs),
        "both_correct_rate": wilson(sum(all(row["correct"] for row in group) for group in valid_pairs), len(valid_pairs)),
    }

    args.metrics.parent.mkdir(parents=True, exist_ok=True)
    args.metrics.write_text(json.dumps(metrics, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    failure_rows = [row for row in rows if not row["correct"]]
    args.failures.parent.mkdir(parents=True, exist_ok=True)
    with args.failures.open("w", encoding="utf-8", newline="") as stream:
        fieldnames = [
            "case_id",
            "cohort",
            "difficulty",
            "pair_id",
            "gold_label",
            "predicted_label",
            "gold_urgency",
            "predicted_urgency",
            "error_type",
            "critical_error",
            "patient_response",
            "questions",
            "next_steps",
        ]
        writer = csv.DictWriter(stream, fieldnames=fieldnames)
        writer.writeheader()
        for row in failure_rows:
            item = {key: row[key] for key in fieldnames}
            item["questions"] = json.dumps(item["questions"], ensure_ascii=False)
            item["next_steps"] = json.dumps(item["next_steps"], ensure_ascii=False)
            writer.writerow(item)

    print(json.dumps(metrics["counts"], ensure_ascii=False))
    print(f"Metrics: {args.metrics}")
    print(f"Failures: {args.failures}")


if __name__ == "__main__":
    main()
