import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApolloError, useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/queries";

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof SignInSchema>;

const SignIn = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
  });

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem("accessToken", data.login.accessToken);
      navigate("/products");
    },
    onError: (error: ApolloError) => {
      console.log("🚀 ~ SignIn ~ error:", error.networkError);
      const graphQLErrors = error.graphQLErrors;
      console.log("🚀 ~ graphQLErrors:", graphQLErrors);
      if (graphQLErrors.length > 0) {
        setErrorMessage(graphQLErrors[0].message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    // try {
    await login({
      variables: { email: data.email, password: data.password },
    }).catch((error) => {
      console.log("SignIn error:", error);
    });
  };

  return (
    <div className="flex items-center flex-col justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-8">SIGN IN</h1>
      <div className="p-8 shadow-md rounded-md w-full max-w-md border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5B51F8] focus:border-transparent"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-4 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5B51F8] focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#5B51F8] text-white py-2 px-4 rounded-md font-semibold hover:bg-[#4842C6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            {isSubmitting || loading ? "Signing in..." : "LOGIN"}
          </button>
          {errorMessage && (
            <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#28b1bd] font-semibold hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
