'use client';

import React, { useEffect, useState } from "react";
import { api } from "../../axios.config.js";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../alert-system.js";

const Leave = () => {
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    reason: "",
    healthRecordId: "",
    supportingDocuments: null,
  });
  const [healthRecords, setHealthRecords] = useState([]);
  const navigate = useNavigate(); // Declare the navigate variable

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await api.get("/health-record"); // Corrected endpoint
        setHealthRecords(response.data);
      } catch (error) {
        console.error("Error fetching health records:", error);
      }
    };
    fetchHealthRecords();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    try {
      const formDataToSend = new FormData();

      // Append non-file data
      Object.keys(formData).forEach((key) => {
        if (key !== "supportingDocuments") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // ✅ Append multiple files
      if (formData.supportingDocuments) {
        Array.from(formData.supportingDocuments).forEach((file) => {
          formDataToSend.append("supportingDocuments", file);
        });
      }

      const response = await api.post("/leave/apply", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200 || response.status === 201) {
        showAlert("Leave application submitted successfully.");
        navigate("/profile");
      }

      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark p-4 md:p-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 text-center text-balance">
        Medical Leave Form
      </h2>
      <p className="text-gray-400 text-base sm:text-lg mb-6 text-center max-w-xl leading-relaxed">
        Apply for medical leave with ease. Fill in the details below.
      </p>
      <div className="glass-card p-6 md:p-10 w-full max-w-2xl border border-white/[0.06]">
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <p className="text-red-400/70 text-xs">* indicates required fields</p>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              From Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="fromDate"
              className="w-full border border-white/[0.06] rounded-xl p-3 text-white bg-white/[0.03] text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              To Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="toDate"
              className="w-full border border-white/[0.06] rounded-xl p-3 text-white bg-white/[0.03] text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              Reason for Leave <span className="text-red-400">*</span>
            </label>
            <textarea
              name="reason"
              placeholder="Describe the reason for your leave"
              className="w-full border border-white/[0.06] rounded-xl p-3 text-white bg-white/[0.03] text-sm h-28 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder-gray-500 transition-all resize-none"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              Health Record <span className="text-red-400">*</span>
            </label>
            <select
              name="healthRecordId"
              className="w-full border border-white/[0.06] rounded-xl p-3 text-white bg-white/[0.03] text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              onChange={handleChange}
              value={formData.healthRecordId}
              required
            >
              <option value="" className="bg-dark">Select Health Record</option>
              {healthRecords.map((record) => (
                <option key={record.id} value={record.id} className="bg-dark">
                  {record.diagnosis} -{" "}
                  {new Date(record.created_at || record.date)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(",", "")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              Supporting Documents (optional)
            </label>
            <input
              type="file"
              name="supportingDocuments"
              multiple
              className="w-full border border-white/[0.06] rounded-xl p-3 text-gray-300 bg-white/[0.03] text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-primary/10 file:text-primary"
              onChange={(e) =>
                setFormData({ ...formData, supportingDocuments: e.target.files })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl text-sm font-medium hover:bg-primary/80 transition-all btn-animated mt-2"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default Leave;
