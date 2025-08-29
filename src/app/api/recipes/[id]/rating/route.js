import { NextResponse } from 'next/server';
import connectDb from '@/lib/connectDb';
import Recipe from '@/models/recipe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import User from '@/models/user';

export async function PUT(req, { params }) {
  await connectDb();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { value } = await req.json();
  let userId = session.user._id;

  if (!userId) {
    const email = session.user?.email;
    if (!email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const u = await User.findOne({ email }).lean();
    if (!u?._id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    userId = u._id.toString();
  }

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 });
    }

    const existing = recipe.ratings.find(r => r.user.toString() === userId.toString());

    if (existing) {
      existing.value = value; // update old rating
    } else {
      recipe.ratings.push({ user: userId, value }); // new rating
    }

    await recipe.save();

    // Calculate average and count
    const total = recipe.ratings.reduce((sum, r) => sum + r.value, 0);
    const count = recipe.ratings.length;
    const average = count ? total / count : 0;

    return NextResponse.json({
      success: true,
      average: average.toFixed(1),
      count,
      rating: value,
    });

  } catch (error) {
    console.error("Rating API Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  await connectDb();
  const session = await getServerSession(authOptions);
  let userId = session?.user?.id || session?.user?._id;

  if (!userId && session?.user?.email) {
    const u = await User.findOne({ email: session.user.email }).lean();
    userId = u?._id?.toString();
  }

  try {
    const { id } = await params;
    const recipe = await Recipe.findById(id);
    if (!recipe) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });

    const ratings = recipe.ratings;
    const total = ratings.length;
    const avg = total > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / total : 0;
    const userRating = userId ? ratings.find((r) => r.user.toString() === userId.toString()) : null;

    return NextResponse.json({
      success: true,
      rating: userRating?.value || 0,
      average: avg.toFixed(1),
      count: total,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}