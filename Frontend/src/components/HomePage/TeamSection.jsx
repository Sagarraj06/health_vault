import React from "react";
import { Linkedin } from "lucide-react";

const teamMembers = [
  {
    name: "Harshit Kumar",
    role: "UI/UX Designer & AI Lead",
    initials: "HK",
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Himalay Singh",
    role: "Backend Lead",
    initials: "HS",
    color: "bg-amber-50 text-amber-600",
  },
  {
    name: "Yuvraj Singh",
    role: "Backend Lead",
    initials: "YS",
    color: "bg-blue-50 text-blue-600",
  },
];

const TeamSection = () => {
  return (
    <div className="py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
            Our Team
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text font-[Space_Grotesk] mb-3">
            People Behind Health Vault
          </h2>
          <p className="text-text-light text-base max-w-lg mx-auto">
            Meet the skilled and experienced team behind our successful medical
            app
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="glass-card p-6 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-full ${member.color} flex items-center justify-center text-lg font-bold mb-4`}
              >
                {member.initials}
              </div>
              <h3 className="text-base font-semibold text-text mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-text-light mb-4">{member.role}</p>
              <button className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-text-light hover:text-primary hover:bg-primary/10 transition-colors">
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
