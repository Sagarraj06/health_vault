import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, FileText, Calendar, Bot, FileCheck, Award, MessageSquare } from "lucide-react";
import React from "react";

export default function SpecialistCard() {
  const [openIndex, setOpenIndex] = useState(null);

  const specialists = [
    {
      id: 1,
      title: "Prescription Generator",
      description: "AI-powered prescription generation with accurate dosage calculations and drug interaction checks.",
      icon: FileText,
    },
    {
      id: 2,
      title: "Appointment Booking",
      description: "Seamless appointment scheduling with real-time doctor availability and instant confirmations.",
      icon: Calendar,
    },
    {
      id: 3,
      title: "AI Based Diagnosis",
      description: "Advanced machine learning models that analyze symptoms to provide preliminary health assessments.",
      icon: Bot,
    },
    {
      id: 4,
      title: "Apply for Leave",
      description: "Streamlined medical leave application process with automated doctor verification and approval workflow.",
      icon: FileCheck,
    },
    {
      id: 5,
      title: "Medical Certificate",
      description: "Generate and verify medical certificates digitally with QR code authentication.",
      icon: Award,
    },
    {
      id: 6,
      title: "Talk with AI",
      description: "24/7 AI health assistant for instant medical queries, wellness tips, and symptom checking.",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 md:px-8">
      <div className="text-center mb-10">
        <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
          Features
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-text font-[Space_Grotesk]">
          Our Specialties
        </h2>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-3">
        {specialists.map((specialist, index) => (
          <div key={specialist.id}>
            <button
              className={`w-full glass-card px-6 py-5 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                openIndex === index
                  ? "border-primary/30 shadow-md"
                  : "hover:shadow-md hover:-translate-y-0.5"
              }`}
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl sm:text-4xl font-light text-border font-[Space_Grotesk]">
                  {String(specialist.id).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-3">
                  <specialist.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm sm:text-base font-semibold text-text">
                    {specialist.title}
                  </span>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                openIndex === index ? "bg-primary/10 text-primary" : "bg-surface-alt text-text-light"
              }`}>
                {openIndex === index ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-4 bg-surface-alt rounded-b-xl border border-t-0 border-border">
                    <p className="text-sm text-text-light leading-relaxed">
                      {specialist.description}
                    </p>
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
