"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';

const FunctionComponent = () => {
  // State for expanding the details
  const [expandedSection, setExpandedSection] = useState<string | null>('01');

  // Toggle function for expanding/collapsing sections
  const toggleSection = (id: string) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  };

  // Array for the content of each section
  const contentArray = [
    {
      id: '01',
      title: 'Training',
      description: 'We are a certified guarding company instrumental in the following training programs.',
      details: [
        'Physical Security Training',
        'Electronic Security Training',
        'ISMS',
        'ERT',
        'EHS',
        'Soft skills',
        'Emergency Evacuation drills',
      ],
    },
    {
      id: '02',
      title: 'Other Services',
      description: 'Our group of companies also provides a wide range of maintenance and security services.',
      details: [
        'FM services for Residential and Commercial complexes',
        'Office upkeep and maintenance',
        'Electrical maintenance',
        'Plumbing maintenance',
        'STP & WTP maintenance services',
        'Rodent & Pest control',
      ],
    },
  ];

  return (
    <section className="w-full mx-auto px-4 py-16">
      {/* Updated h2 tag */}
      <h2 className="text-3xl font-bold mb-8 text-white">
        COMPREHENSIVE TRAINING AND <br/>FACILITY SERVICES<span className="text-theme">.</span>
      </h2>
      
      {/* Updated p tag */}
      <p className="text-gray-400 mb-4">
            Our range of training and services ensures that our clients receive the best in security and facility management, tailored to meet their specific needs.
          </p>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 mb-8 md:mb-0">
   
          <div className="relative w-full h-96">
            <Image
              src="https://raipur.inspireacademy.in/wp-content/uploads/2024/02/radio-man-and-a-security-guard-or-safety-officer-outdoor-on-a-city-road-for-communication-back-of-e1706457509394.jpg"
              alt="Security Training"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="mb-4">
            <div className="w-full bg-[#2a2c2f] h-2 rounded-full mt-5 overflow-hidden">
              <div className="bg-theme h-full" style={{ width: '70%' }}></div>
            </div>
            <div className="flex justify-between text-white mt-2">
              <span>Security Expertise</span>
              <span>70%</span>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 md:pl-12">
          {contentArray.map((item) => (
            <div className="mb-6" key={item.id}>
              <h3 className="flex text-white items-center font-bold mb-2">
                <span className="mr-2 text-theme">{item.id}</span> {item.title}
                <button onClick={() => toggleSection(item.id)} className="ml-auto text-theme">
                  {expandedSection === item.id ? <Minus size={20} /> : <Plus size={20} />}
                </button>
              </h3>
              <p className="text-gray-400 mb-2">{item.description}</p>

              {expandedSection === item.id && item.details && (
                <ul className="text-gray-400 list-disc ml-6">
                  {item.details.map((detail, index) => (
                    <li key={index} className="mb-2">
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FunctionComponent;
