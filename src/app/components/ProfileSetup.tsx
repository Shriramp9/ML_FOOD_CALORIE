import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import * as Slider from "@radix-ui/react-slider";

export function ProfileSetup() {
  const navigate = useNavigate();
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState("light");

  const activityLevels = [
    { id: "sedentary", label: "Sedentary", emoji: "🛋️" },
    { id: "light", label: "Light", emoji: "🚶" },
    { id: "active", label: "Active", emoji: "🏃" },
    { id: "very-active", label: "Very Active", emoji: "💪" },
  ];

  // Simple BMR calculation (Mifflin-St Jeor)
  const calculateDailyGoal = () => {
    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      active: 1.55,
      "very-active": 1.725,
    };

    return Math.round(bmr * multipliers[activity as keyof typeof multipliers]);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white px-6 py-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-[375px] mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#8B8B9E]">Step 2 of 2</span>
            <span className="text-sm text-[#8B8B9E]">100%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.6 }}
              className="h-full bg-gradient-to-r from-[#00E5A0] to-[#7C3AED]"
            />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl mb-8" style={{ fontWeight: 700 }}>
          Tell us about yourself
        </h1>

        {/* Avatar selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 rounded-[20px] bg-[#13131A] border border-white/8"
        >
          <div className="text-6xl text-center mb-2">
            {gender === "male" ? "👨" : "👩"}
          </div>
        </motion.div>

        {/* Sliders */}
        <div className="space-y-6 mb-8">
          <div>
            <div className="flex justify-between mb-3">
              <label className="text-[#8B8B9E]">Age</label>
              <span className="text-[#00E5A0]" style={{ fontWeight: 500 }}>{age} years</span>
            </div>
            <Slider.Root
              value={[age]}
              onValueChange={(v) => setAge(v[0])}
              min={10}
              max={80}
              step={1}
              className="relative flex items-center w-full h-5"
            >
              <Slider.Track className="relative h-1 flex-grow rounded-full bg-white/10">
                <Slider.Range className="absolute h-full rounded-full bg-[#00E5A0]" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-[#00E5A0] rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00E5A0]/50" />
            </Slider.Root>
          </div>

          <div>
            <div className="flex justify-between mb-3">
              <label className="text-[#8B8B9E]">Weight</label>
              <span className="text-[#00E5A0]" style={{ fontWeight: 500 }}>{weight} kg</span>
            </div>
            <Slider.Root
              value={[weight]}
              onValueChange={(v) => setWeight(v[0])}
              min={30}
              max={150}
              step={1}
              className="relative flex items-center w-full h-5"
            >
              <Slider.Track className="relative h-1 flex-grow rounded-full bg-white/10">
                <Slider.Range className="absolute h-full rounded-full bg-[#00E5A0]" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-[#00E5A0] rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00E5A0]/50" />
            </Slider.Root>
          </div>

          <div>
            <div className="flex justify-between mb-3">
              <label className="text-[#8B8B9E]">Height</label>
              <span className="text-[#00E5A0]" style={{ fontWeight: 500 }}>{height} cm</span>
            </div>
            <Slider.Root
              value={[height]}
              onValueChange={(v) => setHeight(v[0])}
              min={120}
              max={220}
              step={1}
              className="relative flex items-center w-full h-5"
            >
              <Slider.Track className="relative h-1 flex-grow rounded-full bg-white/10">
                <Slider.Range className="absolute h-full rounded-full bg-[#00E5A0]" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-[#00E5A0] rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00E5A0]/50" />
            </Slider.Root>
          </div>
        </div>

        {/* Gender toggle */}
        <div className="mb-8">
          <label className="text-[#8B8B9E] block mb-3">Gender</label>
          <div className="flex gap-3">
            <button
              onClick={() => setGender("male")}
              className={`flex-1 h-12 rounded-[50px] transition-all ${
                gender === "male"
                  ? "bg-gradient-to-r from-[#00E5A0] to-[#7C3AED] text-white"
                  : "bg-[#13131A] border border-white/8 text-[#8B8B9E]"
              }`}
              style={{ fontWeight: 500 }}
            >
              Male
            </button>
            <button
              onClick={() => setGender("female")}
              className={`flex-1 h-12 rounded-[50px] transition-all ${
                gender === "female"
                  ? "bg-gradient-to-r from-[#00E5A0] to-[#7C3AED] text-white"
                  : "bg-[#13131A] border border-white/8 text-[#8B8B9E]"
              }`}
              style={{ fontWeight: 500 }}
            >
              Female
            </button>
          </div>
        </div>

        {/* Activity level */}
        <div className="mb-8">
          <label className="text-[#8B8B9E] block mb-3">Activity Level</label>
          <div className="grid grid-cols-2 gap-3">
            {activityLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setActivity(level.id)}
                className={`p-4 rounded-[20px] transition-all ${
                  activity === level.id
                    ? "bg-[#13131A] border-2 border-[#00E5A0] shadow-[0_0_20px_rgba(0,229,160,0.3)]"
                    : "bg-[#13131A] border border-white/8"
                }`}
              >
                <div className="text-3xl mb-2">{level.emoji}</div>
                <div className="text-sm" style={{ fontWeight: 500 }}>{level.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Daily goal card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-[20px] bg-[#13131A] border border-white/8 mb-8"
        >
          <p className="text-[#8B8B9E] text-sm mb-2">Your Daily Goal</p>
          <p className="text-3xl text-[#00E5A0]" style={{ fontWeight: 700 }}>
            {calculateDailyGoal().toLocaleString()} kcal
          </p>
        </motion.div>

        {/* CTA button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full h-[52px] rounded-[50px] bg-gradient-to-r from-[#00E5A0] to-[#7C3AED] text-white transition-transform active:scale-95"
          style={{ fontWeight: 500 }}
        >
          Let's Go →
        </button>
      </div>
    </div>
  );
}
