import React from 'react';

const MedicalLandingPage = () => {
  return (
    <div className="font-sans bg-dark min-h-screen">
      {/* Header */}

      {/* Hero Section */}
      <div className="relative w-screen h-[85vh] sm:h-[90vh] lg:h-screen overflow-hidden"
        style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="../src/assets/video_preview_h264.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-transparent"></div>

        <div className="relative flex flex-col items-center justify-center h-full text-center px-4 sm:px-8 text-white">
          <div className="text-sm text-gray-300 mb-4">
            <span className="hover:text-primary cursor-pointer transition-colors">Home</span>
            <span className="mx-2">/</span>
            <span>Contact</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
            Meet Jivika: Bridging Timeless <br /> Ayurveda with Modern Innovation, Naturally.
          </h1>

          <p className="mt-4 text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl drop-shadow-md">
            जीविका: योगः, आयुर्वेदः, विज्ञानस्य संगमः।
          </p>

          <div className="mt-6">
            <button className="bg-primary hover:bg-primary/80 text-white text-sm sm:text-base font-semibold py-3 px-6 rounded-lg shadow-lg shadow-primary/20 transition duration-300 ease-in-out transform hover:-translate-y-1">
              Start Your Health Journey
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Section */}
      <section className="bg-dark py-8 px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center justify-center glass-card p-6 rounded-lg shadow-md border border-white/10 hover:border-primary/50 transition-colors">
          <div>
            <p className="font-bold text-xl text-primary">Book an Appointment</p>
            <p className="text-gray-400">Convenient booking</p>
          </div>
        </div>
        <div className="flex items-center justify-center glass-card p-6 rounded-lg shadow-md border border-white/10 hover:border-primary/50 transition-colors">
          <div>
            <p className="font-bold text-xl text-primary">Meet Our Doctors</p>
            <p className="text-gray-400">Get expert advice</p>
          </div>
        </div>
        <div className="flex items-center justify-center glass-card p-6 rounded-lg shadow-md border border-white/10 hover:border-primary/50 transition-colors">
          <div>
            <p className="font-bold text-xl text-primary">Healthcare Services</p>
            <p className="text-gray-400">Accessible care</p>
          </div>
        </div>
      </section>

      {/* Welcome Section */}

    </div>
  );
};

export default MedicalLandingPage;
