// RecipeFilterSidebar.jsx
"use client";
import { useState } from "react";

export default function RecipeFilterSidebar({ setFilters }) {
  const cuisines = ["Italian", "Mexican", "Indian", "Chinese"];
  const dietTypes = ["Vegan", "Vegetarian", "Keto", "Gluten-Free"];
  const foodTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

  const [cookTime, setCookTime] = useState([0, 120]);
  const [servings, setServings] = useState([1, 10]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-72 p-5 space-y-6 rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold">Filter Recipes</h2>

      {/* Cuisine Filter */}
      <div>
        <h3 className="font-medium mb-2">Cuisine</h3>
        <div className="flex flex-wrap gap-2">
          {cuisines.map((c) => (
            <button key={c} className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-400" onClick={() => handleFilterChange("cuisine", c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Diet Type */}
      <div>
        <h3 className="font-medium mb-2">Diet Type</h3>
        <div className="flex flex-wrap gap-2">
          {dietTypes.map((d) => (
            <button key={d} className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-400" onClick={() => handleFilterChange("dietType", d)}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Food Type */}
      <div>
        <h3 className="font-medium mb-2">Food Type</h3>
        <div className="flex flex-wrap gap-2">
          {foodTypes.map((f) => (
            <button key={f} className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-400" onClick={() => handleFilterChange("foodType", f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cook Time */}
      <div>
        <h3 className="font-medium mb-2">Cook Time</h3>
        <input type="number" value={cookTime[0]} onChange={(e) => setCookTime([+e.target.value, cookTime[1]])} className="w-16" />
        -
        <input type="number" value={cookTime[1]} onChange={(e) => setCookTime([cookTime[0], +e.target.value])} className="w-16" />
        <button className="text-xs text-blue-600 ml-2" onClick={() => {
          handleFilterChange("minCookTime", cookTime[0]);
          handleFilterChange("maxCookTime", cookTime[1]);
        }}>Apply</button>
      </div>

      {/* Servings */}
      <div>
        <h3 className="font-medium mb-2">Servings</h3>
        <input type="number" value={servings[0]} onChange={(e) => setServings([+e.target.value, servings[1]])} className="w-16" />
        -
        <input type="number" value={servings[1]} onChange={(e) => setServings([servings[0], +e.target.value])} className="w-16" />
        <button className="text-xs text-blue-600 ml-2" onClick={() => {
          handleFilterChange("minServings", servings[0]);
          handleFilterChange("maxServings", servings[1]);
        }}>Apply</button>
      </div>

      {/* Clear */}
      <div className="text-center">
        <button onClick={() => {
          setCookTime([0, 120]);
          setServings([1, 10]);
          setFilters({
            cuisine: "",
            dietType: "",
            foodType: "",
            minCookTime: 0,
            maxCookTime: 120,
            minServings: 1,
            maxServings: 10,
          });
        }} className="text-sm underline">Clear All</button>
      </div>
    </div>
  );
}
