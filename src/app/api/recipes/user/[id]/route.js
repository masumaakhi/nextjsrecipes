//src/app/api/recipes/user/[id]/route.js
// /src/app/api/recipes/user/[id]/route.js


import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";

export async function GET(req, { params }) {
  await connectDb();
   const { id } = await params;

  try {
    const recipes = await Recipe.find({ createdBy: params.id }).sort({ createdAt: -1 });

    return new Response(JSON.stringify({ success: true, recipes }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      status: 500,
    });
  }
}
