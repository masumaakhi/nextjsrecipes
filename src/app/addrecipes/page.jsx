// // Updated addrecipes/page.jsx with Save functionality (POST to /api/recipes)

// "use client";
// import React, { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const AddRecipes = () => {
//   const router = useRouter();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [cuisine, setCuisine] = useState("");
//   const [mealType, setMealType] = useState("");
//   const [dietType, setDietType] = useState("");
//   const [foodType, setFoodType] = useState("");
//   const [ingredients, setIngredients] = useState([""]);
//   const [instructions, setInstructions] = useState([""]);
//   const [prepTime, setPrepTime] = useState(0);
//   const [cookTime, setCookTime] = useState(0);
//   const [servings, setServings] = useState(1);
//   const [calories, setCalories] = useState(0);
//   const [protein, setProtein] = useState(0);
//   const [fat, setFat] = useState(0);
//   const [carbs, setCarbs] = useState(0);
//   const [imageUrl, setImageUrl] = useState("");

//   const addIngredient = () => setIngredients([...ingredients, ""]);
//   const addInstruction = () => setInstructions([...instructions, ""]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("/api/recipes", {
//         title,
//         description,
//         imageUrl,
//         prepTime,
//         cookTime,
//         servings,
//         ingredients,
//         instructions,
//         nutrition: {
//           calories,
//           protein,
//           fat,
//           carbs,
//         },
//         category: {
//           cuisine: [cuisine],
//           mealType: [mealType],
//           dietType: [dietType],
//           foodType: [foodType],
//         },
//       });
//       if (res.status === 201) {
//         router.push("/recipes");
//       }
//     } catch (err) {
//       console.error("Error creating recipe:", err);
//     }
//   };

//   return (
//     <div className="max-w-2xl mt-[7rem] mx-auto bg-orange-50 p-6 rounded-lg shadow-lg my-16">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Create a New Recipe</h2>
//         <button
//           onClick={handleSubmit}
//           className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md font-semibold"
//         >
//           Save Recipe
//         </button>
//       </div>

//       <form className="space-y-6">
//         <div>
//           <label className="block font-medium mb-2">Title</label>
//           <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border px-4 py-2 rounded-md" />
//         </div>

//         <div>
//           <label className="block font-medium mb-2">Description</label>
//           <textarea maxLength="500" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border px-4 py-2 rounded-md" />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block font-medium mb-2">Cuisine</label>
//             <input type="text" value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="w-full border px-4 py-2 rounded-md" placeholder="e.g., Indian" />
//           </div>

//           <div>
//             <label className="block font-medium mb-2">Meal Type</label>
//             <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="w-full border px-4 py-2 rounded-md">
//               <option value="">-- Select Meal Type --</option>
//               <option value="Breakfast">Breakfast</option>
//               <option value="Brunch">Brunch</option>
//               <option value="Lunch">Lunch</option>
//               <option value="Dinner">Dinner</option>
//               <option value="Snacks">Snacks</option>
//               <option value="Late Night">Late Night</option>
//               <option value="Pre-Workout">Pre-Workout</option>
//               <option value="Post-Workout">Post-Workout</option>
//             </select>
//           </div>
//           <div>
//             <label className="block font-medium mb-2">Diet Type</label>
//             <input type="text" value={dietType} onChange={(e) => setDietType(e.target.value)} className="w-full border px-4 py-2 rounded-md" placeholder="e.g., Vegan" />
//           </div>
//           <div>
//             <label className="block font-medium mb-2">Food Type</label>
//             <input type="text" value={foodType} onChange={(e) => setFoodType(e.target.value)} className="w-full border px-4 py-2 rounded-md" placeholder="e.g., Main Course" />
//           </div>
//         </div>

//         <div>
//           <label className="block font-medium mb-2">Ingredients</label>
//           {ingredients.map((ing, index) => (
//             <input key={index} type="text" value={ing} onChange={(e) => {
//               const newIngredients = [...ingredients];
//               newIngredients[index] = e.target.value;
//               setIngredients(newIngredients);
//             }} className="w-full border px-4 py-2 mb-2 rounded-md" placeholder={`Ingredient ${index + 1}`} />
//           ))}
//           <button type="button" className="text-sm text-blue-600" onClick={addIngredient}>+ Add Ingredient</button>
//         </div>

//         <div>
//           <label className="block font-medium mb-2">Instructions</label>
//           {instructions.map((step, index) => (
//             <textarea key={index} value={step} onChange={(e) => {
//               const newInstructions = [...instructions];
//               newInstructions[index] = e.target.value;
//               setInstructions(newInstructions);
//             }} className="w-full border px-4 py-2 mb-2 rounded-md" placeholder={`Step ${index + 1}`} />
//           ))}
//           <button type="button" className="text-sm text-blue-600" onClick={addInstruction}>+ Add Step</button>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block font-medium mb-2">Prep Time (min)</label>
//             <input type="number" value={prepTime} onChange={(e) => setPrepTime(parseInt(e.target.value))} className="w-full border px-4 py-2 rounded-md" />
//           </div>
//           <div>
//             <label className="block font-medium mb-2">Cook Time (min)</label>
//             <input type="number" value={cookTime} onChange={(e) => setCookTime(parseInt(e.target.value))} className="w-full border px-4 py-2 rounded-md" />
//           </div>
//         </div>

//         <div>
//           <label className="block font-medium mb-2">Servings</label>
//           <input type="number" value={servings} onChange={(e) => setServings(parseInt(e.target.value))} className="w-full border px-4 py-2 rounded-md" />
//         </div>

//         <div>
//           <label className="block font-medium mb-2">Nutrition (per serving)</label>
//           <input type="number" value={calories} onChange={(e) => setCalories(parseInt(e.target.value))} className="w-full border px-4 py-2 mb-2 rounded-md" placeholder="Calories" />
//           <input type="number" value={protein} onChange={(e) => setProtein(parseInt(e.target.value))} className="w-full border px-4 py-2 mb-2 rounded-md" placeholder="Protein (g)" />
//           <input type="number" value={fat} onChange={(e) => setFat(parseInt(e.target.value))} className="w-full border px-4 py-2 mb-2 rounded-md" placeholder="Fat (g)" />
//           <input type="number" value={carbs} onChange={(e) => setCarbs(parseInt(e.target.value))} className="w-full border px-4 py-2 mb-2 rounded-md" placeholder="Carbs (g)" />
//         </div>

//         <div>
//           <label className="block font-medium mb-2">Image URL</label>
//           <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full border px-4 py-2 rounded-md" placeholder="https://..." />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddRecipes;

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

  return (
    <div className="max-w-2xl mt-[7rem] mx-auto bg-orange-50 p-6 rounded-lg shadow-lg my-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Create a New Recipe</h2>
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
          <label className="block font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-4 py-2 rounded-md"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-2">Description</label>
          <textarea
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-4 py-2 rounded-md"
            required
          />
        </div>

        {/* Category Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Cuisine</label>
            <input
              type="text"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="e.g., Indian"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Meal Type</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
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
              onChange={(e) => setDietType(e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="e.g., Vegan"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Food Type</label>
            <input
              type="text"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="e.g., Main Course"
            />
          </div>
        </div>

        {/* Ingredients */}
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
                setIngredients(newIngredients);
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

        {/* Instructions */}
        <div>
          <label className="block font-medium mb-2">Instructions</label>
          {instructions.map((step, index) => (
            <textarea
              key={index}
              value={step}
              onChange={(e) => {
                const newInstructions = [...instructions];
                newInstructions[index] = e.target.value;
                setInstructions(newInstructions);
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

        {/* Prep & Cook Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Prep Time (min)</label>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
              min={0}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Cook Time (min)</label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
              min={0}
              required
            />
          </div>
        </div>

        {/* Servings */}
        <div>
          <label className="block font-medium mb-2">Servings</label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            className="w-full border px-4 py-2 rounded-md"
            min={1}
            required
          />
        </div>

        {/* Nutrition */}
        <div>
          <label className="block font-medium mb-2">
            Nutrition (per serving)
          </label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full border px-4 py-2 mb-2 rounded-md"
            placeholder="Calories"
            min={0}
          />
          <input
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className="w-full border px-4 py-2 mb-2 rounded-md"
            placeholder="Protein (g)"
            min={0}
          />
          <input
            type="number"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            className="w-full border px-4 py-2 mb-2 rounded-md"
            placeholder="Fat (g)"
            min={0}
          />
          <input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            className="w-full border px-4 py-2 mb-2 rounded-md"
            placeholder="Carbs (g)"
            min={0}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full"
            required
          />
        </div>
      </form>
    </div>
  );
};

export default AddRecipes;
