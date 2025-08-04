// // "use client";

// // import Link from "next/link";
// // import React from "react";
// // import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

// // const Signup = () => {
// //   return (
// //     <div className="max-w-md mx-auto my-[5rem] p-6 bg-opacity-70 backdrop-blur mt-[6rem] rounded-lg shadow-2xl">
// //       <h2 className="text-2xl font-semibold text-center text-slate-700 mb-4">
// //         Sign Up for Flavors & Feasts
// //       </h2>

// //       <button
// //         className="mt-6 w-full bg-blue-500 hover:bg-blue-400 mb-4 text-white py-2 rounded-md text-xl font-medium"
// //       >
// //         Sign Up with Google
// //       </button>

// //       <form className="space-y-4">
// //         {/* Name */}
// //         <div>
// //           <label className="block mb-1 font-semibold text-md text-slate-700">Name</label>
// //           <input
// //             type="text"
// //             placeholder="Enter your name"
// //             className="w-full px-4 py-2 bg-[#cacbca] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
// //           />
// //         </div>

// //         {/* Email */}
// //         <div>
// //           <label className="block mb-1 font-semibold text-md text-slate-700">Email</label>
// //           <input
// //             type="email"
// //             placeholder="Enter your email"
// //             className="w-full px-4 py-2 bg-[#cacbca] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
// //           />
// //         </div>

// //         {/* Password */}
// //         <div>
// //           <label className="block mb-1 font-semibold text-md text-slate-700">Password</label>
// //           <div className="relative">
// //             <input
// //               type="password"
// //               placeholder="Enter your password"
// //               className="w-full px-4 py-2 pr-10 bg-[#cacbca] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
// //             />
// //             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
// //               <AiFillEye />
// //             </span>
// //           </div>
// //         </div>

// //         {/* Confirm Password */}
// //         <div>
// //           <label className="block mb-1 font-semibold text-md text-slate-700">Confirm Password</label>
// //           <div className="relative">
// //             <input
// //               type="password"
// //               placeholder="Confirm your password"
// //               className="w-full px-4 py-2 pr-10 bg-[#cacbca] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
// //             />
// //             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
// //               <AiFillEye />
// //             </span>
// //           </div>
// //         </div>

// //         {/* Submit */}
// //         <button
// //           type="submit"
// //           className="w-full rounded-md  text-md font-semibold  bg-orange-400 hover:bg-orange-500 hover:text-white text-slate-100 hover:shadow-amber-200 py-2 text-md"
// //         >
// //           Sign Up
// //         </button>
// //       </form>

// //       <p className="text-center mt-4 text-sm font-semibold text-slate-700">
// //         Already have an account?{" "}
// //         <Link href="/auth/signin" className="text-orange-500 hover:underline">
// //           Sign in here
// //         </Link>
// //       </p>
// //     </div>
// //   );
// // };

// // export default Signup;

// // app/auth/signup/page.jsx
// "use client";

// import Link from "next/link";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

// const Signup = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const router = useRouter();

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const validate = () => {
//     const { name, email, password, confirmPassword } = formData;
//     if (!name.trim()) return "Name is required";
//     if (!email.trim()) return "Email is required";
//     if (!/\S+@\S+\.\S+/.test(email)) return "Email is invalid";
//     if (password.length < 6) return "Password must be at least 6 characters";
//     if (password !== confirmPassword) return "Passwords do not match";
//     return null;
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");
//   setSuccess("");

//   const validationError = validate();
//   if (validationError) {
//     setError(validationError);
//     return;
//   }

//   setLoading(true);

//   try {
//     const res = await fetch("/api/auth/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.error || "Something went wrong");
//     } else {
//       setSuccess("Registration successful! Please check your email.");
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//       });
//       // 🔁 Immediately sign in user
//     await signIn("credentials", {
//              redirect: false,
//           email: formData.email,
//           password: formData.password,
//     });
//      await getSession();
//       router.push("/");
//     }
//   } catch (err) {
//     setError("Failed to register. Try again later.");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="max-w-md mx-auto my-[5rem] p-6 bg-opacity-70 backdrop-blur mt-[6rem] rounded-lg shadow-2xl">
//       <h2 className="text-2xl font-semibold text-center text-slate-700 mb-4">
//         Sign Up for Flavors & Feasts
//       </h2>

//       <button
//         className="mt-6 w-full bg-blue-500 hover:bg-blue-400 mb-4 text-white py-2 rounded-md text-xl font-medium"
//         type="button"
//         onClick={() => signIn("google")}
//       >
//         Sign Up with Google
//       </button>

//       {error && <p className="text-red-500 mb-2">{error}</p>}
//       {success && <p className="text-green-600 mb-2">{success}</p>}

//       <form className="space-y-4" onSubmit={handleSubmit}>
//         {/* Name */}
//         <div>
//           <label className="block mb-1 font-semibold text-md text-slate-700">
//             Name
//           </label>
//           <input
//             name="name"
//             type="text"
//             placeholder="Enter your name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full px-4 py-2 bg-[#cacbca] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
//             required
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block mb-1 font-semibold text-md text-slate-700">
//             Email
//           </label>
//           <input
//             name="email"
//             type="email"
//             placeholder="Enter your email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-4 py-2 bg-[#cacbca] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
//             required
//           />
//         </div>

//         {/* Password */}
//         <div>
//           <label className="block mb-1 font-semibold text-md text-slate-700">
//             Password
//           </label>
//           <div className="relative">
//             <input
//               name="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-4 py-2 pr-10 bg-[#cacbca] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
//               required
//               minLength={6}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
//               aria-label={showPassword ? "Hide password" : "Show password"}
//             >
//               {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
//             </button>
//           </div>
//         </div>

//         {/* Confirm Password */}
//         <div>
//           <label className="block mb-1 font-semibold text-md text-slate-700">
//             Confirm Password
//           </label>
//           <div className="relative">
//             <input
//               name="confirmPassword"
//               type={showConfirmPassword ? "text" : "password"}
//               placeholder="Confirm your password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className="w-full px-4 py-2 pr-10 bg-[#cacbca] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
//               required
//               minLength={6}
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
//               aria-label={
//                 showConfirmPassword ? "Hide password" : "Show password"
//               }
//             >
//               {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
//             </button>
//           </div>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full rounded-md text-md font-semibold bg-orange-400 hover:bg-orange-500 hover:text-white text-slate-100 hover:shadow-amber-200 py-2 text-md ${
//             loading ? "opacity-60 cursor-not-allowed" : ""
//           }`}
//         >
//           {loading ? "Signing Up..." : "Sign Up"}
//         </button>
//       </form>

//       <p className="text-center mt-4 text-sm font-semibold text-slate-700">
//         Already have an account?{" "}
//         <Link href="/auth/signin" className="text-orange-500 hover:underline">
//           Sign in here
//         </Link>
//       </p>
//     </div>
//   );
// };

// export default Signup;

//app/auth/signup/page.js
"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const validate = () => {
    const { name, email, password, confirmPassword } = formData;
    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email is invalid";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        // ✅ Immediately sign in user after successful registration
        await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        // ✅ Redirect to homepage (session now updates)
        router.push("/");
toast.success("Registration successful!");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full border px-4 py-2 mb-2 rounded-xl  border-slate-600 text-black  focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="max-w-md mx-auto my-[5rem] p-6 bg-opacity-70 backdrop-blur mt-[6rem] rounded-lg shadow-2xl">
      <h2 className="text-2xl font-semibold text-center text-slate-700 mb-4">
        Sign Up for Flavors & Feasts
      </h2>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        disabled={loading}
        className={`mt-6 w-full bg-blue-500 hover:bg-blue-400 mb-4 text-white py-2 rounded-xl text-xl font-medium ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        Sign Up with Google
      </button>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold text-md text-slate-700">
            Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold text-md text-slate-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-semibold text-md text-slate-700">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={inputStyle}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1 font-semibold text-md text-slate-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputStyle}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl text-md font-semibold bg-orange-400 hover:bg-orange-500 hover:text-white text-slate-100 hover:shadow-amber-200 py-2 text-md ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center mt-4 text-sm font-semibold text-slate-700">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-orange-500 hover:underline">
          Sign in here
        </Link>
      </p>
    </div>
  );
};

export default Signup;
