import React from 'react';
import { motion } from "motion/react";
import { ShieldCheck, Database, Activity, Lock } from "lucide-react";

const HealthcareHeader = () => {
  return (
    <section className="flex justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-8 sm:py-12 md:py-16 bg-dark overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center max-w-6xl w-full lg:gap-16 xl:gap-24">
        {/* Text Content */}
        <div className="lg:w-1/2 text-left z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-primary font-light leading-relaxed tracking-wide mb-6"
          >
            Effortless Student Healthcare Management – Securely Store, Access & Manage Medical Records with Health Vault.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 font-medium leading-relaxed tracking-wide"
          >
            EXPERIENCE CUTTING-EDGE TREATMENTS DELIVERED WITH A HUMAN TOUCH. OUR TEAM ENSURES PERSONALIZED CARE TAILORED TO YOUR NEEDS, BLENDING TECHNOLOGY AND EMPATHY FOR THE BEST OUTCOMES.
          </motion.p>
        </div>

        {/* Animated Icon Composition */}
        <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0 relative">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />

            {/* Central Shield Icon */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="bg-surface/80 backdrop-blur-md p-10 rounded-[2rem] border border-white/10 shadow-2xl shadow-primary/20 relative">
                <ShieldCheck size={100} className="text-primary" />
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 border-2 border-primary/50 rounded-[2rem] blur-sm"
                />
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ x: [-15, 15, -15], y: [-10, 10, -10] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute top-0 right-10 bg-surface/90 p-4 rounded-2xl border border-white/10 shadow-lg"
            >
              <Database size={32} className="text-secondary" />
            </motion.div>

            <motion.div
              animate={{ x: [15, -15, 15], y: [10, -10, 10] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute bottom-10 left-0 bg-surface/90 p-4 rounded-2xl border border-white/10 shadow-lg"
            >
              <Lock size={32} className="text-accent" />
            </motion.div>

            {/* Activity Pulse */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-surface/90 p-3 rounded-full border border-white/10 shadow-lg"
            >
              <Activity size={24} className="text-green-400" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthcareHeader;