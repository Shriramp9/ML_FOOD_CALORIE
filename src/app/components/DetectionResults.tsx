import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { ChevronDown, ChevronUp, Lightbulb, Download } from "lucide-react";
import { saveMeal } from "../utils/mealStorage";

const HEALTHY_SWAPS: Record<string, string> = {
  "burger":          "Try a grilled chicken wrap — saves ~200 kcal!",
  "burger veg":      "Try a veggie lettuce wrap — saves ~150 kcal!",
  "burger chicken":  "Try a grilled chicken salad — saves ~200 kcal!",
  "pizza":           "Try whole wheat veggie pizza — saves ~150 kcal!",
  "donut":           "Try a banana instead — saves ~180 kcal!",
  "cake":            "Try Greek yogurt with berries — saves ~250 kcal!",
  "hot dog":         "Try a turkey sandwich — saves ~100 kcal!",
  "wine":            "Try sparkling water with lemon — saves ~125 kcal!",
  "french fries":    "Try baked sweet potato fries — saves ~150 kcal!",
  "peri peri fries": "Try baked potato wedges — saves ~120 kcal!",
  "samosa":          "Try baked samosa or dhokla — saves ~180 kcal!",
  "jalebi":          "Try a bowl of mixed fruit — saves ~150 kcal!",
  "puri":            "Try chapati instead — saves ~150 kcal!",
  "bhatura":         "Try whole wheat roti — saves ~200 kcal!",
  "vada pav":        "Try idli with sambar — saves ~200 kcal!",
  "gulab jamun":     "Try a small bowl of rasgulla instead — saves ~120 kcal!",
  "paneer butter masala": "Try paneer tikka — saves ~200 kcal!",
  "biryani":         "Try veg pulao — saves ~150 kcal!",
  "cold coffee":     "Try black coffee with less sugar — saves ~200 kcal!",
  "milkshake":       "Try a protein shake with fruits — saves ~150 kcal!",
};

export function DetectionResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [saved, setSaved] = useState(false);

  const detectedFoods = location.state?.results || [];
  const imageFile = location.state?.imageFile;

  const totalCalories = detectedFoods.reduce((sum: number, food: any) => sum + food.calories, 0);
  const totalProtein  = detectedFoods.reduce((sum: number, food: any) => sum + food.protein, 0);
  const totalCarbs    = detectedFoods.reduce((sum: number, food: any) => sum + food.carbs, 0);
  const totalFat      = detectedFoods.reduce((sum: number, food: any) => sum + food.fat, 0);

  const toggleExpand = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Get best swap suggestion based on detected foods
  const swapSuggestion = (() => {
    for (const food of detectedFoods) {
      const key = food.name?.toLowerCase();
      if (HEALTHY_SWAPS[key]) return { food: food.name, tip: HEALTHY_SWAPS[key] };
    }
    return null;
  })();

  const handleSaveMeal = () => {
    if (detectedFoods.length === 0) return;
    saveMeal(detectedFoods);
    setSaved(true);
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  const handleDownloadReport = () => {
    const rows = [
      ["Food", "Portion", "Confidence", "Calories (kcal)", "Protein (g)", "Carbs (g)", "Fat (g)"],
      ...detectedFoods.map((f: any) => [
        f.name, f.portion, `${f.confidence}%`, f.calories, f.protein, f.carbs, f.fat,
      ]),
      ["TOTAL", "", "", totalCalories.toFixed(1), totalProtein.toFixed(1), totalCarbs.toFixed(1), totalFat.toFixed(1)],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meal_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-[375px] mx-auto">
        {/* Detected image */}
        <div className="relative h-80 bg-gradient-to-br from-[#13131A] to-[#0A0A0F] mb-6 overflow-hidden">
          {imageFile ? (
            <img src={imageFile} alt="Detected food" className="w-full h-full object-cover opacity-70" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl opacity-50">🍽️</div>
            </div>
          )}

          {/* Floating labels */}
          {detectedFoods.map((food: any, i: number) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 * i }}
              className="absolute px-3 py-1.5 rounded-full text-xs backdrop-blur-sm border"
              style={{
                top: `${15 + (i % 3) * 28}%`,
                left: `${8 + (i % 4) * 20}%`,
                backgroundColor: `${food.color || "#00E5A0"}20`,
                borderColor: food.color || "#00E5A0",
                color: food.color || "#00E5A0",
                fontWeight: 500,
              }}
            >
              {food.name} • {food.calories} kcal
            </motion.div>
          ))}
        </div>

        <div className="px-6">
          {/* Header */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl mb-6"
            style={{ fontWeight: 700 }}
          >
            {detectedFoods.length} {detectedFoods.length === 1 ? "item" : "items"} detected!
          </motion.h2>

          {/* Food items */}
          <div className="space-y-3 mb-6">
            {detectedFoods.length === 0 && (
              <div className="text-center p-6 text-[#8B8B9E] bg-[#13131A] rounded-[20px] border border-white/8">
                No food items detected. Try another image!
              </div>
            )}
            {detectedFoods.map((food: any, i: number) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="rounded-[20px] bg-[#13131A] border border-white/8 overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(food.id)}
                  className="w-full flex items-center gap-4 p-4"
                >
                  <div className="text-3xl">{food.emoji}</div>
                  <div className="flex-1 text-left">
                    <h3 style={{ fontWeight: 500 }}>{food.name}</h3>
                    <p className="text-sm text-[#8B8B9E]">{food.portion}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[#00E5A0] text-xl" style={{ fontWeight: 700 }}>
                      {food.calories}
                    </div>
                    <div className="text-xs text-[#8B8B9E]">{food.confidence}%</div>
                  </div>
                  {expandedItems.includes(food.id) ? (
                    <ChevronUp className="w-5 h-5 text-[#8B8B9E]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#8B8B9E]" />
                  )}
                </button>

                {expandedItems.includes(food.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-4 pb-4"
                  >
                    <div className="flex gap-2 pt-2 border-t border-white/8">
                      <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-center">
                        <div className="text-xs text-[#8B8B9E] mb-1">Protein</div>
                        <div className="text-sm" style={{ fontWeight: 500 }}>{food.protein}g</div>
                      </div>
                      <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-center">
                        <div className="text-xs text-[#8B8B9E] mb-1">Carbs</div>
                        <div className="text-sm" style={{ fontWeight: 500 }}>{food.carbs}g</div>
                      </div>
                      <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-center">
                        <div className="text-xs text-[#8B8B9E] mb-1">Fat</div>
                        <div className="text-sm" style={{ fontWeight: 500 }}>{food.fat}g</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Total summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 p-6 rounded-[20px] bg-gradient-to-br from-[#00E5A0]/10 to-[#7C3AED]/10 border border-[#00E5A0]/30"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg" style={{ fontWeight: 500 }}>Total</span>
              <span className="text-3xl text-[#00E5A0]" style={{ fontWeight: 700 }}>
                {totalCalories} kcal
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-[#00E5A0] to-[#7C3AED]"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8B8B9E]">P: <span className="text-white" style={{ fontWeight: 500 }}>{totalProtein}g</span></span>
              <span className="text-[#8B8B9E]">C: <span className="text-white" style={{ fontWeight: 500 }}>{totalCarbs}g</span></span>
              <span className="text-[#8B8B9E]">F: <span className="text-white" style={{ fontWeight: 500 }}>{totalFat}g</span></span>
            </div>
          </motion.div>

          {/* Healthy swap suggestion — dynamic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 p-4 rounded-[20px] bg-gradient-to-br from-[#FFB800]/10 to-[#FF6B6B]/10 border border-[#FFB800]/30"
          >
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-[#FFB800] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm mb-1" style={{ fontWeight: 500 }}>Healthy Swap</h3>
                <p className="text-sm text-[#8B8B9E]">
                  {swapSuggestion
                    ? <><span className="text-white">{swapSuggestion.food}:</span> {swapSuggestion.tip}</>
                    : "Great choices! Your meal looks balanced and nutritious. 🎉"
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleSaveMeal}
              disabled={detectedFoods.length === 0 || saved}
              className="flex-1 h-[52px] rounded-[50px] bg-gradient-to-r from-[#00E5A0] to-[#7C3AED] text-white transition-transform active:scale-95 disabled:opacity-60"
              style={{ fontWeight: 500 }}
            >
              {saved ? "✅ Saved!" : "Save Meal"}
            </button>
            <button
              onClick={() => navigate("/scan")}
              className="h-[52px] px-6 rounded-[50px] border border-white/20 text-white transition-transform active:scale-95"
              style={{ fontWeight: 500 }}
            >
              Re-scan
            </button>
          </div>

          {/* Download report button */}
          {detectedFoods.length > 0 && (
            <button
              onClick={handleDownloadReport}
              className="w-full h-[52px] rounded-[50px] border border-[#00E5A0]/40 text-[#00E5A0] flex items-center justify-center gap-2 transition-transform active:scale-95"
              style={{ fontWeight: 500 }}
            >
              <Download className="w-4 h-4" />
              Download Meal Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
