//src/app/dashboard/admin/users/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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
    <div className="max-w-4xl mx-auto mt-20 p-4 text-slate-950">
                <Link href="/" className="hover:text-slate-800">
                  Home
                </Link>
                <span>{">"}</span>
                <Link href="/dashboard/admin/users" className="hover:text-slate-800">
                  Users 
                </Link>
                <span>{">"}</span>
                <span>User Details Information</span>
      <h2 className="text-2xl font-bold text-slate-950 mb-2">Name: {user?.name}</h2>
      <p className="text-slate-900 mb-6">Email: {user?.email}</p>
         
      <h3 className="text-xl text-slate-800 font-semibold mb-4">
        Recipes Added: {recipes.length}
      </h3>

      <table className="w-full rounded-xl shadow-md pb-4 bg-opacity-70 backdrop-blur text-sm text-left">
        <thead className=" text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe._id} className="border-b text-slate-800">
              <td className="px-4 py-3">{recipe.title}</td>
              <td className="px-4 py-3 capitalize">{recipe.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
