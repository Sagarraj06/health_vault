import React from "react";
import { motion } from "motion/react";
import { Activity, Shield, Database, Heart, Stethoscope } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-16 sm:py-24 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center max-w-7xl w-full lg:gap-16 xl:gap-24">
        {/* Text Content */}
        <div className="lg:w-1/2 text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Effortless <span className="text-gradient">Healthcare</span> Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-lg sm:text-xl mb-8 leading-relaxed"
          >
            Securely store, access & manage medical records with <span className="text-primary font-semibold">Health Vault</span>. Your health data, reimagined for the future.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex space-x-4"
          >
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-primary/50 transition-transform transform hover:scale-105">
              Get Started
            </button>
            <button className="px-8 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/10 transition-colors">
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Animated Icon Composition */}
        <div className="lg:w-1/2 flex justify-center mt-12 lg:mt-0 relative">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 blur-[80px] rounded-full" />

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
              <div className="bg-surface/80 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-primary/20 relative">
                <Activity size={100} className="text-primary" />
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
                <div className="bg-surface/90 p-4 rounded-2xl border border-white/10 shadow-lg transform -rotate-12">
                  <Shield size={32} className="text-secondary" />
                </div>
              </div>
              <div className="absolute bottom-10 right-10">
                <div className="bg-surface/90 p-4 rounded-2xl border border-white/10 shadow-lg transform rotate-12">
                  <Database size={32} className="text-accent" />
                </div>
              </div>
              <div className="absolute bottom-10 left-10">
                <div className="bg-surface/90 p-4 rounded-2xl border border-white/10 shadow-lg transform -rotate-12">
                  <Stethoscope size={32} className="text-green-400" />
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