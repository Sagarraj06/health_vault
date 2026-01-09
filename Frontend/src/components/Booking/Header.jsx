import React from "react";
import { motion } from "motion/react";
import { CalendarCheck, Clock, HeartPulse, Stethoscope } from "lucide-react";

const Header = () => {
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
            Book. Confirm. Stay Healthy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed lg:leading-loose"
          >
            Schedule doctor appointments in seconds – hassle-free booking, instant confirmations, and seamless healthcare access with Health Vault!
          </motion.p>
        </div>

        {/* Animated Icon Composition */}
        <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0 relative">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />

            {/* Central Calendar Icon */}
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="bg-surface/80 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl shadow-primary/20 relative">
                <CalendarCheck size={100} className="text-primary" />
                {/* Checkmark Animation */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg"
                >
                  <div className="w-4 h-4 bg-white rounded-full" />
                </motion.div>
              </div>
            </motion.div>

            {/* Orbiting Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8">
                <div className="bg-surface/90 p-3 rounded-xl border border-white/10 shadow-lg transform -rotate-12">
                  <Clock size={32} className="text-secondary" />
                </div>
              </div>
              <div className="absolute bottom-12 left-12">
                <div className="bg-surface/90 p-3 rounded-xl border border-white/10 shadow-lg transform rotate-12">
                  <Stethoscope size={32} className="text-accent" />
                </div>
              </div>
            </motion.div>

            {/* Heartbeat Animation */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
              className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 bg-surface/90 p-3 rounded-full border border-white/10 shadow-lg"
            >
              <HeartPulse size={28} className="text-red-500" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;