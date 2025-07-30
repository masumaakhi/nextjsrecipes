// src/app/recipes/[id]/page.jsx

import Image from "next/image";
import Link from "next/link";

const getRecipe = async (id) => {
  const res = await fetch(`/api/recipes/${id}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.recipe;
};

export default async function RecipeDetails({ params }) {
  const recipe = await getRecipe(params.id);

  if (!recipe) return <div className="p-10">Recipe not found</div>;

  const {
    title,
    imageUrl,
    description,
    ingredients = [],
    instructions = [],
    category,
    nutrition,
    createdBy,
  } = recipe;

  return (
    <div className="p-6 max-w-4xl mx-auto mt-32 space-y-6">
              {/* ✅ Breadcrumb */}
      <nav className="text-gray-400 text-sm mb-6 flex space-x-2">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>{">"}</span>
        <Link href="/dashboard/admin/recipes" className="hover:text-white">recipes</Link>
        <span>{">"}</span>
        <span className=" font-semibold">{title}</span>
      </nav>


      <h1 className="text-3xl font-bold">{title}</h1>

      <Image
        src={imageUrl}
        alt={title}
        width={800}
        height={400}
        className="rounded-lg w-full object-cover"
      />

      <div className="text-sm text-gray-500">
        <p>
          <strong>Created by:</strong> {createdBy?.name || "Unknown"}
        </p>
        <p>
          <strong>Category:</strong>{" "}
          {category?.cuisine?.join(", ")} | {category?.mealType?.join(", ")}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Description</h2>
        <p className="text-gray-700">{description}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <ul className="list-disc pl-5 text-gray-700">
          {ingredients.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Instructions</h2>
        <ol className="list-decimal pl-5 text-gray-700">
          {instructions.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Nutrition</h2>
        <ul className="text-gray-700">
          <li>Calories: {nutrition?.calories || 0}</li>
          <li>Protein: {nutrition?.protein || 0}g</li>
          <li>Fat: {nutrition?.fat || 0}g</li>
          <li>Carbs: {nutrition?.carbs || 0}g</li>
        </ul>
      </div>
    </div>
  );
}
