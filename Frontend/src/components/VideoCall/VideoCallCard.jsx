import React from 'react';

const VideoCallCard = ({ doctorImage, decorationImage }) => {
  const handleScheduleSession = () => {
    window.location.href = "https://meet.jit.si/KalSmithMathMentorRoom2025"; // Replace with your actual Daily.co room link
  };
  return (
    <div className="container mx-auto p-6 max-w-5xl bg-dark min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-between gap-12 p-6 glass-card shadow-lg rounded-xl border border-white/10">
        {/* Doctor Profile Section */}
        <div className="flex flex-col items-center text-center md:text-left md:items-start">
          {/* Doctor Image */}
          <div className="mb-6">
            <div className="w-52 h-52 overflow-hidden rounded-xl shadow-md border border-white/10">
              {doctorImage ? (
                <img
                  src="../src/assets/video call 2.png"
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="../src/assets/video call 2.png"
                  alt="Doctor placeholder"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-surface p-6 rounded-lg shadow-md w-full max-w-sm border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-2">MR. KAL SMITH</h2>
            <p className="text-lg font-medium text-gray-300 mb-4">BONE SPECIALIST</p>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              GRADUATED FROM ITALY SCHOOL<br />
              OF MEDICAL SCIENCE
            </p>
            <button onClick={handleScheduleSession} className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/80 transition-all shadow-md">
              See Your Doctor !
            </button>
          </div>
        </div>

        {/* Decoration Image */}
        <div className="relative w-full h-full flex-shrink-0">
          {decorationImage ? (
            <img
              src={decorationImage}
              alt="Decoration"
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src="../src/assets/form design.png"
              alt="Decoration placeholder"
              className="w-full h-full object-contain opacity-80"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallCard;