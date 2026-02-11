import React, { useState, useEffect } from "react";
import { FileText, CheckCircle, Plus, RefreshCw } from "lucide-react";
import jsPDF from "jspdf";
import { api } from "../../axios.config.js";

const PrescriptionGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [generatedPrescription, setGeneratedPrescription] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [formData, setFormData] = useState({
    doctorName: "", patientName: "", issueDate: new Date().toISOString().split("T")[0], diseaseName: "",
    medications: [{ medicineName: "", dose: "", frequency: "", duration: "" }],
  });

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try { const response = await api.get("/doctor/appointment?status=confirmed"); setAppointments(response.data); }
    catch (error) { console.error("Error fetching appointments:", error); }
    finally { setLoadingAppointments(false); }
  };

  const handleAppointmentSelect = (e) => {
    const appointmentId = e.target.value;
    setSelectedAppointment(appointmentId);
    if (appointmentId) {
      const selected = appointments.find((app) => app._id === appointmentId);
      if (selected) setFormData({ ...formData, doctorName: selected.doctorName || selected.doctorId?.name || "", patientName: selected.studentId?.name || "" });
    }
  };

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData({ ...formData, [name]: value }); };
  const handleMedicationChange = (index, field, value) => { const updated = [...formData.medications]; updated[index][field] = value; setFormData({ ...formData, medications: updated }); };
  const addMedication = () => { setFormData({ ...formData, medications: [...formData.medications, { medicineName: "", dose: "", frequency: "", duration: "" }] }); };
  const removeMedication = (index) => { const updated = [...formData.medications]; updated.splice(index, 1); setFormData({ ...formData, medications: updated }); };

  const generatePrescription = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const sampleResponse = `MEDICAL PRESCRIPTION\n\nDr. ${formData.doctorName}\n\nPatient: ${formData.patientName}\nDate: ${formData.issueDate}\n\nDiagnosis: ${formData.diseaseName}\n\nRx:\n${formData.medications.map((med, idx) => `${idx + 1}. ${med.medicineName} - ${med.dose}\n   Take ${med.frequency} for ${med.duration}`).join("\n")}\n\nInstructions:\n- Take medications as prescribed\n- Complete the full course of treatment\n- Store in a cool, dry place away from children\n\nFollow-up in 7 days if symptoms persist.\n\nHealthVault Verified`;
      setGeneratedPrescription(sampleResponse);
      setIsLoading(false);
    }, 1500);
  };

  const uploadPDFAndSendToBackend = async () => {
    if (!selectedAppointment) { alert("Please select an appointment first."); return; }
    const doc = new jsPDF();
    doc.setFillColor(13, 148, 136); doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor(255, 255, 255); doc.setFontSize(16); doc.text("HealthVault Medical Prescription", 105, 14, { align: "center" });
    doc.setTextColor(0, 0, 0); doc.setFontSize(12);
    const lines = generatedPrescription.split("\n"); let y = 30;
    lines.forEach((line) => { if (line.trim() === "") return; doc.text(line, 15, y); y += 7; });
    const pdfBlob = doc.output("blob");
    const formDataPayload = new FormData();
    formDataPayload.append("file", pdfBlob, "prescription.pdf");
    formDataPayload.append("appointmentId", selectedAppointment);
    try { setIsLoading(true); await api.patch("/doctor/prescription", formDataPayload, { headers: { "Content-Type": "multipart/form-data" } }); alert("Prescription uploaded successfully!"); }
    catch (error) { console.error("Error uploading prescription:", error); alert("Failed to upload prescription."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface p-4 text-text">
      <div className="max-w-4xl mx-auto">
        <div className="bg-primary text-white p-5 rounded-t-2xl shadow-sm">
          <h1 className="text-2xl font-bold text-center font-heading">HealthVault Prescription Generator</h1>
        </div>
        <div className="bg-card border border-border border-t-0 rounded-b-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-alt p-5 rounded-2xl border border-border">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-base font-semibold text-text">Select Appointment</h2>
                  <button onClick={fetchAppointments} disabled={loadingAppointments} className="text-primary hover:text-primary-dark flex items-center text-sm transition-colors font-medium">
                    <RefreshCw className={`w-3 h-3 mr-1 ${loadingAppointments ? "animate-spin" : ""}`} /> Refresh
                  </button>
                </div>
                <select value={selectedAppointment} onChange={handleAppointmentSelect} className="block w-full rounded-xl border border-border bg-card text-text shadow-sm focus:ring-2 focus:ring-primary/20 p-2.5 text-sm" disabled={loadingAppointments}>
                  <option value="">-- Select an appointment --</option>
                  {appointments.map((app) => (
                    <option key={app._id} value={app._id}>{app.studentId?.name} - {new Date(app.slotDateTime).toLocaleDateString()} {new Date(app.slotDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</option>
                  ))}
                </select>
              </div>
              <h2 className="text-base font-semibold text-text mb-4">Prescription Details</h2>
              <div className="space-y-4">
                {[{ label: "Doctor's Name", name: "doctorName", placeholder: "Dr. Name" }, { label: "Patient's Name", name: "patientName", placeholder: "Patient Name" }].map(f => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-text-light">{f.label}</label>
                    <input type="text" name={f.name} value={formData[f.name]} onChange={handleInputChange} className="mt-1 block w-full rounded-xl border border-border bg-card text-text shadow-sm focus:ring-2 focus:ring-primary/20 p-2.5 text-sm placeholder-muted" placeholder={f.placeholder} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-text-light">Issue Date</label>
                  <input type="date" name="issueDate" value={formData.issueDate} onChange={handleInputChange} className="mt-1 block w-full rounded-xl border border-border bg-card text-text shadow-sm focus:ring-2 focus:ring-primary/20 p-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light">Disease/Condition</label>
                  <input type="text" name="diseaseName" value={formData.diseaseName} onChange={handleInputChange} className="mt-1 block w-full rounded-xl border border-border bg-card text-text shadow-sm focus:ring-2 focus:ring-primary/20 p-2.5 text-sm placeholder-muted" placeholder="Disease or condition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Medications</label>
                  {formData.medications.map((med, index) => (
                    <div key={index} className="p-3 bg-card rounded-xl mb-3 border border-border">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {[{ label: "Medicine Name", field: "medicineName", placeholder: "Medicine name" }, { label: "Dosage", field: "dose", placeholder: "e.g. 500mg" }].map(f => (
                          <div key={f.field}>
                            <label className="block text-xs text-muted">{f.label}</label>
                            <input type="text" value={med[f.field]} onChange={(e) => handleMedicationChange(index, f.field, e.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-surface text-text text-sm p-2 placeholder-muted" placeholder={f.placeholder} />
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[{ label: "Frequency", field: "frequency", placeholder: "e.g. twice daily" }, { label: "Duration", field: "duration", placeholder: "e.g. 7 days" }].map(f => (
                          <div key={f.field}>
                            <label className="block text-xs text-muted">{f.label}</label>
                            <input type="text" value={med[f.field]} onChange={(e) => handleMedicationChange(index, f.field, e.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-surface text-text text-sm p-2 placeholder-muted" placeholder={f.placeholder} />
                          </div>
                        ))}
                      </div>
                      {formData.medications.length > 1 && <button type="button" onClick={() => removeMedication(index)} className="mt-2 text-xs text-red-500 hover:text-red-600 font-medium transition-colors">Remove</button>}
                    </div>
                  ))}
                  <button type="button" onClick={addMedication} className="text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg text-sm flex items-center transition-colors w-full justify-center font-medium">
                    <Plus className="w-3 h-3 mr-1" /> Add Medication
                  </button>
                </div>
                <button type="button" onClick={generatePrescription} disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center transition-colors text-sm">
                  {isLoading ? (<><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</>) : (<><CheckCircle className="w-4 h-4 mr-2" />Generate Prescription</>)}
                </button>
              </div>
            </div>
            <div className="bg-surface-alt p-5 border border-border rounded-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-base font-semibold text-text">Prescription Preview</h2>
                {generatedPrescription && (
                  <button onClick={uploadPDFAndSendToBackend} className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg text-sm flex items-center mt-2 sm:mt-0 transition-colors font-medium">
                    <FileText className="w-4 h-4 mr-1" /> Upload & Save
                  </button>
                )}
              </div>
              {generatedPrescription ? (
                <div className="whitespace-pre-line font-mono text-sm border-l-4 border-primary pl-4 text-text-light bg-card p-4 rounded-r-xl">{generatedPrescription}</div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted">
                  <FileText className="w-12 h-12 mb-2 opacity-30" />
                  <p className="text-sm">Fill in the form and generate a prescription</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionGenerator;
