"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const MyRecipesPage = () => {
  const { data: session, status } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (!session?.user?._id) return;

      try {
        const res = await fetch(`/api/recipes/user/${session.user._id}`);
        const data = await res.json();
        if (data.success) {
          setRecipes(data.recipes);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [session]);

  if (loading) return <div className="text-center text-md text-slate-950 mt-32">Loading your recipes...</div>;

  return (
    <div className="max-w-7xl mx-auto mt-24 mb-10 px-4">
      <h2 className="text-3xl font-bold text-slate-950 mb-6 text-center">My Recipes ({recipes.length})</h2>

      {recipes.length === 0 ? (
        <p className="text-center text-slate-800">You haven’t added any recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl text-slate-900 font-semibold mb-2 truncate">{recipe.title}</h3>

                <div className="text-sm text-slate-900 mb-1">
                  <strong>Cuisine:</strong>{" "}
                  {recipe.category?.cuisine?.[0] || "N/A"}
                </div>
                <div className="text-sm text-slate-700 mb-1">
                  <strong>Meal Type:</strong>{" "}
                  {recipe.category?.mealType?.[0] || "N/A"}
                </div>
                <div className="text-md">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                      recipe.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : recipe.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                   Status: {recipe.status}
                  </span>
                </div>

                <Link
                  href={`/recipes/${recipe._id}`}
                  className="inline-block mt-3 text-sm text-blue-600 hover:underline"
                >
                  View Recipe →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipesPage;
