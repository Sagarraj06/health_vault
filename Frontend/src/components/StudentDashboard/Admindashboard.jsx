import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, ResponsiveContainer, Cell, Legend
} from "recharts";
import { Bell, Settings, Search, Eye, Calendar, FileText, User, UserPlus, Users, Activity, AlertCircle } from 'lucide-react';
import { api } from '../../axios.config';
import Notibell from '../Noti/Notibell';
import socket from "../../socket";
import { showAlert } from '../alert-system';
import Sidebar from "../Sidebar";

const AdminDashboard = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await api.get("/medical-leaves/healthrecord");
        const formattedData = response.data.map(record => ({
          ...record,
          docUrls: record.attachments
            ? record.attachments.map(att => ({
              url: att.url || "#",
              format: att.url ? att.url.split('.').pop().toLowerCase() : "unknown",
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

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/user/doctors');
        const formattedDoctors = response.data.map(doc => ({
          id: doc.id,
          name: doc.name.startsWith('Dr.') ? doc.name : `Dr. ${doc.name}`,
          specialization: doc.specialization || 'General Specialist',
          contact: doc.phone || 'N/A',
          availability: 'Mon - Fri'
        }));
        setDoctors(formattedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

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

  const [activeTab, setActiveTab] = useState('leave');

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        const response = await api.get("/medical-leaves");
        setLeaveApplications(response.data);
      } catch (error) {
        console.error("Frontend: Error fetching leave applications:", error);
      }
    };
    fetchLeaveApplications();

    socket.on("newLeaveNotification", (data) => {
      if (data.notification) {
        showAlert(data.notification.message);
      }
      if (data.leave) {
        setLeaveApplications((prev) => {
          const leaveId = data.leave._id;
          const formattedLeave = {
            ...data.leave,
            id: leaveId,
            duration: `${data.leave.fromDate} to ${data.leave.toDate} `
          };
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        api
          .get("/medical-leaves/searchSuggestions", { params: { query: searchQuery } })
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
      .get("/medical-leaves/search", { params: { query: suggestion } })
      .then((res) => setSearchResults(res.data))
      .catch(() => setSearchResults([]));
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      await api.patch(`/ medical - leaves / ${id}/status`, { status });
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
      alert("An error occurred while fetching leave details. Please try again later.");
    }
  };

  const handleStatusChange = (e) => setSelectedStatus(e.target.value);

  const CHART_COLORS = ['#0D9488', '#F59E0B', '#EF4444', '#3B82F6', '#10B981'];

  return (
    <div className="flex min-h-screen bg-surface-alt text-text">
      <Sidebar role="admin" />

      <div className="flex-1 p-6 lg:p-8 transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-text font-heading">Admin Dashboard</h1>
            <p className="text-text-light text-sm mt-1">College Medical Management</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2.5 border border-border rounded-xl bg-card text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-48 focus:w-64 text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {suggestions.length > 0 && (
                <div className="absolute bg-card border border-border rounded-xl mt-1 w-full z-10 shadow-lg overflow-hidden">
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="px-4 py-2.5 hover:bg-surface-alt cursor-pointer text-text text-sm transition-colors"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-semibold shadow-sm">
              A
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { title: 'Total Students', value: stats.totalStudents, color: 'bg-blue-50 text-blue-600', iconBg: 'bg-blue-100', icon: Users },
            { title: 'Pending Leaves', value: stats.pendingLeaves, color: 'bg-amber-50 text-amber-600', iconBg: 'bg-amber-100', icon: FileText },
            { title: 'Open Health Cases', value: stats.openHealthCases, color: 'bg-red-50 text-red-600', iconBg: 'bg-red-100', icon: AlertCircle },
            { title: 'Available Doctors', value: stats.availableDoctors, color: 'bg-emerald-50 text-emerald-600', iconBg: 'bg-emerald-100', icon: User }
          ].map((item, index) => (
            <div key={index} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className={`${item.iconBg} p-2.5 rounded-xl`}>
                  <item.icon className={`w-5 h-5 ${item.color.split(' ')[1]}`} />
                </div>
                <span className="text-muted text-xs bg-surface-alt px-2 py-1 rounded-lg">Last 30 days</span>
              </div>
              <h2 className="text-2xl font-bold text-text">{item.value}</h2>
              <p className="text-text-light text-sm mt-1">{item.title}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-border">
          <div className="flex gap-1">
            {['leave', 'health', 'doctors', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-4 text-sm font-medium transition-all rounded-t-lg ${activeTab === tab
                  ? 'border-b-2 border-primary text-primary bg-primary/5'
                  : 'text-text-light hover:text-text hover:bg-surface-alt'
                }`}
              >
                {tab === 'leave' ? 'Leave Applications' : tab === 'health' ? 'Health Records' : tab === 'doctors' ? 'Doctors' : 'Analytics'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-card border border-border rounded-2xl p-6 animate-fade-in">
          {activeTab === 'leave' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <h2 className="text-lg font-semibold text-text">Student Leave Applications</h2>
                <div className="flex gap-2">
                  <select className="border border-border rounded-xl px-3 py-2 bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" value={selectedStatus} onChange={handleStatusChange}>
                    <option value="All Status">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl flex items-center text-sm font-medium transition-colors">
                    <UserPlus className="w-4 h-4 mr-2" /> New Application
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-surface-alt">
                    <tr>
                      {['ID', 'Student Name', 'Student ID', 'Gender', 'Duration', 'Health Issue', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-light uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {[...leaveApplications]
                      .filter(app => selectedStatus === 'All Status' || app.status === selectedStatus)
                      .sort((a, b) => new Date(b.duration.split(" to ")[0]) - new Date(a.duration.split(" to ")[0]))
                      .map((app, index) => (
                        <tr key={app._id} className="hover:bg-surface-alt/50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-text">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-text-light">{app.studentName}</td>
                          <td className="px-4 py-3 text-sm text-text-light">{app.studentId}</td>
                          <td className="px-4 py-3 text-sm text-text-light">{app.gender}</td>
                          <td className="px-4 py-3 text-sm text-text-light">{app.duration}</td>
                          <td className="px-4 py-3 text-sm text-text-light">{app.diagnosis}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${app.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                              app.status === 'rejected' ? 'bg-red-50 text-red-700' :
                                'bg-amber-50 text-amber-700'
                              }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button onClick={() => viewLeaveDetails(app.id)} className="text-primary hover:text-primary-dark mr-2 font-medium transition-colors">View</button>
                            {app.status === 'pending' && (
                              <>
                                <button onClick={() => updateLeaveStatus(app.id, 'approved')} className="text-emerald-600 hover:text-emerald-700 mr-2 font-medium transition-colors">Approve</button>
                                <button onClick={() => updateLeaveStatus(app.id, 'rejected')} className="text-red-500 hover:text-red-600 font-medium transition-colors">Reject</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {selectedLeave && (
                  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
                      <h3 className="text-lg font-semibold text-text mb-4">Leave Details</h3>
                      <div className="space-y-2 text-sm">
                        {[
                          ['Student', selectedLeave.studentName],
                          ['Student ID', selectedLeave.studentId],
                          ['Gender', selectedLeave.gender],
                          ['Duration', selectedLeave.duration],
                          ['Reason', selectedLeave.reason],
                          ['Status', selectedLeave.status],
                          ['Email', selectedLeave.email],
                          ['Phone', selectedLeave.phone],
                          ['DOB', selectedLeave.dateOfBirth],
                          ['Health Issue', selectedLeave.diagnosis],
                          ['Doctor', selectedLeave.doctorName],
                          ['Treatment', selectedLeave.treatment],
                          ['Prescription', selectedLeave.prescription],
                        ].map(([label, value]) => (
                          <p key={label} className="text-text-light"><strong className="text-text font-medium">{label}:</strong> {value}</p>
                        ))}
                      </div>
                      {selectedLeave.docUrls && selectedLeave.docUrls.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-text text-sm mb-2">Supporting documents:</h4>
                          {selectedLeave.docUrls.map((attachment, index) => (
                            <div key={index} className="mt-2">
                              {attachment.format === 'pdf' ? (
                                <iframe src={`${attachment.url}#view=FitH`} className="w-full h-64 border border-border rounded-lg" title={`PDF Attachment ${index + 1}`}></iframe>
                              ) : (
                                <img src={attachment.url} alt={`Image Attachment ${index + 1}`} className="max-w-full h-auto border border-border rounded-lg" />
                              )}
                              <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block mt-1 text-sm">
                                Download {attachment.format.toUpperCase()}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                      <button onClick={() => setSelectedLeave(null)} className="mt-4 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-xl transition-colors w-full">
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="w-full max-w-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h2 className="text-lg font-semibold text-text">Student Health Records</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input type="text" placeholder="Search by ID or Name" className="border border-border rounded-xl px-3 py-2 bg-card text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                  <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl flex items-center justify-center text-sm font-medium transition-colors">
                    <FileText className="w-4 h-4 mr-2" /> Add Record
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full table-fixed divide-y divide-border">
                  <thead className="bg-surface-alt">
                    <tr>
                      {['Record ID', 'Student Name', 'Student ID', 'Gender', 'Diagnosis', 'Date', 'Prescription', 'Actions'].map(h => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-text-light uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {healthRecords.map((record, index) => (
                      <tr key={record.id} className="hover:bg-surface-alt/50 transition-colors">
                        <td className="px-3 py-3 text-sm font-medium text-text truncate">{index + 1}</td>
                        <td className="px-3 py-3 text-sm text-text-light truncate">{record.studentName}</td>
                        <td className="px-3 py-3 text-sm text-text-light truncate">{record.studentId}</td>
                        <td className="px-3 py-3 text-sm text-text-light truncate">{record.gender}</td>
                        <td className="px-3 py-3 text-sm text-text-light truncate">{record.diagnosis}</td>
                        <td className="px-3 py-3 text-sm text-text-light truncate">{record.date}</td>
                        <td className="px-3 py-3 text-sm text-text-light truncate">{record.prescription}</td>
                        <td className="px-3 py-3 text-sm truncate">
                          {record.docUrls && record.docUrls.length > 0 ? (
                            <button onClick={() => setSelectedRecord(record)} className="text-primary hover:text-primary-dark text-sm font-medium transition-colors">View Attachments</button>
                          ) : (
                            <span className="text-muted text-sm">No Attachments</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedRecord && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                  <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold text-text mb-4">Attachments for {selectedRecord.studentName}</h3>
                    {selectedRecord.docUrls.map((attachment, index) => (
                      <div key={index} className="mt-4">
                        {attachment.format === 'pdf' ? (
                          <iframe src={`${attachment.url}#view=FitH`} title={`Attachment ${index + 1}`} width="100%" height={300} className="border border-border rounded-lg"></iframe>
                        ) : (
                          <img src={attachment.url} alt={`Attachment ${index + 1}`} className="max-w-full h-auto border border-border rounded-lg mx-auto" />
                        )}
                        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block mt-2 text-sm">
                          Download {attachment.format.toUpperCase()}
                        </a>
                      </div>
                    ))}
                    <div className="flex justify-end mt-5">
                      <button onClick={() => setSelectedRecord(null)} className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-xl transition-colors">Close</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'doctors' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-text">College Medical Staff</h2>
                <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl flex items-center text-sm font-medium transition-colors">
                  <UserPlus className="w-4 h-4 mr-2" /> Add Doctor
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="border border-border rounded-2xl p-5 flex bg-card hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-lg font-bold mr-4 flex-shrink-0">
                      {doctor.name.split(' ')[1]?.[0] || 'D'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-text">{doctor.name}</h3>
                      <p className="text-primary text-sm font-medium">{doctor.specialization}</p>
                      <p className="text-text-light text-sm mt-1">{doctor.contact}</p>
                      <p className="text-text-light text-sm">Available: {doctor.availability}</p>
                      <div className="mt-3 flex gap-2">
                        <button className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 font-medium transition-colors">View Schedule</button>
                        <button className="text-xs bg-surface-alt text-text-light px-3 py-1.5 rounded-lg hover:bg-border font-medium transition-colors">Contact</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-lg font-semibold mb-6 text-text">Health Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-border rounded-2xl p-5 bg-card">
                  <h3 className="text-base font-semibold mb-4 text-text">Monthly Health Visits</h3>
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="month" stroke="#94A3B8" tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94A3B8" tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                          itemStyle={{ color: '#0D9488' }}
                          cursor={{ fill: 'rgba(13,148,136,0.05)' }}
                        />
                        <Bar dataKey="checkups" fill="#0D9488" name="Checkups" radius={[6, 6, 0, 0]} barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="border border-border rounded-2xl p-5 bg-card">
                  <h3 className="text-base font-semibold mb-4 text-text">Common Health Issues</h3>
                  <div className="w-full h-[300px] flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={healthIssuesData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                          fill="#8884d8" paddingAngle={5} dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                          labelLine={{ stroke: '#94A3B8' }}
                        >
                          {healthIssuesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px' }} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-semibold text-text mb-4">Search Results</h3>
              {searchResults.map((record) => (
                <div key={record._id} className="mb-4 border-b border-border pb-3">
                  <p className="text-text-light text-sm"><strong className="text-text font-medium">Diagnosis:</strong> {record.diagnosis}</p>
                  <p className="text-text-light text-sm"><strong className="text-text font-medium">Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                  <p className="text-text-light text-sm"><strong className="text-text font-medium">Treatment:</strong> {record.treatment || "N/A"}</p>
                  <p className="text-text-light text-sm"><strong className="text-text font-medium">Prescription:</strong> {record.prescription || "N/A"}</p>
                </div>
              ))}
              <button onClick={() => setSearchResults([])} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors w-full">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
