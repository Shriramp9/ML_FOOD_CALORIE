import { useState, useRef } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { X, Camera, Image, Scan } from "lucide-react";

export function ScanScreen() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async (file: File) => {
    setIsScanning(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const backendUrl = `http://${window.location.hostname}:8000/api/detect`;
      const response = await fetch(backendUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to detect food");
      }

      const data = await response.json();
      
      navigate("/detection-results", { 
        state: { 
          results: data.items, 
          imageFile: URL.createObjectURL(file) 
        } 
      });
    } catch (error) {
      console.error(error);
      alert("Error detecting food. Is the backend running on port 8000?");
      setIsScanning(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleScan(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between p-6">
        <p className="text-lg">Point at your food</p>
        <button onClick={() => navigate("/dashboard")} className="p-2">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera viewfinder */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="relative w-[300px] h-[300px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#13131A] to-[#0A0A0F] border border-white/10">
          {/* Placeholder camera view */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-20 h-20 text-white/20" />
          </div>

          {/* Animated scanning frame */}
          {isScanning && (
            <>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-[#00E5A0] rounded-tl-2xl"
              />
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-[#00E5A0] rounded-tr-2xl"
              />
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute bottom-4 left-4 w-12 h-12 border-l-4 border-b-4 border-[#00E5A0] rounded-bl-2xl"
              />
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute bottom-4 right-4 w-12 h-12 border-r-4 border-b-4 border-[#00E5A0] rounded-br-2xl"
              />
              <motion.div
                animate={{ top: ["10%", "90%", "10%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00E5A0] to-transparent"
                style={{ position: "absolute" }}
              />
            </>
          )}

          {!isScanning && (
            <>
              <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-[#00E5A0]/50 rounded-tl-2xl" />
              <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-[#00E5A0]/50 rounded-tr-2xl" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-[#00E5A0]/50 rounded-bl-2xl" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-[#00E5A0]/50 rounded-br-2xl" />
            </>
          )}
        </div>
      </div>

      {/* Hidden file inputs — separate for Camera and Gallery */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={cameraInputRef}
        onChange={onFileChange}
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={galleryInputRef}
        onChange={onFileChange}
      />

      {/* Quick options */}
      <div className="p-6">
        <div className="flex items-center justify-center gap-6 mb-6">
          {/* Camera button — opens live camera */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={isScanning}
            className="flex flex-col items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <div className="w-16 h-16 rounded-full bg-[#13131A] border border-white/8 flex items-center justify-center">
              <Camera className="w-8 h-8 text-[#00E5A0]" />
            </div>
            <span className="text-sm text-[#8B8B9E]">Camera</span>
          </button>

          {/* Gallery button — opens file picker */}
          <button
            onClick={() => galleryInputRef.current?.click()}
            disabled={isScanning}
            className="flex flex-col items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <div className="w-16 h-16 rounded-full bg-[#13131A] border border-white/8 flex items-center justify-center">
              <Image className="w-8 h-8 text-[#00E5A0]" />
            </div>
            <span className="text-sm text-[#8B8B9E]">Gallery</span>
          </button>

          <button className="flex flex-col items-center gap-2 transition-transform active:scale-95 opacity-50">
            <div className="w-16 h-16 rounded-full bg-[#13131A] border border-white/8 flex items-center justify-center">
              <Scan className="w-8 h-8 text-[#00E5A0]" />
            </div>
            <span className="text-sm text-[#8B8B9E]">Barcode</span>
          </button>
        </div>

        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#13131A] border border-[#00E5A0]/30">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Scan className="w-4 h-4 text-[#00E5A0]" />
              </motion.div>
              <span className="text-sm text-[#00E5A0]">Analyzing with AI...</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
