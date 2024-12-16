"use client";

import React from "react";
import { ImSpinner9 } from "react-icons/im";

const CustomLoadingScreen: React.FC = () => {
  return (
    <div className="w-[100%] h-[100%] flex items-center justify-center bg-gray-900 z-50">
      <div className="bg-gray-800 rounded-lg p-8 shadow-xl flex flex-col items-center">
        <ImSpinner9 className="animate-spin duration-1000 text-gray-100 text-2xl" />
        <p className="text-center text-gray-300 mt-4 font-semibold">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default CustomLoadingScreen;
