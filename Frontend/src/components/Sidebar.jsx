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
    Settings
} from "lucide-react";
import { UserContext } from "../context/UserContext";
import { api } from "../axios.config";

const Sidebar = ({ role }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, setUser } = useContext(UserContext); // Access UserContext

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = async () => {
        try {
            await api.post("user/logout");
            logout();
            setUser(null);
            navigate("/"); // Redirect to home or login
        } catch (error) {
            console.error("Error logging out:", error);
            // Even if API fails, clear local state
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
            className={`${isCollapsed ? "w-20" : "w-64"
                } h-screen bg-dark/80 backdrop-blur-xl border-r border-white/[0.06] transition-all duration-300 flex flex-col sticky top-0 left-0 z-50`}
        >
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-10 bg-surface-elevated text-gray-300 p-1.5 rounded-lg shadow-lg border border-white/[0.06] hover:text-primary transition-colors z-50"
                aria-label="Toggle sidebar"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo Area */}
            <div className="p-4 flex items-center justify-center border-b border-white/[0.06] h-16">
                {isCollapsed ? (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">H</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">H</span>
                        </div>
                        <span className="text-base font-semibold text-white tracking-tight whitespace-nowrap">HealthVault</span>
                    </div>
                )}
            </div>

            {/* Scrollable Content (Nav + Logout) */}
            <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
                <nav className="flex flex-col gap-1 px-3 py-4">
                    {currentMenu.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                                    }`}
                            >
                                <item.icon
                                    className={`w-5 h-5 shrink-0 transition-colors duration-200 ${isActive ? "text-primary" : "text-gray-500 group-hover:text-white"
                                        }`}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 text-sm font-medium whitespace-nowrap">
                                        {item.name}
                                    </span>
                                )}
                                {isCollapsed && (
                                    <div className="absolute left-full rounded-lg px-2.5 py-1.5 ml-4 bg-surface-elevated text-white text-xs font-medium invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-50 border border-white/[0.06] shadow-xl">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className="p-3 mt-auto border-t border-white/[0.06]">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group ${isCollapsed ? "justify-center" : ""
                            }`}
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-105 transition-transform" />
                        {!isCollapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
