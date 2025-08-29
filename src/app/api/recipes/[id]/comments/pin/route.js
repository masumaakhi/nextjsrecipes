// // src/app/api/recipes/[id]/comments/pin/route.js
import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";

export async function PUT(req, { params }) {
  await connectDb();
  const { id } = params;
  const { commentId, pinned } = await req.json();

    const recipe = await Recipe.findById(id);
  if (!recipe) return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 });

    const comment = recipe.comments.id(commentId);
  if (!comment) return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });

    comment.pinned = pinned;
    await recipe.save();

  return NextResponse.json({ success: true, comment });
}
