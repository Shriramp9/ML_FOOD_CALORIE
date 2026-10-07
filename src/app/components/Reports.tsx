import { Link } from "react-router";
import { motion } from "motion/react";
import { Bell, Camera, Home, History, BarChart3, User, Sparkles, Flame } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, ComposedChart } from "recharts";

export function Reports() {
  const weeklyData = [
    { day: "Mon", calories: 1850, goal: 2100 },
    { day: "Tue", calories: 2200, goal: 2100 },
    { day: "Wed", calories: 1950, goal: 2100 },
    { day: "Thu", calories: 2100, goal: 2100 },
    { day: "Fri", calories: 1800, goal: 2100 },
    { day: "Sat", calories: 2300, goal: 2100 },
    { day: "Sun", calories: 2050, goal: 2100 },
  ];

  const macroData = [
    { name: "Protein", value: 30, color: "#00E5A0" },
    { name: "Carbs", value: 45, color: "#7C3AED" },
    { name: "Fat", value: 25, color: "#FF6B6B" },
  ];

  const streakDays = [true, true, true, true, true, false, true];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-24" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-[375px] mx-auto px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between pt-8 pb-6">
          <h1 className="text-2xl" style={{ fontWeight: 700 }}>
            Your Insights
          </h1>
          <button className="p-2">
            <Bell className="w-6 h-6" />
          </button>
        </div>

        {/* 7-Day Calorie Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-6 rounded-[20px] bg-[#13131A] border border-white/8"
        >
          <h2 className="text-lg mb-4" style={{ fontWeight: 700 }}>
            7-Day Calorie Trend
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={weeklyData}>
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5A0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00E5A0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#8B8B9E" style={{ fontSize: 12 }} />
              <YAxis stroke="#8B8B9E" style={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="goal"
                stroke="#8B8B9E"
                strokeDasharray="5 5"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="calories"
                stroke="#00E5A0"
                strokeWidth={2}
                fill="url(#colorCalories)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="p-4 rounded-[20px] bg-[#13131A] border border-white/8 text-center">
            <div className="text-xs text-[#8B8B9E] mb-2">Best Day</div>
            <div className="text-xl text-[#00E5A0]" style={{ fontWeight: 700 }}>
              Thu
            </div>
          </div>
          <div className="p-4 rounded-[20px] bg-[#13131A] border border-white/8 text-center">
            <div className="text-xs text-[#8B8B9E] mb-2">Avg Daily</div>
            <div className="text-xl text-[#00E5A0]" style={{ fontWeight: 700 }}>
              2,036
            </div>
          </div>
          <div className="p-4 rounded-[20px] bg-[#13131A] border border-white/8 text-center">
            <div className="text-xs text-[#8B8B9E] mb-2">On Goal</div>
            <div className="text-xl text-[#00E5A0]" style={{ fontWeight: 700 }}>
              5/7
            </div>
          </div>
        </motion.div>

        {/* Weekly Macro Split */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-6 rounded-[20px] bg-[#13131A] border border-white/8"
        >
          <h2 className="text-lg mb-4" style={{ fontWeight: 700 }}>
            Weekly Macro Split
          </h2>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4">
            {macroData.map((macro) => (
              <div key={macro.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: macro.color }}
                />
                <span className="text-sm text-[#8B8B9E]">
                  {macro.name} {macro.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 p-6 rounded-[20px] bg-gradient-to-br from-[#7C3AED]/20 to-[#7C3AED]/10 border border-[#7C3AED]/30"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-[#7C3AED] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm mb-2" style={{ fontWeight: 700 }}>
                AI Insight
              </h3>
              <p className="text-sm text-[#8B8B9E]">
                You're eating 30% more carbs than your goal. Consider adding more protein-rich foods like chicken, fish, or legumes to balance your macros.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Streak card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 p-6 rounded-[20px] bg-gradient-to-br from-[#FF6B6B]/20 to-[#FF6B6B]/10 border border-[#FF6B6B]/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-[#FF6B6B]" />
              <h3 className="text-lg" style={{ fontWeight: 700 }}>
                5 Day Healthy Streak!
              </h3>
            </div>
          </div>
          <div className="flex justify-center gap-2">
            {streakDays.map((isActive, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive
                    ? "bg-[#00E5A0] text-white"
                    : "bg-white/10 text-[#8B8B9E]"
                }`}
              >
                {isActive ? "✓" : "·"}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Navigation */}
        <BottomNav active="reports" />
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
