import {
  groups, styles, foods, foodColors, avoidOptions, allergens, exampleState,
  normalizeState, isAllowed, makeMeals, nameOf, searchNames, groupOf, styleOf, avoidOf, allergyOf,
  pantryOf, foodFor, ingredientName, findIngredient, restrictionsKey,
} from "./meals.js";
import * as cloud from "./cloud.js";
import * as localMeals from "./local-meals.js";
import { languagePreferenceKey, locale, locales, setLocale, t, wording } from "./copy.js";

const byId = id => document.getElementById(id);
const form = byId("meal-form");
const search = byId("food-search");
const dialog = byId("dialog");
const content = byId("dialog-content");
const feedback = byId("dialog-feedback");
const foodTabs = ["top", ...Object.keys(groups), "extra", "rainbow"];
const languages = { en: "en-US", zh: "zh-Hans", yue: "yue-Hant" };
const draftKey = "joybinya-meal-draft-v1";
const walkKey = "joybinya-meal-walk-v1";
const embeddedBrowser = /MicroMessenger/i.test(navigator.userAgent);
const useCloudMeals = cloud.isConfigured && !embeddedBrowser;
let state = normalizeState(readDraft());
let category = "top";
let meals = [];
let mealIds = [];
let versions = [0, 0];
let dialogVersion = 0;
let walkEnd = Number(readStorage(sessionStorage, walkKey)) || 0;
let walkComplete = false;
let ticker;

function readStorage(storage, key) {
  try { return storage.getItem(key); }
  catch { return null; }
}

function writeStorage(storage, key, value) {
  try { storage.setItem(key, value); }
  catch { /* The guide also works in browsers with storage disabled. */ }
}

function optionsFor(keys, label) {
  return Object.fromEntries(keys.map(id => [id, label(id)]));
}

function renderOrder(element) {
  element.replaceChildren(...Object.keys(groups).map(id => node("li", groupOf(id))));
}

function renderLocale() {
  document.documentElement.lang = languages[locale];
  document.title = t("Meal Guide · JoyBinya", "家常搭餐 · JoyBinya", "家常搭餸 · JoyBinya");
  byId("language").value = locale;
  for (const element of document.querySelectorAll("[data-copy]")) {
    element.textContent = wording(element.dataset.copy);
  }
  search.placeholder = wording("search");
  search.setAttribute("aria-label", t("Search ingredients", "搜索食材", "搵食材"));
  byId("hero-photo").alt = wording("photo");
  byId("dialog-close").setAttribute("aria-label", wording("close"));
  byId("walk-minutes").setAttribute("aria-label", wording("minutes"));
  byId("food-tabs").setAttribute("aria-label", t("Ingredient categories", "食材分类", "食材分類"));
  renderOrder(byId("empty-order"));
  renderOrder(byId("routine-order"));
  byId("form-message").textContent = "";
  renderForm();
  if (meals.length) {
    meals = makeMeals(state, versions);
    renderResults();
  }
  renderWalk();
}

function renderWalk() {
  if (walkEnd && walkEnd <= Date.now()) {
    walkEnd = 0;
    walkComplete = true;
    writeStorage(sessionStorage, walkKey, "");
  }
  const active = walkEnd > 0;
  const time = byId("walk-time");
  const seconds = Math.max(0, Math.ceil((walkEnd - Date.now()) / 1000));
  time.hidden = !active;
  if (active) time.textContent = Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
  byId("walk-button").textContent = wording(active ? "stopWalk" : "startWalk");
  byId("walk-minutes").disabled = active;
  const status = active ? "" : wording(walkComplete ? "done" : "ready");
  if (byId("walk-status").textContent !== status) byId("walk-status").textContent = status;
  if (active && !ticker) ticker = setInterval(renderWalk, 250);
  if (!active && ticker) { clearInterval(ticker); ticker = undefined; }
}

function readDraft() {
  try { return JSON.parse(sessionStorage.getItem(draftKey)); }
  catch { return null; }
}

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function button(label, className, onClick) {
  const element = node("button", label, className);
  element.type = "button";
  element.addEventListener("click", onClick);
  return element;
}

function toggle(id, current) {
  return current.includes(id) ? current.filter(value => value !== id) : [...current, id];
}

function markColor(element, color) {
  if (color) element.dataset.foodColor = color;
  return element;
}

function renderColors(element, colors, label) {
  element.hidden = !colors.length;
  element.replaceChildren(node("span", wording(label), "hint"), ...colors.map(color =>
    markColor(node("span", wording(foodColors[color]), "color-label"), color)));
}

function renderChoices(element, options, selected, onSelect, css = "chip", colorFor = () => undefined) {
  const focus = element.contains(document.activeElement) ? document.activeElement.dataset.choice : null;
  element.replaceChildren(...Object.entries(options).map(([id, label]) => {
    const item = markColor(button(label, css, () => onSelect(id)), colorFor(id));
    item.dataset.choice = id;
    item.setAttribute("aria-pressed", String(selected.includes(id)));
    return item;
  }));
  if (focus) [...element.children].find(item => item.dataset.choice === focus)?.focus({ preventScroll: true });
}

function renderFood() {
  const query = search.value.normalize("NFKC").trim().toLowerCase();
  const pantry = pantryOf(state);
  const list = query
    ? pantry.filter(food => searchNames(food).toLowerCase().includes(query))
    : pantry.filter(food => category === "rainbow" ? food.group === "veg" || food.group === "fruit"
      : !food.more && (category === "top" ? food.top : food.group === category));
  const selectFood = id => update({ foods: toggle(id, state.foods) });
  const more = pantry.filter(food => food.more);
  byId("more-vegetables").hidden = Boolean(query) || category === "rainbow";
  byId("rainbow-hint").hidden = Boolean(query) || category !== "rainbow";
  const renderFoodChoices = (element, entries) => renderChoices(element,
    Object.fromEntries(entries.map(food => [food.id, nameOf(food)])), state.foods, selectFood,
    "chip", id => foodFor(state, id).color);
  renderFoodChoices(byId("more-vegetable-list"), more);
  const foodList = byId("food-list");
  renderFoodChoices(foodList, list);
  if (!list.length) foodList.append(node("span", t("No matches. You can add it below.", "没找到，可以在下面手动添加。", "搵唔到，可以喺下面手動加。"), "hint"));
  byId("selected-foods").hidden = !state.foods.length;
  const selected = byId("selected-list");
  selected.replaceChildren(...state.foods.map((id, index) => {
    const food = foodFor(state, id);
    const item = button(nameOf(food) + " ×", "chip remove", () => {
      update({ foods: toggle(id, state.foods) });
      const next = selected.children[Math.min(index, selected.children.length - 1)];
      (next?.querySelector("button") || next || search).focus({ preventScroll: true });
    });
    item.setAttribute("aria-label", t("Remove ", "移除", "移除") + nameOf(food));
    markColor(item, food.color);
    if (!food.custom || isAllowed(food, state)) return item;
    const wrapper = node("span", "", "custom-review");
    wrapper.append(item, button(t("Check restrictions", "核对忌口", "核對忌口"), "link-button", () => showIngredientForm(food)));
    return wrapper;
  }));
  const colors = new Set(state.foods.map(id => foodFor(state, id).color));
  renderColors(byId("selected-colors"), Object.keys(foodColors).filter(color => colors.has(color)), "selectedColors");
}

function showIngredientForm(existing) {
  const editor = node("form", "", "ingredient-editor");
  const name = node("input");
  name.type = "text";
  name.required = true;
  name.maxLength = 30;
  name.autocomplete = "off";
  name.value = existing?.name || ingredientName(search.value);
  const nameLabel = node("label", t("Ingredient name", "食材名称", "食材名"));
  nameLabel.append(name);

  const group = node("select");
  group.required = true;
  const prompt = node("option", t("Choose a category", "请选择类别", "請揀類別"));
  prompt.value = "";
  group.append(prompt);
  for (const id of Object.keys(groups)) {
    const option = node("option", groupOf(id));
    option.value = id;
    group.append(option);
  }
  group.value = existing?.group || "";
  const groupLabel = node("label", t("Category", "食材类别", "食材類別"));
  groupLabel.append(group);
  const color = node("select");
  const noColor = node("option", wording("noColor"));
  noColor.value = "";
  color.append(noColor);
  for (const [id, label] of Object.entries(foodColors)) {
    const option = node("option", wording(label));
    option.value = id;
    color.append(option);
  }
  color.value = existing?.color || "";
  const colorLabel = node("label", wording("foodColor"));
  colorLabel.append(color);
  editor.append(nameLabel, groupLabel, colorLabel);

  const check = node("input");
  check.type = "checkbox";
  const restriction = restrictionsKey(state);
  if (restriction) {
    const checkbox = node("label", "", "check-ingredient");
    checkbox.append(check, node("span", t("I’ve checked that this ingredient fits my allergies and restrictions.", "我已核对这项食材符合我的过敏和忌口要求。", "我已核對呢款食材符合我嘅敏感同忌口要求。")));
    editor.append(checkbox);
  }
  const add = node("button", existing
    ? t("Update ingredient", "更新食材", "更新食材")
    : t("Add to this meal", "添加到这餐", "加落呢餐"), "primary");
  add.type = "submit";
  editor.append(add);
  editor.addEventListener("submit", event => {
    event.preventDefault();
    const label = ingredientName(name.value);
    if (!label) {
      feedback.textContent = t("Enter a food name of up to 30 characters.", "请输入 30 个字符以内的食材名。", "請輸入 30 個字元以內嘅食材名。");
      name.focus();
      return;
    }
    const known = findIngredient(label, foods);
    if (known && !isAllowed(known, state)) {
      feedback.textContent = t("That ingredient conflicts with your restrictions.", "这项食材与已选忌口有冲突。", "呢款食材同已揀嘅忌口有衝突。");
      return;
    }
    if (!known && restriction && !check.checked) {
      feedback.textContent = t("Check the ingredients against your restrictions first.", "请先核对配料是否符合忌口要求。", "請先核對配料係咪符合忌口要求。");
      check.focus();
      return;
    }
    const previous = existing || findIngredient(label, state.customFoods);
    if (!known && !previous && state.customFoods.length >= 50) {
      feedback.textContent = t("This tab has reached its limit of 50 added foods.", "当前页面已添加 50 种自定义食材。", "呢個分頁已經加咗 50 款自訂食材。");
      return;
    }
    const food = known || { id: previous?.id || "custom-" + makeDraftId(), name: label, group: group.value, color: color.value, checked: restriction };
    const customFoods = state.customFoods.filter(item => item.id !== previous?.id);
    if (!known) customFoods.push(food);
    const selectedIds = state.foods.filter(id => id !== previous?.id || id === food.id);
    search.value = "";
    update({ customFoods, foods: [...selectedIds, food.id] });
    dialog.close();
    byId("add-ingredient").focus({ preventScroll: true });
  });
  showDialog(wording("addIngredient"), editor);
  name.focus();
}

function renderForm() {
  renderChoices(byId("food-tabs"), optionsFor(foodTabs, id => id === "rainbow" ? wording("rainbow") : id === "top" ? t("Common", "常用", "常用") : groupOf(id)), [category], id => {
    category = id;
    search.value = "";
    renderForm();
  }, "tab");
  renderFood();
  renderChoices(byId("avoid-list"), optionsFor(Object.keys(avoidOptions), avoidOf), state.avoid, id => update({ avoid: toggle(id, state.avoid) }));
  renderChoices(byId("allergy-list"), optionsFor(Object.keys(allergens), allergyOf), state.allergies, id => update({ allergies: toggle(id, state.allergies) }));
  renderChoices(byId("style-list"), optionsFor(Object.keys(styles), styleOf), [state.style], id => update({ style: id }));
  byId("allergy-count").textContent = state.allergies.length ? t("· " + state.allergies.length + " selected", "· 已选 " + state.allergies.length + " 项", "· 已揀 " + state.allergies.length + " 項") : "";
  byId("ldl").checked = state.ldl;
  byId("picked-count").textContent = state.foods.length ? t(state.foods.length + " selected", "已选 " + state.foods.length + " 种食材", "已揀 " + state.foods.length + " 種食材") : t("No ingredients selected", "还没选食材", "未揀食材");
}

function update(patch) {
  state = normalizeState({ ...state, ...patch });
  writeStorage(sessionStorage, draftKey, JSON.stringify(state));
  byId("form-message").textContent = "";
  renderForm();
  if (meals.length) {
    meals = [];
    byId("empty-state").hidden = false;
    byId("generated").hidden = true;
  }
}

function makeDraftId() {
  return globalThis.crypto?.randomUUID?.() || "meal-" + Date.now() + "-" + Math.random().toString(36).slice(2);
}

function submit({ scroll = true } = {}) {
  const mealFoods = state.foods.map(id => foodFor(state, id)).filter(food => food.group !== "extra");
  if (!mealFoods.length) {
    byId("form-message").textContent = t("Pick at least one vegetable, fruit, protein or carb.", "先选至少一种蔬菜、水果、蛋白质食材或主食。", "先揀至少一款蔬菜、水果、蛋白質食材或者主食。");
    search.focus();
    return;
  }
  if (!mealFoods.some(food => isAllowed(food, state))) {
    byId("form-message").textContent = t("Pick another ingredient that fits your restrictions.", "已选食材和忌口有冲突，请再选一种你可以吃的食材。", "已揀嘅食材同忌口有衝突，請再揀一款食得嘅食材。");
    return;
  }
  if (state.foods.some(id => {
    const food = foodFor(state, id);
    return food.custom && !isAllowed(food, state);
  })) byId("form-message").textContent = t("Added foods awaiting a restriction check were left out.", "待核对忌口的手动食材已从这次搭配中略过。", "未核對忌口嘅自訂食材暫時冇放入呢餐。");
  versions = [0, 0];
  meals = makeMeals(state, versions);
  mealIds = meals.map(makeDraftId);
  renderResults();
  if (scroll) {
    byId("result-title").focus({ preventScroll: true });
    byId("results").scrollIntoView({ block: "start" });
  }
}

function renderResults() {
  const result = byId("generated");
  byId("empty-state").hidden = true;
  result.hidden = false;
  result.replaceChildren(node("p", t("Use what you have. Pick up an ingredient only if you need it.", "先用已有食材，缺的那项可以按需补。", "先用屋企有嘅食材，有需要先補買。"), "hint"));
  if (state.ldl) {
    const hasFattyCut = state.foods.some(id => foodFor(state, id).ldl < 0);
    const reason = hasFattyCut
      ? t("LDL choice: Try the suggested protein in place of the fatty cut you selected.", "兼顾 LDL，可以用推荐的蛋白质食材换掉刚选的肥肉。", "兼顧 LDL，可以用建議嘅蛋白質食材換走頭先揀嘅肥肉。")
      : t("LDL choice: Prefer beans, fish or lean protein, and season with olive or canola oil.", "兼顾 LDL，优先选豆类、鱼或较瘦的蛋白质食材，可用橄榄油或菜籽油调味。", "兼顧 LDL，優先揀豆類、魚或者較瘦嘅蛋白質食材，可以用橄欖油或者芥花籽油調味。");
    result.append(node("p", reason, "hint ldl-note"));
  }
  meals.forEach((meal, index) => {
    const card = node("article", "", "meal");
    card.append(node("p", meal.style, "hint"), node("h3", meal.title));
    const list = node("ol", "", "order meal-order");
    list.setAttribute("aria-label", wording("sequenceTitle"));
    meal.items.forEach(item => {
      const line = node("li");
      line.append(markColor(node("strong", item.name), item.color));
      if (!item.onHand) line.append(node("small", t("To pick up", "可补", "可補買")));
      list.append(line);
    });
    const actions = node("div", "", "actions");
    const change = button(t("Try another", "换个搭配", "換個搭法"), "secondary", () => {
      versions[index] += 1;
      meals = makeMeals(state, versions);
      mealIds[index] = makeDraftId();
      renderResults();
      result.querySelectorAll(".meal .secondary")[index]?.focus({ preventScroll: true });
    });
    const save = button(t("Save meal", "保存这餐", "儲存呢餐"), "primary", () => showSave(meal, mealIds[index]));
    actions.append(change, save);
    const sequenceHint = node("p", t("Try the foods in this order.", "可以按这个顺序吃。", "可以跟呢個次序食。"), "hint");
    const tips = [sequenceHint, list, node("p", meal.method, "hint")];
    if (meal.items[2].id === "rice") {
      tips.push(node("p", t("White rice fits this meal. For more fiber next time, try mixing some cooked brown rice into it.", "这餐可以保留白饭。下次想多加一点纤维，可以拌入一些煮熟的糙米饭。", "呢餐可以保留白飯。下次想加多啲纖維，可以撈入少少煮熟嘅糙米飯。"), "hint"));
    }
    if (state.ldl && meal.items[1].custom) {
      tips.push(node("p", t("Check the cut or label for saturated fat in your added protein.", "手动添加的蛋白质食材，请查看部位或标签上的饱和脂肪。", "自訂嘅蛋白質食材，記得睇部位或者標籤上嘅飽和脂肪。"), "hint"));
    }
    const fish = meal.items.find(item => ["salmon", "sardines"].includes(item.id));
    if (fish) tips.push(node("p", t(fish.name + " supplies omega-3 EPA and DHA.", fish.name + "提供 omega‑3（EPA 和 DHA）。", fish.name + "提供 omega‑3（EPA 同 DHA）。"), "hint"));
    const walk = node("a", t("Walking and strength training ↓", "散步和力量训练 ↓", "行路同肌力訓練 ↓"), "source-link");
    walk.href = "#walking";
    walk.addEventListener("click", () => { byId("learn").open = true; });
    card.append(...tips);
    const colors = node("div", "", "plate-colors");
    renderColors(colors, meal.colors, "plateColors");
    card.append(colors);
    card.append(walk, actions);
    result.append(card);
  });

}

function showDialog(title, ...children) {
  dialogVersion += 1;
  byId("dialog-title").textContent = title;
  content.replaceChildren(...children);
  feedback.textContent = "";
  if (!dialog.open) dialog.showModal();
  return dialogVersion;
}

function copyText(meal) {
  return [meal.title, meal.items.map(item => typeof item === "string" ? item : item.name).join(" · "), meal.method].join("\n");
}

function copyButton(meal) {
  return button(t("Copy meal", "复制这餐", "複製呢餐"), "secondary", async () => {
    const value = copyText(meal);
    try {
      await navigator.clipboard.writeText(value);
      feedback.textContent = t("Copied. Paste it into a note or message.", "已复制，可以粘贴到微信或备忘录。", "複製咗，可以貼去微信或者備忘錄。");
    } catch {
      let field = content.querySelector(".copy-area");
      if (!field) {
        field = node("textarea", "", "copy-area");
        field.setAttribute("aria-label", t("Meal text", "餐单文字", "餐單文字"));
        field.readOnly = true;
        content.append(field);
      }
      field.value = value;
      field.focus();
      field.select();
      feedback.textContent = t("Meal text selected. You can copy it now.", "餐单文字已选中，可以手动复制。", "已選取餐單文字，可以自行複製。");
    }
  });
}

function cloudError(error) {
  if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") return t("Sign-in was canceled. You can try again.", "登录已取消。你可以再试一次。", "已取消登入，可以再試。");
  if (error.code === "auth/popup-blocked" || error.code === "auth/disallowed-useragent") return t("Allow pop-ups or open this page in Safari or Chrome to sign in.", "浏览器拦住了登录窗口。请允许弹窗，或用 Safari、Chrome 打开后再试。", "請允許彈出視窗，或者用 Safari、Chrome 打開再試。");
  return t("Couldn’t connect to your account or meals. Please try again.", "暂时连不上账号或餐单。请稍后重试。", "暫時連唔到帳戶或者餐單，請再試。");
}

function accountAction(label, action) {
  const controls = node("div", "", "actions");
  const login = button(t("Connecting…", "正在连接…", "連線中…"), "primary", async () => {
    login.disabled = true;
    feedback.textContent = "";
    const version = dialogVersion;
    try { await cloud.signIn(); await action(version); }
    catch (error) { if (dialog.open && version === dialogVersion) feedback.textContent = cloudError(error); }
    finally { login.disabled = false; }
  });
  login.disabled = true;
  controls.append(login);
  cloud.prepareAccount().then(user => {
    login.textContent = user ? label : t("Sign in with Google", "使用 Google 账号登录", "用 Google 帳戶登入");
    login.disabled = false;
  }).catch(() => {
    login.textContent = t("Reconnect", "重新连接", "重新連線");
    login.disabled = false;
  });
  return controls;
}

function showSave(meal, id) {
  const title = t("Save meal", "保存这餐", "儲存呢餐");
  const viewSaved = () => button(t("View saved meals", "查看已存餐单", "睇已儲存餐單"), "secondary", showHistory);
  if (!useCloudMeals) {
    try {
      localMeals.saveMeal(id, meal);
    } catch {
      showDialog(title, node("p", t("This browser couldn’t save the meal. You can copy it instead.", "当前浏览器无法保存这餐。你可以复制餐单。", "呢個瀏覽器儲存唔到呢餐。你可以複製餐單。"), "hint"), copyButton(meal));
      return;
    }
    showDialog(title, node("p", meal.title),
      node("p", t("Saved in this browser.", "已保存到当前浏览器。", "已儲存喺呢個瀏覽器。"), "hint"),
      viewSaved());
    return;
  }
  const controls = accountAction(t("Save to my meals", "保存到我的餐单", "儲存到我嘅餐單"), async version => {
    await cloud.saveMeal(id, meal);
    if (!dialog.open || version !== dialogVersion) return;
    const saved = node("p", t("Saved to your meals.", "已保存到你的餐单。", "已儲存到你嘅餐單。"), "hint");
    content.replaceChildren(node("p", meal.title), saved, viewSaved());
  });
  controls.append(copyButton(meal));
  showDialog(title, node("p", meal.title), node("p", t("Sign in to see your saved meals on other devices.", "登录后可在其他设备上查看保存的餐单。", "登入後可以喺其他裝置睇返儲存嘅餐單。"), "hint"), controls);
}

function historyList(saved, removeMeal) {
  const list = node("div");
  if (!saved.length) list.append(node("p", t("No saved meals yet.", "还没有保存过餐单。", "仲未有已儲存餐單。"), "hint"));
  saved.forEach(meal => {
    const card = node("div", "", "history-item");
    const remove = button(t("Delete", "删除", "刪除"), "link-button", async () => {
      remove.disabled = true;
      try {
        await removeMeal(meal.id);
        card.remove();
        if (!list.children.length) list.append(node("p", t("No saved meals yet.", "还没有保存过餐单。", "仲未有已儲存餐單。"), "hint"));
      } catch {
        feedback.textContent = t("Couldn’t delete the meal. Try again.", "删除未完成，请重试。", "刪除唔到，請再試。");
        remove.disabled = false;
      }
    });
    card.append(node("strong", meal.title), node("p", meal.items.join(" · "), "hint"),
      node("p", meal.method, "hint"), copyButton(meal), remove);
    list.append(card);
  });
  return list;
}

async function renderHistory(version) {
  const saved = await cloud.getMeals();
  if (!dialog.open || version !== dialogVersion) return;
  const leave = button(t("Sign out", "退出登录", "登出"), "link-button", async () => {
    try { await cloud.signOut(); showHistory(); }
    catch { feedback.textContent = t("Couldn’t sign out. Try again.", "暂时无法退出，请重试。", "暫時登出唔到，請再試。"); }
  });
  content.replaceChildren(historyList(saved, cloud.removeMeal), browserHistoryButton(), leave);
}

function browserHistoryButton() {
  return button(t("Meals saved in this browser", "查看浏览器里的餐单", "睇瀏覽器入面嘅餐單"), "link-button", showLocalHistory);
}

function showHistory() {
  const title = wording("history");
  if (!useCloudMeals) {
    showLocalHistory();
    return;
  }
  const version = showDialog(title, node("p", t("Checking your sign-in…", "正在查看你的登录状态…", "檢查緊登入狀態…"), "hint"));
  cloud.prepareAccount().then(user => {
    if (!dialog.open || version !== dialogVersion) return;
    if (user) return renderHistory(version);
    content.replaceChildren(accountAction(t("View saved meals", "查看已存餐单", "睇已儲存餐單"), renderHistory), browserHistoryButton());
  }).catch(error => {
    if (dialog.open && version === dialogVersion) feedback.textContent = cloudError(error);
  });
}

function showLocalHistory() {
  const title = wording("history");
  try {
    const list = historyList(localMeals.getMeals(), localMeals.removeMeal);
    showDialog(title, node("p", t("Meals saved in this browser.", "这里显示保存在当前浏览器的餐单。", "呢度顯示儲存喺呢個瀏覽器嘅餐單。"), "hint"), list);
  } catch {
    showDialog(title, node("p", t("This browser couldn’t open your saved meals.", "当前浏览器无法打开已存餐单。", "呢個瀏覽器開唔到已儲存嘅餐單。"), "hint"));
  }
}

form.addEventListener("submit", event => { event.preventDefault(); submit(); });
search.addEventListener("input", renderFood);
byId("add-ingredient").addEventListener("click", () => showIngredientForm());
byId("ldl").addEventListener("change", event => update({ ldl: event.target.checked }));
byId("example").addEventListener("click", () => {
  update({ foods: [...new Set([...state.foods, ...exampleState.foods])] });
  submit();
});
byId("history-button").addEventListener("click", showHistory);
byId("privacy-button").addEventListener("click", () => {
  showDialog(t("Data & privacy", "数据与隐私", "資料同私隱"),
    node("p", t("Ingredients and preferences for a trial meal stay in this browser session.", "试搭时，食材和偏好保留在当前浏览器会话里。", "試搭用嘅食材同口味偏好會留喺今次瀏覽器會話。")),
    useCloudMeals
      ? node("p", t("Google sign-in verifies your account. Meals you choose to save are linked to that account and can be deleted under Saved meals. Restrictions and the LDL setting aren’t uploaded as profile fields.", "Google 登录用于验证身份。餐单会关联到你的账号，可以在「已存餐单」里删除。忌口和 LDL 选项不作为账户资料上传。", "Google 登入用嚟確認帳戶。你揀儲存嘅餐單會連到帳戶，可以喺「已儲存餐單」刪除。忌口同 LDL 設定唔會當成個人資料上載。"))
      : node("p", t("Meals you save stay in this browser. You can delete them under Saved meals. Clearing this site’s data also removes them.", "保存的餐单留在当前浏览器，可以在「已存餐单」里删除。清除本站数据也会移除这些餐单。", "儲存嘅餐單會留喺呢個瀏覽器，可以喺「已儲存餐單」刪除。清除本站資料亦會移除呢啲餐單。")));
});
const urlLocale = new URLSearchParams(location.search).get("lang");
setLocale(locales.includes(urlLocale) ? urlLocale : readStorage(localStorage, languagePreferenceKey));
byId("language").addEventListener("change", event => {
  setLocale(event.target.value);
  writeStorage(localStorage, languagePreferenceKey, locale);
  const url = new URL(location.href);
  url.searchParams.delete("lang");
  history.replaceState(null, "", url);
  renderLocale();
});
byId("walk-button").addEventListener("click", () => {
  walkEnd = walkEnd ? 0 : Date.now() + Number(byId("walk-minutes").value) * 60_000;
  walkComplete = false;
  writeStorage(sessionStorage, walkKey, String(walkEnd || ""));
  renderWalk();
});
function openLinkedResources() {
  if (["#routine", "#resources", "#walking"].includes(location.hash)) {
    byId("learn").open = true;
  }
}

window.addEventListener("hashchange", openLinkedResources);
document.querySelector('.footer a[href="#resources"]').addEventListener("click", () => {
  byId("learn").open = true;
});
document.addEventListener("visibilitychange", renderWalk);
openLinkedResources();
renderLocale();
