import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";
import { Bell, Settings, Search, Eye, Calendar, FileText, User, UserPlus, Users, Activity, AlertCircle } from 'lucide-react';
import { api } from '../../axios.config';
import Notibell from '../Noti/Notibell';
import socket from "../../socket"; // Make sure it's the same shared socket instance
import { showAlert } from '../alert-system';
import Sidebar from "../Sidebar";

const AdminDashboard = () => {
  // Sample data for student leave applications
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All Status'); // New state for filter
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Sample data for health records
  const [healthRecords, setHealthRecords] = useState([]);

  // New states for search suggestions
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await api.get("/medical-leaves/healthrecord"); // Corrected API endpoint
        console.log("API Response:", response.data);

        const formattedData = response.data.map(record => ({
          ...record,
          docUrls: record.attachments
            ? record.attachments.map(att => ({
              url: att.url || "#", // Fallback URL
              format: att.url ? att.url.split('.').pop().toLowerCase() : "unknown", // Fallback format
            }))
            : [],
        }));

        setHealthRecords(formattedData);
      } catch (error) {
        console.error("Error fetching health records:", error);
      }
    };

    fetchHealthRecords();
  }, []);

  // Sample data for doctors
  // Doctors state
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/user/doctors');
        console.log("Doctors API Response:", response.data);

        const formattedDoctors = response.data.map(doc => ({
          id: doc.id,
          name: doc.name.startsWith('Dr.') ? doc.name : `Dr. ${doc.name}`,
          specialization: doc.specialization || 'General Specialist', // Fallback
          contact: doc.phone || 'N/A',
          availability: 'Mon - Fri' // Hardcoded for now as it's not in DB
        }));

        setDoctors(formattedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  // Dashboard Statistics
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingLeaves: 0,
    openHealthCases: 0,
    availableDoctors: 0,
  });

  const [healthIssuesData, setHealthIssuesData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data);

        const analyticsRes = await api.get('/admin/analytics');
        setHealthIssuesData(analyticsRes.data.commonHealthIssues);
        setMonthlyData(analyticsRes.data.monthlyVisits);

      } catch (error) {
        console.error("Error fetching dashboard analytics:", error);
      }
    };

    fetchStats();
  }, []);

  // State for active tab
  const [activeTab, setActiveTab] = useState('leave');

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        const response = await api.get("/medical-leaves");
        console.log("Frontend: API Response for medical-leaves:", response.data);
        setLeaveApplications(response.data);
      } catch (error) {
        console.error("Frontend: Error fetching leave applications:", error);
      }
    };
    fetchLeaveApplications();

    socket.on("newLeaveNotification", (data) => {
      console.log("📬 Leave notification received in dashboard:", data);

      if (data.notification) {
        showAlert(data.notification.message);
      }
      console.log('leave object is ', data.leave);

      if (data.leave) {
        setLeaveApplications((prev) => {
          // Ensure we always use _id as the identifier from backend, but store as id in frontend
          const leaveId = data.leave._id;

          const formattedLeave = {
            ...data.leave,
            id: leaveId, // Store as id for frontend consistency
            duration: `${data.leave.fromDate} to ${data.leave.toDate} `
          };

          // Check if item exists using the id property that our frontend uses
          const exists = prev.some((item) => item.id === leaveId);

          if (exists) {
            return prev.map((item) =>
              item.id === leaveId ? { ...item, ...formattedLeave } : item
            );
          } else {
            return [formattedLeave, ...prev];
          }
        });
      }
    });

    return () => {
      socket.off("newLeaveNotification");
    };
  }, []);

  // Debounced API call for search suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        api
          .get("/medical-leaves/searchSuggestions", { params: { query: searchQuery } })
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // When a search suggestion is clicked, use it as a query to search health records
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    api
      .get("/medical-leaves/search", { params: { query: suggestion } })
      .then((res) => {
        setSearchResults(res.data);
      })
      .catch((err) => {
        console.error("Error fetching search results:", err);
        setSearchResults([]);
      });
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      await api.patch(`/ medical - leaves / ${id}/status`, { status });
      // Refresh the leave applications after updating
      const response = await api.get("/medical-leaves");
      setLeaveApplications(response.data);
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };
  const [selectedLeave, setSelectedLeave] = useState(null);

  const viewLeaveDetails = async (id) => {
    try {
      const response = await api.get(`/medical-leaves/${id}/details`);
      setSelectedLeave({
        ...response.data,
        docUrls: response.data.supportingDocuments
          ? response.data.supportingDocuments.map(att => ({
            url: att.url,
            format: att.url.split('.').pop().toLowerCase()
          }))
          : []
      });
    } catch (error) {
      console.error("Error fetching leave details:", error);
      // Display an error message to the user
      alert("An error occurred while fetching leave details. Please try again later.");
    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };


  return (
    <div className="flex min-h-screen bg-transparent text-white">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main Content */}
      <div className="flex-1 p-8 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">College Medical Admin Dashboard</h1>
          <div className="flex items-center space-x-4">

            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-surface/50 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-all duration-300 focus:w-64 w-48"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {/* Dropdown for suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute bg-surface border border-white/10 rounded-lg mt-1 w-full z-10 shadow-xl">
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-white/10 cursor-pointer text-gray-200"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>


            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Students', value: stats.totalStudents, color: 'bg-gradient-to-r from-blue-600 to-cyan-500', icon: Users },
            { title: 'Pending Leaves', value: stats.pendingLeaves, color: 'bg-gradient-to-r from-amber-500 to-yellow-400', icon: FileText },
            { title: 'Open Health Cases', value: stats.openHealthCases, color: 'bg-gradient-to-r from-red-600 to-rose-500', icon: AlertCircle },
            { title: 'Available Doctors', value: stats.availableDoctors, color: 'bg-gradient-to-r from-emerald-500 to-lime-500', icon: User }
          ].map((item, index) => (
            <div key={index} className="glass-card p-6 hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-20 h-20 ${item.color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-150 duration-500`}></div>
              <div className="flex justify-between items-center mb-4 relative z-10">
                <div className={`${item.color} p-3 rounded-lg shadow-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-gray-400 text-sm bg-white/5 px-2 py-1 rounded">Last 30 days</span>
              </div>
              <h2 className="text-2xl font-bold text-white relative z-10">{item.value}</h2>
              <p className="text-gray-300 relative z-10">{item.title}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-white/10">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('leave')}
              className={`pb-4 px-1 transition-all duration-300 ${activeTab === 'leave' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-400 hover:text-primary transition-colors'}`}
            >
              Leave Applications
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`pb-4 px-1 transition-all duration-300 ${activeTab === 'health' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-400 hover:text-primary transition-colors'}`}
            >
              Health Records
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`pb-4 px-1 transition-all duration-300 ${activeTab === 'doctors' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-400 hover:text-primary transition-colors'}`}
            >
              Doctors
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-4 px-1 transition-all duration-300 ${activeTab === 'analytics' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-400 hover:text-primary transition-colors'}`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="glass-card p-6 animate-fade-in">
          {/* Leave Applications Tab */}
          {activeTab === 'leave' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Student Leave Applications</h2>
                <div className="flex space-x-2">
                  <select className="border border-white/20 rounded-lg px-3 py-2 bg-surface text-white focus:outline-none focus:ring-2 focus:ring-primary" value={selectedStatus} onChange={handleStatusChange}>
                    <option value="All Status">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 text-white px-4 py-2 rounded-lg flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" /> New Application
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Health issue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-transparent divide-y divide-white/10">
                    {[...leaveApplications]
                      .filter(app => selectedStatus === 'All Status' || app.status === selectedStatus)
                      .sort((a, b) => {
                        const aStart = new Date(a.duration.split(" to ")[0]);
                        const bStart = new Date(b.duration.split(" to ")[0]);
                        return bStart - aStart; // Sort by startDate (descending)
                      })
                      .map((app, index) => (
                        <tr key={app._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{app.studentName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{app.studentId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{app.gender}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{app.duration}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{app.diagnosis}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                              app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button onClick={() => viewLeaveDetails(app.id)} className="text-primary hover:text-blue-300 mr-3 transition-colors">View</button>
                            {app.status === 'pending' && (
                              <>
                                <button onClick={() => updateLeaveStatus(app.id, 'approved')} className="text-green-400 hover:text-green-300 mr-3 transition-colors">Approve</button>
                                <button onClick={() => updateLeaveStatus(app.id, 'rejected')} className="text-red-400 hover:text-red-300 transition-colors">Reject</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>

                </table>
                {selectedLeave && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border border-white/10 w-96 shadow-lg rounded-md bg-surface">
                      <h3 className="text-lg font-medium leading-6 text-white mb-2">Leave Details</h3>
                      <p className="text-gray-300"><strong className="text-white">Student:</strong> {selectedLeave.studentName}</p>
                      <p className="text-gray-300"><strong className="text-white">StudentId:</strong> {selectedLeave.studentId}</p>
                      <p className="text-gray-300"><strong className="text-white">gender:</strong> {selectedLeave.gender}</p>
                      <p className="text-gray-300"><strong className="text-white">Duration:</strong> {selectedLeave.duration}</p>
                      <p className="text-gray-300"><strong className="text-white">Reason:</strong> {selectedLeave.reason}</p>
                      <p className="text-gray-300"><strong className="text-white">Status:</strong> {selectedLeave.status}</p>
                      <p className="text-gray-300"><strong className="text-white">Email:</strong> {selectedLeave.email}</p>
                      <p className="text-gray-300"><strong className="text-white">Phone:</strong> {selectedLeave.phone}</p>
                      <p className="text-gray-300"><strong className="text-white">DOB:</strong> {selectedLeave.dateOfBirth}</p>
                      <p className="text-gray-300"><strong className="text-white">health issue:</strong> {selectedLeave.diagnosis}</p>
                      <p className="text-gray-300"><strong className="text-white">Doctor:</strong> {selectedLeave.doctorName}</p>
                      <p className="text-gray-300"><strong className="text-white">treatment:</strong> {selectedLeave.treatment}</p>
                      <p className="text-gray-300"><strong className="text-white">prescription:</strong> {selectedLeave.prescription}</p>
                      {selectedLeave.docUrls && selectedLeave.docUrls.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-white">Supporting documents:</h4>
                          {selectedLeave.docUrls.map((attachment, index) => (
                            <div key={index} className="mt-2">
                              {attachment.format === 'pdf' ? (
                                <iframe
                                  src={`${attachment.url}#view=FitH`}
                                  className="w-full h-64 border border-white/20"
                                  title={`PDF Attachment ${index + 1}`}
                                ></iframe>
                              ) : (
                                <img
                                  src={attachment.url}
                                  alt={`Image Attachment ${index + 1}`}
                                  className="max-w-full h-auto border border-white/20"
                                />
                              )}
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline block mt-2"
                              >
                                Download {attachment.format.toUpperCase()}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedLeave(null)}
                        className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Health Records Tab */}
          {activeTab === 'health' && (
            <div className="w-full max-w-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
                <h2 className="text-xl font-semibold">Student Health Records</h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    placeholder="Search by ID or Name"
                    className="border border-white/20 rounded-lg px-3 py-2 w-full sm:w-auto bg-surface text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                  />
                  <button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 mr-2" /> Add Record
                  </button>
                </div>
              </div>

              <div className="w-full overflow-hidden">
                <div className="overflow-x-auto shadow rounded-lg">
                  <table className="w-full table-fixed divide-y divide-white/10">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="w-[8%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Record ID</th>
                        <th className="w-[14%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Student Name</th>
                        <th className="w-[12%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Student ID</th>
                        <th className="w-[10%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gender</th>
                        <th className="w-[14%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Diagnosis</th>
                        <th className="w-[12%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                        <th className="w-[14%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Prescription</th>
                        <th className="w-[16%] px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-white/10">
                      {healthRecords.map((record, index) => (
                        <tr key={record.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-white truncate">{index + 1}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 truncate">{record.studentName}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 truncate">{record.studentId}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 truncate">{record.gender}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 truncate">{record.diagnosis}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 truncate">{record.date}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 truncate">{record.prescription}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm truncate">
                            {record.docUrls && record.docUrls.length > 0 ? (
                              <button
                                onClick={() => setSelectedRecord(record)}
                                className="text-primary hover:text-blue-300 text-xs sm:text-sm transition-colors"
                              >
                                View Attachments
                              </button>
                            ) : (
                              <span className="text-gray-500 text-xs sm:text-sm">No Attachments</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedRecord && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-4 sm:pt-10">
                    <div className="relative mx-auto p-4 sm:p-5 border border-white/10 w-[95%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] shadow-lg rounded-md bg-surface max-h-[90vh] overflow-y-auto">
                      <h3 className="text-lg font-medium leading-none mb-4 text-white">
                        Attachments for {selectedRecord.studentName}
                      </h3>

                      {/* Render Attachments */}
                      {selectedRecord.docUrls.map((attachment, index) => (
                        <div key={index} className="mt-4">
                          {attachment.format === 'pdf' ? (
                            // Render PDF
                            <iframe
                              src={`${attachment.url}#view=FitH`}
                              title={`Attachment ${index + 1}`}
                              frameBorder={1}
                              width="100%"
                              height={300}
                              className="border border-white/20"
                            ></iframe>
                          ) : (
                            // Render Image
                            <img
                              src={attachment.url}
                              alt={`Attachment ${index + 1}`}
                              className="max-w-full h-auto border border-white/20 mx-auto"
                            />
                          )}
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline block mt-2"
                          >
                            Download {attachment.format.toUpperCase()}
                          </a>
                        </div>
                      ))}

                      {/* Close Button */}
                      <div className="flex justify-center sm:justify-end mt-5">
                        <button
                          onClick={() => setSelectedRecord(null)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">College Medical Staff</h2>
                <button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 text-white px-4 py-2 rounded-lg flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" /> Add Doctor
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="border border-white/10 rounded-xl p-6 flex bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xl font-bold mr-4">
                      {doctor.name.split(' ')[1][0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{doctor.name}</h3>
                      <p className="text-primary font-medium">{doctor.specialization}</p>
                      <p className="text-gray-300 mt-1">{doctor.contact}</p>
                      <p className="text-gray-300">Available: {doctor.availability}</p>
                      <div className="mt-3 flex space-x-2">
                        <button className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-lg hover:bg-primary/20 transition-colors">View Schedule</button>
                        <button className="text-sm bg-white/10 text-gray-300 px-3 py-1 rounded-lg hover:bg-white/20 transition-colors">Contact</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Health Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-white/10 rounded-xl p-6 bg-white/5">
                  <h3 className="text-lg font-medium mb-4">Monthly Health Visits</h3>
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorCheckups" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis
                          dataKey="month"
                          stroke="rgba(255,255,255,0.2)"
                          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="rgba(255,255,255,0.2)"
                          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            backdropFilter: 'blur(4px)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          itemStyle={{ color: '#06b6d4' }}
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar
                          dataKey="checkups"
                          fill="url(#colorCheckups)"
                          name="Checkups"
                          radius={[4, 4, 0, 0]}
                          barSize={30}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="border border-white/10 rounded-xl p-6 bg-white/5">
                  <h3 className="text-lg font-medium mb-4">Common Health Issues</h3>
                  <div className="w-full h-[300px] flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={healthIssuesData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                          labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                        >
                          {healthIssuesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][index % 5]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            backdropFilter: 'blur(4px)'
                          }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          wrapperStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Modal for displaying search results */}
        {searchResults.length > 0 && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm overflow-y-auto h-full w-full">
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
                className="mt-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
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

export default AdminDashboard;