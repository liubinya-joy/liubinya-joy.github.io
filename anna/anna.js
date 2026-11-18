"use strict";

const copy = {
  guideNav: ["设计与使用说明", "Design & how to use", "設計同使用說明"],
  forAnna: ["Anna Wang", "Anna Wang", "Anna Wang"],
  title: ["送给客户的一年家庭餐单", "A year of family meals to gift your clients", "送畀客人嘅一年家庭餐單"],
  intro: ["一份实用的新居礼物。每周按一家人的口味、忌口和人数安排晚餐，买什么、怎么换菜，一页就能看清。", "A housewarming gift that helps families plan dinners around their tastes, dietary needs, and household size. They can swap a meal and have the shopping list update for them.", "一份實用嘅入伙禮物。每星期照一家人嘅口味、戒口同人數配晚餐，買咩餸、點換餐，一頁睇清楚。"],
  start: ["试一遍客户流程 ↓", "Try the client experience ↓", "試吓客人點用 ↓"],
  demoTitle: ["家庭餐单 Demo", "Family meal planner demo", "家庭餐單示範"],
  sample: ["示例家庭喜欢清淡口味，避开坚果。正式版可规划七晚。", "This sample household prefers mild meals and avoids nuts. Members can plan seven dinners.", "示範家庭鍾意清淡、避開堅果。會員可以安排七日晚餐。"],
  people: ["人数", "People", "人數"],
  menu: ["本周菜单", "Weekly menu", "今週餐單"],
  shopping: ["采购清单", "Shopping list", "買餸清單"],
  review: ["晚餐回顾", "Dinner review", "晚餐回顧"],
  swap: ["换掉周三的晚餐", "Swap Wednesday’s dinner", "換星期三嘅晚餐"],
  swapBack: ["换回原来的晚餐", "Restore the original dinner", "換返原本嘅晚餐"],
  swapped: ["周三的菜和采购清单已更新。", "Wednesday’s dinner and the shopping list are updated.", "星期三嘅晚餐同買餸清單已更新。"],
  shopHint: ["用量随人数和换菜自动更新。家里有的食材可以勾掉。", "Quantities update when you change the number of people or swap a meal. Check off items you have.", "換餸或者改人數，份量會自動更新。屋企已有嘅可以剔走。"],
  reviewSample: ["以下是示例记录。正式版由家人确认实际吃了哪些晚餐。", "These are sample records. Members mark the dinners they actually ate.", "呢啲係示範記錄。會員可以標記實際食過嘅晚餐。"],
  reviewCount: ["照菜单吃了 4 顿，其中 1 顿有全谷物。", "Four dinners were eaten as planned. One included whole grains.", "照餐單食咗 4 餐，有 1 餐有全穀物。"],
  reviewIdea: ["下周想试试把一顿的主食换成糙米吗？", "Try brown rice with one dinner next week?", "下星期想唔想有一餐轉食糙米？"],
  add: ["加入下周菜单", "Add to next week’s menu", "加到下星期餐單"],
  added: ["已加入下周菜单", "Added to next week’s menu", "已加到下星期餐單"],
  nextMenu: ["下周菜单", "Next week’s menu", "下星期餐單"],
  nextShopping: ["下周采购清单", "Next week’s shopping list", "下星期買餸清單"],
  nextMeal: ["姜葱鸡、西兰花配糙米", "Ginger-scallion chicken and broccoli with brown rice", "薑蔥雞、西蘭花配糙米"],
  healthNote: ["餐单按兼顾血糖和血脂的一般饮食原则设计。个人医疗建议请咨询医生。", "The menus use general nutrition principles that consider blood sugar and cholesterol. Ask your clinician for personal medical advice.", "餐單按兼顧血糖同血脂嘅一般飲食原則設計。個人醫療建議請問醫生。"],
  guideTitle: ["设计与使用说明", "Design and how to use it", "設計同使用說明"],
  designTitle: ["客户收到什么", "What clients receive", "客人收到啲咩"],
  designBody: ["一年的家庭餐单服务。按口味、忌口和人数规划晚餐，换菜后自动更新采购清单。晚餐回顾会根据确认吃过的餐点，给出一条可用到下周的食材建议。", "A year of family meal planning. The planner uses household tastes, dietary needs, and head count. A meal swap updates the shopping list. A review of confirmed dinners can suggest an ingredient to try next week.", "一年家庭餐單服務。照口味、戒口同人數安排晚餐，換餸之後自動更新買餸清單。晚餐回顧會按確認食過嘅餐點，建議下星期可以試嘅食材。"],
  annaTitle: ["Anna 怎么送", "How Anna sends a gift", "Anna 點樣送禮"],
  annaBody: ["先选好要送礼的家庭，再由 Binya 为每户生成一条专属邀请。把各自的链接一对一发给客户，会员从赠送日起有效 12 个月。", "Choose the households you want to gift. Binya creates a private invitation for each one. Send each link directly to its recipient. The membership lasts 12 months from the gift date.", "先揀好送畀邊啲家庭，再由 Binya 為每戶整一條專屬邀請。逐戶私下發連結，會員由送禮日起計 12 個月。"],
  familyTitle: ["客户怎么用", "How families use it", "客人點樣用"],
  familyBody: ["用平时使用的 Safari 或 Chrome 打开邀请并开通，然后设定人数和忌口。平时用每周菜单和采购清单，周末可做晚餐回顾。开通后沿用同一个浏览器。", "Open the invitation in your usual Safari or Chrome browser and activate it. Set household size and dietary needs. Use the weekly menu and shopping list, then review dinners at the end of the week. Return in the same browser.", "用平時用開嘅 Safari 或 Chrome 打開邀請同開通，再填人數同戒口。平時用每週餐單同買餸清單，週末可以做晚餐回顧。開通之後沿用同一個瀏覽器。"],
  installTitle: ["把餐单放到手机主屏幕", "Add the planner to your Home Screen", "將餐單加到手機主畫面"],
  installSteps: ["用 iPhone 的 Safari 打开这页。点「分享」→「添加到主屏幕」。如果看到「作为网页 App 打开」，开启后点「添加」。下次点主屏幕上的 Anna Meals Demo 图标就能打开。", "Open this page in Safari on your iPhone. Tap Share, then Add to Home Screen. If you see Open as Web App, turn it on, then tap Add. Use the Anna Meals Demo icon to open it again.", "喺 iPhone 用 Safari 開呢頁。撳「分享」→「加入主畫面」。如果見到「以網頁 App 打開」，開啟之後撳「加入」。下次撳主畫面上嘅 Anna Meals Demo 圖示就開到。"],
  feedbackTitle: ["想听听 Anna 的意见", "What would you change, Anna?", "想聽吓 Anna 嘅意見"],
  questionOne: ["送给客户时，你希望他们第一眼看到什么？", "What would you like clients to see first when they open your gift?", "客人一打開你送嘅禮物，你想佢哋首先見到咩？"],
  questionTwo: ["开通、排餐、采购和回顾，哪一步还可以更简单？", "Which step could be simpler: opening the gift, planning, shopping, or reviewing dinners?", "開通、排餐、買餸同回顧，邊一步可以簡單啲？"],
  questionThree: ["如果只能再加一项，你希望是什么？", "If you could add one thing, what would it be?", "如果只可以加一樣，你想加咩？"],
  reply: ["把意见发给 Binya", "Send feedback to Binya", "將意見發畀 Binya"],
};

const foods = {
  chicken: ["鸡胸肉", "Chicken breast", "雞胸肉"],
  broccoli: ["西兰花", "Broccoli", "西蘭花"],
  sweetPotato: ["红薯", "Sweet potato", "番薯"],
  ginger: ["姜", "Ginger", "薑"],
  scallion: ["葱", "Scallions", "蔥"],
  tofu: ["硬豆腐", "Firm tofu", "硬豆腐"],
  pepper: ["彩椒", "Bell peppers", "彩椒"],
  brownRice: ["糙米", "Brown rice", "糙米"],
  shrimp: ["虾仁", "Peeled shrimp", "蝦仁"],
  tomato: ["番茄", "Tomatoes", "番茄"],
  salmon: ["三文鱼", "Salmon", "三文魚"],
  asparagus: ["芦笋", "Asparagus", "蘆筍"],
  quinoa: ["藜麦", "Quinoa", "藜麥"],
};

const dinners = [
  { day: ["周一", "Monday", "星期一"], title: ["姜葱鸡、西兰花配红薯", "Ginger-scallion chicken, broccoli & sweet potato", "薑蔥雞、西蘭花配番薯"], groceries: { chicken: 120, broccoli: 90, sweetPotato: 130, ginger: 4, scallion: 6 } },
  { day: ["周三", "Wednesday", "星期三"], title: ["彩椒豆腐配糙米", "Tofu and bell peppers with brown rice", "彩椒豆腐配糙米"], groceries: { tofu: 130, pepper: 90, brownRice: 55 } },
  { day: ["周五", "Friday", "星期五"], title: ["烤三文鱼、芦笋配藜麦", "Roasted salmon, asparagus & quinoa", "焗三文魚、蘆筍配藜麥"], groceries: { salmon: 125, asparagus: 90, quinoa: 50 } },
];
const replacement = {
  title: ["番茄虾仁配糙米", "Tomato and shrimp with brown rice", "番茄蝦仁配糙米"],
  groceries: { shrimp: 125, tomato: 90, brownRice: 55 },
};

const locales = { zh: ["zh-CN", 0], en: ["en-US", 1], yue: ["yue-Hant", 2] };
const requested = new URLSearchParams(location.search).get("lang");
let language = Object.hasOwn(locales, requested) ? requested : "zh";
let swapped = false;
let added = false;
const checked = new Map();
const size = document.querySelector("#household");
const selector = document.querySelector("#language");
const dinnerList = document.querySelector("#dinners");
const shoppingList = document.querySelector("#groceries");
const tabs = document.querySelectorAll("[data-pane]");
const swap = document.querySelector("#swap");
const add = document.querySelector("#add");

const pick = values => values[locales[language][1]];
const word = key => pick(copy[key]);
const grams = quantity => `${quantity}${language === "en" ? " g" : " 克"}`;

function renderMeals() {
  const meals = dinners.map((meal, index) => swapped && index === 1 ? { ...meal, ...replacement } : meal);
  dinnerList.innerHTML = meals.map(meal =>
    `<li><span class="day">${pick(meal.day)}</span><strong>${pick(meal.title)}</strong></li>`).join("");
  const totals = new Map();
  for (const meal of meals) {
    for (const [food, perPerson] of Object.entries(meal.groceries)) {
      totals.set(food, (totals.get(food) || 0) + perPerson * Number(size.value));
    }
  }
  for (const [food, amount] of checked) {
    if (totals.get(food) !== amount) checked.delete(food);
  }
  shoppingList.innerHTML = Array.from(totals, ([food, amount]) =>
    `<li><label><input type="checkbox" value="${food}" data-amount="${amount}"${checked.get(food) === amount ? " checked" : ""}>
      <span>${pick(foods[food])}</span><span class="amount">${grams(amount)}</span></label></li>`).join("");
  const next = `${pick(foods.brownRice)} · ${grams(55 * Number(size.value))}`;
  document.querySelector("#added-food").textContent = next;
  document.querySelector("#next-food").textContent = next;
  document.querySelector("#added").hidden = !added;
  document.querySelector("#next-shopping").hidden = !added;
  swap.textContent = word(swapped ? "swapBack" : "swap");
  add.textContent = word(added ? "added" : "add");
  add.disabled = added;
}

function localize() {
  document.documentElement.lang = locales[language][0];
  selector.value = language;
  document.title = `Anna Wang · ${word("demoTitle")} | JoyBinya`;
  for (const node of document.querySelectorAll("[data-copy]")) node.textContent = word(node.dataset.copy);
  for (const node of document.querySelectorAll("[data-label]")) node.setAttribute("aria-label", word(node.dataset.label));
  const subject = encodeURIComponent(`Anna Wang · ${word("demoTitle")}`);
  const body = encodeURIComponent([word("questionOne"), word("questionTwo"), word("questionThree")].join("\n\n"));
  document.querySelector("#feedback").href = `mailto:hellojoybinya@gmail.com?subject=${subject}&body=${body}`;
  renderMeals();
}

for (const tab of tabs) {
  tab.addEventListener("click", () => {
    for (const button of tabs) {
      const active = button === tab;
      button.setAttribute("aria-pressed", String(active));
      document.getElementById(button.dataset.pane).hidden = !active;
    }
  });
}

selector.addEventListener("change", () => {
  language = selector.value;
  const url = new URL(location.href);
  url.searchParams.set("lang", language);
  history.replaceState(null, "", url);
  localize();
});
size.addEventListener("change", renderMeals);
swap.addEventListener("click", () => {
  swapped = !swapped;
  renderMeals();
  document.querySelector("#swap-status").textContent = word("swapped");
});
shoppingList.addEventListener("change", event => {
  const input = event.target;
  if (input.checked) checked.set(input.value, Number(input.dataset.amount));
  else checked.delete(input.value);
});
add.addEventListener("click", () => {
  added = true;
  renderMeals();
});

localize();
