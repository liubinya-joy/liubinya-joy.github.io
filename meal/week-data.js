"use strict";

const weekGroups = {
  vegetable: ["Vegetables", "蔬菜", "蔬菜"],
  protein: ["Protein", "蛋白质食材", "蛋白質食材"],
  carb: ["Whole grains & starchy vegetables", "优质主食（全谷物与薯类）", "全穀物同薯類"],
  fruit: ["Fruit", "水果", "生果"],
  topping: ["Toppings", "搭配小料", "伴碟小料"],
  finish: ["After-dinner bite", "餐末小点", "餐尾小食"],
  seasoning: ["Seasonings", "调味", "調味"],
  custom: ["Other ingredients", "其他食材", "其他食材"],
};

function weekFood(name, unit, perGuest, color) {
  return { name, unit, perGuest, color };
}


const weekFoods = {
  vegetable: {
    broccoli: weekFood(["Broccoli", "西兰花", "西蘭花"], "g", 85, "green"),
    bokChoy: weekFood(["Bok choy", "小白菜", "小白菜"], "g", 85, "green"),
    spinach: weekFood(["Spinach", "菠菜", "菠菜"], "g", 85, "green"),
    tomato: weekFood(["Tomatoes", "番茄", "番茄"], "g", 85, "red"),
    carrot: weekFood(["Carrots","胡萝卜","紅蘿蔔"], "g", 85, "orange"),
    bellPepper: weekFood(["Bell peppers", "彩椒", "彩椒"], "g", 85, "mixed"),
    greenBeans: weekFood(["Green beans","四季豆","青豆角"], "g", 85, "green"),
    redCabbage: weekFood(["Purple cabbage","紫甘蓝","紫椰菜"], "g", 85, "purple"),
    mushroom: weekFood(["Shiitake mushrooms","鲜香菇","鮮冬菇"], "g", 85),
    asparagus: weekFood(["Asparagus", "芦笋", "蘆筍"], "g", 85, "green"),
    artichoke: weekFood(["Artichoke hearts", "洋蓟心", "洋薊心"], "g", 85, "green"),
  },
  protein: {
    chicken: { ...weekFood(["Chicken breast", "鸡胸肉", "雞胸肉"], "g", 130),
      prep: ["Slice the chicken and cook it to 165°F.", "鸡胸肉切片，煮至 74°C。", "雞胸肉切片，煮到 74°C。"] },
    salmon: { ...weekFood(["Salmon fillets","三文鱼柳","三文魚柳"], "g", 130), allergen: "fish", aliases: ["三文鱼", "三文魚", "鲑鱼", "鮭魚"],
      prep: ["Steam or bake the salmon until the thickest part reaches 145°F.", "三文鱼蒸熟或烤熟，最厚处达到 63°C。", "三文魚蒸熟或者焗熟，最厚位到 63°C。"] },
    tofu: { ...weekFood(["Firm tofu", "硬豆腐", "硬豆腐"], "g", 135), allergen: "soy", aliases: ["豆腐"],
      prep: ["Pat the tofu dry, cube it and warm it through.", "豆腐擦干切块，加热透。", "豆腐印乾切粒，整到熱透。"] },
    egg: { ...weekFood(["Eggs", "鸡蛋", "雞蛋"], "count", 2), allergen: "egg",
      prep: ["Boil the eggs until both whites and yolks are firm. Peel and halve.", "鸡蛋煮至蛋清蛋黄凝固，去壳切半。", "雞蛋烚到蛋白蛋黃凝固，剝殼切半。"] },
    chickpea: { ...weekFood(["Cooked chickpeas","熟鹰嘴豆","熟鷹嘴豆"], "g", 135),
      prep: ["Rinse and drain the cooked chickpeas, then warm them through.", "熟鹰嘴豆冲洗沥干，再加热透。", "熟鷹嘴豆沖洗瀝乾，再煮到熱透。"] },
    turkey: { ...weekFood(["Boneless turkey breast","去骨火鸡胸","去骨火雞胸"], "g", 130),
      prep: ["Cut the turkey into bite-size pieces and cook it to 165°F.", "火鸡胸切成一口大小，煮至 74°C。", "火雞胸切件，煮到 74°C。"] },
    beef: { ...weekFood(["Lean beef steak", "瘦牛肉", "瘦牛肉"], "g", 130),
      prep: ["Pan-sear the beef steak to 145°F. Let it rest at least 3 minutes before slicing.", "牛排煎至最厚处达到 63°C，静置至少 3 分钟再切片。", "牛扒煎到最厚位有 63°C，擺至少 3 分鐘先切片。"] },
    lamb: { ...weekFood(["Boneless lamb leg steak", "瘦羊肉", "瘦羊肉"], "g", 130),
      prep: ["Trim visible fat and pan-sear the lamb steak to 145°F. Let it rest at least 3 minutes before slicing.", "羊排去掉可见肥油，煎至最厚处达到 63°C，静置至少 3 分钟再切片。", "羊扒切走睇到嘅肥膏，煎到最厚位有 63°C，擺至少 3 分鐘先切片。"] },
    shrimp: { ...weekFood(["Raw peeled shrimp", "虾", "蝦"], "g", 130), allergen: "crustacean",
      prep: ["Cook the peeled shrimp until the flesh is pearly or white and opaque.", "去壳虾煮至虾肉呈珍珠色或白色，不透明。", "去殼蝦煮到蝦肉呈珍珠色或者白色，同埋唔再透明。"] },
  },
  carb: {
    brownRice: weekFood(["Brown rice", "糙米", "糙米"], "g", 55),
    quinoa: weekFood(["Quinoa","藜麦","藜麥"], "g", 55),
    sweetPotato: weekFood(["Yellow-fleshed sweet potatoes", "黄心红薯", "黃心番薯"], "g", 130, "yellow"),
    purpleSweetPotato: weekFood(["Purple sweet potatoes", "紫薯", "紫番薯"], "g", 130, "purple"),
    corn: weekFood(["Corn kernels", "玉米粒", "粟米粒"], "g", 120),
    barley: { ...weekFood(["Barley", "大麦", "大麥"], "g", 55), allergen: "gluten" },
    oats: { ...weekFood(["Rolled oats", "燕麦片", "燕麥片"], "g", 55), allergen: "gluten" },
  },
  fruit: {
    blueberry: weekFood(["Blueberries","蓝莓","藍莓"], "g", 70, "blue"),
    strawberry: weekFood(["Strawberries","草莓","士多啤梨"], "g", 70, "red"),
    apple: weekFood(["Apples","苹果","蘋果"], "count", 0.5, "red"),
    banana: weekFood(["Bananas", "香蕉", "香蕉"], "count", 0.5),
    orange: weekFood(["Oranges","橙子","橙"], "count", 0.5, "orange"),
    blackberry: weekFood(["Blackberries","黑莓","黑莓"], "g", 70, "purple"),
    raspberry: weekFood(["Raspberries","红莓","紅莓"], "g", 70, "red"),
    avocado: weekFood(["Avocados","牛油果","牛油果"], "count", 0.25, "green"),
  },
  topping: {
    olives: weekFood(["Pitted olives", "去核橄榄", "去核橄欖"], "g", 12, "green"),
  },
  finish: {
    scallionPancake: { ...weekFood(["Scallion pancakes", "葱油饼", "蔥油餅"], "count", 0.25),
      allergen: "gluten", avoid: "scallion" },
  },
  seasoning: {
    oil: weekFood(["Extra-virgin olive oil","特级初榨橄榄油","特級初榨橄欖油"], "tbsp", 0.25),
    lemon: weekFood(["Lemons","柠檬","檸檬"], "count", 0.125),
    ginger: weekFood(["Fresh ginger","鲜姜","新鮮薑"], "g", 4),
    scallion: weekFood(["Scallions","小葱","蔥"], "count", 0.25),
    garlic: weekFood(["Garlic cloves", "蒜瓣", "蒜瓣"], "count", 0.5),
    vinegar: weekFood(["Rice vinegar", "米醋", "米醋"], "tsp", 1),
    chili: weekFood(["Crushed red pepper (optional)", "干辣椒碎（可选）", "乾辣椒碎（可省）"], "tsp", 0.125),
    mint: weekFood(["Fresh mint", "鲜薄荷", "鮮薄荷"], "g", 3),
    dill: weekFood(["Fresh dill", "鲜莳萝", "鮮蒔蘿"], "g", 3),
    soySauce: { ...weekFood(["Reduced-sodium soy sauce", "减盐酱油", "減鹽豉油"], "tsp", 0.75), allergens: ["soy", "gluten"], aliases: ["soy sauce", "酱油", "醬油", "豉油"] },
  },
};

const defaults = ["broccoli", "bokChoy", "redCabbage", "carrot", "mushroom", "chicken", "salmon", "tofu", "chickpea", "brownRice", "quinoa", "sweetPotato", "blueberry", "strawberry", "apple"];
const restrictions = {
  avoid: {
    scallion: ["No scallion", "不放葱", "唔落蔥"],
    ginger: ["No ginger", "不放姜", "唔落薑"],
    garlic: ["No garlic", "不放蒜", "唔落蒜"],
    chili: ["No chili", "不放辣椒", "唔落辣椒"],
  },
  allergen: {
    fish: ["Fish", "鱼类", "魚類"],
    crustacean: ["Shrimp and crab", "虾蟹类", "蝦蟹類"],
    soy: ["Soy", "大豆", "大豆"], egg: ["Eggs", "鸡蛋", "雞蛋"],
    gluten: ["Avoid gluten grains", "避开含麸质谷物", "避開含麩質穀物"],
  },
};
const restrictionNames = { avoid: ["Aromatics to skip", "烹调用料忌口", "戒口配料"], allergen: ["Ingredients to avoid", "需要避开的食材", "需要避開嘅食材"] };
const cuisineNames = {
  cantonese: ["Cantonese", "粤菜", "粵菜"],
  yunnan: ["Yunnan-inspired", "云南风味", "雲南風味"],
  shanghai: ["Shanghai-inspired", "上海菜", "上海菜"],
  zhejiang: ["Zhejiang-inspired", "浙菜", "浙菜"],
  hunan: ["Hunan-inspired", "湘式风味", "湘式風味"],
  shandong: ["Shandong-inspired", "鲁式风味", "魯式風味"],
  northeast: ["Northeast Chinese-inspired", "东北风味", "東北風味"],
  mediterranean: ["Mediterranean-inspired", "地中海风味", "地中海風味"],
};
const regions = {
  yunnan: [
    [["Mint-lemon toss", "薄荷柠檬拌", "薄荷檸檬撈"], "blanch", ["lemon", "mint"]],
    [["Ginger and mint braise", "云南家常焖", "雲南家常炆"], "braise", ["ginger", "mint"]],
  ],
  cantonese: [
    [["Cantonese-style steamed", "粤式清蒸", "廣式清蒸"], "steam", ["ginger", "scallion"]],
    [["Garlic wok toss", "粤式清炒", "廣式清炒"], "wok", ["garlic", "scallion"]],
  ],
  shanghai: [
    [["Shanghai scallion-oil toss", "上海葱油拌", "上海蔥油撈"], "warmOil", ["scallion"]],
    [["Shanghai home-style glaze", "上海本帮酱香焖", "上海本幫醬香炆"], "glaze", ["ginger", "soySauce"]],
    [["Shanghai ginger stir-fry", "沪式姜香清炒", "滬式薑香清炒"], "wok", ["ginger", "scallion"]],
  ],
  zhejiang: [
    [["Zhejiang vinegar finish", "浙式醋香", "浙式醋香"], "tangy", ["vinegar", "ginger"]],
    [["Jiangnan-style steaming", "江南姜葱清蒸", "江南薑蔥清蒸"], "steam", ["ginger", "scallion"]],
    [["Zhejiang garlic greens", "浙式蒜香清炒", "浙式蒜香清炒"], "wok", ["garlic"]],
  ],
  hunan: [
    [["Chili-vinegar wok toss", "湘式酸辣快炒", "湘式酸辣快炒"], "wok", ["vinegar", "chili", "garlic"]],
    [["Vinegar-scented braise", "湘式醋香焖", "湘式醋香炆"], "braise", ["vinegar", "chili"]],
  ],
  shandong: [
    [["Scallion braise", "鲁式葱香焖", "魯式蔥香炆"], "braise", ["scallion", "ginger"]],
    [["Vinegar wok toss", "鲁式醋香快炒", "魯式醋香快炒"], "wok", ["vinegar", "scallion"]],
  ],
  northeast: [
    [["Northeast-style home stew", "东北家常炖", "東北家常燉"], "braise", ["scallion", "garlic"]],
    [["Northeast-style cold toss", "东北凉拌", "東北涼拌"], "blanch", ["vinegar", "garlic"]],
  ],
  mediterranean: [
    [["Mediterranean lemon-herb roast", "地中海柠檬香草烤", "地中海檸檬香草焗"], "roast", ["lemon", "dill", "garlic"]],
    [["Mediterranean olive-oil toss", "地中海橄榄油拌", "地中海橄欖油撈"], "herbToss", ["lemon", "mint"]],
    [["Mediterranean lemon braise", "地中海柠檬炖", "地中海檸檬燉"], "braise", ["lemon", "garlic"]],
  ],
};
const cooking = {
  blanch: ["Blanch the vegetables until tender, drain them well and toss with the cooked protein.",
    "蔬菜焯熟沥干，与煮熟的蛋白质食材拌匀。", "蔬菜灼熟瀝乾，同煮熟嘅蛋白質食材撈勻。"],
  braise: ["Simmer the vegetables with a splash of water until tender. Add the cooked protein for the final minute.",
    "蔬菜加少量水焖软，最后一分钟加煮熟的蛋白质食材。", "蔬菜加少少水炆軟，最後一分鐘加煮熟嘅蛋白質食材。"],
  steam: ["Steam the vegetables until tender and serve with the separately cooked protein.",
    "蔬菜蒸熟，搭配另行煮熟的蛋白质食材。", "蔬菜蒸熟，配另外煮熟嘅蛋白質食材。"],
  wok: ["Stir-fry the vegetables in a little olive oil until tender. Fold in the cooked protein.",
    "用少量橄榄油把蔬菜炒熟，拌入煮熟的蛋白质食材。", "用少少橄欖油炒熟蔬菜，再撈入煮熟嘅蛋白質食材。"],
  warmOil: ["Blanch and drain the vegetables. Briefly warm the seasonings in the oil, then toss the fragrant oil with the vegetables and cooked protein.",
    "蔬菜焯熟沥干。调料用油短暂煸香，再把香油和蔬菜、煮熟的蛋白质食材拌匀。", "蔬菜灼熟瀝乾。調味料用油略爆香，再同蔬菜同煮熟嘅蛋白質食材撈勻。"],
  glaze: ["Simmer the vegetables and cooked protein with a few spoonfuls of water and the seasonings. Let the sauce reduce until it lightly coats the food.",
    "蔬菜和煮熟的蛋白质食材加几匙水及调料一起焖，最后把汁收浓至薄薄裹住食材。", "蔬菜同煮熟嘅蛋白質食材，加幾匙水同調味料一齊炆，最後收汁至薄薄包住食材。"],
  tangy: ["Steam the vegetables. Warm the seasonings with a splash of water, then spoon the sauce over the vegetables and cooked protein just before serving.",
    "蔬菜蒸熟。调料加少许水加热，起锅前浇在蔬菜和煮熟的蛋白质食材上。", "蔬菜蒸熟。調味料加少少水煮熱，上碟前淋喺蔬菜同煮熟嘅蛋白質食材上。"],
  roast: ["Toss the vegetables with olive oil and roast at 425°F until tender. Finish with the seasonings and serve alongside the cooked protein.",
    "蔬菜拌橄榄油，用 220°C 烤至熟软。出炉再加调味，搭配煮熟的蛋白质食材。", "蔬菜拌橄欖油，用 220°C 焗到熟軟。出爐加調味，配煮熟嘅蛋白質食材。"],
  herbToss: ["Steam the vegetables until tender, then toss them warm with the olive oil, seasonings and cooked protein.",
    "蔬菜蒸熟，趁温热拌入橄榄油、调料和煮熟的蛋白质食材。", "蔬菜蒸熟，趁暖撈入橄欖油、調味料同煮熟嘅蛋白質食材。"],
};
const dishSteps = {
  steam: ["Steamed", "清蒸", "清蒸"], wok: ["Wok-tossed", "快炒", "快炒"],
  braise: ["Home-style braise", "家常焖", "家常炆"], blanch: ["Blanched and tossed", "焯熟拌菜", "灼熟撈菜"],
  warmOil: ["Warm-oil toss", "热油拌", "熱油撈"], glaze: ["Light glaze", "收汁焖", "收汁炆"],
  tangy: ["Steam and dress", "清蒸浇汁", "清蒸淋汁"], roast: ["Oven-roasted", "烤蔬菜", "焗蔬菜"],
  herbToss: ["Olive-oil toss", "橄榄油拌", "橄欖油撈"],
};
const days = [
  ["Monday", "周一", "星期一"], ["Tuesday", "周二", "星期二"], ["Wednesday", "周三", "星期三"],
  ["Thursday", "周四", "星期四"], ["Friday", "周五", "星期五"], ["Saturday", "周六", "星期六"], ["Sunday", "周日", "星期日"],
];
