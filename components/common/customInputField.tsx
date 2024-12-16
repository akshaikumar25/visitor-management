import React from "react";
import { Input } from "../ui/input";

interface InputProps {
  field: any;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
  type?: string;
  icon?: React.ReactNode;
}

const CustomInputField = ({
  field,
  className,
  placeholder = "",
  readOnly = false,
  icon,
  type = "text",
}: InputProps) => {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
          {icon}
        </div>
      )}
      <Input
        type={type}
        placeholder={placeholder}
        {...field}
        className={`rounded-xl pl-8 pr-3 py-2 border-gray-300 shadow-sm transition-all duration-200 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
          icon ? "pl-12" : ""
        } ${
          readOnly
            ? "bg-gray-100 cursor-not-allowed"
            : "hover:bg-gray-50 focus:bg-white"
        }`}
        readOnly={readOnly}
      />
    </div>
  );
};

export default CustomInputField;
