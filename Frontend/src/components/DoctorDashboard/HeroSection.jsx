import React from "react";
import { motion } from "motion/react";
import { Activity, Clock, Users, TrendingUp } from "lucide-react";

const HeroSection = () => {
  const features = [
    { icon: Activity, label: "Real-time Monitoring", desc: "Track patient health metrics in real-time" },
    { icon: Clock, label: "24/7 Availability", desc: "Round the clock healthcare support" },
    { icon: Users, label: "Patient Management", desc: "Efficiently manage patient records" },
    { icon: TrendingUp, label: "Health Analytics", desc: "Data-driven insights for better care" },
  ];

  return (
    <section className="px-4 sm:px-6 md:px-12 lg:px-24 py-12 sm:py-16 bg-dark">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 text-balance">
            Empowering Healthcare with Technology
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Streamline your practice with our comprehensive suite of tools designed for modern healthcare professionals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-5 hover:border-white/10 transition-all duration-300 group"
            >
              <div className="bg-primary/10 p-3 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{feature.label}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
