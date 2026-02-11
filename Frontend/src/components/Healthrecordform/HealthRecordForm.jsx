import React, { useState, useEffect } from 'react';
import { api } from '../../axios.config';
import { useNavigate } from "react-router-dom";

const HealthRecordForm = () => {
  const [formData, setFormData] = useState({ doctorId: '', diagnosis: '', treatment: '', prescription: '', date: '', isManualUpload: false, externalDoctorName: '', externalHospitalName: '' });
  const [doctorList, setDoctorList] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => { if (!formData.date) { const today = new Date().toISOString().split('T')[0]; setFormData(prev => ({ ...prev, date: today })); } }, [formData.date]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try { const response = await api.get("/user/doctors"); if (response.status === 200) setDoctorList(response.data); else setMessage("Failed to load doctors list."); }
      catch { setMessage("Error fetching doctors list."); }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') setFormData(prev => ({ ...prev, [name]: checked }));
    else if (type === 'file') setAttachments(files);
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage('');
    const submissionData = new FormData();
    submissionData.append('doctorId', formData.doctorId); submissionData.append('diagnosis', formData.diagnosis);
    submissionData.append('treatment', formData.treatment); submissionData.append('prescription', formData.prescription);
    submissionData.append('date', formData.date); submissionData.append('isManualUpload', formData.isManualUpload.toString());
    if (formData.isManualUpload) { submissionData.append('externalDoctorName', formData.externalDoctorName); submissionData.append('externalHospitalName', formData.externalHospitalName); }
    if (formData.doctorId === "" && !formData.isManualUpload) { setMessage("Doctor ID is required."); return; }
    if (attachments.length > 0) for (let i = 0; i < attachments.length; i++) submissionData.append('attachments', attachments[i]);
    try {
      const response = await api.post("/health-record/create", submissionData, { withCredentials: true });
      if (response.status === 200 || response.status === 201) navigate("/profile");
      setAttachments([]);
    } catch (error) { setMessage(error.response?.data?.message || error.message); }
  };

  const inputClasses = "w-full px-4 py-3 border border-border rounded-xl bg-surface text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-12">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 animate-fade-in shadow-sm">
        <h1 className="text-3xl font-bold text-center mb-8 text-text font-heading">Health Record Form</h1>
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-center text-sm ${message.includes('Success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{message}</div>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
          <div>
            <label htmlFor="doctorId" className="block text-text font-medium mb-2 text-sm">Select Doctor</label>
            <select id="doctorId" name="doctorId" value={formData.doctorId} onChange={handleChange} className={inputClasses} required={!formData.isManualUpload}>
              <option value="">-- Select a doctor --</option>
              {doctorList.map((doctor) => (<option key={doctor.id} value={doctor.id}>{doctor.name} {doctor.specialization ? `- ${doctor.specialization}` : ""}</option>))}
            </select>
          </div>
          {[{ id: "diagnosis", label: "Diagnosis", required: true, placeholder: "Enter diagnosis details" },
            { id: "treatment", label: "Treatment", required: false, placeholder: "Enter treatment details" },
            { id: "prescription", label: "Prescription", required: false, placeholder: "Enter prescription details" }].map(f => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block text-text font-medium mb-2 text-sm">{f.label} {f.required && <span className="text-red-500">*</span>}</label>
              <textarea id={f.id} name={f.id} value={formData[f.id]} onChange={handleChange} required={f.required} placeholder={f.placeholder} rows="3" className={inputClasses}></textarea>
            </div>
          ))}
          <div>
            <label htmlFor="date" className="block text-text font-medium mb-2 text-sm">Date</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={inputClasses} />
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="isManualUpload" name="isManualUpload" checked={formData.isManualUpload} onChange={handleChange} className="h-5 w-5 text-primary focus:ring-primary/20 border-border rounded" />
            <label htmlFor="isManualUpload" className="ml-2 block text-text font-medium text-sm">Manual Upload?</label>
          </div>
          {formData.isManualUpload && (
            <div className="space-y-5 p-4 border border-border rounded-xl bg-surface-alt">
              {[{ id: "externalDoctorName", label: "External Doctor Name", placeholder: "Enter external doctor's name" },
                { id: "externalHospitalName", label: "External Hospital/Clinic Name", placeholder: "Enter external hospital/clinic name" }].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-text font-medium mb-2 text-sm">{f.label}</label>
                  <input type="text" id={f.id} name={f.id} value={formData[f.id]} onChange={handleChange} required={formData.isManualUpload} placeholder={f.placeholder} className={inputClasses} />
                </div>
              ))}
            </div>
          )}
          <div>
            <label htmlFor="attachments" className="block text-text font-medium mb-2 text-sm">Attachments</label>
            <input type="file" id="attachments" name="attachments" onChange={handleChange} multiple className="w-full text-text-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all" />
          </div>
          <button type="submit" className="w-full py-3 px-6 btn-animated bg-primary text-white font-semibold rounded-xl shadow-sm hover:bg-primary-dark transition-colors">Submit Record</button>
        </form>
      </div>
    </div>
  );
};

export default HealthRecordForm;
