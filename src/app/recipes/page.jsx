//src/app/recipes/page.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  

 useEffect(() => {
  const fetchRecipes = async () => {
    const res = await fetch("/api/recipes?status=approved");
    const data = await res.json();
    if (data.success) setRecipes(data.recipes);
  };
  fetchRecipes();
}, []);
  

  return (
    <div className="px-6 mt-24 mb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="...">
            <Link href={`/recipe/${recipe._id}`}>
              <div className="relative w-full h-64 rounded-t-lg overflow-hidden cursor-pointer">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </Link>
            <div className="p-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, index) => (
                  <span key={index} className="text-xl text-yellow-500">
                    ★
                  </span>
                ))}
              </div>
              <h3 className="text-xl font-semibold">{recipe.title}</h3>
              <div className="text-sm text-gray-600">
                <p>By {recipe.createdBy?.name || "Unknown"}</p>
                <p>{recipe.description?.substring(0, 120)}...</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
