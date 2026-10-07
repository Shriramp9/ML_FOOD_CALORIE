export interface SavedFood {
  name: string;
  emoji: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
}

export interface SavedMeal {
  id: string;
  timestamp: number;
  date: string;
  time: string;
  foods: SavedFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

const STORAGE_KEY = "calorielens_meals";

export function saveMeal(foods: any[]): SavedMeal {
  const now = new Date();
  const meal: SavedMeal = {
    id: now.getTime().toString(),
    timestamp: now.getTime(),
    date: now.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
    }),
    time: now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    foods: foods.map((f) => ({
      name: f.name,
      emoji: f.emoji || "🍽️",
      calories: f.calories,
      protein: f.protein,
      carbs: f.carbs,
      fat: f.fat,
      portion: f.portion,
    })),
    totalCalories: Math.round(foods.reduce((s, f) => s + f.calories, 0)),
    totalProtein: Math.round(foods.reduce((s, f) => s + f.protein, 0)),
    totalCarbs: Math.round(foods.reduce((s, f) => s + f.carbs, 0)),
    totalFat: Math.round(foods.reduce((s, f) => s + f.fat, 0)),
  };

  const existing = getMeals();
  existing.unshift(meal);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return meal;
}

export function getMeals(): SavedMeal[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function deleteMeal(id: string): void {
  const meals = getMeals().filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
}

export function getTodayStats() {
  const today = new Date().toDateString();
  const todayMeals = getMeals().filter(
    (m) => new Date(m.timestamp).toDateString() === today
  );
  return {
    calories: todayMeals.reduce((s, m) => s + m.totalCalories, 0),
    protein: todayMeals.reduce((s, m) => s + m.totalProtein, 0),
    carbs: todayMeals.reduce((s, m) => s + m.totalCarbs, 0),
    fat: todayMeals.reduce((s, m) => s + m.totalFat, 0),
    meals: todayMeals,
  };
}
