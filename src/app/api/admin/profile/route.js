// src/app/api/admin/profile/route.js
// src/app/api/admin/profile/route.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import Recipe from "@/models/recipe";

export async function GET(request) {
  try {
    // getServerSession may need the request context in some setups; try both ways if one returns null.
    const session = await getServerSession(authOptions);
    // console.log for debugging — remove in production
    // console.log("Session in admin/profile:", session);

    if (!session) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
    }

    await connectDb();

    // robustly determine user identifier
    const userId = session?.user?._id || session?.user?.id;
    let admin = null;

    if (userId) {
      admin = await User.findById(userId).lean();
    } else if (session?.user?.email) {
      admin = await User.findOne({ email: session.user.email }).lean();
    }

    if (!admin || admin.role !== "admin") {
      return new Response(JSON.stringify({ success: false, message: "Access Denied" }), { status: 403 });
    }

    // Stats
    const [totalUsers, totalRecipes, pending, approved, rejected] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      Recipe.countDocuments({ status: "pending" }),
      Recipe.countDocuments({ status: "approved" }),
      Recipe.countDocuments({ status: "rejected" }),
    ]);

    const totalFavoritesAgg = await User.aggregate([
      { $project: { favoritesCount: { $size: { $ifNull: ["$favorites", []] } } } },
      { $group: { _id: null, total: { $sum: "$favoritesCount" } } },
    ]);

    const lastLogin = admin?.lastLogin || admin?.updatedAt || admin?.createdAt || null;

    return new Response(
      JSON.stringify({
        success: true,
        admin: {
          ...admin,
          lastLogin,
        },
        stats: {
          totalUsers,
          totalRecipes,
          pending,
          approved,
          rejected,
          totalFavorites: totalFavoritesAgg[0]?.total || 0,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin Profile API Error:", error);
    return new Response(JSON.stringify({ success: false, message: "Server Error" }), { status: 500 });
  }
}
