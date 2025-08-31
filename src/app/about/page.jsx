// src/app/about/page.jsx
import Link from "next/link";
import { FaHeart, FaLeaf, FaUsers, FaFireAlt } from "react-icons/fa";
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "About • Flavors & Feasts",
  description:
    "Learn about Flavors & Feasts — our mission, values, and the community that makes sharing recipes delightful.",
};

async function getStats() {
  try {
    await connectDb();

    const totalRecipes = await Recipe.countDocuments({ status: "approved" });

    // Distinct counts (empty arrays হলে 0)
    const cuisines = await Recipe.distinct("category.cuisine", {
      status: "approved",
    });
    const mealTypes = await Recipe.distinct("category.mealType", {
      status: "approved",
    });

    // মোট লাইক গণনা (likes array length যোগফল)
    const likesAgg = await Recipe.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
        },
      },
    ]);
    const totalLikes = likesAgg?.[0]?.totalLikes ?? 0;

    return {
      totalRecipes,
      cuisines: cuisines.filter(Boolean).length,
      mealTypes: mealTypes.filter(Boolean).length,
      totalLikes,
    };
  } catch {
    // ফ্যালব্যাক — DB না পেলে স্ট্যাটিক ভ্যালু
    return { totalRecipes: 0, cuisines: 0, mealTypes: 0, totalLikes: 0 };
  }
}

export default async function AboutPage() {
  const stats = await getStats();

  return (
    <div className="max-w-[86rem] mx-auto px-6 mt-24 mb-20">
      {/* Hero */}
      <section className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 mb-4">
          <span className="text-2xl">🍽️</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900">
          About <span className="text-amber-600">Flavors & Feasts</span>
        </h1>
        <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
          A cozy home for cooks and food lovers. Share your best recipes, explore
          global cuisines, and inspire others to cook something delicious today.
        </p>
      </section>

      {/* Stats */}
      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-white/70 backdrop-blur shadow p-6">
          <p className="text-3xl font-bold text-slate-900">{stats.totalRecipes}</p>
          <p className="text-slate-600">Approved Recipes</p>
        </div>
        <div className="rounded-2xl bg-white/70 backdrop-blur shadow p-6">
          <p className="text-3xl font-bold text-slate-900">{stats.cuisines}</p>
          <p className="text-slate-600">Cuisines</p>
        </div>
        <div className="rounded-2xl bg-white/70 backdrop-blur shadow p-6">
          <p className="text-3xl font-bold text-slate-900">{stats.mealTypes}</p>
          <p className="text-slate-600">Meal Types</p>
        </div>
        <div className="rounded-2xl bg-white/70 backdrop-blur shadow p-6">
          <p className="text-3xl font-bold text-slate-900">{stats.totalLikes}</p>
          <p className="text-slate-600">Total Likes</p>
        </div>
      </section>

      {/* Mission / What we value */}
      <section className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white/70 backdrop-blur shadow p-6">
          <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
            <FaHeart />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Made with Love</h3>
          <p className="text-slate-600 mt-1">
            Every recipe carries a story—family traditions, weekend experiments,
            or a late-night craving. We make it easy to share them all.
          </p>
        </div>

        <div className="rounded-2xl bg-white/70 backdrop-blur shadow p-6">
          <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <FaLeaf />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Inclusive & Fresh</h3>
          <p className="text-slate-600 mt-1">
            From vegan to biryani—discover dishes across diets, cuisines, and
            cultures. Fresh, diverse, and always inviting.
          </p>
        </div>

        <div className="rounded-2xl bg-white/70 backdrop-blur shadow p-6">
          <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <FaFireAlt />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Simple & Fast</h3>
          <p className="text-slate-600 mt-1">
            We focus on clean design and quick navigation so you can spend less
            time searching—and more time cooking.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-16 rounded-2xl bg-white/70 backdrop-blur shadow p-6">
        <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
        <ol className="mt-4 grid gap-4 md:grid-cols-3 list-decimal list-inside text-slate-700">
          <li>
            <span className="font-semibold">Create an account</span> and set up
            your profile.
          </li>
          <li>
            <span className="font-semibold">Share recipes</span> with photos,
            prep time, and detailed steps.
          </li>
          <li>
            <span className="font-semibold">Engage</span>—comment, like,
            favorite, and pin helpful tips.
          </li>
        </ol>
      </section>

      {/* Tech stack */}
      <section className="mt-12 rounded-2xl bg-white/70 backdrop-blur shadow p-6">
        <h2 className="text-2xl font-bold text-slate-900">Powered by</h2>
        <ul className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
          <li className="rounded-lg border border-slate-200 p-3 text-center">Next.js</li>
          <li className="rounded-lg border border-slate-200 p-3 text-center">MongoDB</li>
          <li className="rounded-lg border border-slate-200 p-3 text-center">Mongoose</li>
          <li className="rounded-lg border border-slate-200 p-3 text-center">Tailwind CSS</li>
        </ul>
      </section>

      {/* Community CTA */}
      <section className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 text-slate-700">
          <FaUsers />
          <p>Join our growing foodie community</p>
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Link
            href="/recipes"
            className="px-5 py-2 rounded-full bg-amber-600 text-white hover:bg-amber-700 transition"
          >
            Explore Recipes
          </Link>
          <Link
            href="/add-recipe"
            className="px-5 py-2 rounded-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 transition"
          >
            Share Your Recipe
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Questions?{" "}
          <a
            className="underline decoration-dotted underline-offset-2"
            href="mailto:support@example.com"
          >
            support@example.com
          </a>
        </p>
      </section>
    </div>
  );
}
