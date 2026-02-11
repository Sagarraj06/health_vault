import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaVideo,
  FaMapMarkedAlt,
  FaRobot,
  FaStethoscope,
} from "react-icons/fa";
import { ArrowRight } from "lucide-react";

const MedicalServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Appointment Booking",
      description: "Schedule doctor appointments in seconds with instant confirmations.",
      icon: <FaCalendarCheck />,
      route: "/appointment",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Telemedicine Support",
      description: "Get remote medical guidance from expert healthcare professionals.",
      icon: <FaStethoscope />,
      route: "/telemedicine",
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Video Consultation",
      description: "Face-to-face consultations with doctors from anywhere.",
      icon: <FaVideo />,
      route: "/video-call",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Medical Centers",
      description: "Find nearby medical centers and check availability.",
      icon: <FaMapMarkedAlt />,
      route: "/medical-centers",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "AI Diagnosis",
      description: "Get instant AI-powered health assessments and recommendations.",
      icon: <FaRobot />,
      route: "/ai-diagnosis",
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
            What we offer
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text font-[Space_Grotesk]">
            Our Services
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {services.map((service, index) => (
            <button
              key={index}
              className="glass-card p-6 flex flex-col items-start text-left hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(service.route)}
            >
              <div
                className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center text-xl mb-4`}
              >
                {service.icon}
              </div>

              <h3 className="text-sm font-semibold text-text mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>

              <p className="text-xs text-text-light leading-relaxed mb-4 flex-1">
                {service.description}
              </p>

              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalServices;
