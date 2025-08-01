// src/app/api/recipes/[id]/rating/route.js
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// Save or update a user's rating
export async function PUT(req, { params }) {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { value } = await req.json();
    if (!value || value < 1 || value > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const recipe = await Recipe.findById(params.id);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const userId = session.user.id;

    // Add or update the user's rating
    const existing = recipe.ratings.find((r) => {
      const uid = r?.user ? (typeof r.user === "object" ? r.user._id : r.user) : null;
      return uid && uid.toString() === userId;
    });

    if (existing) {
      existing.value = value; // update
    } else {
      recipe.ratings.push({ user: userId, value }); // add
    }

    await recipe.save();

    const ratings = recipe.ratings.filter(r => r?.user && r.value);
    const total = ratings.length;
    const average = ratings.reduce((sum, r) => sum + r.value, 0) / total;

    return NextResponse.json({
      success: true,
      average: average.toFixed(1),
      count: total,
    });
  } catch (err) {
    console.error("PUT /rating error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Get current user's rating and recipe average rating
export async function GET(req, { params }) {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const recipe = await Recipe.findById(params.id);
    if (!recipe)
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

    const userId = session.user.id;
    const ratings = recipe.ratings.filter(r => r?.user && r.value);

    const userRating = ratings.find((r) => {
      const uid = typeof r.user === "object" ? r.user._id : r.user;
      return uid?.toString() === userId;
    });

    const total = ratings.length;
    const avg =
      total > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / total : 0;

    return NextResponse.json({
      rating: userRating?.value || 0,
      average: avg.toFixed(1),
      count: total,
    });
  } catch (err) {
    console.error("GET /rating error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


