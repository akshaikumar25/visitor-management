"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { LogIn } from "lucide-react";

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      setExpanded(false);
    }
  };

  return (
    <>
      <header className="bg-gray-900 py-3 sm:py-2 lg:px-14">
        <div className="max-w-full">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex shrink-0">
              <Link href="/" title="Home" className="flex">
                <Image
                  src="/visitor_management.png"
                  alt="VAGT Logo"
                  width={100} 
                  height={20} 
                  className="h-[60px] w-auto"
                />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="text-white"
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
              >
                {!expanded ? (
                  <svg
                    className="w-7 h-7"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-7 h-7"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:items-center md:justify-start md:ml-16 md:mr-auto md:space-x-10 md:flex">
              <button
                onClick={() => scrollToSection('about')}
                className="text-base font-medium text-white transition-all duration-200 hover:text-amber-600 cursor-pointer"
              >
                About
              </button>
              
              <button
                onClick={() => scrollToSection('vision')}
                className="text-base font-medium text-white transition-all duration-200 hover:text-amber-600 cursor-pointer"
              >
                Our Vision
              </button>
              
              <button
                onClick={() => scrollToSection('service')}
                className="text-base font-medium text-white transition-all duration-200 hover:text-amber-600 cursor-pointer"
              >
                Features
              </button>
            </div>

            {/* Login Button for Desktop */}
            <div className="hidden md:block">
              <Link
                href="/auth/login"
                className="flex items-center bg-gradient-to-r from-amber-500 to-orange-600 dark:bg-yellow-500 text-white hover:from-amber-600 hover:to-orange-700  dark:hover:bg-amber-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
              >
                <LogIn className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Login
              </Link>
            </div>
          </nav>

          {/* Mobile Navigation */}
          {expanded && (
            <nav>
              <div className="px-1 pt-8 pb-4">
                <div className="grid gap-y-6">
                  <button
                    onClick={() => scrollToSection('about')}
                    className="text-base font-medium text-white transition-all duration-200 cursor-pointer text-left"
                  >
                    About
                  </button>
                  
                  <button
                    onClick={() => scrollToSection('vision')}
                    className="text-base font-medium text-white transition-all duration-200 cursor-pointer text-left"
                  >
                    Features
                  </button>
                  
                  <button
                    onClick={() => scrollToSection('service')}
                    className="text-base font-medium text-white transition-all duration-200 cursor-pointer text-left"
                  >
                    Career
                  </button>

                  <Link
                    href="/auth/login"
                    className="flex items-center bg-[#EAB308] dark:bg-[#EAB308] text-white hover:bg-[#d5ad35] dark:hover:bg-[#EAB308] px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
                  >
                    <LogIn className="h-5 w-5 sm:h-5 sm:w-5 mr-1" />
                    Login
                  </Link>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;