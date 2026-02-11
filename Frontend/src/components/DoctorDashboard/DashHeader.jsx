import React from "react";
import { Heart, Shield, Clock } from "lucide-react";

const DashHeader = () => {
  return (
    <section className="flex justify-center px-6 lg:px-24 py-16 bg-surface">
      <div className="flex flex-col lg:flex-row items-center max-w-6xl w-full lg:gap-16">
        <div className="lg:w-1/2 text-left">
          <h1 className="text-text font-heading text-3xl lg:text-5xl font-bold mb-6 leading-snug lg:leading-tight text-balance">
            Meet Jivika: Your 24/7 Health Companion
          </h1>
          <p className="text-text-light text-lg lg:text-xl mb-8 leading-relaxed">
            Experience healthcare reimagined with AI-powered support. From routine checkups to urgent care guidance, Jivika is always here for you.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { icon: Heart, text: "Personalized Care" },
              { icon: Shield, text: "Secure Records" },
              { icon: Clock, text: "24/7 Available" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-xl text-sm font-medium">
                <item.icon className="w-4 h-4" />
                {item.text}
              </div>
            ))}
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm">
            Start Your Journey
          </button>
        </div>
        <div className="lg:w-1/2 flex justify-center mt-10 lg:mt-0">
          <div className="w-full max-w-lg aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl flex items-center justify-center">
            <Heart className="w-32 h-32 text-primary/30" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashHeader;
