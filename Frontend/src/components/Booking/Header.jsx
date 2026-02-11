import React from "react";
import { motion } from "motion/react";
import { CalendarCheck, Clock, HeartPulse } from "lucide-react";

const Header = () => {
  return (
    <section className="flex justify-center px-4 sm:px-6 md:px-12 lg:px-24 pt-24 pb-8">
      <div className="flex flex-col lg:flex-row items-center max-w-6xl w-full lg:gap-16">
        {/* Text Content */}
        <div className="lg:w-1/2 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <CalendarCheck className="w-4 h-4" />
            Appointment Booking
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-text font-[Space_Grotesk] mb-4 leading-snug"
          >
            Book. Confirm. Stay Healthy.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text-light text-base leading-relaxed max-w-md"
          >
            Schedule doctor appointments in seconds - hassle-free booking,
            instant confirmations, and seamless healthcare access.
          </motion.p>
        </div>

        {/* Illustration */}
        <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl" />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="bg-card p-6 rounded-2xl border border-border shadow-lg">
                <CalendarCheck size={48} className="text-primary" />
                <p className="mt-2 text-xs font-medium text-text text-center">Booked</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute top-2 right-2"
            >
              <div className="bg-card p-3 rounded-xl border border-border shadow-md">
                <Clock size={20} className="text-secondary" />
              </div>
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute bottom-4 left-4"
            >
              <div className="bg-red-50 p-2.5 rounded-full border border-red-100">
                <HeartPulse size={18} className="text-red-500" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
