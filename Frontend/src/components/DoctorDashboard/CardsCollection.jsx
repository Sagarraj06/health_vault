import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

const Card = ({ id, name, message }) => {
  return (
    <div className="glass-card p-5 flex items-start gap-4 hover:border-white/10 transition-all duration-300">
      {/* ID Badge */}
      <div className="shrink-0">
        <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-xl">
          <span className="font-mono text-sm font-bold">{id.padStart(2, '0')}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white text-sm mb-1">{name}</h3>
        <p className="text-gray-400 mb-4 text-xs leading-relaxed">{message}</p>

        {/* Buttons */}
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors text-xs font-medium">
            <Check size={14} /> Accept
          </button>
          <button className="flex items-center gap-1.5 bg-red-500/10 text-red-400 px-4 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors text-xs font-medium">
            <X size={14} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
};

const CardsCollection = () => {
  const cardsData = [
    {
      id: "1",
      name: "Mr. Vaibhav Mandloi",
      message: "Feeling extremely unwell with continuous vomiting and loose motions. My body feels weak, and there's a constant sense of discomfort and uneasiness. Hoping to recover soon."
    },
    {
      id: "2",
      name: "Mr. Rahul Sharma",
      message: "Experiencing severe headache and fever since yesterday. Having difficulty concentrating and maintaining balance. Need immediate medical attention."
    },
    {
      id: "3",
      name: "Mrs. Priya Patel",
      message: "Suffering from acute back pain and muscle stiffness. Unable to perform daily activities. Requesting consultation for proper diagnosis and treatment."
    },
    {
      id: "4",
      name: "Dr. Amit Kumar",
      message: "Patient reporting chest pain and shortness of breath. Vital signs show elevated blood pressure. Recommending immediate cardiovascular assessment."
    },
    {
      id: "5",
      name: "Ms. Sneha Gupta",
      message: "Dealing with persistent cough and throat infection. Experiencing difficulty in swallowing and speaking. Seeking medical advice and prescription."
    }
  ];

  return (
    <section className="px-4 sm:px-6 md:px-12 lg:px-24 py-12 bg-dark">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-white">Patient Requests</h2>
        </div>
        <div className="flex flex-col gap-3">
          {cardsData.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              name={card.name}
              message={card.message}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardsCollection;
