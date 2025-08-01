//src/app/api/recipes/[id]/dislike/route.js

import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust if needed

export async function POST(req, { params }) {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const recipeId = params.id;
    const userId = session.user._id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return new Response(JSON.stringify({ message: "Recipe not found" }), {
        status: 404,
      });
    }

    const hasDisliked = recipe.dislikes.includes(userId);
    if (hasDisliked) {
      recipe.dislikes.pull(userId); // remove dislike
    } else {
      recipe.dislikes.push(userId); // add dislike
      recipe.likes.pull(userId); // remove like if it exists
    }

    await recipe.save();

    return new Response(
      JSON.stringify({ success: true, dislikes: recipe.dislikes.length }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Dislike error:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Something went wrong" }),
      { status: 500 }
    );
  }
}
