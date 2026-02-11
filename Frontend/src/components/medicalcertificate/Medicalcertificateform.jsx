// FRONTEND - React Components with Tailwind CSS

// File: client/src/components/MedicalCertificateForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const MedicalCertificateForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: 'male',
    patientAddress: '',
    diagnosis: '',
    recommendedRestDays: '',
    doctorName: '',
    doctorSpecialization: '',
    hospitalName: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/generate-certificate', formData);
      setCertificate(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error generating certificate. Please try again.');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([certificate.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `medical_certificate_${formData.patientName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pt-24">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Medical Certificate Generator</h2>
      
      {!certificate ? (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl shadow-md overflow-hidden border border-white/10">
          <div className="p-6 space-y-6">
            {/* Patient Information */}
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-white/20 rounded-xl bg-surface text-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-gray-500"
                  />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
                  <input
                    type="number"
                    name="patientAge"
                    value={formData.patientAge}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full p-2 border border-white/20 rounded-xl bg-surface text-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-gray-500"
                  />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                  <select
                    name="patientGender"
                    value={formData.patientGender}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-white/20 rounded-xl bg-surface text-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-gray-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                  <textarea
                    name="patientAddress"
                    value={formData.patientAddress}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-white/20 rounded-xl bg-surface text-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-gray-500 h-20"
                  />
                </div>
              </div>
            </div>
            
            {/* Medical Information */}
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Diagnosis</label>
                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-white/20 rounded-xl bg-surface text-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-gray-500 h-28"
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Recommended Rest (days)</label>
                  <input
                    type="number"
                    name="recommendedRestDays"
                    value={formData.recommendedRestDays}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full p-2 border border-white/20 rounded-xl bg-surface text-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Doctor Information */}
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4">Doctor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-white/20 rounded-xl bg-surface text-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-gray-500"
                  />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Specialization</label>
                  <input
                    type="text"
                    name="doctorSpecialization"
                    value={formData.doctorSpecialization}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-white/20 rounded-xl bg-surface text-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-gray-500"
                  />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Hospital/Clinic Name</label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-white/20 rounded-xl bg-surface text-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-gray-500"
                  />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-white/20 rounded-xl bg-surface text-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/[0.02] px-6 py-4 text-right border-t border-white/[0.06]">
            <button 
              type="submit" 
              className={`px-6 py-3 rounded-xl text-white font-medium focus:outline-none transition-all ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary/80 shadow-lg shadow-primary/20'
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : 'Generate Certificate'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 mt-4 rounded-xl">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </form>
      ) : (
        <div className="glass-card rounded-2xl shadow-md overflow-hidden border border-white/10">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Medical Certificate</h3>
            <div className="bg-white p-4 rounded-xl border border-white/20 font-mono text-sm whitespace-pre-wrap h-96 overflow-y-auto mb-6 text-gray-900">
              {certificate.content}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                onClick={handleDownload} 
                className="flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/80 text-white font-medium rounded-xl transition-colors shadow-lg shadow-primary/20"
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Certificate
              </button>
              <button 
                onClick={() => setCertificate(null)} 
                className="px-6 py-3 bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 font-medium rounded-xl border border-white/[0.06] transition-colors"
              >
                Create Another Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalCertificateForm;
