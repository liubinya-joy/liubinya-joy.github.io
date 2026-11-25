import { t } from "./copy.js?v=weekly-1";

export const groups = { veg: "蔬菜", protein: "蛋白质", starch: "主食" };
export const styles = {
  mixed: "中西混搭",
  chinese: "中式家常",
  western: "西式简餐",
};

export const avoidOptions = {
  scallion: "葱",
  onion: "洋葱",
  ginger: "姜",
  garlic: "蒜",
  cilantro: "香菜",
  chili: "辣椒",
  pork: "猪肉",
  beef: "牛肉",
  dairy: "奶制品",
};

export const allergens = {
  soy: "大豆",
  egg: "鸡蛋",
  fish: "鱼",
  shellfish: "虾蟹",
  wheat: "小麦",
  dairy: "牛奶",
  nuts: "坚果",
  peanut: "花生",
  sesame: "芝麻",
  hemp: "火麻仁",
};

export const foodColors = {
  red: "colorRed", pink: "colorPink", orange: "colorOrange", yellow: "colorYellow",
  green: "colorGreen", blue: "colorBlue", purple: "colorPurple", white: "colorWhite",
  tan: "colorTan", brown: "colorBrown", silver: "colorSilver", mixed: "colorMixed",
};

export const foods = [
  { id: "broccoli", name: "西兰花", group: "veg", top: true, color: "green" },
  { id: "bokchoy", name: "小白菜", group: "veg", top: true, color: "green", style: "chinese", search: "青菜 上海青" },
  { id: "tomato", name: "番茄", group: "veg", top: true, color: "red", search: "西红柿" },
  { id: "spinach", name: "菠菜", group: "veg", color: "green" },
  { id: "mushroom", color: "brown", name: "香菇", group: "veg", top: true, style: "chinese", search: "蘑菇" },
  { id: "cucumber", color: "green", name: "黄瓜", group: "veg", top: true },
  { id: "bellpepper", color: "mixed", name: "甜椒", group: "veg", style: "western", search: "彩椒 青椒" },
  { id: "redpepper", name: "红彩椒", group: "veg", color: "red", search: "red pepper red bell pepper 彩椒 紅甜椒 紅椒" },
  { id: "yellowpepper", name: "黄彩椒", group: "veg", color: "yellow", search: "yellow pepper yellow bell pepper 彩椒 黃甜椒 黃椒" },
  { id: "carrot", name: "胡萝卜", group: "veg", color: "orange", search: "carrot carrots 红萝卜 紅蘿蔔" },
  { id: "purplecabbage", name: "紫甘蓝", group: "veg", color: "purple", search: "red cabbage purple cabbage 紫包菜 紫卷心菜 紫椰菜" },
  { id: "cauliflower", name: "菜花", group: "veg", color: "white", search: "花椰菜" },
  { id: "zucchini", color: "green", name: "西葫芦", group: "veg", style: "western" },
  { id: "cabbage", color: "green", name: "卷心菜", group: "veg", search: "包菜 圆白菜" },
  { id: "snappeas", color: "green", name: "荷兰豆", group: "veg" },
  { id: "eggplant", color: "purple", name: "茄子", group: "veg" },
  { id: "asparagus", color: "green", name: "芦笋", group: "veg", style: "western", search: "asparagus 蘆筍 露笋 露筍" },
  { id: "onion", color: "white", name: "洋葱", group: "veg", more: true, style: "western", tags: ["onion"], search: "onion onions 洋蔥 紫洋葱 黄洋葱 甜洋葱" },
  { id: "beet", name: "甜菜根", group: "veg", color: "purple", more: true, style: "western", search: "beet beets beetroot beetroots 红菜头 紅菜頭" },
  { id: "artichoke", color: "green", name: "洋蓟", group: "veg", style: "western", search: "artichokes globe artichoke artichoke hearts 朝鲜蓟 朝鮮薊 洋薊", aliases: ["globe artichoke", "artichoke hearts"] },
  { id: "brussels", color: "green", name: "抱子甘蓝", group: "veg", more: true, style: "western", search: "Brussels sprouts 芽甘蓝 小卷心菜 椰菜仔" },
  { id: "arugula", color: "green", name: "芝麻菜", group: "veg", more: true, style: "western", search: "arugula rocket rucola" },
  { id: "greenbeans", color: "green", name: "四季豆", group: "veg", more: true, style: "western", search: "green beans string beans 青豆角" },
  { id: "tofu", color: "white", name: "豆腐", group: "protein", top: true, style: "chinese", tags: ["soy"], ldl: 2 },
  { id: "salmon", color: "pink", name: "三文鱼", group: "protein", top: true, style: "western", tags: ["fish"], ldl: 2 },
  { id: "chicken", color: "tan", name: "鸡胸肉", group: "protein", top: true, ldl: 1 },
  { id: "egg", color: "yellow", name: "鸡蛋", group: "protein", top: true, tags: ["egg"] },
  { id: "edamame", color: "green", name: "毛豆", group: "protein", style: "chinese", tags: ["soy"], ldl: 2 },
  { id: "chickpea", color: "tan", name: "鹰嘴豆", group: "protein", style: "western", ldl: 2 },
  { id: "lentil", color: "brown", name: "扁豆（干豆）", group: "protein", style: "western", ldl: 2, search: "小扁豆 lentils" },
  { id: "shrimp", color: "pink", name: "虾", group: "protein", tags: ["shellfish"] },
  { id: "sardines", color: "silver", name: "沙丁鱼", group: "protein", style: "western", tags: ["fish"], ldl: 2 },
  { id: "cod", color: "white", name: "鳕鱼", group: "protein", tags: ["fish"], ldl: 1 },
  { id: "porkloin", color: "pink", name: "猪里脊", group: "protein", tags: ["pork"], ldl: 1 },
  { id: "porkbelly", color: "pink", name: "五花肉", group: "protein", style: "chinese", tags: ["pork"], ldl: -2 },
  { id: "beef", color: "red", name: "肥牛", group: "protein", tags: ["beef"], ldl: -2 },
  { id: "rice", color: "white", name: "白米饭", group: "starch", top: true, style: "chinese", search: "大米 白饭" },
  { id: "brownrice", color: "brown", name: "糙米饭", group: "starch", top: true, style: "chinese", ldl: 1 },
  { id: "oat", color: "tan", name: "燕麦", group: "starch", style: "western", ldl: 1 },
  { id: "toast", color: "brown", name: "全麦面包", group: "starch", top: true, style: "western", tags: ["wheat"], packaged: true },
  { id: "yam", color: "orange", name: "红薯", group: "starch", top: true, search: "地瓜 番薯" },
  { id: "quinoa", color: "tan", name: "藜麦", group: "starch", style: "western", ldl: 1 },
  { id: "barley", color: "tan", name: "大麦", group: "starch", ldl: 2 },
  { id: "corn", color: "yellow", name: "玉米", group: "starch" },
  { id: "noodles", color: "tan", name: "小麦面条", group: "starch", style: "chinese", tags: ["wheat"], packaged: true },
  { id: "pasta", color: "brown", name: "全麦意面", group: "starch", style: "western", tags: ["wheat"], packaged: true },
  { id: "blackberry", name: "黑莓", group: "fruit", color: "purple", search: "blackberry blackberries 黑魅" },
  { id: "blueberry", name: "蓝莓", group: "fruit", color: "blue", search: "blueberry blueberries 藍莓" },
  { id: "raspberry", name: "红莓（树莓）", group: "fruit", color: "red", search: "raspberry raspberries 红莓 红树莓 覆盆子 紅莓" },
  { id: "strawberry", name: "草莓", group: "fruit", color: "red", search: "strawberry strawberries 士多啤梨" },
  { id: "hemp", color: "tan", name: "火麻仁", group: "extra", top: true, tags: ["hemp"], search: "hemp hearts hemp seeds 大麻籽" },
];

export const foodById = Object.fromEntries(foods.map(food => [food.id, food]));
export const initialState = { foods: [], avoid: [], allergies: [], style: "mixed", ldl: false };
export const exampleState = { ...initialState, foods: ["rice", "tofu", "broccoli"] };

export function ingredientName(value) {
  const name = typeof value === "string" ? value.normalize("NFKC").trim().replace(/\s+/gu, " ") : "";
  return name.length <= 30 && /^[\p{L}\p{N}][\p{L}\p{M}\p{N} .()'’·-]*$/u.test(name) ? name : "";
}

export function findIngredient(value, catalog) {
  const key = value.toLowerCase();
  return catalog.find(food => (
    [food.name, food.id, ...(names[food.id] || []), ...(food.aliases || []), ...(food.search || "").split(/ +/)]
      .some(alias => alias.toLowerCase() === key)
  ));
}

export function restrictionsKey(state) {
  return [...state.avoid.map(id => "avoid:" + id), ...state.allergies.map(id => "allergy:" + id)].sort().join(",");
}

export function pantryOf(state) {
  return [...foods, ...state.customFoods];
}

export function foodFor(state, id) {
  return foodById[id] || state.customFoods.find(food => food.id === id);
}

export function normalizeState(value) {
  const options = (key, catalog) => Array.isArray(value?.[key])
    ? [...new Set(value[key].filter(id => typeof id === "string" && Object.hasOwn(catalog, id)))]
    : [];
  const customFoods = [];
  const ids = new Set();
  if (Array.isArray(value?.customFoods)) {
    for (const entry of value.customFoods.slice(0, 50)) {
      const name = ingredientName(entry?.name);
      if (!name || !/^custom-[a-z0-9-]{1,60}$/.test(entry.id) || ids.has(entry.id)
        || !Object.hasOwn(groups, entry.group)) continue;
      ids.add(entry.id);
      customFoods.push({
        id: entry.id,
        name,
        group: entry.group,
        custom: true,
        color: typeof entry.color === "string" && Object.hasOwn(foodColors, entry.color) ? entry.color : undefined,
        checked: typeof entry.checked === "string" ? entry.checked : "",
      });
    }
  }
  const allowedFoodIds = { ...foodById, ...Object.fromEntries(customFoods.map(food => [food.id, food])) };
  return {
    foods: options("foods", allowedFoodIds),
    customFoods,
    avoid: options("avoid", avoidOptions),
    allergies: options("allergies", allergens),
    style: typeof value?.style === "string" && Object.hasOwn(styles, value.style) ? value.style : "mixed",
    ldl: value?.ldl === true,
  };
}

export function isAllowed(food, state) {
  const avoidTags = [...state.avoid, ...state.allergies];
  if (food.custom) return avoidTags.length === 0 || food.checked === restrictionsKey(state);
  // Breads and noodles can contain ingredients beyond their base grain.
  if (food.packaged && (state.allergies.length || state.avoid.includes("dairy"))) return false;
  return !food.tags?.some(tag => avoidTags.includes(tag));
}

function rankedFoods(state, group, style) {
  const score = food => (state.foods.includes(food.id) ? 20 : 0)
    + (food.style === style ? 3 : 0)
    + (state.ldl ? (food.ldl || 0) * 2 : 0);
  return pantryOf(state).filter(food => food.group === group && (!food.custom || state.foods.includes(food.id)) && isAllowed(food, state)
    && !(state.ldl && food.ldl < 0)).sort((a, b) => score(b) - score(a));
}

function choicesForGroup(state, group, style) {
  const candidates = rankedFoods(state, group, style);
  const atHome = candidates.filter(food => state.foods.includes(food.id));
  if (atHome.length) return atHome;
  const fallback = group === "protein"
    ? candidates.find(food => food.id === "chicken")
      || candidates.find(food => food.id === "egg")
      || candidates.find(food => !(food.ldl < 0))
    : candidates[0];
  return [fallback];
}

const names = {
  broccoli: ["Broccoli", "西蘭花"], bokchoy: ["Bok choy", "白菜"],
  tomato: ["Tomato", "番茄"], spinach: ["Spinach", "菠菜"],
  mushroom: ["Shiitake mushrooms", "冬菇"], cucumber: ["Cucumber", "青瓜"],
  bellpepper: ["Bell pepper", "甜椒"], redpepper: ["Red bell pepper", "紅椒"],
  yellowpepper: ["Yellow bell pepper", "黃椒"], carrot: ["Carrot", "紅蘿蔔"],
  purplecabbage: ["Red cabbage", "紫椰菜"], cauliflower: ["Cauliflower", "椰菜花"],
  zucchini: ["Zucchini", "翠玉瓜"], cabbage: ["Cabbage", "椰菜"],
  snappeas: ["Snow peas", "荷蘭豆"], eggplant: ["Eggplant", "茄子"],
  asparagus: ["Asparagus", "蘆筍"], onion: ["Onion", "洋蔥"], beet: ["Beets", "紅菜頭"],
  artichoke: ["Artichoke", "洋薊"], brussels: ["Brussels sprouts", "抱子甘藍"],
  arugula: ["Arugula", "芝麻菜"], greenbeans: ["Green beans", "四季豆"], tofu: ["Tofu", "豆腐"],
  salmon: ["Salmon", "三文魚"], chicken: ["Chicken breast", "雞胸肉"],
  egg: ["Eggs", "雞蛋"], edamame: ["Edamame", "毛豆"],
  chickpea: ["Chickpeas", "鷹嘴豆"], lentil: ["Lentils", "小扁豆"],
  shrimp: ["Shrimp", "蝦"], cod: ["Cod", "鱈魚"],
  sardines: ["Sardines", "沙甸魚"], porkloin: ["Pork loin", "豬柳"],
  porkbelly: ["Pork belly", "五花腩"], beef: ["Fatty beef", "肥牛"],
  rice: ["White rice", "白飯"], brownrice: ["Brown rice", "糙米飯"],
  oat: ["Oats", "燕麥"], toast: ["Whole-wheat bread", "全麥麵包"],
  yam: ["Sweet potato", "番薯"], quinoa: ["Quinoa", "藜麥"],
  barley: ["Barley", "大麥"], corn: ["Corn", "粟米"],
  noodles: ["Wheat noodles", "小麥麵"], pasta: ["Whole-wheat pasta", "全麥意粉"],
  blackberry: ["Blackberries", "黑莓"], blueberry: ["Blueberries", "藍莓"],
  raspberry: ["Raspberries", "紅莓（覆盆子）"], strawberry: ["Strawberries", "士多啤梨"],
  hemp: ["Hemp hearts", "火麻仁"],
};

const styleNames = { mixed: ["Both styles", "中西都得"], chinese: ["Chinese home-style", "中式家常"], western: ["Western-style", "西式簡餐"] };
const groupNames = { veg: ["Vegetables", "蔬菜"], protein: ["Protein", "蛋白質"], starch: ["Carbs", "主食"], fruit: ["Fruit", "水果"], extra: ["Toppings", "配料"] };
const avoidNames = {
  scallion: ["Scallions", "蔥"], onion: ["Onion", "洋蔥"], ginger: ["Ginger", "薑"], garlic: ["Garlic", "蒜"],
  cilantro: ["Cilantro", "芫荽"], chili: ["Chili", "辣椒"], pork: ["Pork", "豬肉"],
  beef: ["Beef", "牛肉"], dairy: ["Dairy", "奶類"],
};
const allergyNames = {
  soy: ["Soy", "大豆"], egg: ["Egg", "雞蛋"], fish: ["Fish", "魚"],
  shellfish: ["Shellfish", "蝦蟹"], wheat: ["Wheat", "小麥"], dairy: ["Milk", "牛奶"],
  nuts: ["Tree nuts", "堅果"], peanut: ["Peanut", "花生"], sesame: ["Sesame", "芝麻"],
  hemp: ["Hemp seed", "火麻仁"],
};

export function nameOf(food) { return food.custom ? food.name : t(names[food.id][0], food.name, names[food.id][1]); }
export function searchNames(food) { return [food.name, food.id, food.search || "", ...(names[food.id] || [])].join(" "); }
export function styleOf(id) { return t(styleNames[id][0], styles[id], styleNames[id][1]); }
export function groupOf(id) { return t(groupNames[id][0], groups[id] || groupNames[id][1], groupNames[id][1]); }
export function avoidOf(id) { return t(avoidNames[id][0], avoidOptions[id], avoidNames[id][1]); }
export function allergyOf(id) { return t(allergyNames[id][0], allergens[id], allergyNames[id][1]); }

export function makeMeals(state, versions = [0, 0]) {
  return [0, 1].map(index => {
    const style = state.style === "mixed" ? (index === 0 ? "chinese" : "western") : state.style;
    const choices = Object.keys(groups).map(group => choicesForGroup(state, group, style));
    const combinationCount = choices.reduce((total, group) => total * group.length, 1);
    const version = versions[index] + (index === 1 && state.style !== "mixed" ? 1 : 0);
    let combination = version % combinationCount;
    const items = choices.map(group => {
      const food = group[combination % group.length];
      combination = Math.floor(combination / group.length);
      return { ...food, name: nameOf(food), onHand: state.foods.includes(food.id) };
    });
    const [veg, protein, starch] = items;
    const chinese = style === "chinese";
    const title = chinese
      ? t(protein.name + " with " + veg.name.toLowerCase(), protein.name + "配" + veg.name, protein.name + "配" + veg.name)
      : t("Lemon " + protein.name.toLowerCase() + " with " + veg.name.toLowerCase(), "柠檬" + protein.name + "配" + veg.name, "檸檬" + protein.name + "配" + veg.name);
    const aromatics = ["scallion", "ginger", "garlic"].filter(id => !state.avoid.includes(id)).map(avoidOf);
    const seasoning = chinese && aromatics.length
      ? t("Season with " + aromatics.map(name => name.toLowerCase()).join(", ") + " and a little canola oil.", "可用" + aromatics.join("、") + "和少量菜籽油调味。", "可以用" + aromatics.join("、") + "同少少芥花籽油調味。")
      : t("Season with lemon, black pepper and olive oil.", "可用柠檬汁、黑胡椒和橄榄油调味。", "可以用檸檬汁、黑椒同橄欖油調味。");
    const alternateMethod = Math.floor(version / combinationCount) % 2 === 1;
    const vegMethod = chinese
      ? (alternateMethod ? t("Stir-fry the vegetables.", "蔬菜快炒。", "蔬菜快炒。") : t("Steam the vegetables.", "蔬菜蒸熟。", "蔬菜蒸熟。"))
      : (alternateMethod ? t("Sauté the vegetables.", "蔬菜用平底锅快炒。", "蔬菜用平底鑊快炒。") : t("Roast the vegetables.", "蔬菜烤熟。", "蔬菜焗熟。"));
    const prep = vegMethod + " " + t("Cook the protein through and serve with the starch.", "蛋白质食材煮熟，搭配主食。", "蛋白質食材煮熟，再配主食。");
    const available = state.foods.map(id => foodFor(state, id)).filter(food => isAllowed(food, state));
    const secondVegetable = available.find(food => food.group === "veg" && food.id !== veg.id && food.color && food.color !== "mixed" && food.color !== veg.color);
    const fruit = available.find(food => food.group === "fruit" && food.color !== veg.color && food.color !== secondVegetable?.color)
      || available.find(food => food.group === "fruit");
    const extras = [];
    if (secondVegetable) {
      const name = nameOf(secondVegetable);
      extras.push(t("Add " + name.toLowerCase() + " to the vegetables.", "蔬菜里再搭一点" + name + "。", "蔬菜可以加少少" + name + "。"));
    }
    const grainPartner = { brownrice: "quinoa", quinoa: "brownrice" }[starch.id];
    const mixedGrains = grainPartner && available.some(food => food.id === grainPartner);
    if (mixedGrains) {
      extras.push(t("Mix brown rice and quinoa to fill a quarter plate.", "糙米拌藜麦，两样合起来占四分之一盘。", "糙米撈藜麥，兩樣加埋佔四分一碟。"));
    }
    if (fruit) {
      const name = nameOf(fruit);
      extras.push(t("Serve " + name.toLowerCase() + " on the side.", "旁边可以搭一份" + name + "。", "旁邊可以配一份" + name + "。"));
    }
    const hemp = state.foods.includes("hemp") && isAllowed(foodById.hemp, state);
    const topping = hemp
      ? t(" Finish with a sprinkle of hemp hearts for plant omega-3 (ALA).", "撒一点火麻仁，补充植物来源的 omega‑3（ALA）。", "灑少少火麻仁，加啲植物來源嘅 omega‑3（ALA）。")
      : "";
    const method = [prep + " " + seasoning + topping, ...extras].join(" ");
    const mealFoods = [...items, secondVegetable, fruit, hemp && foodById.hemp, mixedGrains && foodById[grainPartner]];
    const colors = [...new Set(mealFoods.map(food => food?.color).filter(Boolean))];
    return { title, style: styleOf(style), items, method, colors, canChangeIngredients: combinationCount > 1 };
  });
}
