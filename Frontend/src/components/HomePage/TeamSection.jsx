import React from "react";

const teamMembers = [
  {
    name: "Harshit Kumar",
    // role: "UI/UX Designer/AI lead",
    // experience: "AI Enthusiast , Hackathon finalist ",
    // image: "/./src/assets/Screenshot 2025-03-11 205754.png"
  },
  {
    name: "Himalay Singh",
    // role: "Backend Lead",
    // experience: "Backend Expert , Blockchain Enthusiast ",
    // image: "./src/assets/aadi.jpg"
  },
  {
    name: "Yuvraj Singh",
    // role: "Backend Lead",
    // experience: "Student || Exploring, Observing, Learning ||",
    // image: "./src/assets/Vaibhav.jpg"
  },


];

const TeamSection = () => {
  return (
    <div className="py-16 sm:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          People Behind <span className="text-gradient">HealthVault</span>
        </h2>
        <p className="text-gray-400 text-sm mt-3 max-w-md mx-auto leading-relaxed">
          Meet the skilled and experienced team behind our successful medical app
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="glass-card p-6 relative group hover:border-white/10 transition-all duration-300"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-white/[0.06] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
              {member.image ? (
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white/60">
                  {member.name ? member.name.charAt(0) : "?"}
                </span>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-sm font-semibold text-white">{member.name}</h3>
              {member.role && <p className="text-gray-400 text-xs mt-1">{member.role}</p>}
              {member.experience && (
                <>
                  <div className="h-px bg-white/[0.06] my-3"></div>
                  <p className="text-gray-500 text-xs leading-relaxed">{member.experience}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
