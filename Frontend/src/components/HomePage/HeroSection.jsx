import React from "react";
import { motion } from "motion/react";
import { Activity, Shield, Database, Heart, Stethoscope } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex justify-center px-4 sm:px-6 md:px-12 lg:px-24 pt-32 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      <div className="relative z-10 flex flex-col lg:flex-row items-center max-w-7xl w-full lg:gap-16 xl:gap-24">
        {/* Text Content */}
        <div className="lg:w-1/2 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-primary text-xs font-medium tracking-wide uppercase">AI-Powered Platform</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight"
          >
            Effortless{" "}
            <span className="text-gradient">Healthcare</span>
            <br />
            Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg mb-8 leading-relaxed max-w-lg"
          >
            Securely store, access & manage medical records with{" "}
            <span className="text-white font-medium">Health Vault</span>. Your health data, reimagined for the future.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <button className="px-6 py-3 rounded-xl bg-primary text-white font-medium text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary/90 transition-all duration-300">
              Get Started
            </button>
            <button className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 font-medium text-sm hover:bg-white/[0.04] hover:text-white transition-all duration-300">
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Animated Icon Composition */}
        <div className="lg:w-1/2 flex justify-center mt-12 lg:mt-0 relative">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 to-accent/10 blur-[100px] rounded-full" />

            {/* Central Activity Icon */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="bg-surface-elevated/80 backdrop-blur-md p-8 rounded-3xl border border-white/[0.08] shadow-2xl shadow-primary/10 relative">
                <Activity size={80} className="text-primary" />
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 border-2 border-primary/50 rounded-[2.5rem] blur-sm"
                />
              </div>
            </motion.div>

            {/* Orbiting Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-10">
                <div className="bg-surface-elevated/90 p-3 rounded-xl border border-white/[0.08] shadow-lg">
                  <Shield size={28} className="text-secondary" />
                </div>
              </div>
              <div className="absolute bottom-10 right-10">
                <div className="bg-surface-elevated/90 p-3 rounded-xl border border-white/[0.08] shadow-lg">
                  <Database size={28} className="text-accent" />
                </div>
              </div>
              <div className="absolute bottom-10 left-10">
                <div className="bg-surface-elevated/90 p-3 rounded-xl border border-white/[0.08] shadow-lg">
                  <Stethoscope size={28} className="text-emerald-400" />
                </div>
              </div>
            </motion.div>

            {/* Floating Heart */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-10 right-0 bg-red-500/20 p-3 rounded-full backdrop-blur-sm"
            >
              <Heart size={24} className="text-red-500 fill-current" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
