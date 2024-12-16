import React from "react";
import Link from "next/link";
import { Target, Shield } from "lucide-react";

const HeroComponent = () => {
  return (
    <section className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://raipur.inspireacademy.in/wp-content/uploads/2024/02/radio-man-and-a-security-guard-or-safety-officer-outdoor-on-a-city-road-for-communication-back-of-e1706457509394.jpg"
          alt="Security Personnel Communication"
          className="w-full h-full object-cover opacity-30"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
      </div>

      {/* Animated Gradient Blob */}

      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-grid-white/5 opacity-10"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 flex items-center min-h-screen">
        <div className="max-w-2xl space-y-8">
          {/* Main Title */}
          <h1
            className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text 
bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 
animate-text-gradient"
          >
            Visitor Management System
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            We work closely with our customers to provide world-class security
            services with optimized solutions.
          </p>

          {/* Call to Action */}
          <div className="flex items-center space-x-6">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center 
  bg-gradient-to-r from-amber-500 to-orange-600 
  text-white px-8 py-3 rounded-full 
  font-bold hover:from-amber-600 hover:to-orange-700 
  transition-all duration-300 transform hover:scale-105 
  shadow-lg hover:shadow-xl"
            >
              Get Started
              <Target className="ml-2 w-5 h-5" />
            </Link>
          </div>

          {/* Features Highlight */}
          <div className="flex space-x-4 mt-8">
            <div
              className="flex items-center space-x-2 bg-gray-800/30 
            backdrop-blur-sm p-3 rounded-xl border border-gray-700/50"
            >
              <Target className="text-blue-500 w-5 h-5" />
              <span className="text-sm text-gray-300">Secure Check-in</span>
            </div>
            <div
              className="flex items-center space-x-2 bg-gray-800/30 
            backdrop-blur-sm p-3 rounded-xl border border-gray-700/50"
            >
              <Shield className="text-[#D91656] w-5 h-5" />
              <span className="text-sm text-gray-300">Real-time Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroComponent;
