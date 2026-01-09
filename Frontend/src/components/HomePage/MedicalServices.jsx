import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarCheck, FaVideo, FaMapMarkedAlt, FaRobot, FaStethoscope } from 'react-icons/fa';

const MedicalServices = () => {
  const navigate = useNavigate();

  const services = [
    { title: 'Appointment Booking', icon: <FaCalendarCheck />, route: '/appointment', color: 'text-primary' },
    { title: 'Telemedicine Support', icon: <FaStethoscope />, route: '/telemedicine', color: 'text-secondary' },
    { title: 'Video Consultation', icon: <FaVideo />, route: '/video-call', color: 'text-accent' },
    { title: 'Medical Centers', icon: <FaMapMarkedAlt />, route: '/medical-centers', color: 'text-green-400' },
    { title: 'AI Diagnosis', icon: <FaRobot />, route: '/ai-diagnosis', color: 'text-purple-400' },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 md:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Our <span className="text-gradient">Services</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="glass-card p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 group cursor-pointer"
              onClick={() => navigate(service.route)}
            >
              <div className={`w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl mb-4 group-hover:animate-bounce ${service.color}`}>
                {service.icon}
              </div>

              <h3 className="text-lg font-semibold text-white mb-4 group-hover:text-primary transition-colors">
                {service.title}
              </h3>

              <button className="mt-auto px-4 py-2 rounded-full border border-white/20 text-sm text-gray-300 group-hover:bg-primary group-hover:border-primary group-hover:text-dark font-bold transition-all">
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