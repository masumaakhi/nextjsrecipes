//src/app/api/recipes/[id]/comments/route.js
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Create a new comment (requires auth)
export async function POST(req, { params }) {
  await connectDb();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { text } = await req.json();
  const userId = session.user._id;

  if (!text || !text.trim()) {
    return NextResponse.json({ success: false, message: "Comment text is required" }, { status: 400 });
  }

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 });
    }

    recipe.comments.push({
      user: userId,
      text: text.trim(),
      likes: [],
      dislikes: [],
      pinned: false,
      createdAt: new Date(),
      ratings: [],
      replies: [],
    });
    await recipe.save();

    const populated = await Recipe.findById(id)
      .populate('comments.user', 'name email')
      .populate('comments.replies.user', 'name email');
    const addedComment = populated.comments[populated.comments.length - 1];

    return NextResponse.json({ success: true, comment: addedComment }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// Get comments with simple pagination: ?page=1&limit=10 (newest first)
export async function GET(req, { params }) {
  await connectDb();
  const { id } = params;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);
  const skip = (page - 1) * limit;

  try {
    const recipe = await Recipe.findById(id)
      .populate('comments.user', 'name email')
      .populate('comments.replies.user', 'name email');

    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 });
    }

    const sorted = [...recipe.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const paged = sorted.slice(skip, skip + limit);
    const hasMore = skip + limit < sorted.length;

    return NextResponse.json({ success: true, comments: paged, hasMore }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}


