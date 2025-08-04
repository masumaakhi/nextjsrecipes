// //src/app/dashboard/admin/recipes/page.jsx

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { HiDotsVertical } from "react-icons/hi";
// import Image from "next/image";
// import Link from "next/link";

// export default function RecipesTable() {
//   const [recipes, setRecipes] = useState([]);
//   const [openMenuIndex, setOpenMenuIndex] = useState(null);
//   const menuRef = useRef();

//   useEffect(() => {
//     const fetchRecipes = async () => {
//       const res = await fetch("/api/recipes"); // or fetch all
//       const data = await res.json();
//       if (data.success) setRecipes(data.recipes);
//     };

//     fetchRecipes();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setOpenMenuIndex(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="p-6 max-w-7xl mx-auto mt-32">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">Recipes</h2>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Search recipes by name"
//             className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <Link
//             href="/addrecipes"
//             className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md"
//           >
//             New Recipe
//           </Link>
//         </div>
//       </div>

//       <div className="overflow-x-auto border rounded-lg shadow-sm">
//         <table className="min-w-full divide-y divide-gray-200 bg-white">
//           <thead className="bg-gray-100 text-gray-600 text-sm">
//             <tr>
//               <th className="px-4 py-3 text-left font-medium">Image</th>
//               <th className="px-4 py-3 text-left font-medium">Title</th>
//               <th className="px-4 py-3 text-left font-medium">Category</th>
//               <th className="px-4 py-3 text-left font-medium">
//                 Total Nutrition
//               </th>
//               <th className="px-4 py-3 text-left font-medium">Status</th>
//               <th className="px-4 py-3 text-left font-medium">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
//             {recipes.map((recipe, index) => {
//               const {
//                 calories = 0,
//                 protein = 0,
//                 fat = 0,
//                 carbs = 0,
//               } = recipe.nutrition || {};
//               const totalNutrition = calories + protein + fat + carbs;

//               return (
//                 <tr key={recipe._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <Image
//                       src={recipe.imageUrl}
//                       alt={recipe.title}
//                       width={48}
//                       height={48}
//                       className="object-cover rounded"
//                     />
//                   </td>
//                   <td className="px-6 py-4">{recipe.title}</td>
//                   <td className="px-6 py-4">
//                     {recipe.category?.cuisine?.join(", ") || "Uncategorized"}
//                   </td>
//                   <td className="px-6 py-4">{totalNutrition} units</td>
//                   <td className="px-6 py-4 capitalize">{recipe.status}</td>
//                   <td className="px-6 py-4 relative" ref={menuRef}>
//                     <button
//                       onClick={() =>
//                         setOpenMenuIndex(openMenuIndex === index ? null : index)
//                       }
//                       className="hover:bg-gray-200 p-1 rounded-full"
//                     >
//                       <HiDotsVertical size={20} />
//                     </button>

//                     {openMenuIndex === index && (
//                       <div className="absolute z-10 right-0 mt-2 w-44 bg-white border rounded-md shadow-lg">
//                         <Link
//                           href={`/recipes/${recipe._id}`}
//                           className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                         >
//                           View Recipe
//                         </Link>
//                         <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
//                           Update Recipe
//                         </button>
//                         <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
//                           Delete Recipe
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useRef, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RecipesTable() {
  const [recipes, setRecipes] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      const res = await fetch("/api/recipes");
      const data = await res.json();
      if (data.success) setRecipes(data.recipes);
    };
    fetchRecipes();
  }, []);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openMenuIndex !== null &&
        menuRefs.current[openMenuIndex] &&
        !menuRefs.current[openMenuIndex].contains(e.target)
      ) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuIndex]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (res.ok) {
        alert("Deleted!");
        setRecipes((prev) => prev.filter((recipe) => recipe._id !== id)); // ✅ Remove from UI
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Recipes</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search recipes by name"
            className="border border-gray-300 text-slate-900 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link
            href="/addrecipes"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md"
          >
            New Recipe
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Image</th>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">
                Total Nutrition
              </th>
              <th className="px-4 py-4 text-left">Author</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
            {recipes.map((recipe, index) => {
              const {
                calories = 0,
                protein = 0,
                fat = 0,
                carbs = 0,
              } = recipe.nutrition || {};
              const totalNutrition = calories + protein + fat + carbs;

              return (
                <tr key={recipe._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Image
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      width={48}
                      height={48}
                      className="object-cover rounded"
                    />
                  </td>

                  <td className="px-6 py-4">{recipe.title}</td>
                  <td className="px-6 py-4">
                    {recipe.category?.cuisine?.join(", ") || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4">{totalNutrition} units</td>
                  <td className="px-6 py-4 text-gray-700">
                    {recipe.createdBy?.name?.split(" ")[0] || "Unknown"}
                  </td>
                  <td className="px-6 py-4 capitalize">{recipe.status}</td>
                  <td className="px-6 py-4 relative">
                    <div
                      ref={(el) => (menuRefs.current[index] = el)}
                      className="relative"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuIndex(
                            openMenuIndex === index ? null : index
                          );
                        }}
                        className="hover:bg-gray-200 p-1 rounded-full"
                      >
                        <HiDotsVertical size={20} />
                      </button>

                      {openMenuIndex === index && (
                        <div className="absolute z-10 right-0 mt-2 w-44 bg-white border rounded-md shadow-lg">
                          <Link
                            href={`/recipes/${recipe._id}`}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            View Recipe
                          </Link>
                          <Link
                            href={`/dashboard/admin/recipes/${recipe._id}/edit`}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Update Recipe
                          </Link>
                          <button
                            onClick={() => handleDelete(recipe._id)}
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                          >
                            Delete Recipe
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
