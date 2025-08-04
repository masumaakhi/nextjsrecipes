"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      email: "",
      password: ""
    });
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");
      const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle sign-in logic here
    try{
        setLoading(true);
        const result = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password
        });
        if (result.error) {
            setError(result.error);
        } else {
            toast.success("Sign-in successful!");
            router.push("/");
        }
        setLoading(false);
    } catch (error) {
        setError(error.message);
        toast.error(error.message);
        setLoading(false);
    }
    console.log("Sign-in data:", formData);
    router.push("/");
  };

   const inputStyle = "w-full border px-4 py-2 mb-2 rounded-xl  border-slate-600 text-black  focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="max-w-md mx-auto my-[5rem] p-6 bg-opacity-70 backdrop-blur mt-[6rem] rounded-lg shadow-2xl">
      <h2 className="text-2xl font-semibold text-center text-slate-700 mb-4">
        Sign In to Flavors & Feasts
      </h2>

      {/* Google Sign In Button */}
      <button className="mt-6 w-full bg-blue-500 hover:bg-blue-400 mb-4 text-white py-2 rounded-xl text-xl font-medium"
       onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Sign In with Google
      </button>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="flex flex-col gap-1">
          <label className="block mb-1 font-semibold text-md text-slate-700">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className={inputStyle}
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <label className="block mb-1 font-semibold text-md text-slate-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={inputStyle}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-900"
            >
              {showPassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </span>
          </div>
        </div>

        {/* Forgot Password Link */}
        <p className="text-center text-sm">
          <Link href="/auth/forgotpassword" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </p>

        {/* Sign In Button */}
        <button
          type="submit"
          className="w-full rounded-xl  text-md font-semibold  bg-orange-400 hover:bg-orange-500 hover:text-white text-slate-100 hover:shadow-amber-200 py-2 text-md"
        >
          Sign In
        </button>

        
{/* Show Success or Error Message */}
{success && (
  <p className="text-green-600 text-center font-medium mt-2">{success}</p>
)}
{error && (
  <p className="text-red-600 text-center font-medium mt-2">{error}</p>
)}
      </form>

      {/* Sign Up Redirect */}
      <p className="text-center mt-4 text-sm font-semibold text-slate-700">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="text-orange-500 hover:underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
