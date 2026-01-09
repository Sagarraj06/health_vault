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
    <div className="flex flex-col items-center p-6 bg-dark">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Medicine !"
        className="w-full max-w-lg p-3 border border-white/20 rounded-md shadow-sm bg-surface text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
      />

      {/* Dealers Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {dealers.map((dealer, index) => (
          <div key={index} className={`flex p-8 ${dealer.bgColor} rounded-xl shadow-md flex-row items-center h-52 border border-white/10 transition-transform hover:scale-105`}>
            <div className="flex flex-col flex-1">
              <h2 className={`text-lg font-bold ${dealer.textColor}`}>{dealer.name}</h2>
              <p className="text-gray-300 font-semibold">{dealer.role}</p>
              <div className="flex items-center mt-4 space-x-2 cursor-pointer group">
                <p className="text-gray-400 group-hover:text-primary transition-colors">Learn more</p>
                <div className="w-8 h-8 bg-black border border-white/20 rounded-full flex items-center justify-center group-hover:border-primary transition-colors">
                  <span className="text-white text-lg">→</span>
                </div>
              </div>
            </div>
            <img src={dealer.imgSrc} alt={dealer.role} className="w-32 h-32 object-cover rounded-lg ml-4 bg-gray-800" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;