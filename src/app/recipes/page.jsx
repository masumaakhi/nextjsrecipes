// // //src/app/recipes/page.jsx

"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import { highlightMatch } from "@/utils/highlightMatch";
import RecipeFilterSidebar from "../components/RecipeFilterSidebar";

const Recipes = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const [filters, setFilters] = useState({
    cuisine: "",
    dietType: "",
    foodType: "",
    minCookTime: 0,
    maxCookTime: 120,
    minServings: 1,
    maxServings: 10,
  });
  const [showSidebar, setShowSidebar] = useState(false);

  const fetchRecipes = async () => {
    const params = new URLSearchParams(filters);
    if (search) params.set("search", search);

    const res = await fetch(`/api/recipes?${params.toString()}`);
    const data = await res.json();
    if (data.success) setRecipes(data.recipes);
  };

  useEffect(() => {
    fetchRecipes();
  }, [filters, search]);

  // Optional: initial load with approved recipes only
  useEffect(() => {
    const fetchRecipes = async () => {
      const res = await fetch("/api/recipes?status=approved");
      const data = await res.json();
      if (data.success) setRecipes(data.recipes);
    };
    fetchRecipes();
  }, []);

  if (!recipes) return <div>Loading...</div>;

  return (
    <div className="px-6 mt-[6rem] mb-2">
      {/* 🧾 Filter Button ABOVE the grid */}
      <div className="flex justify-start mb-4">
        <nav className="text-slate-900 text-md mb-6 flex space-x-2">
          <span>
            <SlidersHorizontal size={20} onClick={() => setShowSidebar(true)} />
          </span>
          <Link href="/" className="hover:text-slate-800">
            Home
          </Link>
          <span>{">"}</span>
          <Link href="/recipes" className="hover:text-slate-800">
            Recipes
          </Link>

          {search && (
            <div className="flex items-center gap-2 bg-slate-200 px-3 pt-[1px] pb-[1px] rounded-full w-fit text-md">
              <span className="text-black">
                 {search}
              </span>
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(
                    searchParams.toString()
                  );
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

      {/* ✖ Overlay Background */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* 🧾 Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-lg transition-transform duration-300 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setShowSidebar(false)}>
            <X size={24} />
          </button>
        </div>
        <RecipeFilterSidebar setFilters={setFilters} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {recipes.length === 0 && (
          <p className="text-center col-span-full">No recipes found.</p>
        )}

        {recipes.map((recipe) => (
          <div key={recipe._id} className="bg-white rounded-lg shadow-md">
            <Link href={`/recipes/${recipe._id}`}>
              <div className="relative w-full h-64 rounded-t-lg overflow-hidden">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </Link>

            <div className="p-4">
              {/* ✅ Highlighted Title */}
              <h3 className="text-xl font-semibold">
                {highlightMatch(recipe.title, search)}
              </h3>

              {/* ✅ Author Name */}
              <p className="text-sm text-gray-600">
                By {recipe.createdBy?.name || "Unknown"}
              </p>

              {/* ✅ Highlighted Description */}
              {/* <p className="text-gray-700">
                {highlightMatch(recipe.description?.substring(0, 100), search)}
                ...
              </p> */}
              <p className="text-gray-700">
                {highlightMatch(recipe.description, search)} 
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
