// // //src/app/recipes/page.jsx
"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import { highlightMatch } from "@/utils/highlightMatch";
import RecipeFilterSidebar from "../components/RecipeFilterSidebar";
import { useSearchParams } from "next/navigation";

// 🔧 Wrapper component for useSearchParams inside Suspense
const SearchWrapper = ({ onSearchChange }) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    onSearchChange(search);
  }, [search]);

  return null;
};

const Recipes = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState(null);
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
    <div className="px-6 mt-[6rem] mb-2 max-w-[86rem] mx-auto">
      {/* Suspense for search */}
      <Suspense fallback={null}>
        <SearchWrapper onSearchChange={setSearch} />
      </Suspense>

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

      {/* ✖ Overlay Background */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* 🧾 Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-opacity-70 backdrop-blur rounded-lg shadow-2xl  transition-transform duration-300 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end text-slate-900 p-4">
          <button onClick={() => setShowSidebar(false)}>
            <X size={24} />
          </button>
        </div>
        <RecipeFilterSidebar setFilters={setFilters} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {recipes.length === 0 && (
          <p className="text-center col-span-full text-md text-slate-900">No recipes found.</p>
        )}

        {recipes.map((recipe) => (
          <div key={recipe._id} className="bg-white rounded-lg shadow-lg">
            <Link href={`/recipes/${recipe._id}`}>
              <div className="relative w-full h-54 rounded-t-lg rounded-b-md overflow-hidden">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </Link>

            <div className="p-4">
              <h3 className="text-xl text-slate-900 font-semibold">
                {highlightMatch(recipe.title, search)} <span>***</span>
              </h3>
              <p className="text-sm text-slate-800">
                By {recipe.createdBy?.name || "Unknown"}
              </p>
              <p className="text-slate-800">
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
