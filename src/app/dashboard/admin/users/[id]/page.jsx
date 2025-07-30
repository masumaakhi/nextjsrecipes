//src/app/dashboard/admin/users/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function UserDetailsPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndRecipes = async () => {
      try {
        // Fetch user data
        const userRes = await fetch(`/api/users/${id}`);
        const userData = await userRes.json();

        // Fetch recipes created by this user
        const recipesRes = await fetch(`/api/recipes/user/${id}`);
        const recipesData = await recipesRes.json();

        if (userData.success) setUser(userData.user);
        if (recipesData.success) setRecipes(recipesData.recipes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRecipes();
  }, [id]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-20 p-4">
      <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
      <p className="text-gray-600 mb-6">{user?.email}</p>

      <h3 className="text-xl font-semibold mb-4">
        Recipes Added: {recipes.length}
      </h3>

      <table className="w-full border text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe._id} className="border-b">
              <td className="px-4 py-3">{recipe.title}</td>
              <td className="px-4 py-3 capitalize">{recipe.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
