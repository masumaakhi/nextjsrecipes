"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";

export default function FavoriteRecipes() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorite recipes
  const fetchFavorites = async () => {
    const res = await fetch("/api/users/me/favorites");
    const data = await res.json();
    if (data.success) {
      setFavorites(data.favorites);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Toggle favorite (remove if already favorited)
  const toggleFavorite = async (recipeId) => {
    const res = await fetch("/api/users/me/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId }),
    });
    const data = await res.json();
    if (data.success) {
      setFavorites(data.favorites); // backend থেকে updated list নেবে
    }
  };

  if (loading) return <p className="text-center mt-20">Loading favorites...</p>;

  return (
    <div className="px-6 mt-[6rem] mb-6  max-w-[86rem] mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Favorite Recipes ❤️</h1>

      {favorites.length === 0 ? (
        <p className="text-center text-slate-600 mt-10">You have no favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {favorites.map((recipe) => (
            <div key={recipe._id} className="relative bg-white rounded-lg shadow-lg">
              <Link href={`/recipes/${recipe._id}`}>
                <div className="relative w-full h-54 rounded-t-lg rounded-b-md overflow-hidden">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(recipe._id);
                    }}
                    className="absolute top-3 right-3 z-10 text-2xl text-red-600 hover:text-gray-400 transition-colors duration-300"
                    aria-label="Remove from favorites"
                  >
                    <FaHeart />
                  </button>
                </div>
              </Link>
              <div className="p-4">
                <h3 className="text-xl text-slate-900 font-semibold">{recipe.title}</h3>
                <p className="text-sm text-slate-800">By {recipe.createdBy?.name || "Unknown"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
