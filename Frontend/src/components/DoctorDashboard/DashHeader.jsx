import React from "react";
import { motion } from "motion/react";
import { Heart, Stethoscope, Shield, Sparkles } from "lucide-react";

const DashHeader = () => {
  return (
    <section className="flex justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-8 sm:py-12 md:py-16 bg-dark overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center max-w-6xl w-full lg:gap-16 xl:gap-24">
        {/* Text Content */}
        <div className="lg:w-1/2 text-left z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-thin mb-4 sm:mb-6 leading-snug lg:leading-tight"
          >
            Meet Jivika: Your 24/7 Health Companion
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed lg:leading-loose"
          >
            Experience healthcare reimagined with AI-powered support. From routine checkups to urgent care guidance, Jivika is always here for you.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/80 transition-all duration-300 btn-animated"
          >
            Start Your Journey
          </motion.button>
        </div>

        {/* Animated Icon Composition */}
        <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0 relative">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="bg-surface/80 backdrop-blur-md p-8 rounded-full border border-white/10 shadow-2xl shadow-primary/20">
                <Heart size={80} className="text-primary" />
              </div>
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                <div className="bg-surface/90 p-3 rounded-xl border border-white/10 shadow-lg">
                  <Stethoscope size={28} className="text-cyan-400" />
                </div>
              </div>
              <div className="absolute bottom-10 right-10">
                <div className="bg-surface/90 p-3 rounded-xl border border-white/10 shadow-lg">
                  <Shield size={28} className="text-emerald-400" />
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              className="absolute top-10 right-10"
            >
              <Sparkles size={24} className="text-yellow-400" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashHeader;
