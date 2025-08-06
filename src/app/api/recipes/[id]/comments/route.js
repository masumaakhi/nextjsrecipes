//src/app/api/recipes/[id]/comments/route.js
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await connectDb();
   const { id } = await params;
  const { userId, text } = await req.json();

  try {
    const recipe = await Recipe.findById(params.id);
    if (!recipe) return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 });

    recipe.comments.push({ user: userId, text });
    await recipe.save();

    return NextResponse.json({ success: true, message: "Comment added" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  await connectDb();
   const { id } = await params;

  try {
    const recipe = await Recipe.findById(params.id);
    if (!recipe) return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 });

    return NextResponse.json({ success: true, comments: recipe.comments }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import connectDb from "@/lib/connectDb";
// import Recipe from "@/models/recipe";

// export async function POST(req, { params }) {
//   await connectDb();

//   try {
//     const { id } = params;
//     const body = await req.json();
//     const { text, userId } = body;

//     if (!text || !userId) {
//       return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
//     }

//     const recipe = await Recipe.findById(id);
//     if (!recipe) {
//       return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 });
//     }

//     // Add comment
//     recipe.comments.push({
//       user: userId,
//       text,
//       createdAt: new Date(),
//       replies: [],
//     });

//     await recipe.save();

//     return NextResponse.json({ success: true, message: "Comment added!" });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
//   }
// }
