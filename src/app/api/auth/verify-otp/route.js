import { NextResponse } from "next/server";
import connectDb from "../../../../lib/connectDb";
import User from "../../../../models/user";

export async function POST(req) {
  await connectDb();

  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.isAccountVerified) {
    return NextResponse.json({ message: "Account already verified" }, { status: 200 });
  }

  // OTP টাইপ কনভার্শন নিশ্চিত করো, কারণ input হতে string আসে
  if (user.verifyOtp !== otp.trim()) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  if (Date.now() > user.verifyOtpExpiredAt) {
    return NextResponse.json({ error: "OTP expired" }, { status: 400 });
  }

  user.isAccountVerified = true;
  user.verifyOtp = "";
  user.verifyOtpExpiredAt = 0;

  await user.save();

  return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
}
