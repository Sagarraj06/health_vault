import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Award,
  MessageSquare,
  Activity,
  Video,
  Bot,
  Users,
  UserPlus,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
} from "lucide-react";
import { UserContext } from "../context/UserContext";
import { api } from "../axios.config";

const Sidebar = ({ role }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, setUser } = useContext(UserContext);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleLogout = async () => {
    try {
      await api.post("user/logout");
      logout();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      logout();
      setUser(null);
      navigate("/");
    }
  };

  const menuItems = {
    student: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "Book Appointment", path: "/appointment", icon: Calendar },
      { name: "Health Records", path: "/recordform", icon: FileText },
      { name: "Certificate Generator", path: "/certificate", icon: Award },
      { name: "Leave Concern", path: "/leave-concern", icon: AlertCircle },
      { name: "Health Record Concern", path: "/health-record-concern", icon: Activity },
      { name: "AI Diagnosis", path: "/ai-diagnosis", icon: Bot },
    ],
    doctor: [
      { name: "Dashboard", path: "/doctor", icon: LayoutDashboard },
      { name: "Set Time Slots", path: "/slots", icon: Calendar },
      { name: "Prescriptions", path: "/prescriptions", icon: FileText },
      { name: "Video Call", path: "/video-call", icon: Video },
      { name: "AI Assistant", path: "/ai-assistant", icon: Bot },
    ],
    admin: [
      { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
      { name: "Leave Applications", path: "/admin", icon: FileText },
      { name: "Health Records", path: "/admin", icon: Activity },
      { name: "Manage Doctors", path: "/admin", icon: Users },
    ],
  };

  const currentMenu = menuItems[role] || [];

  return (
    <div
      className={`${
        isCollapsed ? "w-[72px]" : "w-64"
      } h-screen bg-card border-r border-border transition-all duration-300 flex flex-col sticky top-0 left-0 z-50`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 w-6 h-6 bg-primary text-card rounded-full flex items-center justify-center shadow-md hover:bg-primary-dark transition-colors z-50"
      >
        {isCollapsed ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>

      {/* Logo Area */}
      <div className="p-4 flex items-center justify-center border-b border-border h-16">
        {isCollapsed ? (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-5 h-5 text-card" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-card" />
            </div>
            <span className="text-lg font-bold text-text font-[Space_Grotesk] whitespace-nowrap">
              HealthVault
            </span>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <nav className="flex flex-col gap-1 px-3 py-4">
          {currentMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-light hover:bg-surface-alt hover:text-text"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                )}
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm whitespace-nowrap">
                    {item.name}
                  </span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full rounded-md px-2 py-1 ml-3 bg-dark text-card text-xs invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-50 shadow-lg">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 mt-auto border-t border-border">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors group ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
