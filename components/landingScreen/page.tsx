"use client";
import React from "react";
import Navbar from "@/components/landingScreen/NavbarComponent";
import HeroComponent from "@/components/landingScreen/HeroComponent";
import AboutComponent from "@/components/landingScreen/AboutComponent";
import VisionComponent from "@/components/landingScreen/VisionComponent";
import ServiceComponent from "@/components/landingScreen/ServiceComponent";
import FooterComponent from "@/components/landingScreen/FooterComponent";

const LandingContainer = () => {
  return (
    <div>
      <Navbar />
      <HeroComponent />
      <div>
        <div id="about" className="scroll-target">
          <AboutComponent />
        </div>
        <div id="vision" className="scroll-target">
          <VisionComponent />
        </div>
        <div id="service" className="scroll-target">
          <ServiceComponent />
        </div>
        <FooterComponent />
      </div>
    </div>
  );
};

export default LandingContainer;