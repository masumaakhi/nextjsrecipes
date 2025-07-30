"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

const UpdateRecipe = () => {
  const router = useRouter();
  const { id: recipeId } = useParams();

  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (recipeId) {
      fetch(`/api/recipes/${recipeId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const recipe = data.recipe;
            setRecipeData({
              ...recipe,
              cuisine: recipe.category?.cuisine?.[0] || "",
              mealType: recipe.category?.mealType?.[0] || "",
              dietType: recipe.category?.dietType?.[0] || "",
              foodType: recipe.category?.foodType?.[0] || "",
              calories: recipe.nutrition?.calories || 0,
              protein: recipe.nutrition?.protein || 0,
              fat: recipe.nutrition?.fat || 0,
              carbs: recipe.nutrition?.carbs || 0,
            });
          }
        });
    }
  }, [recipeId]);

  const handleChange = (field, value) => {
    setRecipeData((prev) => ({ ...prev, [field]: value }));
  };

  const addIngredient = () => {
    setRecipeData((prev) => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), ""]
    }));
  };

  const addInstruction = () => {
    setRecipeData((prev) => ({
      ...prev,
      instructions: [...(prev.instructions || []), ""]
    }));
  };

  const updateRecipe = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = recipeData.imageUrl;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "imageecom");

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/drlo4ktpa/image/upload",
          { method: "POST", body: formData }
        );
        const imgData = await uploadRes.json();
        imageUrl = imgData.secure_url;
      }

      const updatedRecipe = {
        ...recipeData,
        imageUrl,
        prepTime: Number(recipeData.prepTime),
        cookTime: Number(recipeData.cookTime),
        servings: Number(recipeData.servings),
        nutrition: {
          calories: Number(recipeData.calories),
          protein: Number(recipeData.protein),
          fat: Number(recipeData.fat),
          carbs: Number(recipeData.carbs),
        },
        category: {
          cuisine: recipeData.cuisine ? [recipeData.cuisine] : [],
          mealType: recipeData.mealType ? [recipeData.mealType] : [],
          dietType: recipeData.dietType ? [recipeData.dietType] : [],
          foodType: recipeData.foodType ? [recipeData.foodType] : [],
        },
      };

      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRecipe),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Recipe updated successfully!");
        router.push("/.netlify/functions/dashboard/admin/recipes");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!recipeData) return <div className="mt-32 text-center">Loading...</div>;

  const {
    title,
    description,
    cuisine,
    mealType,
    dietType,
    foodType,
    ingredients = [],
    instructions = [],
    prepTime,
    cookTime,
    servings,
    calories,
    protein,
    fat,
    carbs
  } = recipeData;

  return (
    <div className="max-w-2xl mt-[7rem] mx-auto bg-orange-50 p-6 rounded-lg shadow-lg my-16">
      <div className="flex justify-between items-center mb-6">
        <nav className="text-gray-400 text-sm mb-6 flex space-x-2">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>{">"}</span>
          <Link href="/dashboard/admin/recipes" className="hover:text-white">Recipes</Link>
          <span>{">"}</span>
          <span className="font-semibold">{title}</span>
        </nav>

        <h2 className="text-2xl font-bold">Update Recipe</h2>
        <button
          onClick={updateRecipe}
          disabled={loading}
          className={`py-1 px-3 rounded-md font-semibold text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>

      <form className="space-y-6" onSubmit={updateRecipe}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Description</label>
          <textarea
            maxLength={500}
            value={description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border px-4 py-2 rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Cuisine</label>
            <input
              type="text"
              value={cuisine}
              onChange={(e) => handleChange("cuisine", e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="e.g., Indian"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Meal Type</label>
            <select
              value={mealType}
              onChange={(e) => handleChange("mealType", e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
            >
              <option value="">-- Select Meal Type --</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Brunch">Brunch</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks</option>
              <option value="Late Night">Late Night</option>
              <option value="Pre-Workout">Pre-Workout</option>
              <option value="Post-Workout">Post-Workout</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">Diet Type</label>
            <input
              type="text"
              value={dietType}
              onChange={(e) => handleChange("dietType", e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="e.g., Vegan"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Food Type</label>
            <input
              type="text"
              value={foodType}
              onChange={(e) => handleChange("foodType", e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="e.g., Main Course"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">Ingredients</label>
          {ingredients.map((ing, index) => (
            <input
              key={index}
              type="text"
              value={ing}
              onChange={(e) => {
                const newIngredients = [...ingredients];
                newIngredients[index] = e.target.value;
                handleChange("ingredients", newIngredients);
              }}
              className="w-full border px-4 py-2 mb-2 rounded-md"
              placeholder={`Ingredient ${index + 1}`}
              required
            />
          ))}
          <button
            type="button"
            className="text-sm text-blue-600"
            onClick={addIngredient}
          >
            + Add Ingredient
          </button>
        </div>

        <div>
          <label className="block font-medium mb-2">Instructions</label>
          {instructions.map((step, index) => (
            <textarea
              key={index}
              value={step}
              onChange={(e) => {
                const newInstructions = [...instructions];
                newInstructions[index] = e.target.value;
                handleChange("instructions", newInstructions);
              }}
              className="w-full border px-4 py-2 mb-2 rounded-md"
              placeholder={`Step ${index + 1}`}
              required
            />
          ))}
          <button
            type="button"
            className="text-sm text-blue-600"
            onClick={addInstruction}
          >
            + Add Step
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Prep Time (min)</label>
            <input
              type="number"
              value={prepTime || 0}
              onChange={(e) => handleChange("prepTime", e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
              min={0}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Cook Time (min)</label>
            <input
              type="number"
              value={cookTime || 0}
              onChange={(e) => handleChange("cookTime", e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
              min={0}
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">Servings</label>
          <input
            type="number"
            value={servings || 1}
            onChange={(e) => handleChange("servings", e.target.value)}
            className="w-full border px-4 py-2 rounded-md"
            min={1}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Nutrition (per serving)</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => handleChange("calories", e.target.value)}
            className="w-full border px-4 py-2 mb-2 rounded-md"
            placeholder="Calories"
            min={0}
          />
          <input
            type="number"
            value={protein}
            onChange={(e) => handleChange("protein", e.target.value)}
            className="w-full border px-4 py-2 mb-2 rounded-md"
            placeholder="Protein (g)"
            min={0}
          />
          <input
            type="number"
            value={fat}
            onChange={(e) => handleChange("fat", e.target.value)}
            className="w-full border px-4 py-2 mb-2 rounded-md"
            placeholder="Fat (g)"
            min={0}
          />
          <input
            type="number"
            value={carbs}
            onChange={(e) => handleChange("carbs", e.target.value)}
            className="w-full border px-4 py-2 mb-2 rounded-md"
            placeholder="Carbs (g)"
            min={0}
          />
        </div>
      </form>
    </div>
  );
};

export default UpdateRecipe;
