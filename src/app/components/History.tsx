import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ChevronRight, Trash2, Bell, Camera, Home, History as HistoryIcon, BarChart3, User } from "lucide-react";
import { getMeals, deleteMeal, SavedMeal } from "../utils/mealStorage";

export function History() {
  const [selectedFilter, setSelectedFilter] = useState("today");
  const [expandedMeals, setExpandedMeals] = useState<string[]>([]);
  const [meals, setMeals] = useState<SavedMeal[]>([]);

  useEffect(() => {
    setMeals(getMeals());
  }, []);

  const filters = [
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
  ];

  const now = new Date();
  const filteredMeals = meals.filter((m) => {
    const d = new Date(m.timestamp);
    if (selectedFilter === "today") return d.toDateString() === now.toDateString();
    if (selectedFilter === "week") {
      const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo;
    }
    const monthAgo = new Date(now); monthAgo.setMonth(now.getMonth() - 1);
    return d >= monthAgo;
  });

  const groupedMeals = filteredMeals.reduce((acc, meal) => {
    const key = meal.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(meal);
    return acc;
  }, {} as Record<string, SavedMeal[]>);

  const toggleExpand = (id: string) => {
    setExpandedMeals((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    deleteMeal(id);
    setMeals(getMeals());
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-24" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-[375px] mx-auto px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between pt-8 pb-6">
          <h1 className="text-2xl" style={{ fontWeight: 700 }}>Meal History</h1>
          <button className="p-2">
            <Bell className="w-6 h-6" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedFilter === filter.id
                  ? "bg-gradient-to-r from-[#00E5A0] to-[#7C3AED] text-white"
                  : "bg-[#13131A] border border-white/8 text-[#8B8B9E]"
              }`}
              style={{ fontWeight: 500 }}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Grouped meal entries */}
        {Object.keys(groupedMeals).length === 0 ? (
          <div className="text-center py-16 text-[#8B8B9E]">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-lg" style={{ fontWeight: 500 }}>No meals yet</p>
            <p className="text-sm mt-2">Scan your food to start tracking!</p>
            <Link to="/scan" className="inline-block mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-[#00E5A0] to-[#7C3AED] text-white text-sm" style={{ fontWeight: 500 }}>
              Scan Food
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMeals).map(([date, dateMeals]) => (
              <div key={date}>
                <h2 className="text-lg mb-3 text-[#8B8B9E]" style={{ fontWeight: 500 }}>{date}</h2>
                <div className="space-y-3">
                  {dateMeals.map((meal, i) => (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="rounded-[20px] bg-[#13131A] border border-white/8 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleExpand(meal.id)}
                        className="w-full flex items-center gap-4 p-4"
                      >
                        <div className="px-3 py-1 rounded-full bg-[#00E5A0]/10 text-[#00E5A0] text-xs" style={{ fontWeight: 500 }}>
                          {meal.time}
                        </div>
                        <div className="flex gap-1">
                          {meal.foods.slice(0, 3).map((food, idx) => (
                            <span key={idx} className="text-2xl">{food.emoji}</span>
                          ))}
                        </div>
                        <div className="flex-1" />
                        <div className="text-[#00E5A0]" style={{ fontWeight: 700 }}>
                          {meal.totalCalories}
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#8B8B9E]" />
                      </button>

                      {expandedMeals.includes(meal.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="px-4 pb-4 border-t border-white/8"
                        >
                          <div className="pt-4 space-y-2 mb-4">
                            {meal.foods.map((food, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{food.emoji}</span>
                                  <span>{food.name}</span>
                                </div>
                                <span className="text-[#00E5A0]">{food.calories} kcal</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 mb-3">
                            <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-center">
                              <div className="text-xs text-[#8B8B9E] mb-1">Protein</div>
                              <div className="text-sm" style={{ fontWeight: 500 }}>{meal.totalProtein}g</div>
                            </div>
                            <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-center">
                              <div className="text-xs text-[#8B8B9E] mb-1">Carbs</div>
                              <div className="text-sm" style={{ fontWeight: 500 }}>{meal.totalCarbs}g</div>
                            </div>
                            <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-center">
                              <div className="text-xs text-[#8B8B9E] mb-1">Fat</div>
                              <div className="text-sm" style={{ fontWeight: 500 }}>{meal.totalFat}g</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(meal.id)}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#FF6B6B]/10 text-[#FF6B6B] transition-transform active:scale-95"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-sm" style={{ fontWeight: 500 }}>Delete Meal</span>
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <BottomNav active="history" />
      </div>
    </div>
  );
}

function BottomNav({ active }: { active: string }) {
  const navItems = [
    { id: "home", icon: Home, label: "Home", path: "/dashboard" },
    { id: "scan", icon: Camera, label: "Scan", path: "/scan" },
    { id: "history", icon: HistoryIcon, label: "History", path: "/history" },
    { id: "reports", icon: BarChart3, label: "Reports", path: "/reports" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#13131A] border-t border-white/8">
      <div className="max-w-[375px] mx-auto flex items-center justify-around h-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          const isScan = item.id === "scan";

          if (isScan) {
            return (
              <Link key={item.id} to={item.path} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#00E5A0] to-[#7C3AED] flex items-center justify-center -mt-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center gap-1 ${
                isActive ? "text-[#00E5A0]" : "text-[#8B8B9E]"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
