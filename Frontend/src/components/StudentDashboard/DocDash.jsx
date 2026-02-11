'use client';

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
  Bell,
  Settings,
  Search,
  Eye,
  Calendar,
  FileText,
  User,
  Check,
  X,
  Video,
  Clock,
  Bot,
  MessageSquare,
  Activity,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { api } from "../../axios.config.js";
import { useNavigate } from "react-router-dom";
import Notibell from "../Noti/Notibell.jsx";
import Sidebar from "../Sidebar";

const DocDash = () => {
  // State for active tab - Moved to top to avoid ReferenceError
  const [activeTab, setActiveTab] = useState("certificate");
  // Sample data for student certificates
  const [certificates, setCertificates] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const navigate = useNavigate();

  // Fetch Certificates and Prescriptions
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/certificate/pending-certificates');
        setCertificates(res.data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };

    const fetchPrescriptions = async () => {
      try {
        const res = await api.get('/certificate/pending-prescriptions');
        setPrescriptions(res.data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };

    if (activeTab === 'certificate') fetchCertificates();
    if (activeTab === 'prescription') fetchPrescriptions();
  }, [activeTab]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/certificate/${id}/status`, { status });
      // Refresh data
      if (activeTab === 'certificate') {
        const res = await api.get('/certificate/pending-certificates');
        setCertificates(res.data);
      } else {
        const res = await api.get('/certificate/pending-prescriptions');
        setPrescriptions(res.data);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };
  // Replace static appointment sample data with dynamic state
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

  // State to manage the currently selected appointment for viewing details
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);



  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/doctor/stats');
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
        timeFrom: new Date(app.slotDateTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timeTo: calculateEndTime(app.slotDateTime, app.duration || 30),
        reason: app.reason || "General Checkup",
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
        rawData: app,

      };

      // Prepend the new appointment to the current list
      setAppointments((prevAppointments) => [newApp, ...prevAppointments]);
    };

    socket.on("newAppointment", handleNewAppointment);

    // Cleanup on unmount
    return () => {
      socket.off("newAppointment", handleNewAppointment);
    };
  }, []);

  // Sample data for prescriptions


  // Remove static sample data for video call appointments and use dynamic state instead
  const [videoAppointments, setVideoAppointments] = useState([]);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [videoError, setVideoError] = useState(null);

  // Statistics for dashboard charts
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

  // State for active tab


  // Helper function to format date in DD/month name/yyyy format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch appointments whenever the status or date filter changes
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
      const response = await api.get("/doctor/appointment", {
        params: queryParams,
      });
      const formattedAppointments = response.data.map((app) => ({
        id: app._id,
        patientName: app.studentId?.name || "Unknown Patient",
        studentId: app.studentId?._id || "N/A",
        studentEmail: app.studentId?.email || "N/A",
        appointmentDate: new Date(app.slotDateTime).toLocaleDateString(),
        timeFrom: new Date(app.slotDateTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timeTo: calculateEndTime(app.slotDateTime, app.duration || 30),
        reason: app.reason || "General Checkup",
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
        rawData: app,
      }));
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointmentsError(
        "Failed to load appointments. Please try again later."
      );
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Helper to calculate end time based on start time and duration
  const calculateEndTime = (startDateTime, durationMinutes) => {
    const endTime = new Date(
      new Date(startDateTime).getTime() + durationMinutes * 60000
    );
    return endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Update appointment status and update the local state
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await api.patch(`/doctor/${appointmentId}/appointment-status`, {
        status: newStatus.toLowerCase(),
      });
      setAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app.id === appointmentId
            ? {
              ...app,
              status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
            }
            : app
        )
      );
    } catch (error) {
      console.error(`Error updating appointment to ${newStatus}:`, error);
      alert("Failed to update appointment status. Please try again.");
    }
  };

  // Function to view appointment details (for example, opening a modal)
  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeAppointmentModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // New: Fetch video appointments from the API when the Video tab is active
  useEffect(() => {
    if (activeTab === "video") {
      fetchVideoAppointments();
    }
  }, [activeTab]);

  const fetchVideoAppointments = async () => {
    try {
      setLoadingVideo(true);
      const response = await api.get("/doctor/appointment", {
        params: { status: "confirmed" },
      });
      const formattedVideoAppointments = response.data.map((app) => ({
        id: app._id,
        patientName: app.studentId?.name || "Unknown Patient",
        studentId: app.studentId?._id || "N/A",
        appointmentDate: formatDate(app.slotDateTime),
        time: new Date(app.slotDateTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
        rawData: app,
      }));
      setVideoAppointments(formattedVideoAppointments);
    } catch (error) {
      console.error("Error fetching video appointments:", error);
      setVideoError(
        "Failed to load video appointments. Please try again later."
      );
    } finally {
      setLoadingVideo(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent text-white relative">

      {/* Sidebar */}
      {/* Sidebar */}
      <Sidebar role="doctor" />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 pt-20 sm:pt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">{"Doctor's Dashboard"}</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-9 pr-4 py-2 border border-white/[0.06] rounded-xl bg-white/[0.03] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300 focus:w-64 w-48"
              />
            </div>
            <Settings className="w-5 h-5 text-gray-500 hover:text-primary transition-colors cursor-pointer hover:rotate-90 duration-500" />
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Today's Appointments", value: stats.todayAppointments, color: "bg-cyan-500", icon: Calendar },
            { title: "Pending Certificates", value: stats.pendingCertificates, color: "bg-amber-500", icon: FileCheck },
            { title: "Active Cases", value: stats.activeCases, color: "bg-emerald-500", icon: Activity },
            { title: "Video Consultations", value: stats.videoConsultations, color: "bg-primary", icon: Video },
          ].map((item, index) => (
            <div key={index} className="glass-card p-5 hover:scale-[1.01] hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-20 h-20 ${item.color} opacity-5 rounded-bl-full -mr-2 -mt-2 transition-all group-hover:scale-150 duration-500`} />
              <div className="flex justify-between items-center mb-3 relative z-10">
                <div className={`${item.color} p-2.5 rounded-xl`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-500 text-xs bg-white/[0.03] px-2 py-1 rounded-lg">Today</span>
              </div>
              <h2 className="text-2xl font-bold text-white relative z-10">{item.value}</h2>
              <p className="text-gray-400 text-sm relative z-10">{item.title}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-white/[0.06]">
          <nav className="flex gap-1 overflow-x-auto">
            {[
              { key: 'certificate', label: 'Certificate Verification' },
              { key: 'appointment', label: 'Appointment Approval' },
              { key: 'prescription', label: 'Prescription Verification' },
              { key: 'video', label: 'Video Consultations' },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`py-2.5 px-4 text-xs font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-white'
                  }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="glass-card p-5 animate-fade-in">
          {/* Certificate Verification Tab */}

          {activeTab === "appointment" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-primary">
                  Appointment Requests
                </h2>
                <div className="flex space-x-2">
                  <select
                    className="border border-white/20 rounded-lg px-3 py-2 bg-surface text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="border border-white/20 rounded-lg px-3 py-2 bg-surface text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>
              {loadingAppointments ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : appointmentsError ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
                  {appointmentsError}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Patient Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          From
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          To
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-white/10">
                      {appointments.length === 0 ? (
                        <tr>
                          <td
                            colSpan="9"
                            className="px-6 py-4 text-center text-gray-400"
                          >
                            No appointments found
                          </td>
                        </tr>
                      ) : (
                        appointments.map((app) => (
                          <tr key={app.id} className="hover:bg-white/5">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                              {String(app.id).substring(0, 6)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {app.patientName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {app.studentId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {app.appointmentDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {app.timeFrom}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {app.timeTo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {app.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-lg ${app.status === "Confirmed"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : app.status === "Cancelled"
                                    ? "bg-red-500/10 text-red-400"
                                    : app.status === "Delayed"
                                      ? "bg-orange-500/10 text-orange-400"
                                      : "bg-yellow-500/10 text-yellow-400"
                                  }`}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-2">
                                {app.status === "Pending" ? (
                                  <>
                                    <button
                                      className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
                                      onClick={() =>
                                        updateAppointmentStatus(
                                          app.id,
                                          "confirmed"
                                        )
                                      }
                                    >
                                      <Check className="w-4 h-4 mr-1" /> Approve
                                    </button>
                                    <button
                                      className="flex items-center text-red-400 hover:text-red-300 transition-colors"
                                      onClick={() =>
                                        updateAppointmentStatus(
                                          app.id,
                                          "cancelled"
                                        )
                                      }
                                    >
                                      <X className="w-4 h-4 mr-1" /> Reject
                                    </button>
                                    <button
                                      className="flex items-center text-orange-400 hover:text-orange-300 transition-colors"
                                      onClick={() =>
                                        updateAppointmentStatus(
                                          app.id,
                                          "delayed"
                                        )
                                      }
                                    >
                                      <Clock className="w-4 h-4 mr-1" /> Delay
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    className="flex items-center text-primary hover:text-primary/80 transition-colors"
                                    onClick={() => viewAppointmentDetails(app)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" /> View
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

          {activeTab === "certificate" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Student Certificate Verification
                </h2>
                <div className="flex space-x-2">
                  <select className="border border-white/20 rounded-lg px-3 py-2 bg-surface text-white focus:outline-none focus:border-primary transition-all">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search by ID"
                    className="border border-white/20 rounded-lg px-3 py-2 bg-surface text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Certificate Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Issue Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Expiry Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Document
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-transparent divide-y divide-white/10">
                    {certificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {cert.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {cert.student_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {cert.student_email || cert.student_id || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {cert.diagnosis} {/* Using Diagnosis as Cert Type/Title */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(cert.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          N/A
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary underline cursor-pointer hover:text-accent transition-colors">
                          View PDF
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cert.status === "Approved" || cert.status === "Verified"
                              ? "bg-green-500/20 text-green-400"
                              : cert.status === "Rejected"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                              }`}
                          >
                            {cert.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button className="flex items-center text-primary hover:text-accent transition-colors">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </button>
                            {cert.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(cert.id, 'Verified')}
                                  className="flex items-center text-green-400 hover:text-green-300 transition-colors">
                                  <Check className="w-4 h-4 mr-1" /> Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(cert.id, 'Rejected')}
                                  className="flex items-center text-red-400 hover:text-red-300 transition-colors">
                                  <X className="w-4 h-4 mr-1" /> Reject
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

          {/* Prescription Verification Tab */}
          {activeTab === "prescription" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Student Prescription Verification
                </h2>
                <div className="flex space-x-2">
                  <select className="border border-white/20 rounded-lg px-3 py-2 bg-surface text-white focus:outline-none focus:border-primary transition-all">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search medication"
                    className="border border-white/20 rounded-lg px-3 py-2 bg-surface text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-gradient-to-r from-primary/10 to-transparent">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Medication
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Dosage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Issued Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider min-w-[200px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-transparent divide-y divide-white/10">
                    {prescriptions.map((presc) => (
                      <tr key={presc.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {presc.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {presc.student_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {presc.student_email || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {presc.prescription || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {presc.treatment || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(presc.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                          {presc.diagnosis}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${presc.status === "Approved" || presc.status === "Verified"
                              ? "bg-green-500/20 text-green-400"
                              : presc.status === "Rejected"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                              }`}
                          >
                            {presc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2 items-start">
                            <button
                              onClick={() => {
                                if (presc.attachments && presc.attachments.length > 0) {
                                  // Open the first attachment in a new tab if available
                                  const url = presc.attachments[0].url || presc.attachments[0]; // Handle object or string
                                  window.open(url, '_blank');
                                } else {
                                  // Fallback to modal if no attachment
                                  alert("No attachment found for this record.");
                                }
                              }}
                              className="flex items-center text-primary hover:text-accent transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-1" /> View Attachment
                            </button>
                            {presc.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(presc.id, 'Verified')}
                                  className="flex items-center text-green-400 hover:text-green-300 transition-colors">
                                  <Check className="w-4 h-4 mr-1" /> Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(presc.id, 'Rejected')}
                                  className="flex items-center text-red-400 hover:text-red-300 transition-colors">
                                  <X className="w-4 h-4 mr-1" /> Reject
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

          {/* Video Consultation Tab */}
          {activeTab === "video" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Video Consultations</h2>
                <button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 text-white px-4 py-2 rounded-lg flex items-center">
                  <Video className="w-4 h-4 mr-2" /> Schedule New Call
                </button>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">
                  Confirmed Video Appointments
                </h3>
                {loadingVideo ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : videoError ? (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
                    {videoError}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videoAppointments.length === 0 ? (
                      <div className="col-span-full text-center text-gray-500 py-8">
                        No video appointments found
                      </div>
                    ) : (
                      videoAppointments.map((app) => (
                        <div
                          key={app.id}
                          className={`p-4 rounded-xl border transition-all hover:scale-[1.01] ${app.status === "Confirmed"
                            ? "border-emerald-500/20 bg-emerald-500/5"
                            : app.status === "Pending"
                              ? "border-yellow-500/20 bg-yellow-500/5"
                              : "border-red-500/20 bg-red-500/5"
                            }`}
                        >
                          <h4 className="font-semibold text-white">{app.patientName}</h4>
                          <p className="text-sm text-gray-400">
                            {app.appointmentDate}
                          </p>
                          <p className="text-sm text-gray-400">{app.time}</p>
                          <p
                            className={`text-sm font-medium ${app.status === "Confirmed"
                              ? "text-emerald-400"
                              : app.status === "Pending"
                                ? "text-yellow-400"
                                : "text-red-400"
                              }`}
                          >
                            {app.status}
                          </p>
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
              {/* Analytics content goes here */}
              <h2 className="text-xl font-semibold">Analytics</h2>
            </div>
          )}
        </div>
      </div>
      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="bg-[#1a1c23] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all scale-100 opacity-100"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Appointment Details
              </h3>
              <button
                onClick={closeAppointmentModal}
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
                    Patient Name
                  </p>
                  <p className="text-white font-medium truncate">
                    {selectedAppointment.patientName}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
                    Student ID
                  </p>
                  <p className="text-white font-medium truncate">
                    {selectedAppointment.studentId}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
                    Date
                  </p>
                  <p className="text-white font-medium">
                    {selectedAppointment.appointmentDate}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
                    Time
                  </p>
                  <p className="text-white font-medium">
                    {selectedAppointment.timeFrom} - {selectedAppointment.timeTo}
                  </p>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                <p className="text-xs text-gray-400 uppercase font-semibold mb-2">
                  Reason for Visit
                </p>
                <p className="text-white/90 text-sm leading-relaxed">
                  {selectedAppointment.reason}
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                <p className="text-xs text-gray-400 uppercase font-semibold mb-2">
                  Contact Email
                </p>
                <p className="text-white/90 text-sm leading-relaxed">
                  {selectedAppointment.studentEmail}
                </p>
              </div>

              <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-gray-400 text-sm font-medium">
                  Current Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${selectedAppointment.status === "Confirmed"
                    ? "bg-green-500/20 text-green-400"
                    : selectedAppointment.status === "Cancelled"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                    }`}
                >
                  {selectedAppointment.status}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/5 rounded-b-2xl">
              <button
                onClick={closeAppointmentModal}
                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200"
              >
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
