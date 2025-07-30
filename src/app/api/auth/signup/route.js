// src/app/api/auth/signup/route.js
import { NextResponse } from "next/server";
import connectDb from "../../../../lib/connectDb";
import User from "../../../../models/user";
import { hash } from "bcrypt";
import { sendEmail } from "../../../../lib/email";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  await connectDb();

  const { name, email, password } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);
  const otp = generateOTP();
  const otpExpiry = Date.now() + 5 * 60 * 1000;

  try {
    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
      verifyOtp: otp,
      verifyOtpExpiredAt: otpExpiry,
      isAccountVerified: false,
    }).save();

    // ✅ send OTP email
    await sendEmail({
      to: newUser.email,
      subject: "Verify your email",
      html: `<p>Your OTP is: <b>${otp}</b></p>`,
    });

    return NextResponse.json(
      { message: "User registered. Please verify OTP sent to your email." },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  return NextResponse.json({ message: "Bismillah" });
}
