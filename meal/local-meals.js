const prefix = "joybinya-saved-meal-v1:";

export function saveMeal(id, meal) {
  const saved = {
    id,
    title: meal.title,
    items: meal.items.map(item => item.name),
    method: meal.method,
    savedAt: Date.now(),
  };
  localStorage.setItem(prefix + id, JSON.stringify(saved));
}

export function getMeals() {
  const meals = [];
  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith(prefix)) continue;
    let meal;
    try {
      meal = JSON.parse(localStorage.getItem(key));
    } catch {
      continue;
    }
    if (meal?.id === key.slice(prefix.length) && typeof meal.title === "string" &&
      Array.isArray(meal.items) && meal.items.every(item => typeof item === "string") &&
      typeof meal.method === "string" && Number.isFinite(meal.savedAt)) {
      meals.push(meal);
    }
  }
  return meals.sort((a, b) => b.savedAt - a.savedAt);
}

export function removeMeal(id) {
  localStorage.removeItem(prefix + id);
}
