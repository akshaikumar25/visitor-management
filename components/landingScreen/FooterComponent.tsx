import React from "react";
import Link from "next/link";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";


const companyLinks = [
  { href: "#about", text: "About" },
  { href: "#vision", text: "Feature" },
  { href: "#service", text: "Careers" },
];


const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-grid-white/5 opacity-10 z-0"></div>

      <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 ml-0 sm:ml-14">
          <div>
            <h3 className="text-lg font-semibold text-transparent bg-clip-text 
          bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600
          animate-text-gradient mb-4">Visitor Management System</h3>
            <div className="grid grid-cols-2 gap-2">
              {companyLinks.map(({ href, text }) => (
                <Link
                  key={text}
                  href={href}
                  className="text-sm text-gray-300 
        hover:text-amber-400 transition-colors"
                >
                  {text}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Email</h4>
            <div className="flex items-center space-x-3">
              <FiMail className="text-amber-400 flex-shrink-0" />
              <Link
                href="mailto:-----------"
                className="text-sm text-gray-300 hover:text-amber-400 transition-colors"
              >
                ----------
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <FiMail className="text-amber-400 flex-shrink-0" />
              <Link
                href="mailto:--------"
                className="text-sm text-gray-300 hover:text-amber-400 transition-colors"
              >
                ----------
              </Link>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Contact</h4>
            <div className="flex items-center space-x-3">
              <FiPhone className="text-amber-400 flex-shrink-0" />
              <span className="text-sm text-gray-300">-------------</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiPhone className="text-amber-400 flex-shrink-0" />
              <span className="text-sm text-gray-300">-------------</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white mb-2">
              Download Visitor Management App
            </h4>
            <div className="flex flex-col space-y-2">
              <Link
                href=""
                className="inline-flex items-center justify-center 
                  font-semibold bg-black text-white px-3 py-2 rounded-md 
                  hover:bg-gray-800 transition-colors"
              >
                <FaApple className="mr-1.5 text-lg" />
                <span className="text-xs">App Store</span>
              </Link>
              <Link
                href=""
                className="inline-flex items-center justify-center 
                  font-semibold bg-gradient-to-r from-green-500 to-green-600 
                  text-white px-3 py-2 rounded-md 
                  hover:from-green-600 hover:to-green-700 
                  transition-colors"
              >
                <FaGooglePlay className="mr-1.5 text-xs" />
                <span className="text-xs">Google Play</span>
              </Link>
            </div>
          </div>
        </div>
        <div
          className="mt-8 pt-8 border-t border-gray-700 
        flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-sm text-gray-400">
            &copy; 2025 Visitor Management System. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-sm text-gray-400 
              hover:text-amber-400 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-400 
              hover:text-amber-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/cookie-policy"
              className="text-sm text-gray-400 
              hover:text-amber-400 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
