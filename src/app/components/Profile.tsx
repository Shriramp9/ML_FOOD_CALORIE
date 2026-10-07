import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Bell, Camera, Home, History, BarChart3, User, Edit2, LogOut, Cpu, ShieldCheck, UploadCloud, X, Image as ImageIcon } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";

export function Profile() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [metric, setMetric] = useState(true);

  // Federated Learning State
  const [edgeTraining, setEdgeTraining] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState("idle");
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [globalRound, setGlobalRound] = useState(0);

  const [localImages, setLocalImages] = useState<{id: string, url: string, label: string}[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [isTraining, setIsTraining] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalImages(prev => [...prev, { id: Math.random().toString(), url, label: newLabel || "Unknown Food" }]);
      setNewLabel("");
    }
  };

  const startLocalTraining = () => {
    if (localImages.length === 0) return;
    setIsTraining(true);
    setTrainingStatus("training");
    setTrainingProgress(0);
  };

  useEffect(() => {
    if (!edgeTraining) {
      setTrainingStatus("idle");
      setTrainingProgress(0);
      setIsTraining(false);
      setLocalImages([]);
      return;
    }
  }, [edgeTraining]);

  useEffect(() => {
    if (!isTraining) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setTrainingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTrainingStatus("encrypting");
        
        setTimeout(() => {
          setTrainingStatus("sending");
          fetch("http://localhost:8000/api/federated/submit-gradients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              client_id: "user_mobile_" + Math.floor(Math.random() * 1000),
              encrypted_gradients: "enc_" + Math.random().toString(36).substring(7),
              loss: Math.random() * 0.5 + 0.1,
              samples_trained: localImages.length
            })
          })
          .then(res => res.json())
          .then(data => {
            setTrainingStatus("success");
            if (data.global_round) {
              setGlobalRound(data.global_round);
            }
            setTimeout(() => {
              setTrainingStatus("idle");
              setIsTraining(false);
              setLocalImages([]);
            }, 3000);
          })
          .catch(err => {
            console.error("Federated training error:", err);
            setTrainingStatus("error");
            setTimeout(() => {
              setTrainingStatus("idle");
              setIsTraining(false);
            }, 3000);
          });
        }, 1500);
      }
    }, 300);
    
    return () => {
      clearInterval(interval);
    };
  }, [isTraining, localImages.length]);
  const weight = 70;
  const height = 170;
  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", position: 15 };
    if (bmi < 25) return { label: "Normal", position: 40 };
    if (bmi < 30) return { label: "Overweight", position: 65 };
    return { label: "Obese", position: 85 };
  };

  const bmiCategory = getBMICategory(parseFloat(bmi));
  const bmiPosition = ((parseFloat(bmi) - 15) / (35 - 15)) * 100;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-24" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-[375px] mx-auto px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between pt-8 pb-6">
          <h1 className="text-2xl" style={{ fontWeight: 700 }}>
            Profile
          </h1>
          <button className="p-2">
            <Bell className="w-6 h-6" />
          </button>
        </div>

        {/* Avatar and info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-6 rounded-[20px] bg-[#13131A] border border-white/8 text-center"
        >
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00E5A0] to-[#7C3AED] mx-auto" />
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#00E5A0] flex items-center justify-center border-2 border-[#13131A]">
              <Edit2 className="w-4 h-4 text-white" />
            </button>
          </div>
          <h2 className="text-xl mb-1" style={{ fontWeight: 700 }}>
            Aryan Kumar
          </h2>
          <p className="text-[#8B8B9E]">aryan@example.com</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="p-4 rounded-[20px] bg-[#13131A] border border-white/8 text-center">
            <div className="text-xs text-[#8B8B9E] mb-2">Weight</div>
            <div className="text-xl text-[#00E5A0]" style={{ fontWeight: 700 }}>
              {weight}kg
            </div>
          </div>
          <div className="p-4 rounded-[20px] bg-[#13131A] border border-white/8 text-center">
            <div className="text-xs text-[#8B8B9E] mb-2">Height</div>
            <div className="text-xl text-[#00E5A0]" style={{ fontWeight: 700 }}>
              {height}cm
            </div>
          </div>
          <div className="p-4 rounded-[20px] bg-[#13131A] border border-white/8 text-center">
            <div className="text-xs text-[#8B8B9E] mb-2">BMI</div>
            <div className="text-xl text-[#00E5A0]" style={{ fontWeight: 700 }}>
              {bmi}
            </div>
          </div>
        </motion.div>

        {/* BMI indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-6 rounded-[20px] bg-[#13131A] border border-white/8"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm" style={{ fontWeight: 500 }}>
              BMI Category
            </h3>
            <span className="text-sm text-[#00E5A0]" style={{ fontWeight: 500 }}>
              {bmiCategory.label}
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-gradient-to-r from-[#00E5A0] via-[#FFB800] to-[#FF6B6B] mb-2">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg"
              style={{ left: `${Math.min(95, Math.max(5, bmiPosition))}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#8B8B9E]">
            <span>15</span>
            <span>20</span>
            <span>25</span>
            <span>30</span>
            <span>35</span>
          </div>
        </motion.div>

        {/* Editable fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 space-y-3"
        >
          <div className="p-4 rounded-[20px] bg-[#13131A] border border-white/8">
            <label className="text-xs text-[#8B8B9E] block mb-2">Age</label>
            <input
              type="number"
              defaultValue={25}
              className="w-full bg-transparent text-lg outline-none"
              style={{ fontWeight: 500 }}
            />
          </div>
          <div className="p-4 rounded-[20px] bg-[#13131A] border border-white/8">
            <label className="text-xs text-[#8B8B9E] block mb-2">Daily Goal</label>
            <input
              type="number"
              defaultValue={2100}
              className="w-full bg-transparent text-lg outline-none"
              style={{ fontWeight: 500 }}
            />
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg mb-3" style={{ fontWeight: 700 }}>
            Settings
          </h2>
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-4 rounded-[20px] bg-[#13131A] border border-white/8">
              <span style={{ fontWeight: 500 }}>Notifications</span>
              <Switch.Root
                checked={notifications}
                onCheckedChange={setNotifications}
                className="w-11 h-6 bg-white/10 rounded-full relative data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#00E5A0] data-[state=checked]:to-[#7C3AED] transition-colors"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5" />
              </Switch.Root>
            </div>
            <div className="flex items-center justify-between p-4 rounded-[20px] bg-[#13131A] border border-white/8">
              <span style={{ fontWeight: 500 }}>Dark Mode</span>
              <Switch.Root
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="w-11 h-6 bg-white/10 rounded-full relative data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#00E5A0] data-[state=checked]:to-[#7C3AED] transition-colors"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5" />
              </Switch.Root>
            </div>
            <div className="flex items-center justify-between p-4 rounded-[20px] bg-[#13131A] border border-white/8">
              <span style={{ fontWeight: 500 }}>Metric Units</span>
              <Switch.Root
                checked={metric}
                onCheckedChange={setMetric}
                className="w-11 h-6 bg-white/10 rounded-full relative data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#00E5A0] data-[state=checked]:to-[#7C3AED] transition-colors"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5" />
              </Switch.Root>
            </div>
            <div className="p-4 rounded-[20px] bg-[#13131A] border border-white/8">
              <label className="text-xs text-[#8B8B9E] block mb-2">Allergen Preferences</label>
              <input
                type="text"
                placeholder="e.g., nuts, dairy, gluten"
                className="w-full bg-transparent outline-none"
                style={{ fontWeight: 500 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Federated Learning Edge AI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg flex items-center gap-2" style={{ fontWeight: 700 }}>
              <Cpu className="w-5 h-5 text-[#00E5A0]" />
              Edge AI Learning
            </h2>
            <span className="text-[10px] bg-[#7C3AED]/20 text-[#7C3AED] px-2 py-1 rounded-full font-bold">BETA</span>
          </div>
          
          <div className="p-5 rounded-[20px] bg-gradient-to-br from-[#13131A] to-[#1A1A24] border border-white/8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div>
                <span className="block text-sm" style={{ fontWeight: 600 }}>Participate in Global Model</span>
                <span className="text-xs text-[#8B8B9E] max-w-[200px] block mt-1">Train privately on your device. Your photos never leave your phone.</span>
              </div>
              <Switch.Root
                checked={edgeTraining}
                onCheckedChange={(checked) => {
                  setEdgeTraining(checked);
                  if (!checked) setTrainingStatus("idle");
                }}
                className="w-11 h-6 bg-white/10 rounded-full relative data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#00E5A0] data-[state=checked]:to-[#7C3AED] transition-colors"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5" />
              </Switch.Root>
            </div>
            
            {edgeTraining && (
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 relative z-10 mt-4 space-y-4">
                
                {/* Upload Section */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Image Label (e.g. Samosa)" 
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00E5A0] text-white"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                    />
                    <label className="bg-white/10 hover:bg-white/20 transition-colors cursor-pointer rounded-lg px-4 py-2 flex items-center justify-center">
                      <UploadCloud className="w-4 h-4 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>

                {/* Gallery */}
                {localImages.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {localImages.map((img) => (
                      <div key={img.id} className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-white/10">
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-center p-0.5 truncate px-1">
                          {img.label}
                        </div>
                        <button 
                          onClick={() => setLocalImages(prev => prev.filter(i => i.id !== img.id))}
                          className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Training Button & Progress */}
                {localImages.length > 0 && trainingStatus === "idle" && (
                   <button 
                     onClick={startLocalTraining}
                     className="w-full bg-gradient-to-r from-[#00E5A0] to-[#7C3AED] text-white rounded-lg py-2 text-sm font-bold shadow-lg transition-transform active:scale-95"
                   >
                     Start Local Training ({localImages.length} images)
                   </button>
                )}

                {localImages.length === 0 && trainingStatus === "idle" && (
                   <div className="text-center py-4 text-xs text-[#8B8B9E]">
                     Upload a food image to start training
                   </div>
                )}

                {trainingStatus !== "idle" && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-[#00E5A0]">
                        {trainingStatus === "idle" && "Ready for training round..."}
                        {trainingStatus === "training" && "Training local weights..."}
                        {trainingStatus === "encrypting" && "Encrypting payload..."}
                        {trainingStatus === "sending" && "Aggregating with global model..."}
                        {trainingStatus === "success" && "Aggregation successful!"}
                        {trainingStatus === "error" && "Connection error"}
                      </span>
                      {globalRound > 0 && <span className="text-[10px] text-[#8B8B9E]">Round: {globalRound}</span>}
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-[#00E5A0] to-[#7C3AED]"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: trainingStatus === "idle" ? "0%" : 
                                 trainingStatus === "training" ? `${trainingProgress}%` : "100%" 
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-1.5 mt-2 opacity-70 border-t border-white/10 pt-3">
                  <ShieldCheck className="w-3 h-3 text-[#00E5A0]" />
                  <span className="text-[9px] text-white/60 uppercase tracking-wider">End-to-End Encrypted • {localImages.length} samples</span>
                </div>
              </div>
            )}
            
            {/* Decorative background glow */}
            {edgeTraining && trainingStatus !== "idle" && (
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#7C3AED] rounded-full blur-[50px] opacity-20 animate-pulse pointer-events-none" />
            )}
          </div>
        </motion.div>

        {/* Export data */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full h-[52px] mb-4 rounded-[50px] border border-white/20 text-white transition-transform active:scale-95"
          style={{ fontWeight: 500 }}
        >
          Export My Data
        </motion.button>

        {/* Sign out */}
        <Link to="/">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full flex items-center justify-center gap-2 py-4 text-[#FF6B6B] transition-transform active:scale-95"
            style={{ fontWeight: 500 }}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </motion.button>
        </Link>

        {/* Bottom Navigation */}
        <BottomNav active="profile" />
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
