import React from "react";
import { Video, ArrowRight, Shield, Clock } from "lucide-react";

const VideoCallCard = () => {
  const handleScheduleSession = () => {
    window.location.href = "https://meet.jit.si/KalSmithMathMentorRoom2025";
  };

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Header bar */}
          <div className="bg-primary/5 border-b border-border px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text font-[Space_Grotesk]">
                Video Consultation
              </h2>
              <p className="text-xs text-text-light">Secure, HD video calls with your doctor</p>
            </div>
          </div>

          <div className="p-6 flex flex-col md:flex-row gap-6">
            {/* Doctor Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  KS
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">
                    Mr. Kal Smith
                  </h3>
                  <p className="text-sm text-text-light">Bone Specialist</p>
                  <p className="text-xs text-muted mt-0.5">
                    Italy School of Medical Science
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-surface-alt rounded-lg">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-text-light">End-to-end encrypted</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-alt rounded-lg">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-text-light">30 min consultation</span>
                </div>
              </div>

              <button
                onClick={handleScheduleSession}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-card text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
              >
                Start Video Call
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Visual */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full aspect-square max-w-[200px] rounded-2xl bg-primary/5 border border-border flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-xs text-text-light">Ready to connect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallCard;
