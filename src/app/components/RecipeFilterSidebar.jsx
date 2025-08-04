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
    <div className="w-72 p-5 space-y-6 rounded-xl shadow-md bg-opacity-70 backdrop-blur">
      <h2 className="text-xl font-bold text-slate-900">Filter Recipes</h2>

      {/* Cuisine Filter */}
      <div>
        <h3 className="font-semibold mb-2 text-slate-950">Cuisine</h3>
        <div className="flex flex-wrap gap-2">
          {cuisines.map((c) => (
            <button key={c} className="px-3 py-1 rounded-md bg-amber-50 bg-opacity-500 shadow-2xl text-slate-950 hover:bg-orange-600 hover:text-slate-900" onClick={() => handleFilterChange("cuisine", c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Diet Type */}
      <div>
        <h3 className="font-semibold mb-2 text-slate-950">Diet Type</h3>
        <div className="flex flex-wrap gap-2">
          {dietTypes.map((d) => (
            <button key={d} className="px-3 py-1 rounded-md bg-amber-50 bg-opacity-500 shadow-2xl text-slate-950 hover:bg-orange-600 hover:text-slate-900" onClick={() => handleFilterChange("dietType", d)}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Food Type */}
      <div>
        <h3 className="font-semibold mb-2 text-slate-950">Food Type</h3>
        <div className="flex flex-wrap gap-2">
          {foodTypes.map((f) => (
            <button key={f} className="px-3 py-1 rounded-md bg-amber-50 bg-opacity-500 shadow-2xl text-slate-950 hover:bg-orange-600 hover:text-slate-900" onClick={() => handleFilterChange("foodType", f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cook Time */}
      <div>
        <h3 className="font-semibold mb-2 text-slate-950">Cook Time</h3>
        <input type="number" value={cookTime[0]} onChange={(e) => setCookTime([+e.target.value, cookTime[1]])} className="w-16 text-slate-950" />
        -
        <input type="number" value={cookTime[1]} onChange={(e) => setCookTime([cookTime[0], +e.target.value])} className="w-16 text-slate-950" />
        <button className="text-md font-medium text-slate-900 ml-2" onClick={() => {
          handleFilterChange("minCookTime", cookTime[0]);
          handleFilterChange("maxCookTime", cookTime[1]);
        }}>Apply</button>
      </div>

      {/* Servings */}
      <div>
        <h3 className="font-semibold mb-2 text-slate-950">Servings</h3>
        <input type="number" value={servings[0]} onChange={(e) => setServings([+e.target.value, servings[1]])} className="w-16 text-slate-950" />
        -
        <input type="number" value={servings[1]} onChange={(e) => setServings([servings[0], +e.target.value])} className="w-16 text-slate-950" />
        <button className="text-md font-medium text-slate-900 ml-2" onClick={() => {
          handleFilterChange("minServings", servings[0]);
          handleFilterChange("maxServings", servings[1]);
        }}>Apply</button>
      </div>

      {/* Clear */}
      <div className="text-center text-slate-950">
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
        }} className="text-md font-medium underline">Clear All</button>
      </div>
    </div>
  );
}
