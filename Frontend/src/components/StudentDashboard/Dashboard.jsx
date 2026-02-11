'use client';

import React, { useState, useEffect } from "react";
import { api } from "../../axios.config.js"; // Axios instance
import { Link } from "react-router-dom";
import {
  Search,
  Upload,
  Calendar,
  FileText,
  MessageCircle,
  Settings
} from "lucide-react";
import Notibell from "../Noti/Notibell.jsx";
import socket from "../../socket.js";
import { showAlert } from "../alert-system.js";
import Sidebar from "../Sidebar";

const Dashboard = () => {
  // States for various sections
  const [healthRecords, setHealthRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null); // For selected health record
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [leaveLoading, setLeaveLoading] = useState(true);
  const [leaveError, setLeaveError] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  // States for search suggestions
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // ** NEW: Active tab state **
  // Possible tab values: "leave", "appointments", "healthRecords", "aiDiagnosis"
  const [activeTab, setActiveTab] = useState("leave");

  // Fetch leave applications
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

  // Fetch health records
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

  // Fetch student appointments and listen to socket events
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
      console.log("🔔 Real-time appointment update received:", data);
      // showAlert is assumed defined elsewhere (or you can replace with your notification logic)
      // showAlert(data.message, 'custom', 10000);
      fetchStudentAppointments();
    });

    socket.on("newAppointment", (data) => {
      console.log("📥 New appointment received:", data);
      // showAlert(data.message, "custom", 10000);
      setNotificationCount((prev) => prev + 1);
      const updatedAppointment = {
        ...data.appointment,
        doctorId: {
          ...(data.appointment.doctorId || {}),
          name: data.appointment.doctorName || data.appointment.doctorId?.name || "Unknown"
        }
      };
      setAppointments((prev) => [updatedAppointment, ...prev]);
    });

    // Clean up socket listeners when component unmounts
    return () => {
      socket.off("appointmentUpdate");
      socket.off("newAppointment");
    };
  }, []);

  // Debounced API call for search suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        api
          .get("/user/searchSuggestions", { params: { query: searchQuery } })
          .then((res) => {
            setSuggestions(res.data);
          })
          .catch((err) => {
            console.error("Error fetching suggestions:", err);
            setSuggestions([]);
          });
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle search field change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // When a suggestion is clicked, search health records by query
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    api
      .get("/user/search", { params: { query: suggestion } })
      .then((res) => {
        setSearchResults(res.data);
      })
      .catch((err) => {
        console.error("Error fetching search results:", err);
        setSearchResults([]);
      });
  };

  // View health record details
  const viewHealthRecordDetails = async (id) => {
    try {
      const response = await api.get(`/health-record/${id}`);
      setSelectedRecord(response.data);
    } catch (err) {
      console.error("Error fetching health record details:", err);
      alert("Failed to load health record details.");
    }
  };

  // Delete a health record
  const deleteHealthRecord = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this record?"
      );
      if (!confirmDelete) return;

      await api.delete(`/health-record/${id}/delete`);
      alert("Health record deleted successfully.");
      setHealthRecords(healthRecords.filter((record) => record.id !== id));
    } catch (err) {
      console.error("Error deleting health record:", err);
      alert("Failed to delete health record.");
    }
  };

  // Format date/time
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

  // Get the next upcoming appointment for the action card history
  const getNextAppointment = () => {
    if (appointments.length === 0) return "No upcoming appointments";

    // Sort appointments by slotDateTime
    const sortedAppointments = [...appointments].sort(
      (a, b) => new Date(a.slotDateTime) - new Date(b.slotDateTime)
    );

    const now = new Date();
    const upcomingAppointment = sortedAppointments.find(
      (apt) => new Date(apt.slotDateTime) > now
    );

    if (upcomingAppointment) {
      return `Next appointment: ${formatDate(
        upcomingAppointment.slotDateTime
      )} - ${upcomingAppointment.doctorId?.name || "Doctor"}`;
    } else {
      return "No upcoming appointments";
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent text-white">
      {/* Sidebar */}
      <Sidebar role="student" />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 pt-20 sm:pt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 border border-white/[0.06] rounded-xl bg-white/[0.03] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300 focus:w-64 w-48"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {/* Dropdown for suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute bg-surface-elevated border border-white/[0.06] rounded-xl mt-1 w-full z-10 shadow-2xl overflow-hidden">
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="px-4 py-2.5 hover:bg-white/[0.04] cursor-pointer text-gray-300 text-sm transition-colors"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Settings className="w-5 h-5 text-gray-500 hover:text-primary transition-colors cursor-pointer hover:rotate-90 duration-500" />
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            {
              title: "Health Records",
              action: "Upload Health Record",
              color: "bg-gradient-to-r from-blue-600 to-cyan-400 shadow-lg shadow-blue-500/30",
              icon: Upload,
              history: "Last uploaded: Blood Test Report - 10th March 2025",
              route: "/recordform",
            },
            {
              title: "Leave Applications",
              action: "Apply for Leave",
              color: "bg-gradient-to-r from-emerald-500 to-lime-400 shadow-lg shadow-emerald-500/30",
              icon: FileText,
              history: "Last leave applied: 5th March 2025 (Medical Leave)",
              route: "/leave",
            },
            {
              title: "Appointments",
              action: "Book Appointment",
              color: "bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg shadow-purple-500/30",
              icon: Calendar,
              history: getNextAppointment(),
              route: "/appointment",
            },
            {
              title: "AI Diagnosis",
              action: "AI DIAGNOSIS",
              color: "bg-gradient-to-r from-amber-500 to-yellow-400 shadow-lg shadow-amber-500/30",
              icon: MessageCircle,
              history: "Last query: 'Best home remedies for fever?'",
              route: "/ai-diagnosis",
            },
          ].map((item, index) => (
            <Link to={item.route} key={index} className="block group">
              <div className="glass-card p-5 hover:scale-[1.01] hover:border-white/10 transition-all duration-300 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-20 h-20 ${item.color} opacity-5 rounded-bl-full -mr-2 -mt-2 transition-all group-hover:scale-150 duration-500`}></div>
                <h2 className="text-base font-semibold mb-3 text-white relative z-10">
                  {item.title}
                </h2>
                <button
                  className={`flex items-center justify-center ${item.color} text-white p-3 rounded-xl shadow-md w-full mb-3 text-sm font-medium btn-animated relative z-10`}
                >
                  <item.icon className="mr-2 w-4 h-4" /> {item.action}
                </button>
                <p className="text-gray-400 text-xs bg-white/[0.03] p-3 rounded-lg border border-white/[0.04] relative z-10 leading-relaxed">
                  {item.history}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-white/[0.06]">
          <nav className="flex gap-1 overflow-x-auto">
            {[
              { key: "leave", label: "Leave Applications" },
              { key: "appointments", label: "My Appointments" },
              { key: "healthRecords", label: "Health Records" },
              { key: "aiDiagnosis", label: "AI Diagnosis" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`py-2.5 px-4 text-xs font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-white"
                  }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Conditional Rendering of Sections based on Active Tab */}
        {activeTab === "leave" && (
          <div className="glass-card p-5 mb-8 animate-fade-in">
            <h2 className="text-base font-semibold mb-4 text-white">
              Medical Leave Applications
            </h2>
            {leaveLoading ? (
              <p className="text-gray-400 text-sm">Loading leave applications...</p>
            ) : leaveError ? (
              <p className="text-red-400 text-sm">{leaveError}</p>
            ) : leaveApplications.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-white/[0.03]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sno.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">From</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Diagnosis</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {leaveApplications.map((leave, index) => (
                    <tr key={leave._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-300">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{leave.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{leave.fromDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{leave.toDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{leave.diagnosis}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-lg ${leave.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : leave.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                            }`}
                        >
                          {leave.status && typeof leave.status === "string"
                            ? leave.status.charAt(0).toUpperCase() + leave.status.slice(1)
                            : "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedLeave(leave)}
                          className="text-primary text-sm hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No medical leave applications found.</p>
            )}

            {/* Modal for viewing selected leave details */}
            {selectedLeave && (
              <div className="glass-card p-5 mt-4 border-l-2 border-primary">
                <h3 className="text-sm font-semibold mb-3 text-white">
                  Medical Leave Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-400"><span className="text-gray-300 font-medium">Reason:</span> {selectedLeave.reason}</p>
                  <p className="text-gray-400"><span className="text-gray-300 font-medium">Duration:</span> {selectedLeave.fromDate} to {selectedLeave.toDate}</p>
                  <p className="text-gray-400"><span className="text-gray-300 font-medium">Diagnosis:</span> {selectedLeave.diagnosis}</p>
                  <p className="text-gray-400"><span className="text-gray-300 font-medium">Doctor:</span> {selectedLeave.doctorName}</p>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-medium rounded-lg ${selectedLeave.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : selectedLeave.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                      }`}
                  >
                    {selectedLeave.status.charAt(0).toUpperCase() +
                      selectedLeave.status.slice(1)}
                  </span>
                  <button
                    onClick={() => setSelectedLeave(null)}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="glass-card p-5 mb-8 animate-fade-in">
            <h2 className="text-base font-semibold mb-4 text-white">
              My Appointments
            </h2>
            {appointmentsLoading ? (
              <p className="text-gray-400 text-sm">Loading appointments...</p>
            ) : appointmentsError ? (
              <p className="text-red-400 text-sm">{appointmentsError}</p>
            ) : appointments.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-white/[0.03]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date & Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Prescription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {appointments.map((appointment) => (
                    <tr key={appointment._id || appointment.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {appointment.doctorId?.name || "Not specified"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {formatDate(appointment.slotDateTime)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${appointment.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : appointment.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : appointment.status === "cancelled"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-gray-500/10 text-gray-400"
                            }`}
                        >
                          {appointment.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {appointment.prescription ? (
                          <a
                            href={appointment.prescription}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-sm hover:underline"
                          >
                            View Prescription
                          </a>
                        ) : (
                          <span className="text-gray-500">No prescription</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No appointments found.</p>
            )}
          </div>
        )}

        {activeTab === "healthRecords" && (
          <>
            <div className="glass-card p-5 mb-8 animate-fade-in">
              <h2 className="text-base font-semibold mb-4 text-white">
                Health Records
              </h2>
              {loading ? (
                <p className="text-gray-400 text-sm">Loading health records...</p>
              ) : error ? (
                <p className="text-red-400 text-sm">{error}</p>
              ) : healthRecords.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-white/[0.03]">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sno.</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Diagnosis</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {healthRecords.map((record, index) => (
                      <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-300">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{record.diagnosis}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => viewHealthRecordDetails(record.id)}
                            className="text-primary hover:underline mr-4 text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteHealthRecord(record.id)}
                            className="text-red-400 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No health records found.</p>
              )}
            </div>
            {/* Display Selected Health Record Details */}
            {selectedRecord && (
              <div className="glass-card p-5 mb-8 animate-fade-in border-l-2 border-primary">
                <h3 className="text-sm font-semibold mb-3 text-white">
                  Health Record Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-400"><span className="text-gray-300 font-medium">Diagnosis:</span> {selectedRecord.diagnosis}</p>
                  <p className="text-gray-400"><span className="text-gray-300 font-medium">Date:</span> {new Date(selectedRecord.date).toLocaleDateString()}</p>
                  <p className="text-gray-400"><span className="text-gray-300 font-medium">Treatment:</span> {selectedRecord.treatment || "N/A"}</p>
                  <p className="text-gray-400"><span className="text-gray-300 font-medium">Prescription:</span> {selectedRecord.prescription || "N/A"}</p>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="mt-3 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Dismiss
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "aiDiagnosis" && (
          <div className="glass-card p-6 mb-8 animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 text-white">
              AI Diagnosis
            </h2>
            <p>This is where your AI Diagnosis content would go.</p>
          </div>
        )}

        {/* Modal for displaying search results */}
        {searchResults.length > 0 && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border border-white/10 w-96 shadow-lg rounded-md bg-surface">
              <h3 className="text-lg font-medium leading-6 text-white mb-2">
                Search Results
              </h3>
              {searchResults.map((record) => (
                <div key={record._id} className="mb-4 border-b border-white/10 pb-2">
                  <p className="text-gray-300">
                    <strong className="text-white">Diagnosis:</strong> {record.diagnosis}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">Date:</strong>{" "}
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">Treatment:</strong> {record.treatment || "N/A"}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">Prescription:</strong>{" "}
                    {record.prescription || "N/A"}
                  </p>
                </div>
              ))}
              <button
                onClick={() => setSearchResults([])}
                className="mt-4 bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
