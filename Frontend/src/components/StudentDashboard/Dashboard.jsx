import React, { useState, useEffect } from "react";
import { api } from "../../axios.config.js";
import { Link } from "react-router-dom";
import {
  Search,
  Upload,
  Calendar,
  FileText,
  MessageCircle,
  X,
} from "lucide-react";
import Notibell from "../Noti/Notibell.jsx";
import socket from "../../socket.js";
import { showAlert } from "../alert-system.js";
import Sidebar from "../Sidebar";

const Dashboard = () => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [leaveLoading, setLeaveLoading] = useState(true);
  const [leaveError, setLeaveError] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [activeTab, setActiveTab] = useState("leave");

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        const response = await api.get("/leave/");
        if (Array.isArray(response.data)) {
          setLeaveApplications(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setLeaveApplications([]);
        }
      } catch (err) {
        console.error("Error fetching leave applications:", err);
        setLeaveError("Failed to load leave applications.");
      } finally {
        setLeaveLoading(false);
      }
    };

    fetchLeaveApplications();

    socket.on("newNotification", (data) => {
      if (data.notification?.type === "leave") {
        showAlert(data.notification.message);
      }
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await api.get("/health-record");
        if (Array.isArray(response.data)) {
          setHealthRecords(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setHealthRecords([]);
        }
      } catch (err) {
        console.error("Error fetching health records:", err);
        setError("Failed to load health records.");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, []);

  useEffect(() => {
    const fetchStudentAppointments = async () => {
      try {
        const response = await api.get("/appointment/student");
        if (Array.isArray(response.data)) {
          setAppointments(response.data);
        } else if (response.data && Array.isArray(response.data.appointments)) {
          setAppointments(response.data.appointments);
        } else {
          console.error("Unexpected appointment response format:", response.data);
          setAppointments([]);
        }
      } catch (err) {
        console.error("Error fetching student appointments:", err);
        setAppointmentsError("Failed to load student appointments.");
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchStudentAppointments();

    socket.on("appointmentUpdate", (data) => {
      fetchStudentAppointments();
    });

    socket.on("newAppointment", (data) => {
      setNotificationCount((prev) => prev + 1);
      const updatedAppointment = {
        ...data.appointment,
        doctorId: {
          ...(data.appointment.doctorId || {}),
          name: data.appointment.doctorName || data.appointment.doctorId?.name || "Unknown",
        },
      };
      setAppointments((prev) => [updatedAppointment, ...prev]);
    });

    return () => {
      socket.off("appointmentUpdate");
      socket.off("newAppointment");
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        api
          .get("/user/searchSuggestions", { params: { query: searchQuery } })
          .then((res) => setSuggestions(res.data))
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    api
      .get("/user/search", { params: { query: suggestion } })
      .then((res) => setSearchResults(res.data))
      .catch(() => setSearchResults([]));
  };

  const viewHealthRecordDetails = async (id) => {
    try {
      const response = await api.get(`/health-record/${id}`);
      setSelectedRecord(response.data);
    } catch (err) {
      console.error("Error fetching health record details:", err);
      alert("Failed to load health record details.");
    }
  };

  const deleteHealthRecord = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this record?");
      if (!confirmDelete) return;
      await api.delete(`/health-record/${id}/delete`);
      alert("Health record deleted successfully.");
      setHealthRecords(healthRecords.filter((record) => record.id !== id));
    } catch (err) {
      console.error("Error deleting health record:", err);
      alert("Failed to delete health record.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNextAppointment = () => {
    if (appointments.length === 0) return "No upcoming appointments";
    const sortedAppointments = [...appointments].sort(
      (a, b) => new Date(a.slotDateTime) - new Date(b.slotDateTime)
    );
    const now = new Date();
    const upcomingAppointment = sortedAppointments.find(
      (apt) => new Date(apt.slotDateTime) > now
    );
    if (upcomingAppointment) {
      return `Next: ${formatDate(upcomingAppointment.slotDateTime)} - ${upcomingAppointment.doctorId?.name || "Doctor"}`;
    }
    return "No upcoming appointments";
  };

  const statusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved" || s === "confirmed")
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (s === "rejected" || s === "cancelled")
      return "bg-red-50 text-red-700 border border-red-200";
    return "bg-amber-50 text-amber-700 border border-amber-200";
  };

  const actionCards = [
    {
      title: "Health Records",
      action: "Upload Record",
      icon: Upload,
      color: "bg-sky-500",
      lightBg: "bg-sky-50",
      lightText: "text-sky-700",
      history: "Last uploaded: Blood Test Report - 10th March 2025",
      route: "/recordform",
    },
    {
      title: "Leave Applications",
      action: "Apply for Leave",
      icon: FileText,
      color: "bg-emerald-500",
      lightBg: "bg-emerald-50",
      lightText: "text-emerald-700",
      history: "Last leave applied: 5th March 2025 (Medical Leave)",
      route: "/leave",
    },
    {
      title: "Appointments",
      action: "Book Appointment",
      icon: Calendar,
      color: "bg-primary",
      lightBg: "bg-primary/5",
      lightText: "text-primary",
      history: getNextAppointment(),
      route: "/appointment",
    },
    {
      title: "AI Diagnosis",
      action: "AI Diagnosis",
      icon: MessageCircle,
      color: "bg-secondary",
      lightBg: "bg-amber-50",
      lightText: "text-amber-700",
      history: "Last query: 'Best home remedies for fever?'",
      route: "/ai-diagnosis",
    },
  ];

  const tabs = [
    { key: "leave", label: "Leave Applications" },
    { key: "appointments", label: "My Appointments" },
    { key: "healthRecords", label: "Health Records" },
    { key: "aiDiagnosis", label: "AI Diagnosis" },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar role="student" />

      <div className="flex-1 p-6 lg:p-8 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-text font-[Space_Grotesk]">
            Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 border border-border rounded-lg bg-card text-text text-sm placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-48 focus:w-64"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {suggestions.length > 0 && (
                <div className="absolute bg-card border border-border rounded-lg mt-1 w-full z-10 shadow-lg">
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-surface-alt cursor-pointer text-sm text-text"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Notibell count={notificationCount} />
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {actionCards.map((item, index) => (
            <Link to={item.route} key={index} className="block group">
              <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all duration-200 hover:border-primary/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${item.lightBg} rounded-lg flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${item.lightText}`} />
                  </div>
                  <h2 className="text-sm font-semibold text-text">
                    {item.title}
                  </h2>
                </div>
                <button className={`flex items-center justify-center gap-2 ${item.color} text-card w-full py-2 rounded-lg text-sm font-medium btn-animated mb-3`}>
                  <item.icon className="w-4 h-4" /> {item.action}
                </button>
                <p className="text-xs text-text-light bg-surface-alt p-2.5 rounded-lg leading-relaxed">
                  {item.history}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-border">
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`py-2.5 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-text-light hover:text-text hover:border-border"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Leave Applications Tab */}
        {activeTab === "leave" && (
          <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
            <h2 className="text-base font-semibold mb-4 text-text font-[Space_Grotesk]">
              Medical Leave Applications
            </h2>
            {leaveLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
              </div>
            ) : leaveError ? (
              <p className="text-red-600 text-sm">{leaveError}</p>
            ) : leaveApplications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Sno.</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">From</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">To</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Diagnosis</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveApplications.map((leave, index) => (
                      <tr key={leave._id} className="border-b border-border/50 hover:bg-surface-alt/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-text">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-text">{leave.date}</td>
                        <td className="px-4 py-3 text-sm text-text">{leave.fromDate}</td>
                        <td className="px-4 py-3 text-sm text-text">{leave.toDate}</td>
                        <td className="px-4 py-3 text-sm text-text">{leave.diagnosis}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusBadge(leave.status)}`}>
                            {leave.status ? leave.status.charAt(0).toUpperCase() + leave.status.slice(1) : "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedLeave(leave)}
                            className="text-primary text-sm hover:underline font-medium"
                          >
                            View Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-text-light text-sm py-4">No medical leave applications found.</p>
            )}

            {selectedLeave && (
              <div className="bg-surface-alt rounded-xl p-5 mt-4 border-l-4 border-primary">
                <h2 className="text-base font-semibold mb-3 text-text font-[Space_Grotesk]">
                  Leave Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <p className="text-text"><span className="font-medium text-text-light">Reason:</span> {selectedLeave.reason}</p>
                  <p className="text-text"><span className="font-medium text-text-light">Duration:</span> {selectedLeave.fromDate} to {selectedLeave.toDate}</p>
                  <p className="text-text"><span className="font-medium text-text-light">Diagnosis:</span> {selectedLeave.diagnosis}</p>
                  <p className="text-text"><span className="font-medium text-text-light">Doctor:</span> {selectedLeave.doctorName}</p>
                  <p className="text-text">
                    <span className="font-medium text-text-light">Status:</span>{" "}
                    <span className={`ml-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${statusBadge(selectedLeave.status)}`}>
                      {selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1)}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLeave(null)}
                  className="mt-4 bg-red-500 text-card px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
            <h2 className="text-base font-semibold mb-4 text-text font-[Space_Grotesk]">
              My Appointments
            </h2>
            {appointmentsLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
              </div>
            ) : appointmentsError ? (
              <p className="text-red-600 text-sm">{appointmentsError}</p>
            ) : appointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Doctor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Date & Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Prescription</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment._id || appointment.id} className="border-b border-border/50 hover:bg-surface-alt/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-text">
                          {appointment.doctorId?.name || "Not specified"}
                        </td>
                        <td className="px-4 py-3 text-sm text-text">
                          {formatDate(appointment.slotDateTime)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusBadge(appointment.status)}`}>
                            {appointment.status || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {appointment.prescription ? (
                            <a href={appointment.prescription} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                              View Prescription
                            </a>
                          ) : (
                            <span className="text-text-light">No prescription</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-text-light text-sm py-4">No appointments found.</p>
            )}
          </div>
        )}

        {/* Health Records Tab */}
        {activeTab === "healthRecords" && (
          <>
            <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
              <h2 className="text-base font-semibold mb-4 text-text font-[Space_Grotesk]">
                Health Records
              </h2>
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
                </div>
              ) : error ? (
                <p className="text-red-600 text-sm">{error}</p>
              ) : healthRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Sno.</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Diagnosis</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthRecords.map((record, index) => (
                        <tr key={record.id} className="border-b border-border/50 hover:bg-surface-alt/50 transition-colors">
                          <td className="px-4 py-3 text-sm text-text">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-text">{record.diagnosis}</td>
                          <td className="px-4 py-3 text-sm text-text">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm flex gap-3">
                            <button onClick={() => viewHealthRecordDetails(record.id)} className="text-primary hover:underline font-medium">View</button>
                            <button onClick={() => deleteHealthRecord(record.id)} className="text-red-500 hover:underline font-medium">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-text-light text-sm py-4">No health records found.</p>
              )}
            </div>

            {selectedRecord && (
              <div className="bg-card rounded-xl border border-border p-5 mt-4 border-l-4 border-l-primary animate-fade-in">
                <h2 className="text-base font-semibold mb-3 text-text font-[Space_Grotesk]">
                  Health Record Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <p className="text-text"><span className="font-medium text-text-light">Diagnosis:</span> {selectedRecord.diagnosis}</p>
                  <p className="text-text"><span className="font-medium text-text-light">Date:</span> {new Date(selectedRecord.date).toLocaleDateString()}</p>
                  <p className="text-text"><span className="font-medium text-text-light">Treatment:</span> {selectedRecord.treatment || "N/A"}</p>
                  <p className="text-text"><span className="font-medium text-text-light">Prescription:</span> {selectedRecord.prescription || "N/A"}</p>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="mt-4 bg-red-500 text-card px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </>
        )}

        {/* AI Diagnosis Tab */}
        {activeTab === "aiDiagnosis" && (
          <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
            <h2 className="text-base font-semibold mb-4 text-text font-[Space_Grotesk]">
              AI Diagnosis
            </h2>
            <p className="text-text-light text-sm">This is where your AI Diagnosis content would go.</p>
          </div>
        )}

        {/* Search Results Modal */}
        {searchResults.length > 0 && (
          <div className="fixed inset-0 bg-dark/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-20">
            <div className="bg-card border border-border w-96 shadow-xl rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-text font-[Space_Grotesk]">Search Results</h3>
                <button onClick={() => setSearchResults([])} className="text-muted hover:text-text transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {searchResults.map((record) => (
                <div key={record._id} className="mb-4 border-b border-border pb-3 text-sm">
                  <p className="text-text"><span className="font-medium text-text-light">Diagnosis:</span> {record.diagnosis}</p>
                  <p className="text-text"><span className="font-medium text-text-light">Date:</span> {new Date(record.date).toLocaleDateString()}</p>
                  <p className="text-text"><span className="font-medium text-text-light">Treatment:</span> {record.treatment || "N/A"}</p>
                  <p className="text-text"><span className="font-medium text-text-light">Prescription:</span> {record.prescription || "N/A"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
