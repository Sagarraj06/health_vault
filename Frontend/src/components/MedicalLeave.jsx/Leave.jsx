import React, { useEffect, useState } from "react";
import { api } from "../../axios.config.js";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../alert-system.js";

const Leave = () => {
  const [formData, setFormData] = useState({ fromDate: "", toDate: "", reason: "", healthRecordId: "", supportingDocuments: null });
  const [healthRecords, setHealthRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try { const response = await api.get("/health-record"); setHealthRecords(response.data); }
      catch (error) { console.error("Error fetching health records:", error); }
    };
    fetchHealthRecords();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => { if (key !== "supportingDocuments") formDataToSend.append(key, formData[key]); });
      if (formData.supportingDocuments) Array.from(formData.supportingDocuments).forEach((file) => formDataToSend.append("supportingDocuments", file));
      const response = await api.post("/leave/apply", formDataToSend, { headers: { "Content-Type": "multipart/form-data" } });
      if (response.status === 200 || response.status === 201) { showAlert("Leave application submitted successfully."); navigate("/profile"); }
    } catch (error) { console.error("Error submitting form:", error); }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-4 md:p-8">
      <h2 className="text-3xl md:text-4xl font-bold text-text mb-4 text-center font-heading">Medical Leave Form</h2>
      <p className="text-text-light text-lg mb-6 text-center">Apply for medical leave with ease!</p>
      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-10 w-full max-w-lg md:max-w-4xl flex flex-col gap-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <p className="text-red-500 font-semibold text-sm">* indicates required fields</p>
          {[{ label: "From Date", name: "fromDate", type: "date" }, { label: "To Date", name: "toDate", type: "date" }].map(f => (
            <div key={f.name}>
              <label className="block text-text font-medium mb-1">{f.label} <span className="text-red-500">*</span></label>
              <input type={f.type} name={f.name} className="w-full border border-border rounded-xl p-3 text-text bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" onChange={handleChange} required />
            </div>
          ))}
          <div>
            <label className="block text-text font-medium mb-1">Reason for Leave <span className="text-red-500">*</span></label>
            <textarea name="reason" placeholder="Reason for leave" className="w-full border border-border rounded-xl p-3 text-text bg-surface h-24 md:h-32 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-muted" onChange={handleChange} required></textarea>
          </div>
          <div>
            <label className="block text-text font-medium mb-1">Health Record <span className="text-red-500">*</span></label>
            <select name="healthRecordId" className="w-full border border-border rounded-xl p-3 text-text bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" onChange={handleChange} value={formData.healthRecordId} required>
              <option value="">Select Health Record</option>
              {healthRecords.map((record) => (
                <option key={record.id} value={record.id}>{record.diagnosis} - {new Date(record.created_at || record.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(",", "")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-text font-medium mb-1">Supporting Documents (if any)</label>
            <input type="file" name="supportingDocuments" multiple className="w-full border border-border rounded-xl p-3 text-text-light bg-surface focus:outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20" onChange={(e) => setFormData({ ...formData, supportingDocuments: e.target.files })} />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Leave;
