"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const PendingRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
  const res = await fetch("/api/recipes?status=pending"); // ✅ Only get pending ones
  const data = await res.json();
  if (data.success) {
    setRecipes(data.recipes);
  }
};



  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleAction = async (id, status) => {
    setLoading(true);
    try {
      const res = await fetch("/api/recipes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();
      if (data.success) {
        setRecipes((prev) => prev.filter((r) => r._id !== id)); // remove from list
      } else {
        alert("Failed to update recipe");
      }
    } catch (err) {
      alert("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mt-24">
      <h1 className="text-3xl font-bold mb-6">Pending Recipes</h1>

      {recipes.length === 0 ? (
        <p className="text-gray-600">No pending recipes.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white border rounded-lg overflow-hidden shadow-md"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{recipe.title}</h2>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span className="capitalize font-medium">{recipe.status}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Created by: {recipe.createdBy?.name || "Unknown"}
                </p>
                <div className="text-sm text-gray-600">
                  <p>
                    Cuisine:{" "}
                    {recipe.category?.cuisine?.join(", ") || "Not specified"}
                  </p>
                  <p>
                    Meal Type:{" "}
                    {recipe.category?.mealType?.join(", ") || "Not specified"}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAction(recipe._id, "approved")}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(recipe._id, "rejected")}
                    disabled={loading}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRecipes;
