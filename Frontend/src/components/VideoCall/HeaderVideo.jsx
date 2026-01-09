import React from "react";
import { motion } from "motion/react";
import { Video, Users, Wifi, ShieldCheck } from "lucide-react";

const VideoCallHeader = () => {
  return (
    <section className="flex justify-center px-6 lg:px-24 py-16 bg-dark overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center max-w-6xl w-full gap-8 lg:gap-24">
        {/* Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary text-3xl lg:text-5xl font-thin mb-6 leading-snug lg:leading-tight"
          >
            Seamless Video Consultations, Anytime!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-lg lg:text-xl mb-8 leading-relaxed lg:leading-loose"
          >
            Connect with healthcare professionals in real-time – secure, high-quality video calls for instant medical advice and support, right from Health Vault!
          </motion.p>
        </div>

        {/* Animated Icon Composition */}
        <div className="w-full lg:w-1/2 flex justify-center relative">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />

            {/* Central Video Icon */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="bg-surface/80 backdrop-blur-md p-10 rounded-3xl border border-white/10 shadow-2xl shadow-primary/20 relative overflow-hidden">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"
                />
                <Video size={80} className="text-primary" />
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ x: [-10, 10, -10], y: [-5, 5, -5] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-0 left-10 bg-surface/90 p-3 rounded-xl border border-white/10 shadow-lg"
            >
              <Users size={32} className="text-secondary" />
            </motion.div>

            <motion.div
              animate={{ x: [10, -10, 10], y: [5, -5, 5] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute bottom-10 right-0 bg-surface/90 p-3 rounded-xl border border-white/10 shadow-lg"
            >
              <ShieldCheck size={32} className="text-accent" />
            </motion.div>

            {/* Wifi Signal Animation */}
            <motion.div
              className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <Wifi size={40} className="text-green-400" />
                <motion.div
                  animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-green-400/30 rounded-full blur-md"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoCallHeader;
