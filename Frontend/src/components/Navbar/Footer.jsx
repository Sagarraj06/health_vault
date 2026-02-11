import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Activity } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-surface pt-16 pb-8 px-6 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-card" />
            </div>
            <span className="text-xl font-bold text-card font-[Space_Grotesk]">
              HealthVault
            </span>
          </div>
          <p className="text-muted text-sm leading-relaxed">
            Revolutionizing healthcare management with secure, AI-powered
            solutions for students and institutions.
          </p>
          <div className="flex gap-3 pt-2">
            {[FaLinkedin, FaFacebook, FaTwitter, FaInstagram].map(
              (Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-lg bg-card/10 flex items-center justify-center text-muted hover:text-primary hover:bg-card/20 transition-colors"
                >
                  <Icon className="text-sm" />
                </button>
              )
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-semibold text-card uppercase tracking-wider mb-5">
            Contact Us
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-muted">
            <li>info@healthvault.com</li>
            <li>+1 (555) 123-4567</li>
            <li>123 Innovation Dr, Tech City, TC 90210</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-semibold text-card uppercase tracking-wider mb-5">
            Stay Updated
          </h3>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-card/10 border border-card/20 rounded-lg px-4 py-3 text-sm text-card placeholder-muted focus:outline-none focus:border-primary transition-colors"
            />
            <button className="bg-primary text-card text-sm font-medium py-3 rounded-lg hover:bg-primary-dark transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-card/10 flex flex-col md:flex-row justify-between items-center text-muted text-xs">
        <p>2024 Health Vault. All Rights Reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
