import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Bell, Camera, Home, History, BarChart3, User } from "lucide-react";
import { getTodayStats, SavedMeal } from "../utils/mealStorage";

const CALORIE_GOAL = 2100;

export function Dashboard() {
  const [stats, setStats] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, meals: [] as SavedMeal[] });

  useEffect(() => {
    setStats(getTodayStats());
  }, []);

  const caloriesConsumed = stats.calories;
  const caloriesRemaining = Math.max(0, CALORIE_GOAL - caloriesConsumed);
  const progress = Math.min((caloriesConsumed / CALORIE_GOAL) * 100, 100);

  const macros = [
    { name: "Protein", emoji: "🥩", value: stats.protein, goal: 150, unit: "g" },
    { name: "Carbs",   emoji: "🍞", value: stats.carbs,   goal: 250, unit: "g" },
    { name: "Fat",     emoji: "🧈", value: stats.fat,     goal: 70,  unit: "g" },
  ];

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-24" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-[375px] mx-auto px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E5A0] to-[#7C3AED]"></div>
            <span className="text-lg">Good Day! 👋</span>
          </div>
          <button className="p-2">
            <Bell className="w-6 h-6" />
          </button>
        </div>

        {/* Hero Calorie Ring Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-8 rounded-[20px] bg-[#13131A] border border-white/8 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          style={{ background: "rgba(19, 19, 26, 0.6)", backdropFilter: "blur(10px)" }}
        >
          <div className="flex flex-col items-center">
            <svg width="180" height="180" className="mb-4">
              <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
              <circle
                cx="90" cy="90" r={radius} fill="none" stroke="#00E5A0" strokeWidth="12"
                strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 90 90)" style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
              <text x="90" y="80" textAnchor="middle" fill="white" fontSize="28" fontWeight="700">
                {caloriesConsumed}
              </text>
              <text x="90" y="100" textAnchor="middle" fill="#8B8B9E" fontSize="14">
                / {CALORIE_GOAL} kcal
              </text>
            </svg>
            <p className="text-[#8B8B9E]">
              <span className="text-[#00E5A0]" style={{ fontWeight: 500 }}>{caloriesRemaining} kcal</span>{" "}
              remaining today
            </p>
          </div>
        </motion.div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {macros.map((macro, i) => (
            <motion.div
              key={macro.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="p-4 rounded-[20px] bg-[#13131A] border border-white/8"
            >
              <div className="text-2xl mb-1">{macro.emoji}</div>
              <div className="text-xs text-[#8B8B9E] mb-2">{macro.name}</div>
              <div className="text-sm mb-2" style={{ fontWeight: 500 }}>
                {macro.value}/{macro.goal}{macro.unit}
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00E5A0] transition-all duration-500"
                  style={{ width: `${Math.min((macro.value / macro.goal) * 100, 100)}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Today's Meals */}
        <div>
          <h2 className="text-xl mb-4" style={{ fontWeight: 700 }}>Today's Meals</h2>
          {stats.meals.length === 0 ? (
            <div className="text-center py-8 text-[#8B8B9E] bg-[#13131A] rounded-[20px] border border-white/8">
              <div className="text-4xl mb-3">🍽️</div>
              <p>No meals scanned today.</p>
              <Link to="/scan" className="inline-block mt-4 px-5 py-2 rounded-full bg-gradient-to-r from-[#00E5A0] to-[#7C3AED] text-white text-sm" style={{ fontWeight: 500 }}>
                Scan Food
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.meals.map((meal, i) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-4 p-4 rounded-[20px] bg-[#13131A] border border-white/8"
                >
                  <div className="text-3xl">{meal.foods[0]?.emoji || "🍽️"}</div>
                  <div className="flex-1">
                    <h3 style={{ fontWeight: 500 }}>{meal.foods.map(f => f.name).join(", ")}</h3>
                    <p className="text-sm text-[#8B8B9E]">
                      {meal.time} • {meal.foods.length} item{meal.foods.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-[#00E5A0]" style={{ fontWeight: 700 }}>
                    {meal.totalCalories}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Add FAB */}
        <Link to="/scan">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-[#00E5A0] to-[#7C3AED] shadow-[0_8px_32px_rgba(0,229,160,0.4)] flex items-center justify-center"
          >
            <Camera className="w-8 h-8 text-white" />
          </motion.button>
        </Link>

        {/* Bottom Navigation */}
        <BottomNav active="home" />
      </div>
    </div>
  );
}

function BottomNav({ active }: { active: string }) {
  const navItems = [
    { id: "home", icon: Home, label: "Home", path: "/dashboard" },
    { id: "scan", icon: Camera, label: "Scan", path: "/scan" },
    { id: "history", icon: History, label: "History", path: "/history" },
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
