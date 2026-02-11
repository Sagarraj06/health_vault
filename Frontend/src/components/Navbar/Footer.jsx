import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import React from 'react';

const Footer = () => {
  return (
    <footer className="relative border-t border-white/[0.06] pt-16 pb-8 px-6 mt-16 bg-dark/80">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">HealthVault</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Revolutionizing healthcare management with secure, AI-powered solutions for students and institutions.
          </p>
          <div className="flex gap-3 pt-2">
            {[FaLinkedin, FaFacebook, FaTwitter, FaInstagram].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all duration-300" aria-label="Social link">
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Contact Us</h3>
          <ul className="flex flex-col gap-4">
            {[
              { icon: Mail, text: "info@healthvault.com" },
              { icon: Phone, text: "+1 (555) 123-4567" },
              { icon: MapPin, text: "123 Innovation Dr, Tech City, TC 90210" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                <item.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Stay Updated</h3>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">Get the latest health tech updates delivered to your inbox.</p>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder-gray-500"
              aria-label="Email address"
            />
            <button className="bg-primary text-white font-medium text-sm py-3 rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
        <p>&copy; 2025 HealthVault. All Rights Reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
