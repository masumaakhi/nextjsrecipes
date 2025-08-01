

"use client";
import { useState } from "react";

const cuisines = ["Italian", "Mexican", "Indian", "Chinese"];
const dietTypes = ["Vegan", "Vegetarian", "Keto", "Gluten-Free"];
const foodTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function RecipeFilterSidebar() {
  const [cookTime, setCookTime] = useState([0, 120]);
  const [servings, setServings] = useState([1, 10]);

  return (
    <div className=" text-black w-72 p-5 space-y-6 rounded-xl shadow-lg mt-[5rem] mb-1.5">
      <h2 className="text-xl font-semibold">Filter Recipes</h2>

      {/* By Cuisine */}
      <div>
        <h3 className="font-medium mb-2">By Cuisine</h3>
        <div className="flex flex-wrap gap-2">
          {cuisines.map((cuisine) => (
            <button key={cuisine} className="bg-slate-200 px-3 py-1 rounded-full hover:bg-slate-600">
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* By Diet Type */}
      <div>
        <h3 className="font-medium mb-2">By Diet Type</h3>
        <div className="flex flex-wrap gap-2">
          {dietTypes.map((diet) => (
            <button key={diet} className="bg-slate-200 px-3 py-1 rounded-full hover:bg-slate-600">
              {diet}
            </button>
          ))}
        </div>
      </div>

      {/* By Food Type */}
      <div>
        <h3 className="font-medium mb-2">By Food Type</h3>
        <div className="flex flex-wrap gap-2">
          {foodTypes.map((type) => (
            <button key={type} className="bg-slate-200 px-3 py-1 rounded-full hover:bg-slate-600">
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Cook Time */}
      <div>
        <h3 className="font-medium mb-2">By Cook Time (minutes)</h3>
        <div className="flex items-center gap-2 text-sm">
          <input
            type="number"
            value={cookTime[0]}
            onChange={(e) => setCookTime([+e.target.value, cookTime[1]])}
            className="w-16 p-1 text-black rounded"
          />
          <span>-</span>
          <input
            type="number"
            value={cookTime[1]}
            onChange={(e) => setCookTime([cookTime[0], +e.target.value])}
            className="w-16 p-1 text-black rounded"
          />
        </div>
      </div>

      {/* Servings */}
      <div>
        <h3 className="font-medium mb-2">By Servings</h3>
        <div className="flex items-center gap-2 text-sm">
          <input
            type="number"
            value={servings[0]}
            onChange={(e) => setServings([+e.target.value, servings[1]])}
            className="w-16 p-1 text-black rounded"
          />
          <span>-</span>
          <input
            type="number"
            value={servings[1]}
            onChange={(e) => setServings([servings[0], +e.target.value])}
            className="w-16 p-1 text-black rounded"
          />
        </div>
      </div>

      {/* Clear Button */}
      <div className="text-center">
        <button
          onClick={() => {
            setCookTime([0, 120]);
            setServings([1, 10]);
          }}
          className="bg-slate-100 hover:bg-slate-600 px-4 py-2 rounded-full text-sm"
        >
          Clear Filter
        </button>
      </div>
    </div>
  );
}
