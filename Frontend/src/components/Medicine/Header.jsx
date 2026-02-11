import React from "react";

const HeroSection = () => {
  return (
    <section className="flex justify-center px-6 lg:px-24 pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="flex flex-col lg:flex-row items-center max-w-6xl w-full lg:gap-24">
        {/* Text Content */}
        <div className="lg:w-1/2 text-left">
          <h1 className="text-white text-3xl lg:text-5xl font-bold mb-6 leading-snug lg:leading-tight tracking-tight">
            Instant Care, <span className="text-gradient">Anytime</span>, Anywhere!
          </h1>

          <p className="text-gray-400 text-base lg:text-lg mb-8 leading-relaxed">
            Connect with doctors on demand - book virtual consultations, get prescriptions, and manage your health effortlessly with Health Vault{"'"}s telemedicine feature
          </p>
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-medium text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/40 transition-all duration-300">
            Start Your Journey
          </button>
        </div>

        {/* Image Placeholder */}
        <div className="lg:w-1/2 flex justify-center mt-10 lg:mt-0">
          <img
            src="./src/assets/image 35.png"
            alt="Healthcare Illustration"
            className="w-full max-w-lg opacity-70 hover:opacity-90 transition-opacity duration-300"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
