

//src/app/addrecipes/page.js
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const AddRecipes = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [mealType, setMealType] = useState("");
  const [dietType, setDietType] = useState("");
  const [foodType, setFoodType] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const addInstruction = () => setInstructions([...instructions, ""]);

  const { data: session } = useSession();
  const user = session?.user;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select an image file.");
      return;
    }

    setLoading(true);

    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "imageecom"); // Replace with your Cloudinary preset

      const uploadRes = await fetch(
        "https://api.cloudinary.com/v1_1/drlo4ktpa/image/upload", // Replace your_cloud_name
        {
          method: "POST",
          body: formData,
        }
      );

      const imgData = await uploadRes.json();

      if (!imgData.secure_url) {
        throw new Error("Image upload failed");
      }

      // Prepare recipe data
      const recipe = {
        title,
        description,
        imageUrl: imgData.secure_url,
        prepTime: Number(prepTime),
        cookTime: Number(cookTime),
        servings: Number(servings),
        ingredients,
        instructions,
        nutrition: {
          calories: Number(calories),
          protein: Number(protein),
          fat: Number(fat),
          carbs: Number(carbs),
        },
        category: {
          cuisine: cuisine ? [cuisine] : [],
          mealType: mealType ? [mealType] : [],
          dietType: dietType ? [dietType] : [],
          foodType: foodType ? [foodType] : [],
        },
      };

      // Post recipe to backend API
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Recipe saved successfully!");

        if (user?.role === "admin") {
          // Admin: redirect to live recipes page
          router.push("/recipes");
        } else {
          // Normal user: redirect to a confirmation or pending page
          router.push("/varifyrecipes");
        }
      } else {
        alert("Failed to save recipe.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the recipe.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full border px-4 py-2 mb-2 rounded-md  border-slate-600 text-slate-900  focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="max-w-2xl mt-[7rem] mx-auto bg-opacity-70 backdrop-blur  p-6 rounded-lg shadow-2xl my-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Create a New Recipe</h2>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`py-1 px-3 rounded-md font-semibold text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Saving..." : "Save Recipe"}
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label className="block font-medium mb-2 text-slate-900">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputStyle}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-2 text-slate-900">Description</label>
          <textarea
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputStyle}
            required
          />
        </div>

        {/* Category Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-slate-900">Cuisine</label>
            <input
              type="text"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className={inputStyle}
              placeholder="e.g., Indian"
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-slate-900">Meal Type</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className={inputStyle}
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
            <label className="block font-medium mb-2 text-slate-900">Diet Type</label>
            <input
              type="text"
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className={inputStyle}
              placeholder="e.g., Vegan"
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-slate-900">Food Type</label>
            <input
              type="text"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className={inputStyle}
              placeholder="e.g., Main Course"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block font-medium mb-2 text-slate-900">Ingredients</label>
          {ingredients.map((ing, index) => (
            <input
              key={index}
              type="text"
              value={ing}
              onChange={(e) => {
                const newIngredients = [...ingredients];
                newIngredients[index] = e.target.value;
                setIngredients(newIngredients);
              }}
              className={inputStyle}
              placeholder={`Ingredient ${index + 1}`}
              required
            />
          ))}
          <button
            type="button"
            className="text-md text-slate-800 font-semibold bg-amber-600 hover:bg-amber-700 bg:text-blue-200 py-1 px-3 rounded"
            onClick={addIngredient}
          >
            + Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div>
          <label className="block font-medium mb-2 text-slate-900">Instructions</label>
          {instructions.map((step, index) => (
            <textarea
              key={index}
              value={step}
              onChange={(e) => {
                const newInstructions = [...instructions];
                newInstructions[index] = e.target.value;
                setInstructions(newInstructions);
              }}
              className={inputStyle}
              placeholder={`Step ${index + 1}`}
              required
            />
          ))}
          <button
            type="button"
            className="text-md text-slate-800 font-semibold bg-amber-600 hover:bg-amber-700 bg:text-blue-200 py-1 px-3 rounded"
            onClick={addInstruction}
          >
            + Add Step
          </button>
        </div>

        {/* Prep & Cook Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2 text-slate-900">Prep Time (min)</label>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className={inputStyle}
              min={0}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-slate-900">Cook Time (min)</label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className={inputStyle}
              min={0}
              required
            />
          </div>
        </div>

        {/* Servings */}
        <div>
          <label className="block font-medium mb-2 text-slate-900">Servings</label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            className={inputStyle}
            min={1}
            required
          />
        </div>

        {/* Nutrition */}
        <div>
          <label className="block font-medium mb-2 text-slate-900">
            Nutrition (per serving)
          </label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className={inputStyle}
            placeholder="Calories"
            min={0}
          />
          <input
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className={inputStyle}
            placeholder="Protein (g)"
            min={0}
          />
          <input
            type="number"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            className={inputStyle}
            placeholder="Fat (g)"
            min={0}
          />
          <input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            className={inputStyle}
            placeholder="Carbs (g)"
            min={0}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-2 text-slate-900">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className={inputStyle}
            required
          />
        </div>
      </form>
    </div>
  );
};

export default AddRecipes;
