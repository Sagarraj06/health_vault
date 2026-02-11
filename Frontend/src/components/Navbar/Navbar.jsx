import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiArrowLeft } from "react-icons/fi";
import { UserContext } from "../../context/UserContext";
import { api } from "../../axios.config.js";
import Notibell from "../Noti/Notibell";

const Navbar = React.memo(() => {
  const { isLoggedIn, user, logout, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Scroll handling for dynamic navbar
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar at the top
      if (currentScrollY < 10) {
        setVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Add a small threshold to prevent jitter
      if (Math.abs(currentScrollY - lastScrollY) < 10) {
        return;
      }

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
        className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 group ${isActive ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
      >
        {children}
        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300 ${isActive ? 'w-4' : 'w-0 group-hover:w-full'}`}></span>
      </Link>
    );
  };

  return (
    <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-500 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="mx-4 mt-3 rounded-2xl bg-dark/60 backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/20 px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo and Back Button Container */}
          <div className="flex items-center gap-3">
            {/* Back Button */}
            {location.pathname !== '/' && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-white/[0.06] transition-all duration-300 group"
                aria-label="Go Back"
              >
                <FiArrowLeft className="text-lg group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Logo */}
            <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">
                HealthVault
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-1 bg-white/[0.03] rounded-xl px-2 py-1.5">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/ai-bot">AI Bot</NavLink></li>
            <li><NavLink to="/contact">Certificates</NavLink></li>
            <li><NavLink to="/appointment">Appointment</NavLink></li>
            <li><NavLink to="/video-call">Video Call</NavLink></li>
          </ul>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Notibell />
                <div
                  onClick={handleProfileClick}
                  className="cursor-pointer w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex justify-center items-center text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-sm border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white font-medium transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/signup">
                  <button className="px-4 py-2 rounded-xl text-sm border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:text-white font-medium transition-all duration-300">
                    Sign Up
                  </button>
                </Link>
                <Link to="/login">
                  <button className="px-4 py-2 rounded-xl text-sm bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary/90 transition-all duration-300">
                    Login
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-3">
            {isLoggedIn && <Notibell />}
            <button onClick={toggleMenu} className="p-2 rounded-xl text-white hover:bg-white/[0.06] transition-all" aria-label="Toggle menu">
              {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mx-4 mt-2 rounded-2xl bg-dark/95 backdrop-blur-2xl border border-white/[0.06] p-5 flex flex-col gap-1 md:hidden animate-fade-in-down shadow-2xl">
          {[
            { label: "Home", path: "/" },
            { label: "AI Bot", path: "/ai-bot" },
            { label: "Certificates", path: "/contact" },
            { label: "Appointment", path: "/appointment" },
            { label: "Video Call", path: "/video-call" },
          ].map((item) => (
            <div
              key={item.path}
              onClick={() => { navigate(item.path); toggleMenu(); }}
              className={`px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all ${location.pathname === item.path ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:bg-white/[0.04] hover:text-white'}`}
            >
              {item.label}
            </div>
          ))}

          <div className="h-px bg-white/[0.06] my-2"></div>

          {isLoggedIn ? (
            <div className="flex flex-col gap-2">
              <div onClick={() => { handleProfileClick(); toggleMenu(); }} className="px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/[0.04] hover:text-white cursor-pointer transition-all">Profile</div>
              <button onClick={handleLogout} className="w-full py-3 rounded-xl border border-white/10 text-gray-300 font-medium text-sm hover:bg-white/[0.04] transition-all">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/signup" onClick={toggleMenu} className="w-full py-3 rounded-xl border border-white/10 text-gray-300 font-medium text-sm text-center hover:bg-white/[0.04] transition-all">Sign Up</Link>
              <Link to="/login" onClick={toggleMenu} className="w-full py-3 rounded-xl bg-primary text-white font-medium text-sm text-center shadow-lg shadow-primary/20 transition-all">Login</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
