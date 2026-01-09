import React from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactHeader = () => {
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
            Reach Out, We're Here to Help!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed lg:leading-loose"
          >
            Have questions or need support? Contact us anytime – we're just a message away to assist you with Health Vault!
          </motion.p>
        </div>

        {/* Animated Icon Composition */}
        <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0 relative">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />

            {/* Central Mail Icon */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="bg-surface/80 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl shadow-primary/20">
                <Mail size={80} className="text-primary" />
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute top-0 right-10 bg-surface/90 p-4 rounded-2xl border border-white/10 shadow-lg"
            >
              <Phone size={32} className="text-secondary" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-10 left-0 bg-surface/90 p-4 rounded-2xl border border-white/10 shadow-lg"
            >
              <MapPin size={32} className="text-accent" />
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/2 right-0 bg-primary/30 p-3 rounded-full"
            >
              <Send size={24} className="text-white" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHeader;