// src/app/components/TrendingRecipes.jsx
import Link from "next/link";
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";

export const dynamic = "force-dynamic";

async function getTrendingRecipes() {
  await connectDb();

  const rows = await Recipe.aggregate([
    { $match: { status: "approved" } },

    // ratings array / likes array নরমালাইজ
    {
      $addFields: {
        ratingsArr: { $ifNull: ["$ratings", []] },
        likesCount: { $size: { $ifNull: ["$likes", []] } },
      },
    },

    // avgRating বের করি
    {
      $addFields: {
        avgRating: {
          $cond: [
            { $gt: [{ $size: "$ratingsArr" }, 0] },
            {
              $avg: {
                $map: {
                  input: "$ratingsArr",
                  as: "r",
                  in: { $toDouble: "$$r.value" },
                },
              },
            },
            0,
          ],
        },
      },
    },

    // ট্রেন্ডিং অর্ডার
    { $sort: { avgRating: -1, likesCount: -1, createdAt: -1 } },
    { $limit: 4 },

    // UI ফিল্ড
    { $project: { title: 1, imageUrl: 1, avgRating: 1 } },
  ]);

  // স্টার দেখানোর জন্য nearest int
  return rows.map((r) => ({
    ...r,
    avgRating: Math.max(0, Math.min(5, Math.round(r.avgRating || 0))),
  }));
}

export default async function TrendingRecipes() {
  const recipes = await getTrendingRecipes();

  const renderStars = (rating) => (
    <div className="flex gap-1 text-yellow-400 mb-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="max-w-[86rem] mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Trending Recipes</h2>
        <Link
          href="/recipes"
          className="text-blue-600 no-underline hover:text-blue-800 font-medium transition duration-300"
        >
          See More →
        </Link>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recipes.map((r) => (
          <div
            key={String(r._id)}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <Link href={`/recipes/${r._id}`} className="block">
              <img
                src={r.imageUrl}
                alt={r.title}
                loading="lazy"
                className="w-full h-48 object-cover rounded-t-xl hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                {renderStars(r.avgRating || 0)}
                <h3 className="text-xl font-semibold text-gray-800">{r.title}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
