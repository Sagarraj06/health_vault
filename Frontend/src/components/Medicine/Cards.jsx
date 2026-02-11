import React from "react";

const dealers = [
  { name: "Mr. Joe Doe", role: "First Aid Dealer", bgColor: "bg-surface", textColor: "text-primary", imgSrc: "/path-to-image-1.jpg" },
  { name: "Mr. Weekend", role: "Medicine Dealer", bgColor: "bg-primary/20", textColor: "text-white", imgSrc: "/path-to-image-2.jpg" },
  { name: "Mr. Dua Lipa", role: "Syrum Specialist", bgColor: "bg-black", textColor: "text-white", imgSrc: "/path-to-image-3.jpg" },
  { name: "Mr. Krish", role: "Testing Labs", bgColor: "bg-surface", textColor: "text-primary", imgSrc: "/path-to-image-4.jpg" },
  { name: "Mrs. Neelam", role: "Nursing", bgColor: "bg-primary/20", textColor: "text-white", imgSrc: "/path-to-image-5.jpg" },
  { name: "Mrs. Gunjan", role: "Medicine Dealer", bgColor: "bg-black", textColor: "text-white", imgSrc: "/path-to-image-6.jpg" }
];

const Cards = () => {
  return (
    <div className="flex flex-col items-center py-12 px-4 sm:px-6 md:px-8">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Medicine..."
        className="w-full max-w-lg p-3.5 border border-white/[0.06] rounded-xl bg-white/[0.03] text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder-gray-500 transition-all"
        aria-label="Search medicine"
      />

      {/* Dealers Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
        {dealers.map((dealer, index) => (
          <div key={index} className="glass-card flex p-6 flex-row items-center h-44 hover:border-white/10 transition-all duration-300 group cursor-pointer">
            <div className="flex flex-col flex-1">
              <h3 className="text-sm font-semibold text-white">{dealer.name}</h3>
              <p className="text-gray-400 text-xs mt-1">{dealer.role}</p>
              <div className="flex items-center mt-4 gap-2 cursor-pointer">
                <p className="text-gray-500 text-xs group-hover:text-primary transition-colors">Learn more</p>
                <div className="w-6 h-6 bg-white/[0.04] border border-white/[0.06] rounded-full flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/10 transition-all">
                  <span className="text-gray-400 text-xs group-hover:text-primary transition-colors">{">"}</span>
                </div>
              </div>
            </div>
            <div className="w-28 h-28 rounded-xl bg-white/[0.03] border border-white/[0.06] ml-4 overflow-hidden">
              <img src={dealer.imgSrc} alt={dealer.role} className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
