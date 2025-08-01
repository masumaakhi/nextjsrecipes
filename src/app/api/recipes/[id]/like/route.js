// src/app/api/recipes/[id]/like/route.js
import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // your NextAuth config

export async function PUT(req, { params }) {
  await connectDb();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { type } = await req.json(); // like or dislike
  const recipeId = params.id;
  const userId = session.user._id;

  try {
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 });
    }

    const hasLiked = recipe.likes.includes(userId);
    const hasDisliked = recipe.dislikes.includes(userId);

    if (type === "like") {
      if (hasLiked) {
        // Remove like
        recipe.likes.pull(userId);
      } else {
        recipe.likes.addToSet(userId);
        if (hasDisliked) recipe.dislikes.pull(userId);
      }
    } else if (type === "dislike") {
      if (hasDisliked) {
        // Remove dislike
        recipe.dislikes.pull(userId);
      } else {
        recipe.dislikes.addToSet(userId);
        if (hasLiked) recipe.likes.pull(userId);
      }
    }

    await recipe.save();

    return NextResponse.json({
      success: true,
      likes: recipe.likes.length,
      dislikes: recipe.dislikes.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
