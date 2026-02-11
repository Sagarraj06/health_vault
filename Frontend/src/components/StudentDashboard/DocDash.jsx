import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import socket from "../../socket.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
} from "recharts";
import {
  Search,
  Eye,
  Calendar,
  FileText,
  User,
  Check,
  X,
  Video,
  Clock,
  Activity,
  FileCheck,
} from "lucide-react";
import { api } from "../../axios.config.js";
import { useNavigate } from "react-router-dom";
import Notibell from "../Noti/Notibell.jsx";
import Sidebar from "../Sidebar";

const DocDash = () => {
  const [activeTab, setActiveTab] = useState("certificate");
  const [certificates, setCertificates] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get("/certificate/pending-certificates");
        setCertificates(res.data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };

    const fetchPrescriptions = async () => {
      try {
        const res = await api.get("/certificate/pending-prescriptions");
        setPrescriptions(res.data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };

    if (activeTab === "certificate") fetchCertificates();
    if (activeTab === "prescription") fetchPrescriptions();
  }, [activeTab]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/certificate/${id}/status`, { status });
      if (activeTab === "certificate") {
        const res = await api.get("/certificate/pending-certificates");
        setCertificates(res.data);
      } else {
        const res = await api.get("/certificate/pending-prescriptions");
        setPrescriptions(res.data);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingCertificates: 0,
    activeCases: 0,
    videoConsultations: 0,
  });

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/doctor/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching doctor stats:", error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const handleNewAppointment = (data) => {
      const app = data.appointment;
      const newApp = {
        id: app._id,
        patientName: app.studentId?.name || "Unknown",
        studentId: app.studentId?._id || "N/A",
        studentEmail: app.studentId?.email || "N/A",
        appointmentDate: new Date(app.slotDateTime).toLocaleDateString(),
        timeFrom: new Date(app.slotDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timeTo: calculateEndTime(app.slotDateTime, app.duration || 30),
        reason: app.reason || "General Checkup",
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
        rawData: app,
      };
      setAppointments((prevAppointments) => [newApp, ...prevAppointments]);
    };

    socket.on("newAppointment", handleNewAppointment);
    return () => {
      socket.off("newAppointment", handleNewAppointment);
    };
  }, []);

  const [videoAppointments, setVideoAppointments] = useState([]);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [videoError, setVideoError] = useState(null);

  const healthIssuesData = [
    { name: "Respiratory", value: 35 },
    { name: "Digestive", value: 20 },
    { name: "Mental Health", value: 25 },
    { name: "Injury", value: 15 },
    { name: "Other", value: 5 },
  ];

  const monthlyData = [
    { month: "Jan", checkups: 45, emergencies: 12 },
    { month: "Feb", checkups: 52, emergencies: 15 },
    { month: "Mar", checkups: 38, emergencies: 10 },
    { month: "Apr", checkups: 30, emergencies: 8 },
    { month: "May", checkups: 25, emergencies: 6 },
    { month: "Jun", checkups: 32, emergencies: 9 },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      let queryParams = {};
      if (statusFilter && statusFilter !== "All Status") {
        queryParams.status = statusFilter;
      }
      if (dateFilter) {
        queryParams.date = dateFilter;
      }
      const response = await api.get("/doctor/appointment", { params: queryParams });
      const formattedAppointments = response.data.map((app) => ({
        id: app._id,
        patientName: app.studentId?.name || "Unknown Patient",
        studentId: app.studentId?._id || "N/A",
        studentEmail: app.studentId?.email || "N/A",
        appointmentDate: new Date(app.slotDateTime).toLocaleDateString(),
        timeFrom: new Date(app.slotDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timeTo: calculateEndTime(app.slotDateTime, app.duration || 30),
        reason: app.reason || "General Checkup",
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
        rawData: app,
      }));
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointmentsError("Failed to load appointments. Please try again later.");
    } finally {
      setLoadingAppointments(false);
    }
  };

  const calculateEndTime = (startDateTime, durationMinutes) => {
    const endTime = new Date(new Date(startDateTime).getTime() + durationMinutes * 60000);
    return endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await api.patch(`/doctor/${appointmentId}/appointment-status`, { status: newStatus.toLowerCase() });
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId
            ? { ...app, status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) }
            : app
        )
      );
    } catch (error) {
      console.error(`Error updating appointment to ${newStatus}:`, error);
      alert("Failed to update appointment status. Please try again.");
    }
  };

  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeAppointmentModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  useEffect(() => {
    if (activeTab === "video") {
      fetchVideoAppointments();
    }
  }, [activeTab]);

  const fetchVideoAppointments = async () => {
    try {
      setLoadingVideo(true);
      const response = await api.get("/doctor/appointment", { params: { status: "confirmed" } });
      const formattedVideoAppointments = response.data.map((app) => ({
        id: app._id,
        patientName: app.studentId?.name || "Unknown Patient",
        studentId: app.studentId?._id || "N/A",
        appointmentDate: formatDate(app.slotDateTime),
        time: new Date(app.slotDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
        rawData: app,
      }));
      setVideoAppointments(formattedVideoAppointments);
    } catch (error) {
      console.error("Error fetching video appointments:", error);
      setVideoError("Failed to load video appointments. Please try again later.");
    } finally {
      setLoadingVideo(false);
    }
  };

  const statusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved" || s === "confirmed" || s === "verified")
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (s === "rejected" || s === "cancelled")
      return "bg-red-50 text-red-700 border border-red-200";
    if (s === "delayed")
      return "bg-orange-50 text-orange-700 border border-orange-200";
    return "bg-amber-50 text-amber-700 border border-amber-200";
  };

  const statCards = [
    { title: "Today's Appointments", value: stats.todayAppointments, icon: Calendar, color: "bg-sky-50", textColor: "text-sky-600" },
    { title: "Pending Certificates", value: stats.pendingCertificates, icon: FileCheck, color: "bg-amber-50", textColor: "text-amber-600" },
    { title: "Active Cases", value: stats.activeCases, icon: Activity, color: "bg-emerald-50", textColor: "text-emerald-600" },
    { title: "Video Consultations", value: stats.videoConsultations, icon: Video, color: "bg-primary/5", textColor: "text-primary" },
  ];

  const tabs = [
    { key: "certificate", label: "Certificate Verification" },
    { key: "appointment", label: "Appointment Approval" },
    { key: "prescription", label: "Prescription Verification" },
    { key: "video", label: "Video Consultations" },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar role="doctor" />

      <div className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-text font-[Space_Grotesk]">
            {"Doctor's Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-9 pr-4 py-2 border border-border rounded-lg bg-card text-text text-sm placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-48 focus:w-64"
              />
            </div>
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-card text-sm font-bold">
              D
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((item, index) => (
            <div key={index} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 ${item.textColor}`} />
                </div>
                <span className="text-xs text-text-light bg-surface-alt px-2 py-1 rounded">Today</span>
              </div>
              <h2 className="text-2xl font-bold text-text">{item.value}</h2>
              <p className="text-sm text-text-light">{item.title}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-border">
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-text-light hover:text-text hover:border-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
          {/* Certificate Verification Tab */}
          {activeTab === "certificate" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-base font-semibold text-text font-[Space_Grotesk]">
                  Student Certificate Verification
                </h2>
                <div className="flex gap-2">
                  <select className="border border-border rounded-lg px-3 py-2 bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search by ID"
                    className="border border-border rounded-lg px-3 py-2 bg-card text-text text-sm placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-border bg-surface-alt/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Student ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Issue Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Document</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map((cert) => (
                      <tr key={cert.id} className="border-b border-border/50 hover:bg-surface-alt/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-text">{cert.id}</td>
                        <td className="px-4 py-3 text-sm text-text">{cert.student_name || "N/A"}</td>
                        <td className="px-4 py-3 text-sm text-text">{cert.student_email || cert.student_id || "N/A"}</td>
                        <td className="px-4 py-3 text-sm text-text">{cert.diagnosis}</td>
                        <td className="px-4 py-3 text-sm text-text">{new Date(cert.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm text-primary cursor-pointer hover:underline">View PDF</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusBadge(cert.status)}`}>
                            {cert.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>
                            {cert.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(cert.id, "Verified")}
                                  className="text-emerald-600 hover:underline text-sm font-medium flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(cert.id, "Rejected")}
                                  className="text-red-500 hover:underline text-sm font-medium flex items-center gap-1"
                                >
                                  <X className="w-3.5 h-3.5" /> Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Appointment Approval Tab */}
          {activeTab === "appointment" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-base font-semibold text-text font-[Space_Grotesk]">
                  Appointment Requests
                </h2>
                <div className="flex gap-2">
                  <select
                    className="border border-border rounded-lg px-3 py-2 bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Approved</option>
                    <option value="cancelled">Rejected</option>
                    <option value="delayed">Delayed</option>
                  </select>
                  <input
                    type="date"
                    className="border border-border rounded-lg px-3 py-2 bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>
              {loadingAppointments ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
                </div>
              ) : appointmentsError ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {appointmentsError}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-border bg-surface-alt/50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Patient</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Student ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">From</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">To</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Reason</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="px-4 py-8 text-center text-text-light text-sm">
                            No appointments found
                          </td>
                        </tr>
                      ) : (
                        appointments.map((app) => (
                          <tr key={app.id} className="border-b border-border/50 hover:bg-surface-alt/50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-text">{String(app.id).substring(0, 6)}...</td>
                            <td className="px-4 py-3 text-sm text-text">{app.patientName}</td>
                            <td className="px-4 py-3 text-sm text-text">{app.studentId}</td>
                            <td className="px-4 py-3 text-sm text-text">{app.appointmentDate}</td>
                            <td className="px-4 py-3 text-sm text-text">{app.timeFrom}</td>
                            <td className="px-4 py-3 text-sm text-text">{app.timeTo}</td>
                            <td className="px-4 py-3 text-sm text-text">{app.reason}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusBadge(app.status)}`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex gap-2">
                                {app.status === "Pending" ? (
                                  <>
                                    <button className="text-emerald-600 hover:underline text-sm font-medium flex items-center gap-1" onClick={() => updateAppointmentStatus(app.id, "confirmed")}>
                                      <Check className="w-3.5 h-3.5" /> Approve
                                    </button>
                                    <button className="text-red-500 hover:underline text-sm font-medium flex items-center gap-1" onClick={() => updateAppointmentStatus(app.id, "cancelled")}>
                                      <X className="w-3.5 h-3.5" /> Reject
                                    </button>
                                    <button className="text-orange-500 hover:underline text-sm font-medium flex items-center gap-1" onClick={() => updateAppointmentStatus(app.id, "delayed")}>
                                      <Clock className="w-3.5 h-3.5" /> Delay
                                    </button>
                                  </>
                                ) : (
                                  <button className="text-primary hover:underline text-sm font-medium flex items-center gap-1" onClick={() => viewAppointmentDetails(app)}>
                                    <Eye className="w-3.5 h-3.5" /> View
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Prescription Verification Tab */}
          {activeTab === "prescription" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-base font-semibold text-text font-[Space_Grotesk]">
                  Student Prescription Verification
                </h2>
                <div className="flex gap-2">
                  <select className="border border-border rounded-lg px-3 py-2 bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search medication"
                    className="border border-border rounded-lg px-3 py-2 bg-card text-text text-sm placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-border bg-surface-alt/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Student ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Medication</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Dosage</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Notes</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider min-w-[200px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((presc) => (
                      <tr key={presc.id} className="border-b border-border/50 hover:bg-surface-alt/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-text">{presc.id}</td>
                        <td className="px-4 py-3 text-sm text-text">{presc.student_name || "N/A"}</td>
                        <td className="px-4 py-3 text-sm text-text">{presc.student_email || "N/A"}</td>
                        <td className="px-4 py-3 text-sm text-text">{presc.prescription || "N/A"}</td>
                        <td className="px-4 py-3 text-sm text-text">{presc.treatment || "N/A"}</td>
                        <td className="px-4 py-3 text-sm text-text">{new Date(presc.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm text-text max-w-xs truncate">{presc.diagnosis}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusBadge(presc.status)}`}>
                            {presc.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1.5 items-start">
                            <button
                              onClick={() => {
                                if (presc.attachments && presc.attachments.length > 0) {
                                  const url = presc.attachments[0].url || presc.attachments[0];
                                  window.open(url, "_blank");
                                } else {
                                  alert("No attachment found for this record.");
                                }
                              }}
                              className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Attachment
                            </button>
                            {presc.status === "Pending" && (
                              <>
                                <button onClick={() => handleUpdateStatus(presc.id, "Verified")} className="text-emerald-600 hover:underline text-sm font-medium flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button onClick={() => handleUpdateStatus(presc.id, "Rejected")} className="text-red-500 hover:underline text-sm font-medium flex items-center gap-1">
                                  <X className="w-3.5 h-3.5" /> Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Video Consultations Tab */}
          {activeTab === "video" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-base font-semibold text-text font-[Space_Grotesk]">Video Consultations</h2>
                <button className="bg-primary hover:bg-primary-dark text-card px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <Video className="w-4 h-4" /> Schedule New Call
                </button>
              </div>
              <div className="mb-8">
                <h3 className="text-sm font-medium text-text-light mb-4">Confirmed Video Appointments</h3>
                {loadingVideo ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
                  </div>
                ) : videoError ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {videoError}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videoAppointments.length === 0 ? (
                      <div className="col-span-3 text-center text-text-light text-sm py-8">
                        No video appointments found
                      </div>
                    ) : (
                      videoAppointments.map((app) => (
                        <div
                          key={app.id}
                          className="bg-surface-alt rounded-xl border border-border p-4 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-text">{app.patientName}</h4>
                              <p className="text-xs text-text-light">{app.appointmentDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-text-light">{app.time}</span>
                            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusBadge(app.status)}`}>
                              {app.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div>
              <h2 className="text-base font-semibold text-text font-[Space_Grotesk]">Analytics</h2>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg" role="dialog" aria-modal="true">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h3 className="text-base font-semibold text-text font-[Space_Grotesk] flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Appointment Details
              </h3>
              <button onClick={closeAppointmentModal} className="text-muted hover:text-text hover:bg-surface-alt rounded-full p-2 transition-colors" aria-label="Close modal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-alt p-3 rounded-lg">
                  <p className="text-xs text-text-light uppercase font-medium mb-1">Patient Name</p>
                  <p className="text-sm text-text font-medium truncate">{selectedAppointment.patientName}</p>
                </div>
                <div className="bg-surface-alt p-3 rounded-lg">
                  <p className="text-xs text-text-light uppercase font-medium mb-1">Student ID</p>
                  <p className="text-sm text-text font-medium truncate">{selectedAppointment.studentId}</p>
                </div>
                <div className="bg-surface-alt p-3 rounded-lg">
                  <p className="text-xs text-text-light uppercase font-medium mb-1">Date</p>
                  <p className="text-sm text-text font-medium">{selectedAppointment.appointmentDate}</p>
                </div>
                <div className="bg-surface-alt p-3 rounded-lg">
                  <p className="text-xs text-text-light uppercase font-medium mb-1">Time</p>
                  <p className="text-sm text-text font-medium">{selectedAppointment.timeFrom} - {selectedAppointment.timeTo}</p>
                </div>
              </div>

              <div className="bg-surface-alt p-4 rounded-lg">
                <p className="text-xs text-text-light uppercase font-medium mb-1">Reason for Visit</p>
                <p className="text-sm text-text leading-relaxed">{selectedAppointment.reason}</p>
              </div>

              <div className="bg-surface-alt p-4 rounded-lg">
                <p className="text-xs text-text-light uppercase font-medium mb-1">Contact Email</p>
                <p className="text-sm text-text">{selectedAppointment.studentEmail}</p>
              </div>

              <div className="flex items-center justify-between bg-surface-alt p-3 rounded-lg">
                <span className="text-sm text-text-light font-medium">Status</span>
                <span className={`px-2.5 py-0.5 text-xs font-bold uppercase rounded-full ${statusBadge(selectedAppointment.status)}`}>
                  {selectedAppointment.status}
                </span>
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end">
              <button onClick={closeAppointmentModal} className="px-5 py-2 rounded-lg bg-surface-alt hover:bg-border text-text text-sm font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocDash;
