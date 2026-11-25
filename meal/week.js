"use strict";

const form = document.querySelector("#week-form");
const editPreferences = document.querySelector("#edit-preferences");
const quickWeek = document.querySelector("#quick-week");
const foodOptions = document.querySelector("#week-ingredients");
const extraFoodPanel = document.querySelector("#custom-foods");
const extraFoodName = document.querySelector("#custom-food-name");
const extraFoodGroup = document.querySelector("#custom-food-group");
const extraFoodList = document.querySelector("#custom-food-list");
const extraFoodStatus = document.querySelector("#custom-food-status");
const extraFoodConfirm = document.querySelector("#custom-food-confirm");
const restrictionOptions = document.querySelector("#week-restrictions");
const cuisineSelect = document.querySelector("#cuisines");
const status = document.querySelector("#week-status");
const result = document.querySelector("#weekly-results");
const screenButtons = Array.from(result.querySelectorAll("[data-screen-choice]"));
const shoppingScreenCount = document.querySelector("#shopping-screen-count");
const dishList = document.querySelector("#weekly-dishes");
const items = document.querySelector("#weekly-items");
const count = document.querySelector("#week-remaining");
const copy = document.querySelector("#week-copy");
const amazonCopy = document.querySelector("#amazon-copy");
const openAmazon = document.querySelector("#open-amazon");
const copyStatus = document.querySelector("#week-copy-status");
const copyListText = document.querySelector("#week-copy-text");
const dailyServings = document.querySelector("#daily-servings");
const overview = document.querySelector("#week-overview");
const prep = document.querySelector("#shared-prep");
const prepItems = document.querySelector("#prep-items");
const shanghaiFinish = document.querySelector("#shanghai-finish");
const pancake = form.elements.pancake;
const pancakeRestriction = document.querySelector("#pancake-restriction");
const guides = document.querySelector("#resources");
const savedMeals = document.querySelector("#saved-meals");
const savedMealList = document.querySelector("#saved-meal-list");
const savedMealsEmpty = document.querySelector("#saved-meals-empty");
const baseWeekKey = "joybinya-meal:weekly";
const viewingNextWeek = new URLSearchParams(location.search).get("week") === "next";
const today = new Date();
today.setHours(12, 0, 0, 0);
const todayIndex = (today.getDay() + 6) % 7;
const monday = new Date(today);
monday.setDate(today.getDate() - todayIndex);
const nextMonday = new Date(monday);
nextMonday.setDate(monday.getDate() + 7);
const weekKeyFor = date => `${baseWeekKey}:${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
const weekKey = weekKeyFor(viewingNextWeek ? nextMonday : monday);
const nextWeekKey = weekKeyFor(nextMonday);
const wholeGrains = new Set(["brownRice", "quinoa", "oats"]);
const review = document.querySelector("#week-review");
const reviewDinners = document.querySelector("#review-dinners");
const reviewCount = document.querySelector("#review-count");
const reviewIdea = document.querySelector("#review-idea");
const reviewAdd = document.querySelector("#review-add");
const reviewStorage = document.querySelector("#review-storage");
const nextWeekNote = document.querySelector("#next-week-note");
const foodGroups = ["vegetable", "protein", "carb", "fruit", "topping"];
const allFoods = Object.fromEntries(Object.entries(weekFoods)
  .flatMap(([group, choices]) => Object.entries(choices).map(([id, food]) => [id, { ...food, group }])));

function ingredientName(value) {
  const name = typeof value === "string" ? value.normalize("NFKC").trim().replace(/\s+/gu, " ") : "";
  return name.length <= 50 && /[\p{L}\p{N}]/u.test(name) ? name : "";
}

function storedCustomFoods(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap(entry => {
    const name = ingredientName(entry?.name);
    return name && /^custom-[a-f0-9-]{36}$/.test(entry?.id) && foodGroups.includes(entry.group)
      ? [{ id: entry.id, group: entry.group, name }] : [];
  });
}

function loadWeek(key) {
  try { return JSON.parse(localStorage.getItem(key)); }
  catch { return null; }
}
const sharedSettings = loadWeek(baseWeekKey);
const saved = loadWeek(weekKey) ?? (viewingNextWeek ? null : sharedSettings);
const savedProfile = sharedSettings?.profile ?? saved?.profile;
const validCounter = value => Number.isSafeInteger(value) && value >= 0;
const oldOlives = ["greenOlive", "blackOlive", "purpleOlive"];
let profile = {
  guests: String(savedProfile?.guests || 4),
  cuisine: Object.hasOwn(cuisineNames, savedProfile?.cuisine) ? savedProfile.cuisine : "cantonese",
  foods: Array.isArray(savedProfile?.foods)
    ? [...new Set(savedProfile.foods.map(id => oldOlives.includes(id) ? "olives" : id))]
    : defaults,
  avoid: Array.isArray(savedProfile?.avoid) ? savedProfile.avoid : [],
  allergen: Array.isArray(savedProfile?.allergen) ? savedProfile.allergen : [],
  pancake: savedProfile?.pancake !== false,
  customFoods: storedCustomFoods(savedProfile?.customFoods),
  reviewedCustom: typeof savedProfile?.reviewedCustom === "string" ? savedProfile.reviewedCustom : "",
};
let draftCustomFoods = profile.customFoods;
let draftReview = profile.reviewedCustom;
let planReady = saved?.planReady === true;
let revision = validCounter(saved?.revision) ? saved.revision : 0;
let swaps = days.map((_, index) => {
  const value = saved?.swaps?.[index];
  return Number.isSafeInteger(value) && revision + index + value >= 0 ? value : 0;
});
let pins = days.map((_, index) => {
  const pin = saved?.pins?.[index];
  return validCounter(pin?.revision) && Number.isSafeInteger(pin?.swap)
    && pin.revision + index + pin.swap >= 0 ? pin : null;
});
const guestOverrides = days.map((_, index) => {
  const value = saved?.guestOverrides?.[index];
  return validCounter(value) && value <= 12 ? value : null;
});
let checked = saved?.checked && typeof saved.checked === "object" ? saved.checked : {};
let currentList = [];
let currentPlan = [];
const reviewChoices = { planned: "reviewPlanned", changed: "reviewChanged", skipped: "reviewSkipped" };
const reviewEntries = days.map((_, index) => {
  const entry = saved?.reviewEntries?.[index];
  return Object.hasOwn(reviewChoices, entry?.choice) ? entry : null;
});
const reviewGrain = wholeGrains.has(saved?.reviewGrain) ? saved.reviewGrain : null;
let suggestedGrain = null;

function saveWeek() {
  try {
    localStorage.setItem(weekKey, JSON.stringify({ profile, planReady, revision, swaps, pins, guestOverrides, checked, reviewEntries, reviewGrain }));
    localStorage.setItem(baseWeekKey, JSON.stringify({ profile }));
    return true;
  } catch {
    return false;
  }
}

function formSettings() {
  const values = new FormData(form);
  const settings = {
    guests: values.get("guests"), cuisine: values.get("cuisine"), foods: values.getAll("foods"),
    avoid: values.getAll("avoid"), allergen: values.getAll("allergen"), pancake: pancake.checked,
    customFoods: draftCustomFoods,
  };
  return { ...settings, reviewedCustom: draftReview === customReviewKey(settings) ? draftReview : "" };
}

function customReviewKey(settings) {
  if (!settings.avoid.length && !settings.allergen.length) return "";
  const selected = settings.customFoods.map(food => food.id).filter(id => settings.foods.includes(id)).sort();
  return selected.length ? JSON.stringify([settings.avoid.slice().sort(), settings.allergen.slice().sort(), selected]) : "";
}

function renderCustomReview(settings) {
  const key = customReviewKey(settings);
  extraFoodConfirm.parentElement.hidden = !key;
  extraFoodConfirm.checked = Boolean(key) && settings.reviewedCustom === key;
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function renderCustomFoods(selected) {
  extraFoodList.innerHTML = draftCustomFoods.map(({ id, group, name }) => `<div class="custom-food-choice">
    <label class="choice-chip"><input type="checkbox" name="foods" value="${id}"${selected.includes(id) ? " checked" : ""}>
      <span>${escapeHtml(name)} · ${group === "carb" ? t("customFoodCarb") : tr(weekGroups[group])}</span></label>
    <button type="button" class="quiet-button" data-remove-food="${id}" aria-label="${escapeHtml(t("customFoodRemoveName").replace("{food}", () => name))}">${t("customFoodRemove")}</button>
    </div>`).join("");
}

function renderForm(values) {
  draftCustomFoods = values.customFoods;
  draftReview = values.reviewedCustom;
  form.elements.guests.value = Array.from(form.elements.guests.options).some(option => option.value === values.guests) ? values.guests : "4";
  cuisineSelect.innerHTML = Object.entries(cuisineNames)
    .map(([id, name]) => `<option value="${id}">${tr(name)}</option>`).join("");
  cuisineSelect.value = values.cuisine;

  function chip(name, id, label, color) {
    return `<label class="choice-chip"><input type="checkbox" name="${name}" value="${id}"${values[name].includes(id) ? " checked" : ""}>
      <span${color ? ` data-color="${color}"` : ""}>${tr(label)}</span></label>`;
  }

  foodOptions.innerHTML = foodGroups.map(group => `<fieldset><legend>${tr(weekGroups[group])}</legend><div class="choice-row">
    ${Object.entries(weekFoods[group]).map(([id, food]) => chip("foods", id, food.name, food.color)).join("")}
    </div></fieldset>`).join("");
  const pendingGroup = extraFoodGroup.value;
  extraFoodGroup.innerHTML = `<option value="">${t("customFoodChoose")}</option>` + foodGroups
    .map(group => `<option value="${group}">${group === "carb" ? t("customFoodCarb") : tr(weekGroups[group])}</option>`).join("");
  extraFoodGroup.value = pendingGroup;
  extraFoodStatus.textContent = "";
  renderCustomFoods(values.foods);
  renderCustomReview(values);
  restrictionOptions.innerHTML = Object.entries(restrictions).map(([type, choices]) => `<fieldset><legend>${tr(restrictionNames[type])}</legend><div class="choice-row">
    ${Object.entries(choices).map(([id, label]) => chip(type, id, label)).join("")}
    </div></fieldset>`).join("");
  pancake.checked = values.pancake;
  renderShanghaiFinish();
}

function renderShanghaiFinish() {
  const values = formSettings();
  shanghaiFinish.hidden = values.cuisine !== "shanghai";
  pancake.disabled = !isAllowed(values, "scallionPancake");
  pancakeRestriction.hidden = !pancake.disabled;
}

function foodFor(id, settings = profile) {
  if (Object.hasOwn(allFoods, id)) return allFoods[id];
  const food = settings.customFoods.find(item => item.id === id);
  return food && { ...food, name: [food.name, food.name, food.name], unit: "asNeeded", perGuest: 0 };
}

function isAllowed(values, id) {
  const food = foodFor(id, values);
  if (!food) return false;
  if (food.unit === "asNeeded") {
    const key = customReviewKey(values);
    return !key || key === values.reviewedCustom;
  }
  const allergens = food.allergens ?? [food.allergen];
  return !values.avoid.includes(id) && !values.avoid.includes(food.avoid)
    && !allergens.some(allergen => values.allergen.includes(allergen));
}

function allowedChoices(values, group) {
  const added = values.customFoods.filter(food => food.group === group).map(food => food.id);
  return [...added, ...Object.keys(weekFoods[group])].filter(id => values.foods.includes(id) && isAllowed(values, id));
}

function buildWeek(settings = profile) {
  const choices = Object.fromEntries(foodGroups.map(group => [group, allowedChoices(settings, group)]));
  if (!["vegetable", "protein", "carb"].every(group => choices[group].length)) return [];
  const region = settings.cuisine;
  const pancakeDay = region === "shanghai" && settings.pancake && isAllowed(settings, "scallionPancake")
    ? guestOverrides.findIndex(guests => (guests ?? Number(settings.guests)) > 0) : -1;
  const plan = days.map((day, index) => {
    const variation = (pins[index]?.revision ?? revision) + index + (pins[index]?.swap ?? swaps[index]);
    const [recipeName, defaultMethod, ingredients] = regions[region][variation % regions[region].length];
    const spices = ingredients.filter(id => isAllowed(settings, id));
    const method = spices.length || !ingredients.length ? defaultMethod
      : { warmOil: "blanch", glaze: "braise", tangy: "steam" }[defaultMethod] || defaultMethod;
    const title = spices.length === ingredients.length ? recipeName : dishSteps[method];
    if (["wok", "warmOil", "roast", "herbToss"].includes(method)) spices.push("oil");
    const main = choices.protein[variation % choices.protein.length];
    const starch = choices.carb[variation % choices.carb.length];
    const vegetables = [choices.vegetable[variation % choices.vegetable.length]];
    if (choices.vegetable.length > 1) vegetables.push(choices.vegetable[(variation + 1) % choices.vegetable.length]);
    const fruit = choices.fruit.length ? choices.fruit[variation % choices.fruit.length] : null;
    const topping = choices.topping.length ? choices.topping[variation % choices.topping.length] : null;
    return { day, region, method, spices, title, main, starch, vegetables,
      guests: guestOverrides[index] ?? Number(settings.guests), extras: [fruit, topping].filter(Boolean),
      finish: index === pancakeDay };
  });
  if (reviewGrain && isAllowed(settings, reviewGrain)) {
    const dinner = plan.find((dish, index) => dish.guests > 0 && !pins[index] && dish.starch !== reviewGrain);
    if (dinner) dinner.starch = reviewGrain;
  }
  return plan;
}

function details(dish) {
  const labels = list => list.map(id => tr(foodFor(id).name)).join(lang === "en" ? ", " : "、");
  const title = `${tr(dish.title)} · ${labels([dish.main])}`;
  const vegetables = labels(dish.vegetables);
  const protein = foodFor(dish.main);
  const steps = [protein.prep ? tr(protein.prep) : t("customProteinPrep"), tr(cooking[dish.method])];
  const aromatics = dish.spices.filter(id => id !== "oil");
  if (aromatics.length) steps.push(tr([`Season with ${labels(aromatics)}.`, `用${labels(aromatics)}调味。`, `用${labels(aromatics)}調味。`]));
  const starch = labels([dish.starch]);
  steps.push(tr([`Serve with cooked ${starch.toLowerCase()}.`, `搭配煮熟的${starch}。`, `配煮熟嘅${starch}。`]));
  return { title, vegetables, method: steps.join(" "), extra: labels(dish.extras) };
}

function dishIngredients(dish) {
  return new Set([dish.main, dish.starch, ...dish.vegetables, ...dish.spices, ...dish.extras,
    ...(dish.finish ? ["scallionPancake"] : [])]);
}

function shoppingRows(dishes) {
  const totals = new Map();
  for (const dish of dishes) {
    if (dish.guests === 0) continue;
    for (const item of dishIngredients(dish)) {
      const portion = dish.finish && item === dish.starch ? 0.5 : 1;
      totals.set(item, (totals.get(item) || 0) + foodFor(item).perGuest * dish.guests * portion);
    }
  }
  return [...totals].map(([id, needed]) => {
    const { unit, group, name } = foodFor(id);
    return { id, unit, group: unit === "asNeeded" ? "custom" : group, name, amount: unit === "count" ? Math.ceil(needed) : needed };
  });
}

function toBuy() {
  return currentList.filter(item => checked[item.id] !== item.amount);
}

function refreshCount() {
  const remaining = toBuy().length;
  count.textContent = t("remaining").replace("{n}", remaining);
  shoppingScreenCount.textContent = remaining;
  copy.disabled = remaining === 0;
  amazonCopy.disabled = currentList.length === 0;
  openAmazon.hidden = true;
  copyListText.hidden = true;
  copyListText.value = "";
}

function renderWeekOverview(plan) {
  const planned = plan.filter(dish => dish.guests > 0);
  const servings = planned.reduce((sum, dish) => sum + dish.guests, 0);
  overview.textContent = t("cookSummary").replace("{n}", planned.length).replace("{p}", servings);
  dailyServings.innerHTML = days.map((day, index) => `<label>${tr(day)}
    <select data-dinner-size="${index}">
      <option value="">${t("householdCount").replace("{n}", profile.guests)}</option>
      ${Array.from({ length: 13 }, (_, guests) => `<option value="${guests}"${guestOverrides[index] === guests ? " selected" : ""}>${guests}</option>`).join("")}
    </select>
  </label>`).join("");

  const shared = new Map();
  for (const { vegetables, starch, day } of planned) {
    for (const id of [...vegetables, starch]) {
      if (!shared.has(id)) shared.set(id, []);
      shared.get(id).push(tr(day));
    }
  }
  const reusable = [...shared].filter(([, use]) => use.length > 1)
    .sort((a, b) => b[1].length - a[1].length).slice(0, 3);
  prep.hidden = reusable.length === 0;
  const list = new Intl.ListFormat(calendarLocales[lang], { style: "short" });
  prepItems.innerHTML = reusable.map(([id, use]) => `<li><strong>${escapeHtml(tr(foodFor(id).name))}</strong> <span>${list.format(use)}</span></li>`).join("");
}

function searchTerm(item) {
  if (item.unit === "asNeeded") return item.name[0];
  if (item.id === "chickpea") return "canned chickpeas";
  return item.name[0].replace(/\s*\([^)]*\)/g, "");
}

function amazonUrl(item) {
  const url = new URL("https://www.amazon.com/s");
  url.searchParams.set("k", searchTerm(item));
  return url.href.replaceAll("&", "&amp;");
}

function shopUrl(item) {
  const url = new URL("https://www.wholefoodsmarket.com/grocery/search");
  url.searchParams.set("k", searchTerm(item));
  url.searchParams.set("almBrandId", "VUZHIFdob2xlIEZvb2Rz");
  return url.href.replaceAll("&", "&amp;");
}

function exportWeek(includeSteps) {
  const dinnerLines = currentPlan.map(dish => {
    const day = tr(dish.day);
    if (dish.guests === 0) return `${day} · ${t("noDinner")}`;
    const card = details(dish);
    const meal = [`${day} · ${card.title} · ${card.vegetables} · ${t("guestCount").replace("{n}", dish.guests)}`];
    if (includeSteps) {
      meal.push(card.method);
      if (card.extra) meal.push(`${t("servingExtra")} · ${card.extra}`);
    }
    if (dish.finish) meal.push(t("carbOrder"), t("pancakeOrder"));
    return meal.join("\n");
  });
  const ingredients = includeSteps ? currentList : toBuy();
  const shoppingLines = ingredients.map(item =>
    `${checked[item.id] === item.amount ? "[x]" : "[ ]"} ${tr(item.name)} — ${formatAmount(item)}`);
  const sources = Array.from(document.querySelectorAll("#nutrition-links a"), source =>
    `${source.textContent.trim()} — ${source.href}`);
  const sharedNote = currentPlan.some(dish => dish.finish) ? [] : [t("carbOrder")];
  return [t("weekTitle"), ...sharedNote, dinnerLines.join(includeSteps ? "\n\n" : "\n"),
    [t("shopTitle"), ...shoppingLines].join("\n"),
    [t("nutritionResources"), ...sources].join("\n")].join("\n\n");
}

function renderWeek() {
  const plan = planReady ? buildWeek() : [];
  result.hidden = !plan.length;
  quickWeek.dataset.text = planReady ? "regenerateWeek" : "generateWeek";
  quickWeek.textContent = t(quickWeek.dataset.text);
  currentPlan = plan;
  renderReview(plan);
  if (viewingNextWeek) {
    nextWeekNote.hidden = !reviewGrain || !plan.some(dish => dish.starch === reviewGrain && dish.guests > 0);
    if (!nextWeekNote.hidden) nextWeekNote.textContent = t("reviewAdded").replace("{food}", tr(allFoods[reviewGrain].name));
  }
  savedMealList.innerHTML = plan.map((dish, index) => pins[index] && dish.guests > 0
    ? `<li><a href="#dinner-${index}">${tr(dish.day)} · ${escapeHtml(details(dish).title)}</a></li>` : "").join("");
  savedMealList.hidden = !savedMealList.childElementCount;
  savedMealsEmpty.hidden = !savedMealList.hidden;
  if (!plan.length) return;

  document.querySelector("#week-carb-note").hidden = plan.some(dish => dish.finish);
  renderWeekOverview(plan);
  const openRecipes = new Set(Array.from(dishList.querySelectorAll("details[open]"), recipe => recipe.dataset.recipe));
  dishList.innerHTML = plan.map((dish, index) => {
    if (dish.guests === 0) return `<article class="dish weekly-dish night-off">
      <p class="day-line">${tr(dish.day)}</p><h3>${t("noDinner")}</h3>
    </article>`;
    const card = details(dish);
    const kept = Boolean(pins[index]);
    return `<article class="dish weekly-dish" id="dinner-${index}">
      <div class="dinner-row">
        <div>
          <p class="day-line">${tr(dish.day)} · ${tr(cuisineNames[dish.region])} · ${t("guestCount").replace("{n}", dish.guests)}</p>
          <h3>${escapeHtml(card.title)}</h3>
          <p class="dinner-summary">${escapeHtml(card.vegetables)} · ${escapeHtml(tr(foodFor(dish.starch).name))}</p>
        </div>
        <button type="button" class="small-button swap" data-swap="${index}" aria-label="${tr(dish.day)} · ${t(kept ? "pinnedDinner" : "swapDay")}"${kept ? " disabled" : ""}>${t(kept ? "pinnedDinner" : "swapShort")}</button>
      </div>
      ${dish.finish ? `<p class="meal-finish">${t("carbOrder")} ${t("pancakeOrder")}</p>` : ""}
      <details class="recipe-detail" data-recipe="${index}"${openRecipes.has(String(index)) ? " open" : ""}>
        <summary>${t("viewRecipe")}</summary>
        <p><strong>${tr(weekGroups.vegetable)}</strong> · ${escapeHtml(card.vegetables)}</p>
        <p>${escapeHtml(card.method)}</p>${card.extra ? `<p>${t("servingExtra")} · ${escapeHtml(card.extra)}</p>` : ""}
        <button type="button" class="small-button pin" data-pin="${index}" aria-pressed="${kept}">${t(kept ? "pinnedDinner" : "pinDinner")}</button>
      </details>
    </article>`;
  }).join("");

  currentList = shoppingRows(plan);
  checked = Object.fromEntries(currentList.filter(item => checked[item.id] === item.amount)
    .map(item => [item.id, item.amount]));
  items.innerHTML = Object.entries(weekGroups).map(([group, label]) => {
    const matches = currentList.filter(item => item.group === group);
    return matches.length ? `<h4>${tr(label)}</h4><ul>${matches.map(item => `<li><label>
      <input type="checkbox" value="${item.id}" aria-label="${escapeHtml(t("pantryItem").replace("{food}", () => tr(item.name)))}"${checked[item.id] === item.amount ? " checked" : ""}>
      <span>${escapeHtml(tr(item.name))}<small class="pantry-tag" aria-hidden="true">${t("pantryHave")}</small></span><span class="amount">${formatAmount(item)}</span></label>
      <span class="buy-links"><a class="buy-item" target="_blank" rel="noopener" href="${amazonUrl(item)}" aria-label="${escapeHtml(t("amazonItemName").replace("{food}", () => tr(item.name)))}">Amazon ↗</a>
      <a class="buy-item" target="_blank" rel="noopener" href="${shopUrl(item)}" aria-label="${escapeHtml(t("shopItemName").replace("{food}", () => tr(item.name)))}">Whole Foods ↗</a></span>
      </li>`).join("")}</ul>` : "";
  }).join("");
  copyStatus.textContent = "";
  refreshCount();
}

function renderReview(plan) {
  review.hidden = viewingNextWeek || !plan.length;
  if (review.hidden) return;
  reviewDinners.innerHTML = plan.slice(0, todayIndex + 1).map((dish, index) => {
    const value = reviewEntries[index]?.choice || "";
    const choices = { "": "reviewUnmarked", ...reviewChoices };
    return `<label>${tr(dish.day)} <select data-reviewed-day="${index}">
      ${Object.entries(choices).filter(([id]) => id !== "planned" || dish.guests > 0 || value === "planned")
        .map(([id, label]) => `<option value="${id}"${id === value ? " selected" : ""}>${t(label)}</option>`).join("")}
      </select></label>`;
  }).join("");
  const marked = reviewEntries.filter(Boolean);
  const planned = marked.filter(entry => entry.choice === "planned");
  const grains = planned.filter(entry => entry.wholeGrain).length;
  reviewCount.textContent = t("reviewCount").replace("{n}", marked.length);
  if (planned.length >= 3) reviewCount.textContent += " " + t("reviewGrainCount")
    .replace("{g}", grains).replace("{n}", planned.length);
  suggestedGrain = planned.length >= 3 && grains * 2 < planned.length
    ? ["brownRice", "quinoa", "oats"].find(id => isAllowed(profile, id)) : null;
  reviewIdea.hidden = reviewAdd.hidden = !suggestedGrain;
  reviewIdea.textContent = suggestedGrain ? t("reviewIdea").replace("{food}", tr(allFoods[suggestedGrain].name)) : "";
}

function showStatus(key, error = false) {
  status.toggleAttribute("data-error", error);
  status.textContent = key ? t(key) : "";
}

function setPreferencesOpen(open) {
  form.hidden = !open;
  editPreferences.setAttribute("aria-expanded", String(open));
  editPreferences.dataset.text = open ? "cancelWeekEdit" : "editWeekFood";
  editPreferences.textContent = t(editPreferences.dataset.text);
}

function setScreen(screen) {
  result.dataset.screen = screen;
  for (const button of screenButtons) button.setAttribute("aria-pressed", String(button.dataset.screenChoice === screen));
}

function revealFragment() {
  const target = location.hash.slice(1);
  if (target === "week-form") setPreferencesOpen(true);
  else if (target === "saved-meals") savedMeals.open = true;
  else if (target === "resources") guides.open = true;
  else if (target === "weekly-shopping") setScreen("shopping");
  else if (/^dinner-[0-6]$/.test(target)) {
    const recipe = document.getElementById(target)?.querySelector(".recipe-detail");
    if (!recipe || result.hidden) return;
    setScreen("menu");
    recipe.open = true;
  } else return;
  requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ block: "start" }));
}

if (viewingNextWeek) {
  document.querySelector("#week-heading").dataset.text = "nextWeekTitle";
  document.querySelector("#week-heading").textContent = t("nextWeekTitle");
  document.querySelector("#dinner-title").dataset.text = "nextWeekPlan";
  document.querySelector("#dinner-title").textContent = t("nextWeekPlan");
  document.querySelector("#current-week-link").hidden = false;
}
if (!viewingNextWeek && sharedSettings?.planReady && !loadWeek(weekKey)) saveWeek();
renderForm(profile);
profile = formSettings();
renderWeek();
revealFragment();
window.addEventListener("hashchange", revealFragment);
reviewDinners.addEventListener("change", event => {
  const { value, dataset } = event.target;
  const index = Number(dataset.reviewedDay);
  const dish = currentPlan[index];
  if (!dish || index > todayIndex) return;
  reviewEntries[index] = value ? { choice: value, wholeGrain: value === "planned" && wholeGrains.has(dish.starch) } : null;
  reviewStorage.textContent = saveWeek() ? "" : t("reviewSaveError");
  renderReview(currentPlan);
  reviewDinners.querySelector(`[data-reviewed-day="${index}"]`)?.focus({ preventScroll: true });
});
reviewAdd.addEventListener("click", event => {
  if (!suggestedGrain) {
    event.preventDefault();
    return;
  }
  try {
    const next = loadWeek(nextWeekKey);
    localStorage.setItem(nextWeekKey, JSON.stringify({ ...next, planReady: true, reviewGrain: suggestedGrain }));
  } catch {
    event.preventDefault();
    reviewStorage.textContent = t("reviewSaveError");
  }
});
document.querySelector('a[href="#saved-meals"]').addEventListener("click", () => { savedMeals.open = true; });
savedMealList.addEventListener("click", event => {
  if (event.target.closest("a")?.hash === location.hash) revealFragment();
});

editPreferences.addEventListener("click", () => {
  const opening = form.hidden;
  if (!opening) {
    renderForm(profile);
    renderWeek();
    showStatus("");
  }
  setPreferencesOpen(opening);
});

for (const button of screenButtons) button.addEventListener("click", () => setScreen(button.dataset.screenChoice));

function preferencesChanged() {
  renderShanghaiFinish();
  renderCustomReview(formSettings());
  result.hidden = true;
  showStatus(planReady ? "weekChanged" : "");
}

function addExtraFood() {
  const name = ingredientName(extraFoodName.value);
  if (!name) {
    extraFoodStatus.textContent = t("customFoodInvalid");
    extraFoodName.focus();
    return;
  }
  const key = name.toLowerCase();
  const catalogMatch = Object.entries(allFoods).find(([id, food]) =>
    [id, ...food.name, ...(food.aliases ?? [])].some(label => label.toLowerCase() === key));
  if (catalogMatch && !isAllowed(formSettings(), catalogMatch[0])) {
    extraFoodStatus.textContent = t("customFoodConflict");
    return;
  }
  const existingChoice = catalogMatch && foodOptions.querySelector(`input[value="${catalogMatch[0]}"]`);
  if (existingChoice) {
    existingChoice.checked = true;
  } else {
    const existing = draftCustomFoods.find(food => food.name.toLowerCase() === key);
    if (!existing && !foodGroups.includes(extraFoodGroup.value)) {
      extraFoodStatus.textContent = t("customFoodChoose");
      extraFoodGroup.focus();
      return;
    }
    const food = existing ?? { id: "custom-" + crypto.randomUUID(), group: extraFoodGroup.value, name };
    if (!existing) draftCustomFoods = [food, ...draftCustomFoods];
    renderCustomFoods([...formSettings().foods, food.id]);
  }
  extraFoodName.value = "";
  extraFoodStatus.textContent = t("customFoodAdded");
  preferencesChanged();
}

document.querySelector("#custom-food-add").addEventListener("click", addExtraFood);
extraFoodName.addEventListener("keydown", event => {
  if (event.key !== "Enter" || event.isComposing) return;
  event.preventDefault();
  addExtraFood();
});
extraFoodList.addEventListener("click", event => {
  const button = event.target.closest("[data-remove-food]");
  if (!button) return;
  draftCustomFoods = draftCustomFoods.filter(food => food.id !== button.dataset.removeFood);
  renderCustomFoods(formSettings().foods);
  extraFoodStatus.textContent = "";
  preferencesChanged();
  extraFoodName.focus({ preventScroll: true });
});
form.addEventListener("change", event => {
  if (event.target === extraFoodName || event.target === extraFoodGroup) {
    extraFoodStatus.textContent = "";
    return;
  }
  if (event.target === extraFoodConfirm) {
    draftReview = extraFoodConfirm.checked ? customReviewKey(formSettings()) : "";
    extraFoodStatus.textContent = "";
  }
  preferencesChanged();
});

form.addEventListener("submit", event => {
  event.preventDefault();
  const settings = formSettings();
  const saveOnly = event.submitter?.value === "save";
  if (customReviewKey(settings) && !settings.reviewedCustom) {
    setPreferencesOpen(true);
    extraFoodPanel.open = true;
    extraFoodStatus.textContent = t("customFoodCheck");
    extraFoodConfirm.focus();
    return;
  }
  if (!saveOnly && !buildWeek(settings).length) {
    setPreferencesOpen(true);
    showStatus("missingGroup", true);
    status.scrollIntoView({block: "nearest"});
    return;
  }
  if (JSON.stringify(profile) !== JSON.stringify({ ...settings, guests: profile.guests })) {
    planReady = false;
    checked = {};
    swaps = swaps.map(() => 0);
    pins = pins.map(() => null);
  }
  profile = settings;
  if (saveOnly) {
    showStatus(saveWeek() ? "savedWeek" : "saveUnavailable");
    setPreferencesOpen(false);
    renderWeek();
    editPreferences.focus();
    return;
  }
  if (planReady) {
    revision++;
    checked = {};
    swaps = swaps.map(() => 0);
  }
  planReady = true;
  setPreferencesOpen(false);
  setScreen("menu");
  renderWeek();
  saveWeek();
  showStatus(profile.allergen.length ? "allergyReminder" : "");
  document.querySelector("#dinner-title").focus({preventScroll: true});
  result.scrollIntoView({block: "start"});
});

dishList.addEventListener("click", event => {
  const pin = event.target.closest("[data-pin]");
  if (pin) {
    const index = Number(pin.dataset.pin);
    if (pins[index]) {
      swaps[index] = pins[index].revision + pins[index].swap - revision;
      pins[index] = null;
    } else {
      pins[index] = { revision, swap: swaps[index] };
    }
    renderWeek();
    saveWeek();
    dishList.querySelector(`[data-pin="${index}"]`).focus({preventScroll: true});
    document.querySelector("#week-live").textContent = t(pins[index] ? "pinnedAnnouncement" : "unpinnedAnnouncement");
    return;
  }
  const button = event.target.closest("[data-swap]");
  if (!button || button.disabled) return;
  const index = Number(button.dataset.swap);
  swaps[index]++;
  renderWeek();
  saveWeek();
  const swap = dishList.querySelector(`[data-swap="${index}"]`);
  swap.focus({preventScroll: true});
  document.querySelector("#week-live").textContent = t("swappedDay");
});

dailyServings.addEventListener("change", event => {
  const index = Number(event.target.dataset.dinnerSize);
  if (!Number.isInteger(index)) return;
  guestOverrides[index] = event.target.value === "" ? null : Number(event.target.value);
  renderWeek();
  saveWeek();
  dailyServings.querySelector(`[data-dinner-size="${index}"]`).focus({preventScroll: true});
});

items.addEventListener("change", event => {
  const item = currentList.find(entry => entry.id === event.target.value);
  if (!item) return;
  if (event.target.checked) checked[item.id] = item.amount;
  else delete checked[item.id];
  saveWeek();
  refreshCount();
  copyStatus.textContent = "";
});
copy.addEventListener("click", () => {
  openAmazon.hidden = true;
  copyText(
    [t("shopTitle"), ...toBuy().map(item => `□ ${tr(item.name)} — ${formatAmount(item)}`)].join("\n"),
    copyStatus, copyListText,
  );
});
amazonCopy.addEventListener("click", async () => {
  openAmazon.hidden = true;
  const copied = await copyText(
    currentList.map(item => `${searchTerm(item)} — ${formatAmount(item, "en")}`).join("\n"),
    copyStatus, copyListText, { success: t("amazonCopied"), showList: true },
  );
  if (copied) openAmazon.hidden = false;
});

document.querySelector("#print-week").addEventListener("click", () => window.print());
document.querySelector("#download-week").addEventListener("click", () => {
  const blob = new Blob(["\uFEFF", exportWeek(true)], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "joybinya-weekly-menu.txt";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
});


document.addEventListener("joybinya-language", () => {
  const settings = formSettings();
  const hidden = result.hidden;
  renderForm(settings);
  renderWeek();
  result.hidden = hidden;
  showStatus("");
});

let expandedForPrint = [];
window.addEventListener("beforeprint", () => {
  if (expandedForPrint.length) return;
  expandedForPrint = [guides, document.querySelector("#more-resources"), ...dishList.querySelectorAll(".recipe-detail")]
    .filter(detail => !detail.open);
  for (const detail of expandedForPrint) detail.open = true;
});
window.addEventListener("afterprint", () => {
  for (const detail of expandedForPrint) detail.open = false;
  expandedForPrint = [];
});

quickWeek.disabled = false;
editPreferences.disabled = false;
