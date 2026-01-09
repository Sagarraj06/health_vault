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

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="relative px-3 py-2 text-gray-300 hover:text-primary transition-colors duration-300 group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );

  return (
    <nav className={`fixed w-full z-50 top-0 left-0 px-6 py-4 glass border-b border-white/10 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Back Button Container */}
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          {location.pathname !== '/' && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full text-white/70 hover:text-primary hover:bg-white/10 transition-all duration-300 group"
              aria-label="Go Back"
            >
              <FiArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
            </button>
          )}

          {/* Logo */}
          <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-primary text-3xl font-bold animate-pulse-slow">✦</span>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary group-hover:scale-105 transition-transform duration-300">
              HealthVault
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-lg font-medium">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/ai-bot">AI Bot</NavLink></li>
          <li><NavLink to="/contact">Certificates</NavLink></li>
          <li><NavLink to="/appointment">Appointment</NavLink></li>
          <li><NavLink to="/video-call">Video Call</NavLink></li>
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Notibell />
              <div
                onClick={handleProfileClick}
                className="cursor-pointer w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex justify-center items-center text-white font-bold shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-110"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-dark font-bold transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link to="/signup">
                <button className="px-5 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-dark font-bold transition-all duration-300">
                  Sign Up
                </button>
              </Link>
              <Link to="/login">
                <button className="px-5 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105">
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={toggleMenu} className="text-3xl text-white hover:text-primary transition-colors">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-dark/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col space-y-4 md:hidden animate-fade-in-down">
          <div onClick={() => { navigate("/"); toggleMenu(); }} className="text-xl text-gray-300 hover:text-primary cursor-pointer">Home</div>
          <div onClick={() => { navigate("/ai-bot"); toggleMenu(); }} className="text-xl text-gray-300 hover:text-primary cursor-pointer">AI Bot</div>
          <div onClick={() => { navigate("/contact"); toggleMenu(); }} className="text-xl text-gray-300 hover:text-primary cursor-pointer">Certificates</div>
          <div onClick={() => { navigate("/appointment"); toggleMenu(); }} className="text-xl text-gray-300 hover:text-primary cursor-pointer">Appointment</div>
          <div onClick={() => { navigate("/video-call"); toggleMenu(); }} className="text-xl text-gray-300 hover:text-primary cursor-pointer">Video Call</div>

          <div className="h-px bg-white/10 my-2"></div>

          {isLoggedIn ? (
            <div className="flex flex-col space-y-4">
              <div onClick={handleProfileClick} className="text-xl text-gray-300 hover:text-primary cursor-pointer">Profile</div>
              <button onClick={handleLogout} className="w-full py-3 rounded-lg border border-primary text-primary font-bold">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <Link to="/signup" onClick={toggleMenu} className="w-full py-3 rounded-lg border border-primary text-primary font-bold text-center">Sign Up</Link>
              <Link to="/login" onClick={toggleMenu} className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold text-center">Login</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
