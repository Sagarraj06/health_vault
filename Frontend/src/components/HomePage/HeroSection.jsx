import React from "react";
import { motion } from "motion/react";
import { Activity, Shield, Database, Heart, Stethoscope, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative flex justify-center px-4 sm:px-6 md:px-12 lg:px-24 pt-28 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      <div className="relative z-10 flex flex-col lg:flex-row items-center max-w-7xl w-full lg:gap-16 xl:gap-24">
        {/* Text Content */}
        <div className="lg:w-1/2 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Activity className="w-4 h-4" />
            AI-Powered Healthcare Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-text font-[Space_Grotesk]"
          >
            Effortless{" "}
            <span className="text-gradient">Healthcare</span>{" "}
            Management
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text-light text-lg sm:text-xl mb-8 leading-relaxed max-w-lg"
          >
            Securely store, access and manage medical records with{" "}
            <span className="text-primary font-semibold">Health Vault</span>.
            Your health data, reimagined for the future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={() => navigate("/appointment")}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-card font-medium shadow-sm hover:bg-primary-dark transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/ai-bot")}
              className="px-6 py-3 rounded-lg border border-border text-text font-medium hover:bg-surface-alt transition-colors"
            >
              Try AI Diagnosis
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-8 mt-12 pt-8 border-t border-border"
          >
            {[
              { value: "10K+", label: "Students" },
              { value: "50+", label: "Doctors" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-text font-[Space_Grotesk]">
                  {stat.value}
                </p>
                <p className="text-sm text-text-light">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Illustration - Clean Card Grid */}
        <div className="lg:w-1/2 flex justify-center mt-12 lg:mt-0">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96">
            {/* Main Card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
                <Activity size={64} className="text-primary" />
                <p className="mt-3 text-sm font-medium text-text">Health Monitor</p>
                <p className="text-xs text-text-light">Active & Secure</p>
              </div>
            </motion.div>

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-4 right-4"
            >
              <div className="bg-card p-4 rounded-xl border border-border shadow-md">
                <Shield size={28} className="text-primary" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-8 right-8"
            >
              <div className="bg-card p-4 rounded-xl border border-border shadow-md">
                <Database size={28} className="text-secondary" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-8 left-8"
            >
              <div className="bg-card p-4 rounded-xl border border-border shadow-md">
                <Stethoscope size={28} className="text-primary-dark" />
              </div>
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-8 left-8"
            >
              <div className="bg-red-50 p-3 rounded-full border border-red-100">
                <Heart size={20} className="text-red-500 fill-current" />
              </div>
            </motion.div>

            {/* Background decoration */}
            <div className="absolute inset-0 bg-primary/5 rounded-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
