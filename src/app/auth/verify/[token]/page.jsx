
import Link from 'next/link'

const verify = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl">
        <h2 className="text-3xl font-bold text-green-600 mb-2">Email Verified!</h2>
        <p className="text-gray-600 mb-4">Your email has been successfully verified.</p>
        <Link
          href="/auth/signin"
          className="inline-block mt-4 px-6  transition  rounded-xl  text-md font-semibold  bg-orange-400 hover:bg-orange-500 hover:text-white text-slate-100 hover:shadow-amber-200 py-2 text-md"
        >
          Go to Login
        </Link>
      </div>
    </div>
  )
}

export default verify