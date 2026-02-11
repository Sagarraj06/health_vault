import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarCheck, FaVideo, FaMapMarkedAlt, FaRobot, FaStethoscope } from 'react-icons/fa';

const MedicalServices = () => {
  const navigate = useNavigate();

  const services = [
    { title: 'Appointment Booking', icon: <FaCalendarCheck />, route: '/appointment', color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Telemedicine Support', icon: <FaStethoscope />, route: '/telemedicine', color: 'text-secondary', bg: 'bg-secondary/10' },
    { title: 'Video Consultation', icon: <FaVideo />, route: '/video-call', color: 'text-accent', bg: 'bg-accent/10' },
    { title: 'Medical Centers', icon: <FaMapMarkedAlt />, route: '/medical-centers', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { title: 'AI Diagnosis', icon: <FaRobot />, route: '/ai-diagnosis', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ];

  return (
    <div className="py-20 px-4 sm:px-6 md:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-md mx-auto leading-relaxed">
            Comprehensive healthcare tools designed to simplify your medical journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="glass-card p-6 flex flex-col items-center text-center hover:scale-[1.03] hover:border-white/10 transition-all duration-300 group cursor-pointer"
              onClick={() => navigate(service.route)}
            >
              <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center text-xl mb-4 ${service.color} transition-all duration-300`}>
                {service.icon}
              </div>

              <h3 className="text-sm font-semibold text-white mb-4 group-hover:text-primary transition-colors">
                {service.title}
              </h3>

              <button className="mt-auto px-4 py-2 rounded-lg text-xs text-gray-400 bg-white/[0.03] border border-white/[0.06] group-hover:bg-primary group-hover:border-primary group-hover:text-white font-medium transition-all duration-300">
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalServices;
