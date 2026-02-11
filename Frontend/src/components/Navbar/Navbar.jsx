import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiArrowLeft } from "react-icons/fi";
import { UserContext } from "../../context/UserContext";
import { api } from "../../axios.config.js";
import Notibell from "../Noti/Notibell";
import { Activity } from "lucide-react";

const Navbar = React.memo(() => {
  const { isLoggedIn, user, logout, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }
      if (Math.abs(currentScrollY - lastScrollY) < 10) return;
      setVisible(currentScrollY <= lastScrollY);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleProfileClick = () => {
    if (!user) return;
    if (user.role === "doctor") navigate("/doctor");
    else if (user.role === "student") navigate("/profile");
    else if (user.role === "admin") navigate("/admin");
  };

  const handleLogout = async () => {
    try {
      await api.post("user/logout");
      logout();
      navigate("/");
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-text-light hover:text-text hover:bg-surface-alt"
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav
      className={`fixed w-full z-50 top-0 left-0 bg-card/80 backdrop-blur-md border-b border-border transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Back + Logo */}
          <div className="flex items-center gap-3">
            {location.pathname !== "/" && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg text-text-light hover:text-primary hover:bg-primary/10 transition-all duration-200"
                aria-label="Go Back"
              >
                <FiArrowLeft className="text-lg" />
              </button>
            )}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-card" />
              </div>
              <span className="text-xl font-bold text-text font-[Space_Grotesk]">
                HealthVault
              </span>
            </div>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/ai-bot">AI Bot</NavLink>
            <NavLink to="/contact">Certificates</NavLink>
            <NavLink to="/appointment">Appointment</NavLink>
            <NavLink to="/video-call">Video Call</NavLink>
          </div>

          {/* Right: Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Notibell />
                <button
                  onClick={handleProfileClick}
                  className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-card text-sm font-semibold hover:bg-primary-dark transition-colors"
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-text-light border border-border rounded-lg hover:bg-surface-alt transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <button className="px-4 py-2 text-sm font-medium text-text-light border border-border rounded-lg hover:bg-surface-alt transition-colors">
                    Sign Up
                  </button>
                </Link>
                <Link to="/login">
                  <button className="px-4 py-2 text-sm font-medium text-card bg-primary rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                    Login
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-3">
            {isLoggedIn && <Notibell />}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-text-light hover:bg-surface-alt transition-colors"
            >
              {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-t border-border animate-fade-in-up">
          <div className="px-4 py-4 flex flex-col gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/ai-bot", label: "AI Bot" },
              { to: "/contact", label: "Certificates" },
              { to: "/appointment", label: "Appointment" },
              { to: "/video-call", label: "Video Call" },
            ].map((item) => (
              <button
                key={item.to}
                onClick={() => { navigate(item.to); toggleMenu(); }}
                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.to
                    ? "bg-primary/10 text-primary"
                    : "text-text-light hover:bg-surface-alt hover:text-text"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="h-px bg-border my-2" />

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => { handleProfileClick(); toggleMenu(); }}
                  className="text-left px-4 py-3 rounded-lg text-sm font-medium text-text-light hover:bg-surface-alt hover:text-text transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="mx-4 mt-2 py-2.5 rounded-lg border border-border text-sm font-medium text-text-light text-center hover:bg-surface-alt transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-4 mt-2">
                <Link to="/signup" onClick={toggleMenu}>
                  <button className="w-full py-2.5 rounded-lg border border-border text-sm font-medium text-text-light text-center hover:bg-surface-alt transition-colors">
                    Sign Up
                  </button>
                </Link>
                <Link to="/login" onClick={toggleMenu}>
                  <button className="w-full py-2.5 rounded-lg bg-primary text-card text-sm font-medium text-center hover:bg-primary-dark transition-colors">
                    Login
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
