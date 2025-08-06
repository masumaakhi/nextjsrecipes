import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
    }

    await connectDb();

    const user = await User.findById(session.user._id).populate("favorites");
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ success: true, favorites: user.favorites }),
      { status: 200 }
    );
  } catch (err) {
    console.error("🔥 GET Favorites Error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
  }

  const { recipeId } = await req.json();
  if (!recipeId) {
    return new Response(JSON.stringify({ success: false, message: "recipeId is required" }), { status: 400 });
  }

  await connectDb();

  const user = await User.findById(session.user._id);
  if (!user) {
    return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
  }

  // Ensure favorites array exists
  if (!user.favorites) user.favorites = [];

  // Toggle favorite
  const index = user.favorites.findIndex(fav => fav.toString() === recipeId);
  if (index === -1) {
    user.favorites.push(recipeId);
  } else {
    user.favorites.splice(index, 1);
  }

  await user.save();

  return new Response(
    JSON.stringify({ success: true, favorites: user.favorites }),
    { status: 200 }
  );
}





