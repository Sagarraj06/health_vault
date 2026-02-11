import React, { useContext, useState } from "react";
import { api } from "../../axios.config.js";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, Key, ShieldCheck, UserCheck, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post(
        "/user/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        const { role, userData, token } = response.data;
        login(userData);

        if (token) {
          localStorage.setItem("token", token);
        }
        localStorage.setItem("userId", userData.id);

        if (role === "doctor") navigate("/doctor");
        else if (role === "student") navigate("/profile");
        else navigate("/admin");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 pt-24 relative overflow-hidden">
      <div className="relative z-10 glass-card p-8 md:p-10 max-w-4xl w-full flex flex-col md:flex-row items-center animate-fade-in-up">

        {/* Illustration Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/[0.06]">
          <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Log In</h1>

          <div className="relative w-64 h-64">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-secondary/20 blur-[60px] rounded-full" />

            {/* Central Lock Icon */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="bg-surface/80 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-2xl shadow-secondary/20 relative">
                <Lock size={80} className="text-secondary" />
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"
                />
              </div>
            </motion.div>

            {/* Orbiting Key */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                <div className="bg-surface/90 p-3 rounded-xl border border-white/10 shadow-lg transform -rotate-45">
                  <Key size={32} className="text-primary" />
                </div>
              </div>
            </motion.div>

            {/* Floating Shield */}
            <motion.div
              animate={{ x: [-10, 10, -10], y: [5, -5, 5] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute bottom-4 right-4 bg-surface/90 p-3 rounded-xl border border-white/10 shadow-lg"
            >
              <ShieldCheck size={28} className="text-accent" />
            </motion.div>

            {/* Floating User */}
            <motion.div
              animate={{ x: [10, -10, 10], y: [-5, 5, -5] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute bottom-4 left-4 bg-surface/90 p-3 rounded-xl border border-white/10 shadow-lg"
            >
              <UserCheck size={28} className="text-green-400" />
            </motion.div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 md:pl-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-gray-400 text-xs font-medium ml-1 mb-1.5 block">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-medium ml-1 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button type="submit" className="w-full p-3.5 bg-primary text-white font-medium text-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 hover:scale-[1.01] transition-all duration-300">
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-xs">
            {"Don't have an account?"}{" "}
            <span className="text-primary cursor-pointer hover:underline font-medium" onClick={() => navigate('/signup')}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}
