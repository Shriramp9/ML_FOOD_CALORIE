import { useState } from "react";
import { motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export function SignupLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === "/signup";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white px-6 py-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-[375px] mx-auto">
        {/* Back button */}
        <Link to="/">
          <button className="mb-8 p-2 -ml-2 transition-transform active:scale-95">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </Link>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl mb-8"
          style={{ fontWeight: 700 }}
        >
          {isSignup ? "Create Account" : "Welcome Back"}
        </motion.h1>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {isSignup && (
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full h-14 px-4 rounded-[14px] bg-[#13131A] border border-white/8 focus:border-[#00E5A0] focus:outline-none transition-colors"
              />
            </div>
          )}
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full h-14 px-4 rounded-[14px] bg-[#13131A] border border-white/8 focus:border-[#00E5A0] focus:outline-none transition-colors"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full h-14 px-4 pr-12 rounded-[14px] bg-[#13131A] border border-white/8 focus:border-[#00E5A0] focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8B9E]"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {isSignup && (
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full h-14 px-4 pr-12 rounded-[14px] bg-[#13131A] border border-white/8 focus:border-[#00E5A0] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8B9E]"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={() => navigate(isSignup ? "/profile-setup" : "/dashboard")}
            className="w-full h-[52px] rounded-[50px] bg-gradient-to-r from-[#00E5A0] to-[#7C3AED] text-white mt-6 transition-transform active:scale-95"
            style={{ fontWeight: 500 }}
          >
            Continue
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-[#8B8B9E] text-sm">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Google Sign In */}
          <button className="w-full h-[52px] rounded-[50px] border border-white/20 text-white flex items-center justify-center gap-3 transition-transform active:scale-95"
            style={{ fontWeight: 500 }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Switch link */}
          <p className="text-center text-[#8B8B9E] text-sm mt-6">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Link to={isSignup ? "/login" : "/signup"} className="text-[#00E5A0]">
              {isSignup ? "Login" : "Sign up"}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
