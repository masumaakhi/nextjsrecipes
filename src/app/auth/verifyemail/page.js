// 'use client';

// import React, { useRef, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "react-toastify";

// const EmailVerify = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email");

//   const inputRefs = useRef([]);
//   const [loading, setLoading] = useState(false);

//   const handleInput = (e, index) => {
//     if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && e.target.value === "" && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handlePaste = (e) => {
//     const paste = e.clipboardData.getData("Text").slice(0, 6).split("");
//     paste.forEach((char, index) => {
//       if (inputRefs.current[index]) {
//         inputRefs.current[index].value = char;
//       }
//     });
//   };

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const otp = inputRefs.current.map((input) => input.value).join("");

//     try {
//       const res = await fetch("/api/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success(data.message || "Email verified successfully!");
//         router.push("/");
//       } else {
//         toast.error(data.error || "Verification failed");
//       }
//     } catch (error) {
//       toast.error(error.message || "Something went wrong");
//     }

//     setLoading(false);
//   };

//   if (!email) {
//     return <p className="text-center text-red-600 mt-10">Invalid or missing email.</p>;
//   }

//   return (
//     <div className="max-w-md mx-auto my-20 p-6 bg-white/70 backdrop-blur rounded-lg shadow-2xl">
//       <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
//         <h1 className="text-2xl text-center font-bold text-slate-700 mb-4">
//           Verify Email OTP
//         </h1>
//         <p className="text-center text-sm mb-6 font-semibold text-slate-700">
//           Check your email to verify your account
//         </p>

//         <div className="flex justify-between mb-8" onPaste={handlePaste}>
//           {Array.from({ length: 6 }).map((_, index) => (
//             <input
//               key={index}
//               type="text"
//               maxLength={1}
//               required
//               className="w-12 h-12 text-gray-700 rounded-md text-xl text-center px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               ref={(el) => (inputRefs.current[index] = el)}
//               onInput={(e) => handleInput(e, index)}
//               onKeyDown={(e) => handleKeyDown(e, index)}
//               disabled={loading}
//             />
//           ))}
//         </div>

//         <button
//           disabled={loading}
//           className="w-full py-2.5 rounded-full bg-gradient-to-r from-orange-300 via-orange-600 to-orange-900 hover:from-orange-700 hover:via-orange-600 hover:to-orange-300 text-white font-medium disabled:opacity-50 transition-all duration-300 ease-in-out"
//         >
//           {loading ? "Verifying..." : "Verify"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EmailVerify;

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page