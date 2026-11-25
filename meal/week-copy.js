"use strict";

const locales = { en: 0, zh: 1, yue: 2 };
const tags = { en: "en-US", zh: "zh-CN", yue: "yue-Hant" };
const calendarLocales = { en: "en-US", zh: "zh-CN", yue: "zh-HK" };
const language = document.querySelector("#language");
const words = {
  shopTitle: ["Shopping list","采购清单","買餸清單"],
  shopIntro: ["Check the ingredients you already have. The copied list includes the items still to buy.","勾选表示家里已有。复制时只包含还要买的食材。","剔選表示屋企已有。複製嗰陣只包括仲要買嘅食材。"],
  pantryHave: ["Already have","家里已有","屋企已有"],
  pantryItem: ["Already have {food}","家里已有{food}","屋企已有{food}"],
  copy: ["Copy list","复制待买清单","複製待買清單"],
  remaining: ["{n} to buy","{n} 项待买","仲有 {n} 項要買"],
  copied: ["Copied to your clipboard.","已复制。","已複製。"],
  copyManual: ["Press and hold the text below, then select Copy.","长按下面的清单文字，然后点「复制」。","長撳下面嘅清單文字，再撳「複製」。"],
  disclaimer: ["Use these menus as a general nutrition reference and ask your clinician for personal medical advice.","餐单仅供一般饮食参考，个人医疗建议请咨询医生。","餐單只供一般飲食參考，個人醫療建議請向醫生查詢。"],
  usda: ["USDA cooking temperatures ↗","美国农业部烹调温度 ↗","美國農業部安全烹調溫度 ↗"],
  back: ["‹ Build one meal","‹ 返回单餐搭配","‹ 返回配一餐"],
  contactNavigation: ["About and contact","关于与联系","關於同聯絡"],
  aboutLink: ["About me","关于我","關於我"],
  mealNavigation: ["Meal planning","菜单导航","餐單導覽"],
  savedMeals: ["Saved meals","已保存餐点","已儲存餐點"],
  savedMealsEmpty: ["Choose “Keep dinner” in a recipe to find it here.","在菜谱里点击「保留这道菜」，就能在这里找到。","喺食譜撳「留低呢道餸」，就可以喺呢度搵返。"],
  preferenceStorage: ["Your household preferences stay in this browser and are used the next time you plan.","家庭偏好保存在这个浏览器里，下次排餐会自动沿用。","屋企人口味同戒口會儲喺呢個瀏覽器，下次排餐會自動沿用。"],
  weekTitle: ["This week’s menu","本周晚餐菜单","今個禮拜晚餐餐單"],
  weekIntro: ["Seven dinners for your household, with one shopping list.","为家里排七天晚餐，合成一张采购清单。","幫屋企配七日晚餐，合埋一張買餸清單。"],
  nextWeekTitle: ["Next week’s menu","下周晚餐菜单","下星期晚餐餐單"],
  nextWeekPlan: ["Next week’s plan","下周安排","下星期安排"],
  backCurrentWeek: ["‹ This week’s menu","‹ 返回本周菜单","‹ 返今週餐單"],
  reviewTitle: ["Weekly dinner review","本周晚餐回顾","今週晚餐回顧"],
  reviewHint: ["Mark the dinners you’ve had. The review uses dinners you confirm as planned.","标记已经吃过的晚餐。回顾中的食材次数只统计「照菜单吃了」的晚餐。","標記食過嘅晚餐。食材次數只計「照餐單食咗」嘅晚餐。"],
  reviewUnmarked: ["Record dinner","记录晚餐","記低晚餐"],
  reviewPlanned: ["Ate as planned","照菜单吃了","照餐單食咗"],
  reviewChanged: ["Ate something else","换了菜","換咗餸"],
  reviewSkipped: ["Skipped","跳过","跳過"],
  reviewCount: ["{n} of 7 dinner slots recorded.","已记录 {n}／7 个晚餐时段。","已記低 {n}／7 個晚餐時段。"],
  reviewGrainCount: ["{g} of the {n} dinners you ate as planned included whole grains.","照菜单吃了 {n} 顿，其中 {g} 顿有全谷物。","照餐單食咗 {n} 餐，有 {g} 餐有全穀物。"],
  reviewIdea: ["Try {food} with one dinner next week.","下周可以试一顿搭配{food}。","下星期可以試一餐配{food}。"],
  reviewAdd: ["Add to next week’s menu","加入下周菜单","加到下星期餐單"],
  reviewAdded: ["From your dinner review · {food}","来自晚餐回顾 · {food}","來自晚餐回顧 · {food}"],
  reviewSaveError: ["This browser couldn’t save the review.","这个浏览器暂时无法保存回顾。","呢個瀏覽器暫時儲存唔到回顧。"],
  editWeekFood: ["Household preferences","家庭偏好","屋企人口味"],
  cancelWeekEdit: ["Cancel edits","取消编辑","取消修改"],
  applyWeekPreferences: ["Apply and plan","应用并排餐","套用同排餐"],
  cuisine: ["Regional flavor","地方风味","地方風味"],
  avoidTitle: ["Dietary restrictions","家庭忌口和过敏原","屋企人嘅戒口同致敏原"],
  customFoodTitle: ["Other ingredients","其他食材","其他食材"],
  customFoodName: ["Ingredient name","食材名称","食材名稱"],
  customFoodGroup: ["Category","食材类别","食材類別"],
  customFoodChoose: ["Choose a category","请选择类别","請揀類別"],
  customFoodCarb: ["Starch or other carbs","主食或其他碳水","主食或其他碳水"],
  customFoodAdd: ["Add ingredient","添加食材","加入食材"],
  customFoodRemove: ["Remove","移除","移除"],
  customFoodRemoveName: ["Remove {food}","移除{food}","移除{food}"],
  customFoodAdded: ["Ingredient selected.","已选中这项食材。","已揀呢款食材。"],
  customFoodInvalid: ["Enter an ingredient name of up to 50 characters.","请输入 50 个字符以内的食材名称。","請輸入 50 個字元以內嘅食材名。"],
  customFoodConflict: ["This ingredient conflicts with your restrictions.","这项食材与已选忌口或过敏原有冲突。","呢款食材同已揀嘅戒口或者致敏原有衝突。"],
  customFoodReview: ["I checked that these added ingredients fit our restrictions.","我已核对这些自填食材符合家人的过敏和忌口要求。","我已核對呢啲自填食材符合屋企人嘅敏感同戒口要求。"],
  customFoodCheck: ["Check your added ingredients against your restrictions first.","请先核对自填食材是否符合家人的过敏和忌口要求。","請先核對自填食材係咪符合屋企人嘅敏感同戒口要求。"],
  customProteinPrep: ["Cook the selected protein using the method and temperature appropriate for that ingredient.","请按所选蛋白质食材适用的做法和温度烹调。","請按所選蛋白質食材適用嘅做法同溫度烹調。"],
  asNeeded: ["As needed","按需","按需要"],
  generateWeek: ["Generate this week’s menu","生成本周菜单","整今個禮拜餐單"],
  regenerateWeek: ["Replan the week","重新排一周","再排一星期"],
  saveWeek: ["Save household preferences","保存家庭偏好","儲存屋企人口味"],
  sevenDinners: ["This week’s plan","本周安排","今個禮拜安排"],
  screenMenu: ["Menu","菜单","餐單"],
  screenShopping: ["Shopping","采购清单","買餸清單"],
  planTools: ["Adjust or share","调整与分享","調整同分享"],
  viewRecipe: ["How to cook","查看做法","睇做法"],
  swapShort: ["Swap","换餐","換餸"],
  householdServings: ["Usual number of people","平时用餐人数","平時用餐人數"],
  cookSummary: ["{n} dinners at home · {p} servings","{n} 晚在家做 · 共 {p} 人份","{n} 晚喺屋企煮 · 共 {p} 人份"],
  changeNightGuests: ["Adjust portions by day","调整每天人数","調整每日人數"],
  guestsHint: ["Set a day to 0 for leftovers or plans out.","有剩菜或要外出吃饭，那天可以选 0 人。","嗰日有餸剩或者出去食，就可以揀 0 人。"],
  householdCount: ["Usual ({n})","平时人数（{n}）","平時人數（{n}）"],
  guestCount: ["{n} servings","{n} 人份","{n} 人份"],
  noDinner: ["Leftovers or eating out","留给剩菜或外食","食餸尾或者出街食"],
  pinDinner: ["Keep dinner","保留这道菜","留低呢道餸"],
  pinnedDinner: ["Kept ✓","已保留 ✓","已留低 ✓"],
  pinnedAnnouncement: ["This dinner stays when you generate another menu.","重新生成菜单时会保留这道菜。","再整餐單嗰陣會留低呢道餸。"],
  shanghaiPancake: ["Scallion pancake as an after-dinner bite once this week","本周一顿可加餐末小点：葱油饼","今個禮拜一餐可以加餐尾小食：蔥油餅"],
  pancakeRestricted: ["Skipped when you avoid scallions or gluten.","忌葱或避开麸质时会跳过葱油饼。","戒蔥或者避麩質嗰陣會略過蔥油餅。"],
  carbOrder: ["Start with vegetables, then protein. If you’re having dessert or a refined starch, save a small portion for the end and count it toward your meal’s carbs.","先吃蔬菜，再吃蛋白质。甜点、油酥面点或精制主食，留到餐末少量享用，并算入这餐的碳水份量。","先食蔬菜，再食蛋白質。甜品、油酥麵點或者精製主食，留到餐尾食少少，一齊計入呢餐嘅碳水份量。"],
  pancakeOrder: ["Finish with one small piece of scallion pancake and serve less of your usual starch with this meal.","这一餐留一小片葱油饼当餐末小点，其他主食少配一些。","呢餐留一小件蔥油餅做餐尾小食，其他主食配少啲。"],
  unpinnedAnnouncement: ["This dinner can be swapped again.","这道菜可以重新替换。","呢道餸又可以換喇。"],
  sharedPrep: ["Ingredients to prep together","可以一起备的食材","可以一齊備嘅食材"],
  copyForAmazon: ["Copy full list for Amazon","复制整张清单给 Amazon","複製成張清單畀 Amazon"],
  amazonListHint: ["Find each ingredient on Amazon or Whole Foods, or copy the full list. Added ingredients keep the names you entered.","可逐项去 Amazon 或 Whole Foods 找食材，也可以复制整张清单。自填食材保留原名。","可以逐樣去 Amazon 或 Whole Foods 搵食材，亦可以複製成張清單。自填食材會保留輸入嘅名。"],
  amazonCopied: ["Full list copied. Paste it into Amazon’s shopping list tool.","整张清单已复制，可以到 Amazon 的清单入口粘贴。","成張清單已複製，可以貼去 Amazon 嘅清單入口。"],
  openAmazon: ["Open Amazon ↗","打开 Amazon ↗","打開 Amazon ↗"],
  openWholeFoods: ["Shop at Whole Foods ↗","去 Whole Foods 买菜 ↗","去 Whole Foods 買餸 ↗"],
  shopItemName: ["Find {food} at Whole Foods Market","在 Whole Foods 查找{food}","去 Whole Foods 搵{food}"],
  printWeek: ["Print / Save PDF","打印／保存 PDF","列印／儲存 PDF"],
  downloadWeek: ["Download text","下载文本","下載文字檔"],
  nutritionResources: ["Healthy habits & guides","健康习惯与饮食指南","健康習慣同飲食指南"],
  moreGuides: ["More references","更多参考","更多參考"],
  habitsGuide: ["JoyBinya · Eating habits and after-meal walk timer","JoyBinya · 饮食习惯与饭后散步计时","JoyBinya · 飲食習慣同飯後散步計時"],
  guidePlate: ["ADA · Diabetes Plate Method (PDF)","美国糖尿病协会 · 餐盘比例图解（PDF）","美國糖尿病協會 · 餐盤比例圖解（PDF）"],
  guideProtein: ["ADA · Protein food choices","美国糖尿病协会 · 蛋白质食材选择","美國糖尿病協會 · 點揀蛋白質食材"],
  guideHeart: ["American Heart Association · Plant-forward eating","美国心脏协会 · 多选植物食物的做法","美國心臟協會 · 多揀植物食材嘅做法"],
  guideMayo: ["Mayo Clinic · Healthy eating for diabetes","梅奥诊所 · 糖尿病饮食与一日餐单","梅奧診所 · 糖尿病飲食同一日餐單"],
  guideDga: ["U.S. Dietary Guidelines, 2025–2030","2025–2030 美国膳食指南","2025–2030 美國膳食指南"],
  guidePlateHistory: ["MyPlate · 2020–2025 handout (PDF)","MyPlate · 2020–2025 餐盘资料（PDF）","MyPlate · 2020–2025 餐盤資料（PDF）"],
  guideDri: ["USDA · Macronutrient reference calculator","美国农业部 · 三大营养素参考计算器","美國農業部 · 三大營養素參考計算器"],
  swapDay: ["Swap this dinner","换这天的晚餐","換呢日晚餐"],
  swappedDay: ["Dinner changed and shopping list updated.","已换晚餐，采购清单也更新了。","換咗晚餐，買餸清單亦更新咗。"],
  savedWeek: ["Saved on this device.","偏好已保存到此浏览器。","已儲存喺呢個瀏覽器。"],
  saveUnavailable: ["These choices are ready to use on this page.","这些偏好可在当前页面使用。","呢啲選擇可以喺而家呢版用。"],
  weekChanged: ["Generate again to use your new choices.","重新生成菜单后，会使用新的选择。","再整一次餐單就會用新選擇。"],
  missingGroup: ["Choose at least one vegetable, protein that fits your restrictions, and whole grain or starchy vegetable.","请至少选一种蔬菜、一种符合忌口的蛋白质食材和一种全谷物或薯类。","請最少揀一款蔬菜、一款符合戒口嘅蛋白質食材，同一款全穀物或者薯類。"],
  servingExtra: ["On the side","餐边搭配","伴碟"],
  allergyReminder: ["Check package labels for allergens and shared equipment.","选购包装食品时，请核对配料和过敏原提示。","買包裝食品嗰陣，請睇清楚配料同致敏原提示。"],
  amazonItemName: ["Find {food} on Amazon","在 Amazon 查找{food}","去 Amazon 搵{food}"],
};

let lang = "en";
try {
  const savedLanguage = localStorage.getItem("joybinya-meal-language-v1");
  if (Object.hasOwn(locales, savedLanguage)) lang = savedLanguage;
} catch { /* Preferences are optional. */ }
language.value = lang;

function tr(values) { return values[locales[lang]]; }
function t(key) { return tr(words[key]); }

function formatAmount({ amount, unit }, displayLanguage = lang) {
  if (unit === "asNeeded") return words.asNeeded[locales[displayLanguage]];
  if (unit === "count") return String(amount);
  if (unit === "tbsp" || unit === "tsp") return `${amount} ${displayLanguage === "en" ? unit : unit === "tbsp" ? "大匙" : "小匙"}`;
  if (displayLanguage !== "en") return `${amount} 克`;
  if (amount >= 454) return `${(amount / 453.592).toFixed(1)} lb`;
  return `${Number((amount / 28.3495).toFixed(1))} oz`;
}

function localize() {
  document.documentElement.lang = tags[lang];
  for (const element of document.querySelectorAll("[data-text]")) {
    element.textContent = t(element.dataset.text);
  }
  for (const element of document.querySelectorAll("[data-aria-label]")) {
    element.setAttribute("aria-label", t(element.dataset.ariaLabel));
  }
}

language.addEventListener("change", () => {
  lang = language.value;
  try { localStorage.setItem("joybinya-meal-language-v1", lang); } catch {}
  localize();
  document.dispatchEvent(new Event("joybinya-language"));
});

async function copyText(text, status, manual, { success = t("copied"), showList = false } = {}) {
  manual.value = text;
  manual.hidden = !showList;
  status.textContent = showList ? t("copyManual") : "";
  try {
    const write = navigator.clipboard.writeText(text);
    if (showList) manual.scrollIntoView({ block: "nearest" });
    await write;
    if (manual.value !== text) return false;
    status.textContent = success;
    return true;
  } catch {
    if (manual.value !== text) return false;
    status.textContent = t("copyManual");
    manual.hidden = false;
    manual.focus();
    manual.select();
    return false;
  }
}

localize();
