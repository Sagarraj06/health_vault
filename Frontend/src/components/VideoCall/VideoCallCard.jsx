'use client';

import React from 'react';
import { Video, Clock, Shield, Star } from 'lucide-react';

const VideoCallCard = () => {
  const handleScheduleSession = () => {
    window.location.href = "https://meet.jit.si/KalSmithMathMentorRoom2025";
  };

  return (
    <section className="px-4 sm:px-6 md:px-12 lg:px-24 py-12 sm:py-16 bg-dark">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Doctor Profile */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left flex-1">
              {/* Avatar Placeholder */}
              <div className="w-28 h-28 rounded-2xl bg-primary/10 border border-white/[0.06] flex items-center justify-center mb-6 overflow-hidden">
                <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                  <Video size={40} className="text-primary" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-1">Mr. Kal Smith</h2>
              <p className="text-primary text-sm font-medium mb-3">Bone Specialist</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                Graduated from Italy School of Medical Science. Specializing in orthopedic care and bone health.
              </p>

              {/* Stats */}
              <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Star size={14} className="text-yellow-400" />
                  <span>4.9 Rating</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock size={14} className="text-primary" />
                  <span>10+ Years</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Shield size={14} className="text-emerald-400" />
                  <span>Verified</span>
                </div>
              </div>

              <button
                onClick={handleScheduleSession}
                className="w-full bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary/80 transition-all btn-animated text-sm"
              >
                Start Video Consultation
              </button>
            </div>

            {/* Info Cards */}
            <div className="flex-1 flex flex-col gap-3 w-full">
              {[
                { icon: Video, title: "HD Video Quality", desc: "Crystal clear video consultations with adaptive quality" },
                { icon: Shield, title: "End-to-End Encrypted", desc: "Your health conversations are completely private and secure" },
                { icon: Clock, title: "Flexible Scheduling", desc: "Book sessions at your convenience, available 24/7" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                  <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                    <item.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-medium mb-0.5">{item.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoCallCard;
