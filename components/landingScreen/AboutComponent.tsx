import React from 'react';
import Image from 'next/image';
import Link from "next/link";
import { ShieldCheck, Monitor, Users } from 'lucide-react';

const VisitorManagementComponent = () => {
  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Centered Gradient Animated Blob */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-[500px] h-[500px] bg-gradient-to-r from-amber-600/30 via-yellow-600/30 to-orange-600/30 
          rounded-full animate-blob opacity-50 blur-3xl"
        ></div>
      </div>

      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-grid-white/5 opacity-10"></div>

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center relative">
          {/* Image Section */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-800">
              <Image 
                src="https://raipur.inspireacademy.in/wp-content/uploads/2024/02/radio-man-and-a-security-guard-or-safety-officer-outdoor-on-a-city-road-for-communication-back-of-e1706457509394.jpg"
                alt="Security team in action"
                width={600}
                height={500}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8 relative">
            {/* Animated Gradient Text Effect */}
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold mb-5 text-transparent bg-clip-text 
               bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600
              animate-text-gradient">
                Visitor Management <span className="text-white">System</span>
              </h2>
              <p className="text-xl text-gray-400 mb-6">
                Intelligent Security Solutions
              </p>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Transform your security infrastructure with our advanced Visitor Management System. Leverage cutting-edge technology to monitor, track, and manage visitors seamlessly across your premises.
            </p>

            {/* Feature Cards */}
            <div className="space-y-4">
              {[
                { 
                  icon: <ShieldCheck className="text-orange-600 w-6 h-6" />, 
                  title: "Enhanced Security",
                  description: "PSARA-certified protection with real-time monitoring"
                },
                { 
                  icon: <Monitor className="text-purple-500 w-6 h-6" />, 
                  title: "Digital Tracking",
                  description: "Advanced visitor tracking and management system"
                },
                { 
                  icon: <Users className="text-green-500 w-6 h-6" />, 
                  title: "Seamless Access",
                  description: "Effortless visitor authorization and management"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 bg-gray-800/30 backdrop-blur-sm p-4 rounded-xl 
                  border border-gray-700/50 hover:border-orange-600/50 transition duration-300 group"
                >
                  <div className="p-3 bg-gray-700/30 rounded-full">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 justify-center md:justify-start pt-6">
              <Link
              href="/auth/login"
              className="px-8 py-3  bg-gradient-to-r from-amber-500 to-orange-600 
              text-white rounded-lg hover:from-amber-600 hover:to-orange-700 
              transition duration-300 transform hover:-translate-y-1 
              shadow-lg shadow-amber-500/30"
            >
              Get Started
            </Link>
              <Link
              href="/auth/login"
               className="px-8 py-3 border border-gray-700 text-gray-300 
              rounded-lg hover:bg-gray-800/50 transition duration-300 backdrop-blur-sm">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorManagementComponent;