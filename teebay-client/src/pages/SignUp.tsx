import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../graphql/queries";
import InputField from "../components/InputField";
import { toast } from "react-toastify";

// Validation schema
const SignUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address: z.string().min(1, "Address is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password confirmation is required"),
  })
  .superRefine((data, context) => {
    if (data.password !== data.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords must match",
        path: ["confirmPassword"],
      });
    }
  });

type SignUpFormData = z.infer<typeof SignUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({ resolver: zodResolver(SignUpSchema) });

  const [registerUser, { loading, error }] = useMutation(REGISTER_MUTATION, {
    onCompleted: () => {
      toast.success("User registered successfully");
      navigate("/signin");
    },
    onError: (error) => {
      console.error("SignUp error:", error);
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    const { confirmPassword, ...rest } = data;
    registerUser({ variables: { input: rest } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 w-full max-w-md shadow-md bg-white rounded-md border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6">SIGN UP</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="firstName"
              type="text"
              label="First Name"
              placeholder="Enter your first name"
              register={register}
              error={errors.firstName?.message}
            />
            <InputField
              id="lastName"
              type="text"
              label="Last Name"
              placeholder="Enter your last name"
              register={register}
              error={errors.lastName?.message}
            />
          </div>
          <InputField
            id="address"
            type="text"
            label="Address"
            placeholder="Enter your address"
            register={register}
            error={errors.address?.message}
          />
          <InputField
            id="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            register={register}
            error={errors.email?.message}
          />
          <InputField
            id="phone"
            label="Phone Number"
            type="text"
            placeholder="Enter your phone number"
            register={register}
            error={errors.phone?.message}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            register={register}
            error={errors.password?.message}
          />
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            register={register}
            error={errors.confirmPassword?.message}
          />
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-2 px-4 rounded-md bg-[#5B51F8] text-white font-semibold hover:bg-[#4842C6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || loading ? "Registering..." : "REGISTER"}
          </button>
          {error && (
            <p className="mt-1 text-sm text-red-600">{error.message}</p>
          )}
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-[#28b1bd] font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
