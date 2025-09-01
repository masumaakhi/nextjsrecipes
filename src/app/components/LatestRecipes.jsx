// src/app/components/LatestRecipes.jsx
import Link from "next/link";
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";
import { unstable_noStore as noStore } from "next/cache"; // ⬅️ add this

// DB থেকে ৪টা সর্বশেষ approved রেসিপি
async function getLatestRecipes() {
  noStore();                 // ⬅️ এই রেন্ডারে ক্যাশ না থাক
  await connectDb();

  const docs = await Recipe.find(
    { status: "approved" },  // টেস্টে pending হলে দেখাবে না—চাইলে এটা সরাও
    { title: 1, imageUrl: 1, ratings: 1, createdAt: 1 }
  )
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  return docs.map((r) => {
    const ratings = Array.isArray(r.ratings) ? r.ratings : [];
    const avg =
      ratings.length
        ? Math.round(
            ratings.reduce((s, it) => s + (Number(it.value) || 0), 0) /
            ratings.length
          )
        : 0;
    return { ...r, avgRating: Math.max(0, Math.min(5, avg)) };
  });
}

export default async function LatestRecipes() {
  noStore(); // ⬅️ সেফ সাইডে এখানেও
  const recipes = await getLatestRecipes();

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
        <h2 className="text-3xl font-bold text-gray-800">Latest Recipes</h2>
        <Link href="/recipes" className="text-blue-600 hover:text-blue-800 font-medium transition duration-300">
          See More →
        </Link>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <div key={String(recipe._id)} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <Link href={`/recipes/${recipe._id}`} className="block">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                loading="lazy"
                className="w-full h-48 object-cover rounded-t-xl hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                {renderStars(recipe.avgRating || 0)}
                <h3 className="text-xl font-semibold text-gray-800">{recipe.title}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
