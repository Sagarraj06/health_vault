'use client';

// Certificates.js
import React, { useState } from 'react';
import { api } from '../../axios.config';

const Certificates = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    diagnosis: '',
    details: ''
  });
  const [certificate, setCertificate] = useState('');
  const [error, setError] = useState('');

  // Handle changes to the input fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit form data to generate a certificate
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Post the form data to the Express backend
      const res = await api.post('/generate', formData);
      setCertificate(res.data.certificate);
    } catch (err) {
      console.error(err);
      setError('Error generating certificate.');
    }
  };

  // Download the generated certificate as a PDF
  const handleDownload = async () => {
    try {
      // Request the PDF from the backend (certificate is sent in the body)
      const response = await api.post('/download',
        { certificate },
        { responseType: 'blob' } // important for binary data
      );
      // Create a blob URL for the PDF file and trigger the download
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'medical_certificate.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      setError('Error downloading certificate.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">Medical Certificate Generator</h1>
      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl border border-white/10 space-y-5">
        <div>
          <label htmlFor="name" className="block text-gray-300 font-medium mb-2 text-sm">Patient Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-white/[0.06] rounded-xl bg-white/[0.03] text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-gray-300 font-medium mb-2 text-sm">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-white/[0.06] rounded-xl bg-white/[0.03] text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
        <div>
          <label htmlFor="diagnosis" className="block text-gray-300 font-medium mb-2 text-sm">Diagnosis</label>
          <input
            type="text"
            id="diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-white/[0.06] rounded-xl bg-white/[0.03] text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
        <div>
          <label htmlFor="details" className="block text-gray-300 font-medium mb-2 text-sm">Additional Details</label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border border-white/[0.06] rounded-xl bg-white/[0.03] text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
          ></textarea>
        </div>
        <button type="submit" className="w-full py-3 px-6 bg-primary text-white font-medium rounded-xl text-sm hover:bg-primary/80 transition-colors shadow-lg shadow-primary/20">
          Generate Certificate
        </button>
      </form>

      {error && <p className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">{error}</p>}

      {certificate && (
        <div className="glass-card p-6 rounded-2xl border border-white/10 mt-6">
          <h2 className="text-lg font-semibold text-white mb-4">Generated Certificate</h2>
          <pre className="bg-white p-4 rounded-xl border border-white/20 font-mono text-sm whitespace-pre-wrap text-gray-900 max-h-96 overflow-y-auto mb-4">
            {certificate}
          </pre>
          <button onClick={handleDownload} className="w-full py-3 px-6 bg-primary text-white font-medium rounded-xl text-sm hover:bg-primary/80 transition-colors shadow-lg shadow-primary/20">
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default Certificates;
