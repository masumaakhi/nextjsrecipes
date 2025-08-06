// src/app/api/recipes/[id]/route.js

import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";

export async function GET(req, { params }) {
   const { id } = await params;
  await connectDb();

  try {
    const recipe = await Recipe.findById(params.id).populate("createdBy", "name email");
    if (!recipe) {
      return new Response(JSON.stringify({ success: false, message: "Not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, recipe }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  await connectDb(); // ✅ ছোট b

  const id = params.id;
  const updatedData = await req.json();

  try {
    const updated = await Recipe.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true, // ✅ Added validation
    });

    if (!updated) {
      return new Response(JSON.stringify({ success: false, message: "Not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, recipe: updated }), { status: 200 });
  } catch (err) {
    console.error("Update Error:", err); // ✅ Add log
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  await connectDb(); // Ensure DB connection

  try {
    const deleted = await Recipe.findByIdAndDelete(params.id);

    if (!deleted) {
      return new Response(JSON.stringify({ success: false, message: "Recipe not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, message: "Recipe deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}