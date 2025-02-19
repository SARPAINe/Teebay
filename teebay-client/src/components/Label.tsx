import React from "react";

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

const Label = ({ children, className }: LabelProps) => {
  return (
    <label
      className={`block text-xl text-center font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
