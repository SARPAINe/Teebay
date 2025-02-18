import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FieldValues, UseFormRegister, Path } from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  id: keyof T;
  label: string;
  type: "text" | "email" | "password"; // Extendable for other types
  placeholder: string;
  register: UseFormRegister<T>;
  error?: string;
}

const InputField = <T extends FieldValues>({
  id,
  label,
  type,
  placeholder,
  register,
  error,
}: InputFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  // Toggle visibility of password input
  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

  return (
    <div>
      <label
        htmlFor={id as string}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className={`relative ${isPasswordType ? "flex items-center" : ""}`}>
        <input
          id={id as string}
          type={inputType}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5B51F8] focus:border-transparent"
          {...register(id as Path<T>)}
        />
        {isPasswordType && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;
