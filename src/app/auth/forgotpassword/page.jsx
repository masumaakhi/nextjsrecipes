import React from 'react'

const forgotpassword = () => {
  return (
      <div className="min-h-screen flex items-center justify-center bg-opacity-70 backdrop-blur rounded-lg shadow-2xl px-4">
      <div className="w-full max-w-md  shadow-xl rounded-2xl p-8 space-y-4">
        <h2 className="text-2xl text-center font-bold text-md text-slate-700">Forgot Password</h2>
        <p className=" font-semibold text-md text-slate-700 text-center">Enter your email to receive a reset link.</p>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Your email"
            className="w-full px-4 py-2 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full rounded-xl  text-md font-semibold  bg-orange-400 hover:bg-orange-500 hover:text-white text-slate-100 hover:shadow-amber-200 py-2 text-md"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  )
}

export default forgotpassword;
