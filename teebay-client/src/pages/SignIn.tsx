import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/mutation";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { toast } from "react-toastify";

// Validation schema
const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof SignInSchema>;

const SignIn = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({ resolver: zodResolver(SignInSchema) });

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      toast.success("Logged in successfully");
      localStorage.setItem("accessToken", data.login.accessToken);
      navigate("/");
    },
    onError: (error) => {
      console.error("SignIn error:", error);
    },
  });

  const onSubmit = (data: SignInFormData) => {
    login({ variables: data });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 w-full max-w-md shadow-md bg-white rounded-md border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6">SIGN IN</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            id="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            register={register}
            error={errors.email?.message}
          />
          <InputField
            id="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            register={register}
            error={errors.password?.message}
          />
          <Button type="confirm" disabled={isSubmitting || loading}>
            {isSubmitting || loading ? "Signing in..." : "LOGIN"}
          </Button>
          {error && (
            <p className="mt-1 text-sm text-red-600">{error.message}</p>
          )}
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
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
