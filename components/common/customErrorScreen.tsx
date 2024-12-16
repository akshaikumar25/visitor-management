"use client";

// import { customErrorDetails } from "@/config/const";
// import { ErrorDetail } from "@/types";
import React from "react";
// import Lottie from "react-lottie";
import Image from "next/image";
import Link from "next/link";
import { customErrorDetails } from "@/config/const";
import { ErrorDetail } from "@/types";

function CustomErrorScreen({
  type,
  onReload,
}: {
  type: string;
  onReload?: () => void;
}) {
  const errorDetails = customErrorDetails[type] as ErrorDetail;
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: errorDetails?.lottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 animate-pulse"></div>
      <div className="max-w-6xl w-full bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 animate-fadeIn">
        <div className="md:w-1/2 bg-gradient-to-br from-gray-700 to-gray-600 p-8 flex items-center justify-center">
          {errorDetails?.lottie ? (
            <div className="w-full h-64 md:h-full">
              {/* <Lottie options={defaultOptions} /> */}
            </div>
          ) : (
            errorDetails?.image && (
              <div className="w-full h-64 md:h-full relative animate-float">
                <Image
                  src={errorDetails?.image}
                  alt={errorDetails?.title}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )
          )}
        </div>
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-100 leading-tight animate-fadeInUp">
            {errorDetails?.title}
          </h1>
          <p className="text-xl mb-10 text-gray-300 leading-relaxed animate-fadeInUp animation-delay-200">
            {errorDetails?.description}
          </p>
          {errorDetails?.redirectButton &&
            errorDetails?.redirectButton.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {errorDetails?.redirectButton.map((button, index) => (
                  <Link
                    key={index}
                    href={button.redirectLink || "#"}
                    className="inline-flex items-center justify-center px-8 py-4 border border-gray-600 text-lg font-semibold rounded-lg text-gray-100 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl animate-fadeInUp animation-delay-400"
                    onClick={() => {
                      onReload && onReload();
                      button.action();
                    }}
                  >
                    {button.icon &&
                      React.createElement(button.icon, {
                        className: "mr-3 -ml-1 h-6 w-6",
                      })}
                    {button.label}
                  </Link>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default CustomErrorScreen;
