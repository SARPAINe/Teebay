type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset"; // Matches native button `type` values
  variant?: "confirm" | "cancel";
  disabled?: boolean;
};

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "confirm",
  disabled,
}: ButtonProps) => {
  const baseStyles =
    "py-2 px-4 rounded-md text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const confirmStyles = "bg-[#5B51F8] hover:bg-[#4842C6]";
  const cancelStyles = "bg-[#E53E3E] hover:bg-[#C53030]";

  return (
    <button
      className={`${baseStyles} ${
        variant === "confirm" ? confirmStyles : cancelStyles
      }`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
