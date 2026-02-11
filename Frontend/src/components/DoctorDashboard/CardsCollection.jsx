import React from 'react';

const Card = ({ id, name, message }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 max-w-2xl mb-4 hover:shadow-md transition-shadow">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-xl">
          <span className="font-mono text-lg font-semibold">{id.padStart(2, '0')}</span>
        </div>
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-lg text-text mb-2">{name}</h3>
        <p className="text-text-light mb-4 text-sm leading-relaxed">{message}</p>
        <div className="flex gap-2">
          <button className="bg-primary text-white px-5 py-1.5 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
            Accept
          </button>
          <button className="bg-surface-alt text-text-light border border-border px-5 py-1.5 rounded-lg hover:bg-border transition-colors text-sm font-medium">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

const CardsCollection = () => {
  const cardsData = [
    { id: "1", name: "Mr.Vaibhav Mandloi", message: "Feeling extremely unwell with continuous vomiting and loose motions. My body feels weak, and there's a constant sense of discomfort and uneasiness. Hoping to recover soon." },
    { id: "2", name: "Mr.Rahul Sharma", message: "Experiencing severe headache and fever since yesterday. Having difficulty concentrating and maintaining balance. Need immediate medical attention." },
    { id: "3", name: "Mrs.Priya Patel", message: "Suffering from acute back pain and muscle stiffness. Unable to perform daily activities. Requesting consultation for proper diagnosis and treatment." },
    { id: "4", name: "Dr.Amit Kumar", message: "Patient reporting chest pain and shortness of breath. Vital signs show elevated blood pressure. Recommending immediate cardiovascular assessment." },
    { id: "5", name: "Ms.Sneha Gupta", message: "Dealing with persistent cough and throat infection. Experiencing difficulty in swallowing and speaking. Seeking medical advice and prescription." }
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center">
        {cardsData.map((card) => (
          <Card key={card.id} id={card.id} name={card.name} message={card.message} />
        ))}
      </div>
    </div>
  );
};

export default CardsCollection;
