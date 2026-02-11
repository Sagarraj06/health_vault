'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../axios.config';
import { useNavigate } from "react-router-dom";

const HealthRecordForm = () => {
  const [formData, setFormData] = useState({
    doctorId: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    date: '',
    isManualUpload: false,
    externalDoctorName: '',
    externalHospitalName: '',
  });
  const [doctorList, setDoctorList] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Set default date to today's date when component mounts
  useEffect(() => {
    if (!formData.date) {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: today }));
    }
  }, [formData.date]);

  // Fetch doctors list on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/user/doctors");
        if (response.status === 200) {
          // Assuming response.data is an array of doctors with _id, name and specialization properties
          setDoctorList(response.data);
        } else {
          setMessage("Failed to load doctors list.");
        }
      } catch (error) {
        setMessage("Error fetching doctors list.");
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setAttachments(files);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const submissionData = new FormData();
    submissionData.append('doctorId', formData.doctorId);
    submissionData.append('diagnosis', formData.diagnosis);
    submissionData.append('treatment', formData.treatment);
    submissionData.append('prescription', formData.prescription);
    submissionData.append('date', formData.date);
    submissionData.append('isManualUpload', formData.isManualUpload.toString());

    if (formData.isManualUpload) {
      submissionData.append('externalDoctorName', formData.externalDoctorName);
      submissionData.append('externalHospitalName', formData.externalHospitalName);
    }

    if (formData.doctorId === "" && !formData.isManualUpload) {
      setMessage("Doctor ID is required.");
      return;
    }

    if (attachments.length > 0) {
      for (let i = 0; i < attachments.length; i++) {
        submissionData.append('attachments', attachments[i]);
      }
    }

    try {
      const response = await api.post(
        "/health-record/create",
        submissionData,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("✅ Navigation Triggered");
        navigate("/profile");
      }
      setAttachments([]);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-12">
      <div className="glass-card p-6 sm:p-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-center mb-8 text-white">
          Health Record Form
        </h1>
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center ${message.includes('Success') ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          {/* Doctor Selection */}
          <div>
            <label htmlFor="doctorId" className="block text-gray-300 font-medium mb-2">
              Select Doctor
            </label>
            <select
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-white/[0.06] rounded-xl bg-white/[0.03] text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
              required={!formData.isManualUpload}
            >
              <option value="" className="bg-dark">-- Select a doctor --</option>
              {doctorList.map((doctor) => (
                <option key={doctor.id} value={doctor.id} className="bg-dark">
                  {doctor.name} {doctor.specialization ? `- ${doctor.specialization}` : ""}
                </option>
              ))}
            </select>
          </div>
          {/* Diagnosis */}
          <div>
            <label htmlFor="diagnosis" className="block text-gray-300 font-medium mb-2">
              Diagnosis <span className="text-red-500">*</span>
            </label>
            <textarea
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
              placeholder="Enter diagnosis details"
              rows="3"
              className="w-full px-4 py-3 border border-white/[0.06] rounded-xl bg-white/[0.03] text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
            ></textarea>
          </div>
          {/* Treatment */}
          <div>
            <label htmlFor="treatment" className="block text-gray-300 font-medium mb-2">
              Treatment
            </label>
            <textarea
              id="treatment"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              placeholder="Enter treatment details"
              rows="3"
              className="w-full px-4 py-3 border border-white/[0.06] rounded-xl bg-white/[0.03] text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
            ></textarea>
          </div>
          {/* Prescription */}
          <div>
            <label htmlFor="prescription" className="block text-gray-300 font-medium mb-2">
              Prescription
            </label>
            <textarea
              id="prescription"
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              placeholder="Enter prescription details"
              rows="3"
              className="w-full px-4 py-3 border border-white/[0.06] rounded-xl bg-white/[0.03] text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
            ></textarea>
          </div>
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-gray-300 font-medium mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-white/[0.06] rounded-xl bg-white/[0.03] text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
          {/* Manual Upload Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isManualUpload"
              name="isManualUpload"
              checked={formData.isManualUpload}
              onChange={handleChange}
              className="h-5 w-5 text-primary focus:ring-primary border-white/20 rounded bg-surface/50"
            />
            <label htmlFor="isManualUpload" className="ml-2 block text-gray-300 font-medium">
              Manual Upload?
            </label>
          </div>
          {/* External Fields for Manual Upload */}
          {formData.isManualUpload && (
            <div className="space-y-5 p-4 border border-white/10 rounded-lg bg-white/5">
              <div>
                <label htmlFor="externalDoctorName" className="block text-gray-300 font-medium mb-2">
                  External Doctor Name
                </label>
                <input
                  type="text"
                  id="externalDoctorName"
                  name="externalDoctorName"
                  value={formData.externalDoctorName}
                  onChange={handleChange}
                  required={formData.isManualUpload}
                  placeholder="Enter external doctor's name"
                  className="w-full px-4 py-3 border border-white/[0.06] rounded-xl bg-white/[0.03] text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
              <div>
                <label htmlFor="externalHospitalName" className="block text-gray-300 font-medium mb-2">
                  External Hospital/Clinic Name
                </label>
                <input
                  type="text"
                  id="externalHospitalName"
                  name="externalHospitalName"
                  value={formData.externalHospitalName}
                  onChange={handleChange}
                  required={formData.isManualUpload}
                  placeholder="Enter external hospital/clinic name"
                  className="w-full px-4 py-3 border border-white/[0.06] rounded-xl bg-white/[0.03] text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
            </div>
          )}
          {/* Attachments */}
          <div>
            <label htmlFor="attachments" className="block text-gray-300 font-medium mb-2">
              Attachments
            </label>
            <input
              type="file"
              id="attachments"
              name="attachments"
              onChange={handleChange}
              multiple
              className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 btn-animated bg-primary text-white font-medium rounded-xl text-sm"
          >
            Submit Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default HealthRecordForm;
