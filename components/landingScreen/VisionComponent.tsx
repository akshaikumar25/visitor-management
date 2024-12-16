import React from "react";
import { Target, Shield, ChevronRight } from 'lucide-react';

const VisionComponent = () => {
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
            OUR VISION <span className="text-orange-600">.</span>
          </h1>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed text-lg">
              &apos;To simplify and enhance the visitor experience while ensuring the safety and efficiency of residential societies and apartments.&apos; 
              Our goal is to provide a seamless and secure visitor management system that promotes trust, convenience, and peace of mind for residents, administrators, and visitors alike.
            </p>
            
            <div className="bg-gradient-to-r from-orange-600/20 to-amber-600/20 
            border border-orange-600/50 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/5 opacity-10"></div>
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text 
              bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 relative z-10">
                Our Commitment
              </h2>
              <p className="text-white mt-2 relative z-10">
                &apos;Your Security and Convenience is Our Commitment&apos;
              </p>
            </div>
          </div>

          {/* Image and Features Section */}
          <div className="space-y-8">
            {/* Feature List */}
            <div className="space-y-4">
              {[
                {
                  icon: <Target className="text-blue-500 w-6 h-6" />,
                  text: "Streamlined visitor check-in and authorization"
                },
                {
                  icon: <Shield className="text-purple-500 w-6 h-6" />,
                  text: "Real-time tracking and notifications"
                },
                {
                  icon: <ChevronRight className="text-green-500 w-6 h-6" />,
                  text: "Tailored solutions for societies and apartments"
                },
                {
                  icon: <Shield className="text-indigo-500 w-6 h-6" />,
                  text: "Improved security with PSARA-certified standards"
                },
                {
                  icon: <Target className="text-pink-500 w-6 h-6" />,
                  text: "User-friendly interface for residents and admins"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-4 bg-gray-800/30 
                  backdrop-blur-sm p-4 rounded-xl  border border-gray-700/50 hover:border-orange-600/50 transition duration-300 group"
                >
                  <div className="p-3 bg-gray-700/30 rounded-full">
                    {feature.icon}
                  </div>
                  <span className="text-gray-200 group-hover:text-white transition">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionComponent;