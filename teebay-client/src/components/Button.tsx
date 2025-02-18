import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "confirm" | "cancel";
  disabled?: boolean;
};

const Button = ({
  children,
  onClick,
  type = "confirm",
  disabled,
}: ButtonProps) => {
  const baseStyles =
    "py-2 px-4 rounded-md text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const confirmStyles = "bg-[#5B51F8] hover:bg-[#4842C6]";
  const cancelStyles = "bg-[#E53E3E] hover:bg-[#C53030]";

  return (
    <button
      className={`${baseStyles} ${
        type === "confirm" ? confirmStyles : cancelStyles
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
