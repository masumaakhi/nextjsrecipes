// src/app/api/recipes/[id]/comments/reply/route.js
import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";

export async function POST(req, { params }) {
  await connectDb();

  try {
    const { id } = params; // ✅ will work if folder structure is correct
    const { commentId, text, user } = await req.json();

    if (!commentId || !text || !user) {
      return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
    }

    const recipe = await Recipe.findById(id)
      .populate("comments.user", "name email")
      .populate("comments.replies.user", "name email")
      .populate("createdBy", "name email");

    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 });
    }

    // Find parent comment
    const comment = recipe.comments.id(commentId);
    if (!comment) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });
    }

    // Push reply
    comment.replies.push({
      user: user._id, // send full user object from frontend
      text,
      createdAt: new Date(),
    });

    await recipe.save();

    return NextResponse.json({
      success: true,
      message: "Reply added!",
      recipe,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
