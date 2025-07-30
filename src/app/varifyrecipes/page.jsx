// app/thank-you/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function varifyrecipes() {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // previous page
  };

  const handleEditRecipes = () => {
    router.push("/dashboard/admin/recipes/${recipe._id}/edit");
  };

   const goToRecipes = () => {
    router.push("/recipes"); // Your recipe page route
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="max-w-md w-full text-center border rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Thank you Chef
        </h1>
               <p className="text-gray-700">
          We have sent a mail when your recipe is approved.
        </p>
        <p className="text-gray-700 mt-2">
          You can now view your recipe in your profile page.
        </p>

        <div className="mt-6">
          <p className="text-sm text-gray-500">Didn’t receive email?</p>
          <button
            onClick={goToRecipes}
            className="text-red-500 hover:underline text-sm font-medium"
          >
            View My Recipes
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition"
          >
            back
          </button>
          <button
            onClick={handleEditRecipes}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Edit Recipes
          </button>
        </div>
      </div>
    </div>
  );
}
