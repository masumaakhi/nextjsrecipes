// src/app/recipes/page.jsx
"use client";
import { useEffect, useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { highlightMatch } from "@/utils/highlightMatch";
import RecipeFilterSidebar from "../components/RecipeFilterSidebar";

// 🔧 useSearchParams wrapper
const SearchWrapper = ({ onSearchChange }) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  useEffect(() => { onSearchChange(search); }, [search]);
  return null;
};

// avg rating helper (0–5, 1 দশমিক)
const avgRatingOf = (r) => {
  const arr = Array.isArray(r?.ratings) ? r.ratings : [];
  if (!arr.length) return 0;
  const sum = arr.reduce((s, it) => s + (Number(it?.value) || 0), 0);
  return Number((sum / arr.length).toFixed(1));
};

export default function Recipes() {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const [filters, setFilters] = useState({
    cuisine: "",
    dietType: "",
    foodType: "",
    minCookTime: 0,
    maxCookTime: 120,
    minServings: 1,
    maxServings: 10,
  });

  // ---- list fetch (always approved + no-store)----
  const fetchRecipes = async () => {
    const params = new URLSearchParams();

    // filters -> only truthy values
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "" && v != null) params.set(k, v);
    });
    params.set("status", "approved");
    if (search) params.set("search", search);

    const res = await fetch(`/api/recipes?${params.toString()}`, { cache: "no-store" });
    const data = await res.json();
    if (data?.success) setRecipes(data.recipes || []);
  };

  useEffect(() => { fetchRecipes(); }, [filters, search]);

  // ---- favorites ----
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/users/me/favorites", { cache: "no-store" });
      const data = await res.json();
      if (data?.success) setFavorites((data.favorites || []).map((f) => f._id?.toString?.() || String(f)));
    })();
  }, []);

  const toggleFavorite = async (recipeId) => {
    const res = await fetch("/api/users/me/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ recipeId }),
    });
    const data = await res.json();
    if (data?.success) setFavorites(data.favorites.map((f) => f.toString()));
  };

  return (
    <div className="px-6 mt-[6rem] mb-2 max-w-[86rem] mx-auto">
      {/* Suspense for search */}
      <Suspense fallback={null}>
        <SearchWrapper onSearchChange={setSearch} />
      </Suspense>

      {/* top bar */}
      <div className="flex justify-start mb-4">
        <nav className="text-slate-900 text-md mb-6 flex space-x-2">
          <span><SlidersHorizontal size={20} onClick={() => setShowSidebar(true)} /></span>
          <Link href="/" className="hover:text-slate-800">Home</Link>
          <span>{">"}</span>
          <Link href="/recipes" className="hover:text-slate-800">Recipes</Link>

          {search && (
            <div className="flex items-center gap-2 bg-slate-200 px-3 pt-[1px] pb-[1px] rounded-full w-fit text-md">
              <span className="text-black">{search}</span>
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(window.location.search);
                  newParams.delete("search");
                  router.push(`/recipes?${newParams.toString()}`);
                }}
                className="text-red-500 hover:text-red-700 font-bold"
                aria-label="Clear search"
              >
                &times;
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* overlay */}
      {showSidebar && <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowSidebar(false)} />}

      {/* sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-opacity-70 backdrop-blur rounded-lg shadow-2xl transition-transform duration-300 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end text-slate-900 p-4">
          <button onClick={() => setShowSidebar(false)}><X size={24} /></button>
        </div>
        <RecipeFilterSidebar setFilters={setFilters} />
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {recipes.length === 0 && (
          <p className="text-center col-span-full text-md text-slate-900">No recipes found.</p>
        )}

        {recipes.map((recipe) => {
          const isFavorited = favorites.includes(recipe._id);
          const avg = avgRatingOf(recipe); // ⬅️ rating number
          return (
            <div key={recipe._id} className="relative bg-white rounded-lg shadow-lg">
              <Link href={`/recipes/${recipe._id}`}>
                {/* img ব্যবহার করি যাতে remote image config লাগবে না */}
                <div className="relative w-full h-54 rounded-t-lg rounded-b-md overflow-hidden">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-54 object-cover"
                    loading="lazy"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(recipe._id);
                    }}
                    className={`absolute top-3 right-3 z-10 text-2xl transition-colors duration-300 ${
                      isFavorited ? "text-red-600" : "text-gray-400 hover:text-red-500"
                    }`}
                    aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                  >
                    <FaHeart />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-xl text-slate-900 font-semibold flex items-center gap-2">
                    {highlightMatch(recipe.title, search)}
                    <span className="text-sm font-normal text-slate-800">(⭐ {avg} )</span>
                  </h3>
                  <p className="text-sm text-slate-800">By {recipe.createdBy?.name || "Unknown"}</p>
                  <p className="text-slate-800">{highlightMatch(recipe.description, search)}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
