import React from 'react';
import { FaShieldAlt, FaUsers } from 'react-icons/fa';
import { MdElectricBolt } from "react-icons/md";
import { PiSecurityCameraFill,PiCashRegister } from "react-icons/pi";
import { FaRegIdBadge } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";

const ServiceComponent = () => {
  const services = [
    {
      IconComponent: FaShieldAlt,
      title: 'Secure Visitor Registration',
      description: 'Simplify visitor entry with fast, secure, and hassle-free registration.',
    },
    {
      IconComponent: FaUsers,
      title: 'Real-Time Visitor Tracking',
      description: ' Keep track of visitor movements instantly for maximum security and control.',
    },
    {
      IconComponent: PiCashRegister,
      title: 'Pre-Registration and Appointments',
      description: 'Accelerate check-ins with pre-scheduled appointments and seamless entry.',
    },
    {
      IconComponent: FaRegIdBadge,
      title: 'Customizable Visitor Badges',
      description: 'Create professional, personalized badges for clear visitor identification.',
    },
    {
      IconComponent: IoMdNotifications,
      title: 'Visitor Notifications and Alerts ',
      description: 'Receive instant alerts and updates for visitor arrivals and important events.',
    },
    {
      IconComponent: MdElectricBolt,
      title: 'Electronics Security Solution',
      description: ' Unlock valuable insights with detailed visitor reports and performance analytics',
    },
  ];

  return (
    <section className="relative min-h-screen bg-gray-900 overflow-hidden py-16">
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
      <div className="relative z-10 container mx-auto px-4">
        {/* Section Title */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text 
          bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600
          animate-text-gradient">
            WE SHAPE THE PERFECT SOLUTIONS <span className="text-orange-600">.</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto text-center">
          Discover a comprehensive suite of solutions designed to enhance security, streamline processes, and deliver unparalleled efficiency.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-gray-800/30 
              backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 
              hover:border-orange-600/50 transition duration-300 group space-y-4"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gray-700/30 rounded-full">
                  <service.IconComponent 
                    className="w-6 h-6 text-amber-500 group-hover:text-orange-400 transition" 
                  />
                </div>
                <h2 className="text-xl font-semibold text-white group-hover:text-orange-400 transition">
                  {service.title}
                </h2>
              </div>
              <p className="text-gray-300 group-hover:text-gray-100 transition">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceComponent;