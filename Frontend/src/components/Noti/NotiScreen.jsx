'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Calendar, VideoIcon, ClockIcon, FileText, Search, X, User, ChevronDown, ChevronRight, Filter, Menu, MoreHorizontal } from 'lucide-react';

const NotiScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  
  // Sample notification data
  const notifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'New Appointment Scheduled',
      description: 'Dr. Sarah Chen - Cardiology Checkup',
      time: '10:30 AM, April 3rd',
      status: 'upcoming',
      unread: true,
      timestamp: '23m',
      dateCreated: new Date(2025, 2, 29, 10, 37)
    },
    {
      id: 2,
      type: 'videoConsultation',
      title: 'Video Consultation Confirmed',
      description: 'Dr. James Wilson - Follow-up Consultation',
      time: '2:00 PM, April 2nd',
      status: 'confirmed',
      unread: true,
      timestamp: '1h',
      dateCreated: new Date(2025, 2, 29, 9, 0)
    },
    {
      id: 3,
      type: 'leave',
      title: 'Leave Application Approved',
      description: 'Medical Leave: March 28 - April 1',
      status: 'approved',
      unread: false,
      timestamp: '2h',
      dateCreated: new Date(2025, 2, 29, 8, 0)
    },
    {
      id: 4,
      type: 'videoConsultation',
      title: 'Video Consultation Rescheduled',
      description: 'Dr. Maria Rodriguez - Therapy Session',
      time: '11:15 AM, April 5th',
      status: 'rescheduled',
      unread: true,
      timestamp: '3h',
      dateCreated: new Date(2025, 2, 29, 7, 0)
    },
    {
      id: 5,
      type: 'appointment',
      title: 'Appointment Reminder',
      description: 'Annual Physical Checkup - City Hospital',
      time: '9:00 AM, April 10th',
      status: 'reminder',
      unread: false,
      timestamp: '1d',
      dateCreated: new Date(2025, 2, 28, 10, 0)
    },
    {
      id: 6,
      type: 'leave',
      title: 'Leave Application Under Review',
      description: 'Personal Leave: April 15 - April 18',
      status: 'pending',
      unread: true,
      timestamp: '1d',
      dateCreated: new Date(2025, 2, 28, 9, 0)
    },
    {
      id: 7,
      type: 'videoConsultation',
      title: 'Video Consultation Booking Confirmed',
      description: 'Dr. John Murphy - Dermatology Consultation',
      time: '3:30 PM, April 8th',
      status: 'confirmed',
      unread: false,
      timestamp: '2d',
      dateCreated: new Date(2025, 2, 27, 14, 0)
    }
  ];
  
  // Sort notifications by date (most recent first) and filter based on search
  useEffect(() => {
    const filtered = notifications
      .filter(notification => {
        if (searchQuery === '') return true;
        
        return (
          notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (notification.time && notification.time.toLowerCase().includes(searchQuery.toLowerCase())) ||
          notification.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
      .sort((a, b) => b.dateCreated - a.dateCreated);
    
    setFilteredNotifications(filtered);
  }, [searchQuery]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && !event.target.closest('.filter-dropdown')) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const { data } = await axios.get("http://your-backend-url/api/notifications");
  //       setNotifications(data); // Assuming API returns an array
  //     } catch (error) {
  //       console.error("Error fetching notifications", error);
  //     }
  //   };

  //   fetchNotifications();
  // }, []);
  // Get icon based on notification type
  const getIcon = (type) => {
    switch(type) {
      case 'appointment':
        return <Calendar className="h-5 w-5 text-primary" />;
      case 'videoConsultation':
        return <VideoIcon className="h-5 w-5 text-primary" />;
      case 'leave':
        return <FileText className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'upcoming':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400">Upcoming</span>;
      case 'confirmed':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400">Confirmed</span>;
      case 'approved':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400">Approved</span>;
      case 'pending':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-lg bg-yellow-500/10 text-yellow-400">Pending</span>;
      case 'rescheduled':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-lg bg-cyan-500/10 text-cyan-400">Rescheduled</span>;
      case 'reminder':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-lg bg-primary/10 text-primary">Reminder</span>;
      default:
        return null;
    }
  };

  return (
    <div className="glass-card w-full max-w-4xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-primary/10 border-b border-white/[0.06] p-3 sm:p-4">
        <div className="flex justify-between items-center">
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 p-1 rounded-lg hover:bg-white/[0.04] focus:outline-none"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          
          <h1 className="text-white text-sm sm:text-base font-semibold ml-2 lg:ml-0">Notifications</h1>
          
          <div className="flex gap-2">
            <div className="relative inline-block">
              <span className="absolute -top-0.5 -right-0.5 block h-2 w-2 rounded-full bg-red-500" />
              <button className="bg-white/[0.06] p-2 rounded-lg text-gray-300 hover:bg-white/[0.1] transition-colors">
                <Bell className="h-4 w-4" />
              </button>
            </div>
            <button className="bg-white/[0.06] p-2 rounded-lg text-gray-300 hover:bg-white/[0.1] transition-colors">
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="mt-3 p-2 bg-surface-elevated rounded-xl border border-white/[0.06] lg:hidden">
            <div className="flex flex-col gap-0.5">
              {['All Notifications', 'Mark All as Read', 'Settings', 'Help Center'].map((item) => (
                <button key={item} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/[0.04] rounded-lg transition-colors">
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Search and filter */}
      <div className="p-3 sm:p-4 border-b border-white/[0.06]">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              className="bg-white/[0.03] border border-white/[0.06] text-white text-sm rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 block w-full pl-10 p-2.5 placeholder-gray-500 focus:outline-none transition-all"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4 text-gray-500 hover:text-white transition-colors" />
              </button>
            )}
          </div>
          
          <div className="relative filter-dropdown">
            <button
              className="flex items-center justify-center w-full sm:w-auto bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-sm text-gray-300 hover:bg-white/[0.06] transition-colors"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4 mr-1.5" />
              <span className="mr-1">Filter</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-surface-elevated border border-white/[0.06] rounded-xl shadow-2xl z-10">
                <div className="p-4">
                  <h3 className="font-medium text-white text-sm mb-2">Filter by Type</h3>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="h-3.5 w-3.5 accent-primary rounded" defaultChecked />
                      <span className="ml-2 text-xs text-gray-300">Appointments</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="h-3.5 w-3.5 accent-primary rounded" defaultChecked />
                      <span className="ml-2 text-xs text-gray-300">Video Consultations</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="h-3.5 w-3.5 accent-primary rounded" defaultChecked />
                      <span className="ml-2 text-xs text-gray-300">Leave Applications</span>
                    </label>
                  </div>
                  
                  <h3 className="font-medium text-white text-sm mt-4 mb-2">Filter by Date</h3>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="date" className="h-3.5 w-3.5 accent-primary" defaultChecked />
                      <span className="ml-2 text-xs text-gray-300">All time</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="date" className="h-3.5 w-3.5 accent-primary" />
                      <span className="ml-2 text-xs text-gray-300">Today</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="date" className="h-3.5 w-3.5 accent-primary" />
                      <span className="ml-2 text-xs text-gray-300">Last 7 days</span>
                    </label>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <button className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] text-xs rounded-lg text-gray-300 hover:bg-white/[0.08] transition-colors">
                      Reset
                    </button>
                    <button className="px-3 py-1.5 bg-primary text-xs rounded-lg text-white hover:bg-primary/80 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Notification Counter */}
      <div className="px-3 sm:px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06]">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-400">All Notifications</span>
            <span className="ml-2 px-1.5 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-lg">{filteredNotifications.length}</span>
          </div>
          <button className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">Mark all as read</button>
        </div>
      </div>
      
      {/* Notification List */}
      <div className="divide-y divide-white/[0.04] max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-3 sm:p-4 hover:bg-white/[0.02] transition-colors ${notification.unread ? 'bg-primary/[0.03]' : ''}`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="shrink-0 mt-1 hidden sm:flex w-8 h-8 rounded-lg bg-white/[0.04] items-center justify-center">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start sm:items-center gap-1 sm:gap-0">
                      <div className="mt-0.5 sm:hidden">
                        {getIcon(notification.type)}
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-white sm:flex sm:items-center">
                        {notification.title}
                        {notification.unread && (
                          <span className="ml-1.5 sm:ml-2 inline-block w-1.5 h-1.5 bg-primary rounded-full" />
                        )}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500">{notification.timestamp}</span>
                      <div className="relative ml-1 sm:ml-2 sm:hidden">
                        <button onClick={() => {}} className="p-1 text-gray-500 hover:text-white focus:outline-none transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-none">
                    {notification.description}
                  </p>
                  {notification.time && (
                    <div className="flex items-center mt-1.5">
                      <ClockIcon className="h-3 w-3 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                  )}
                  <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    {getStatusBadge(notification.status)}
                    <button className="text-primary text-xs font-medium flex items-center hover:text-primary/80 transition-colors sm:ml-2">
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">Details</span>
                      <ChevronRight className="h-3 w-3 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 px-4 text-center">
            <div className="mx-auto w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-gray-500" />
            </div>
            <p className="text-gray-300 font-medium text-sm">No notifications found</p>
            <p className="text-gray-500 text-xs mt-1">Try adjusting your search or filter criteria</p>
            <button 
              className="mt-4 px-4 py-2 bg-primary text-xs rounded-xl text-white hover:bg-primary/80 transition-colors"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 sm:p-4 bg-white/[0.02] border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3">
        <div className="text-xs text-gray-500 w-full sm:w-auto text-center sm:text-left">
          Showing {filteredNotifications.length} of {notifications.length} notifications
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <button className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-xs text-gray-400 hover:bg-white/[0.08] disabled:opacity-30 transition-colors" disabled={filteredNotifications.length === 0}>
            Previous
          </button>
          <button className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-xs text-gray-400 hover:bg-white/[0.08] disabled:opacity-30 transition-colors" disabled={filteredNotifications.length === 0}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotiScreen;
