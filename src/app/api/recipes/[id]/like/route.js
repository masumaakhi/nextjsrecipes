// // src/app/api/recipes/[id]/like/route.js
// import { NextResponse } from "next/server";
// import connectDb from "@/lib/connectDb";
// import Recipe from "@/models/recipe";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth"; // your NextAuth config

// export async function PUT(req, { params }) {
//   await connectDb();
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user) {
//     return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//   }

//   const { type } = await req.json(); // like or dislike
//   const recipeId = params.id;
//   const userId = session.user._id;

//   try {
//     const recipe = await Recipe.findById(recipeId);

//     if (!recipe) {
//       return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 });
//     }

//     const hasLiked = recipe.likes.includes(userId);
//     const hasDisliked = recipe.dislikes.includes(userId);

//     if (type === "like") {
//       if (hasLiked) {
//         // Remove like
//         recipe.likes.pull(userId);
//       } else {
//         recipe.likes.addToSet(userId);
//         if (hasDisliked) recipe.dislikes.pull(userId);
//       }
//     } else if (type === "dislike") {
//       if (hasDisliked) {
//         // Remove dislike
//         recipe.dislikes.pull(userId);
//       } else {
//         recipe.dislikes.addToSet(userId);
//         if (hasLiked) recipe.likes.pull(userId);
//       }
//     }

//     await recipe.save();
//    const currentReaction = hasLiked
//   ? "like"
//   : hasDisliked
//   ? "dislike"
//   : null;

//     return NextResponse.json({
//       success: true,
//       likes: recipe.likes.length,
//       dislikes: recipe.dislikes.length,
//       userReaction: currentReaction,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // your NextAuth config

// 🟢 GET method: userReaction সহ রেসিপি info
export async function GET(req, { params }) {
  await connectDb();
  const session = await getServerSession(authOptions);
 const { id } = params; // 👈 এই লাইনে destructure করো
const recipeId = id;   // 👈 এখন আর error হবে না

  const userId = session?.user?._id;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 });
    }

    const hasLiked = userId ? recipe.likes.includes(userId) : false;
    const hasDisliked = userId ? recipe.dislikes.includes(userId) : false;

    const userReaction = hasLiked
      ? "like"
      : hasDisliked
      ? "dislike"
      : null;

    return NextResponse.json({
      success: true,
      likes: recipe.likes.length,
      dislikes: recipe.dislikes.length,
      userReaction,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// 🟡 PUT method: like/dislike update
export async function PUT(req, { params }) {
  await connectDb();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { type } = await req.json(); // expected "like" or "dislike"
  const { id } = params; // 👈 এই লাইনে destructure করো
const recipeId = id;
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
        recipe.likes.pull(userId); // undo like
      } else {
        recipe.likes.addToSet(userId);
        if (hasDisliked) recipe.dislikes.pull(userId);
      }
    } else if (type === "dislike") {
      if (hasDisliked) {
        recipe.dislikes.pull(userId); // undo dislike
      } else {
        recipe.dislikes.addToSet(userId);
        if (hasLiked) recipe.likes.pull(userId);
      }
    }

    await recipe.save();

    const updatedReaction = recipe.likes.includes(userId)
      ? "like"
      : recipe.dislikes.includes(userId)
      ? "dislike"
      : null;

    return NextResponse.json({
      success: true,
      likes: recipe.likes.length,
      dislikes: recipe.dislikes.length,
      userReaction: updatedReaction,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
