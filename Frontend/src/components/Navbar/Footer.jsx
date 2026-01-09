import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-surface/50 backdrop-blur-lg border-t border-white/10 pt-16 pb-8 px-6 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-primary text-2xl font-bold">✦</span>
            <span className="text-2xl font-bold text-white">HealthVault</span>
          </div>
          <p className="text-gray-400">
            Revolutionizing healthcare management with secure, AI-powered solutions for students and institutions.
          </p>
          <div className="flex space-x-4 pt-4">
            <FaLinkedin className="text-gray-400 hover:text-primary text-xl cursor-pointer transition-colors" />
            <FaFacebook className="text-gray-400 hover:text-primary text-xl cursor-pointer transition-colors" />
            <FaTwitter className="text-gray-400 hover:text-primary text-xl cursor-pointer transition-colors" />
            <FaInstagram className="text-gray-400 hover:text-primary text-xl cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6">Contact Us</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center space-x-2">
              <span className="text-primary">✉</span>
              <span>info@healthvault.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-primary">📞</span>
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-primary">📍</span>
              <span>123 Innovation Dr, Tech City, TC 90210</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6">Stay Updated</h3>
          <div className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            />
            <button className="bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <p>&copy; 2024 Health Vault. All Rights Reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;