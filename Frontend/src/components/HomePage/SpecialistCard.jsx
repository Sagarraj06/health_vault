import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import React from "react";

export default function SpecialistCard() {
  const [openIndex, setOpenIndex] = useState(null);

  const specialists = [
    { id: 1, title: "PRESCRIPTION GENERATOR" },
    { id: 2, title: "APPOINTMENT BOOKING" },
    { id: 3, title: "AI BASED DIAGNOSIS" },
    { id: 4, title: "APPLY FOR LEAVE" },
    { id: 5, title: "MEDICAL CERTIFICATE" },
    { id: 6, title: "TALK WITH AI" },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 sm:px-6 md:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Our <span className="text-gradient">Specialists</span>
        </h2>
        <p className="text-gray-400 text-sm mt-3 max-w-md mx-auto leading-relaxed">
          Explore the core features powering your healthcare experience.
        </p>
      </div>
      <div className="w-full max-w-4xl">
        {specialists.map((specialist, index) => (
          <div key={specialist.id} className="mb-3">
            <button
              className={`glass-card p-5 sm:p-6 rounded-2xl flex justify-between items-center cursor-pointer w-full transition-all duration-300 ${openIndex === index ? 'border-primary/20 bg-primary/[0.03]' : 'hover:bg-white/[0.02]'}`}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <span className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-600 tabular-nums">{`0${specialist.id}`}</span>
                <span className="text-sm sm:text-base md:text-lg font-medium text-gray-200">{specialist.title}</span>
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-primary/10 text-primary rotate-0' : 'bg-white/[0.04] text-gray-400'}`}>
                {openIndex === index ?
                  <Minus className="h-4 w-4" /> :
                  <Plus className="h-4 w-4" />
                }
              </div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 sm:px-6 py-4 ml-14 sm:ml-16 text-gray-400 text-sm leading-relaxed">
                    A specialist in this field focuses on providing expert care and guidance for this medical service.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
