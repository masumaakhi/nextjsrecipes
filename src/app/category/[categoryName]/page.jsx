// src/app/category/[categoryName]/page.jsx
import Link from "next/link";
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";

export const dynamic = "force-dynamic";

const VALID_GROUPS = ["cuisine", "mealType", "dietType", "foodType"];

function escapeRegex(s = "") {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildCategoryQuery(name, group) {
  // নামটাকে case-insensitive match করবো (exact match semantics)
  const rx = new RegExp(`^${escapeRegex(name)}$`, "i");

  if (group && VALID_GROUPS.includes(group)) {
    // নির্দিষ্ট টাইপে খুঁজুন
    return { [`category.${group}`]: rx };
  }

  // চার টাইপ জুড়ে খুঁজুন
  return {
    $or: [
      { "category.cuisine": rx },
      { "category.mealType": rx },
      { "category.dietType": rx },
      { "category.foodType": rx },
    ],
  };
}

export default async function CategoryRecipesPage({ params, searchParams }) {
  const categoryName = decodeURIComponent(params.categoryName || "");
  const group = searchParams?.group; // optional: cuisine|mealType|dietType|foodType

  await connectDb();

  const query = {
    status: "approved",
    ...buildCategoryQuery(categoryName, group),
  };

  // প্রয়োজনীয় ফিল্ড নিলাম, নতুনটা আগে
  const recipes = await Recipe.find(query)
    .select("title description imageUrl")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 mt-12 mb-3">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          🍳 Recipes in <span className="text-green-600">"{categoryName}"</span>
          {group ? (
            <span className="text-sm font-normal text-gray-500 ml-2">(group: {group})</span>
          ) : null}
        </h2>
        <Link
          href="/allcategory"
          className="text-[#681f28] no-underline text-lg hover:text-red-800 transition"
        >
          All categories →
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p className="text-center text-gray-500">No recipes found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((r) => (
            <div
              key={String(r._id)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <img
                src={r.imageUrl}
                alt={r.title}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {r.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {r.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
