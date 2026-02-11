'use client';

import React, { useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState({
    gender: "male",
    age: "",
    contact: "",
    medication: "",
    allergies: "",
    history: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch("https://your-backend-api.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark p-4 md:p-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 text-center text-balance">Patient Form</h2>
      <p className="text-gray-400 text-base sm:text-lg mb-6 text-center max-w-xl leading-relaxed">
        Let us know your allergies and medical history so we can provide you the best possible care.
      </p>
      <div className="glass-card p-6 md:p-10 w-full max-w-2xl border border-white/[0.06]">
        <div className="flex items-center gap-6 mb-6 text-sm">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
              className="accent-primary w-4 h-4"
            />
            Male
          </label>
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
              className="accent-primary w-4 h-4"
            />
            Female
          </label>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input type="text" name="age" placeholder="Age" className="w-full border border-white/[0.06] rounded-xl p-3 text-white bg-white/[0.03] text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder-gray-500 transition-all" onChange={handleChange} />
          <input type="text" name="contact" placeholder="Contact Number" className="w-full border border-white/[0.06] rounded-xl p-3 text-white bg-white/[0.03] text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder-gray-500 transition-all" onChange={handleChange} />
          <input type="text" name="medication" placeholder="Current Medication" className="w-full border border-white/[0.06] rounded-xl p-3 text-white bg-white/[0.03] text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder-gray-500 transition-all" onChange={handleChange} />
          <input type="text" name="allergies" placeholder="Known Allergies" className="w-full border border-white/[0.06] rounded-xl p-3 text-white bg-white/[0.03] text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder-gray-500 transition-all" onChange={handleChange} />
          <textarea name="history" placeholder="Medical History" className="w-full border border-white/[0.06] rounded-xl p-3 text-white bg-white/[0.03] text-sm h-28 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder-gray-500 transition-all resize-none" onChange={handleChange} />
          
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl text-sm font-medium hover:bg-primary/80 transition-all btn-animated mt-2">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Form;
