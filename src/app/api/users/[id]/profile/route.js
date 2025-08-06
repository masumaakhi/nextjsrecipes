//src/app/api/users/[id]/profile/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import Recipe from "@/models/recipe";

export async function GET(req) {
  await connectDb();

  // ✅ Get logged-in user session
  const session = await getServerSession(authOptions);
  if (!session || !session.user?._id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user._id;

  // ✅ Fetch user
  const user = await User.findById(userId).lean();
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }

  // ✅ Calculate recipe stats
  const total = await Recipe.countDocuments({ createdBy: userId });
  const pending = await Recipe.countDocuments({ createdBy: userId, status: "pending" });
  const approved = await Recipe.countDocuments({ createdBy: userId, status: "approved" });
  const rejected = await Recipe.countDocuments({ createdBy: userId, status: "rejected" });

  return NextResponse.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
    },
    stats: { total, pending, approved, rejected },
  });
}
