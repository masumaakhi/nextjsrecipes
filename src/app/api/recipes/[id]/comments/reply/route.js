// src/app/api/recipes/[id]/comments/reply/route.js
import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req, { params }) {
  await connectDb();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { commentId, text } = await req.json();

    if (!commentId || !text || !text.trim()) {
      return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
    }

    const recipe = await Recipe.findById(id);
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
      user: session.user._id,
      text: text.trim(),
      createdAt: new Date(),
      likes: [],
      dislikes: [],
      ratings: [],
    });

    await recipe.save();

    const populated = await Recipe.findById(id)
      .populate('comments.user', 'name email')
      .populate('comments.replies.user', 'name email');
    const updatedComment = populated.comments.id(commentId);

    return NextResponse.json({
      success: true,
      comment: updatedComment,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
