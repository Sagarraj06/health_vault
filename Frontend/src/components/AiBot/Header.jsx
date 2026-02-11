import React from "react";
import { motion } from "motion/react";
import { Bot, MessageSquare, Sparkles, Brain } from "lucide-react";

const AiBotHeader = () => {
  return (
    <section className="flex justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-8 sm:py-12 md:py-16 bg-surface overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center max-w-6xl w-full lg:gap-16 xl:gap-24">
        <div className="lg:w-1/2 text-left z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-text font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-snug lg:leading-tight text-balance"
          >
            Your Smart Healthcare Assistant -- Instant Answers, Anytime!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-light text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed"
          >
            Your 24/7 smart health assistant -- instantly answer queries, manage records, and simplify student healthcare with AI-powered precision!
          </motion.p>
        </div>
        <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0 relative">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="bg-card p-8 rounded-full border border-border shadow-lg relative">
                <Bot size={100} className="text-primary" />
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-8 right-8 w-3 h-3 bg-emerald-400 rounded-full" />
              </div>
            </motion.div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                <div className="bg-card p-3 rounded-xl border border-border shadow-md transform -rotate-12">
                  <Brain size={28} className="text-secondary" />
                </div>
              </div>
              <div className="absolute bottom-10 right-10">
                <div className="bg-card p-3 rounded-xl border border-border shadow-md transform rotate-12">
                  <MessageSquare size={28} className="text-primary-dark" />
                </div>
              </div>
            </motion.div>
            <motion.div animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="absolute top-10 right-10">
              <Sparkles size={24} className="text-secondary" />
            </motion.div>
            <motion.div animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }} className="absolute bottom-20 left-10">
              <Sparkles size={20} className="text-primary" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiBotHeader;
