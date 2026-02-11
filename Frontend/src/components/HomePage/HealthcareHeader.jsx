import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Database, Activity, Lock } from "lucide-react";

const HealthcareHeader = () => {
  return (
    <section className="flex justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-16 sm:py-20 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center max-w-6xl w-full lg:gap-16 xl:gap-24">
        {/* Text Content */}
        <div className="lg:w-1/2 text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <ShieldCheck className="w-4 h-4" />
            Secure and Reliable
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-text font-[Space_Grotesk] leading-snug mb-4"
          >
            Effortless Student Healthcare Management
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text-light text-base leading-relaxed"
          >
            Experience cutting-edge treatments delivered with a human touch.
            Our team ensures personalized care tailored to your needs, blending
            technology and empathy for the best outcomes.
          </motion.p>
        </div>

        {/* Illustration */}
        <div className="lg:w-1/2 flex justify-center mt-10 lg:mt-0 relative">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl" />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
                <ShieldCheck size={64} className="text-primary" />
                <p className="mt-2 text-sm font-medium text-text text-center">Protected</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ x: [-8, 8, -8], y: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-2 right-4"
            >
              <div className="bg-card p-3 rounded-xl border border-border shadow-md">
                <Database size={24} className="text-secondary" />
              </div>
            </motion.div>

            <motion.div
              animate={{ x: [8, -8, 8], y: [5, -5, 5] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-6 left-2"
            >
              <div className="bg-card p-3 rounded-xl border border-border shadow-md">
                <Lock size={24} className="text-primary-dark" />
              </div>
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1/2 left-0 -translate-x-4 -translate-y-1/2"
            >
              <div className="bg-emerald-50 p-2.5 rounded-full border border-emerald-100">
                <Activity size={18} className="text-emerald-600" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthcareHeader;
