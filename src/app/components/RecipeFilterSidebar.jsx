// src/app/components/RecipeFilterSidebar.jsx
"use client";

import { useState } from "react";

const Chip = ({ label, active, onClick }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={`px-3 py-1 rounded-full border text-sm transition
      ${active
        ? "bg-amber-500 text-white border-amber-500 shadow"
        : "bg-white/70 text-slate-800 border-slate-200 hover:bg-amber-50 hover:border-amber-300"
      }`}
  >
    {label}
  </button>
);

const Section = ({ title, onReset, children }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <button
        onClick={onReset}
        className="text-xs text-blue-500 hover:text-slate-700 underline"
      >
        Reset
      </button>
    </div>
    {children}
    <div className="h-px bg-white/40 my-2" />
  </div>
);

export default function RecipeFilterSidebar({ setFilters }) {
  // demo options (চাইলে DB থেকে ঢোকাতে পারো)
  const cuisines = ["Italian", "Mexican", "Indian", "Chinese"];
  const dietTypes = ["Vegan", "Vegetarian", "Keto", "Gluten-Free"];
  const foodTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

  // selected state (single-select)
  const [cuisine, setCuisine] = useState("");
  const [dietType, setDietType] = useState("");
  const [foodType, setFoodType] = useState("");

  const [cookTime, setCookTime] = useState([0, 120]);
  const [servings, setServings] = useState([1, 10]);

  const applyCookTime = () => {
    const [min, max] = cookTime;
    setFilters((p) => ({ ...p, minCookTime: Math.max(0, min), maxCookTime: Math.max(min, max) }));
  };

  const applyServings = () => {
    const [min, max] = servings;
    setFilters((p) => ({ ...p, minServings: Math.max(1, min), maxServings: Math.max(min, max) }));
  };

  const toggleAndSet = (key, value, selected, setSelected) => {
    const next = selected === value ? "" : value;
    setSelected(next);
    setFilters((p) => ({ ...p, [key]: next }));
  };

  const clearAll = () => {
    setCuisine("");
    setDietType("");
    setFoodType("");
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
  };

  return (
    <div
      className="
        w-80 p-5 rounded-2xl shadow-2xl
        bg-white/30 backdrop-blur-xl
        border border-white/40
        text-slate-800 space-y-4
      "
    >
      <h2 className="text-xl font-bold text-slate-900">Filter Recipes</h2>

      {/* Cuisine */}
      <Section title="Cuisine" onReset={() => toggleAndSet("cuisine", "", cuisine, setCuisine)}>
        <div className="flex flex-wrap gap-2">
          {cuisines.map((c) => (
            <Chip
              key={c}
              label={c}
              active={cuisine === c}
              onClick={() => toggleAndSet("cuisine", c, cuisine, setCuisine)}
            />
          ))}
        </div>
      </Section>

      {/* Diet Type */}
      <Section title="Diet Type" onReset={() => toggleAndSet("dietType", "", dietType, setDietType)}>
        <div className="flex flex-wrap gap-2">
          {dietTypes.map((d) => (
            <Chip
              key={d}
              label={d}
              active={dietType === d}
              onClick={() => toggleAndSet("dietType", d, dietType, setDietType)}
            />
          ))}
        </div>
      </Section>

      {/* Food Type */}
      <Section title="Food Type" onReset={() => toggleAndSet("foodType", "", foodType, setFoodType)}>
        <div className="flex flex-wrap gap-2">
          {foodTypes.map((f) => (
            <Chip
              key={f}
              label={f}
              active={foodType === f}
              onClick={() => toggleAndSet("foodType", f, foodType, setFoodType)}
            />
          ))}
        </div>
      </Section>

      {/* Cook Time */}
      <Section title="Cook Time" onReset={() => { setCookTime([0, 120]); setFilters((p) => ({ ...p, minCookTime: 0, maxCookTime: 120 })); }}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={cookTime[0]}
            onChange={(e) => setCookTime([+e.target.value, cookTime[1]])}
            className="w-20 rounded-md border border-slate-300 bg-white/70 px-2 py-1 text-slate-900"
          />
          <span className="text-blue-400">to</span>
          <input
            type="number"
            min={0}
            value={cookTime[1]}
            onChange={(e) => setCookTime([cookTime[0], +e.target.value])}
            className="w-20 rounded-md border border-slate-300 bg-white/70 px-2 py-1 text-slate-900"
          />
          <button
            onClick={applyCookTime}
            className="ml-2 px-3 py-1 rounded-md bg-amber-500 text-blue-400 text-sm hover:bg-amber-600"
          >
            Apply
          </button>
        </div>
      </Section>

      {/* Servings */}
      <Section title="Servings" onReset={() => { setServings([1, 10]); setFilters((p) => ({ ...p, minServings: 1, maxServings: 10 })); }}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={servings[0]}
            onChange={(e) => setServings([+e.target.value, servings[1]])}
            className="w-20 rounded-md border border-slate-300 bg-white/70 px-2 py-1 text-slate-900"
          />
          <span className="text-blue-400">to</span>
          <input
            type="number"
            min={1}
            value={servings[1]}
            onChange={(e) => setServings([servings[0], +e.target.value])}
            className="w-20 rounded-md border border-slate-300 bg-white/70 px-2 py-1 text-slate-900"
          />
          <button
            onClick={applyServings}
            className="ml-2 px-3 py-1 rounded-md bg-amber-500 text-blue-400 text-sm hover:bg-amber-600"
          >
            Apply
          </button>
        </div>
      </Section>

      {/* Clear all */}
      <div className="pt-2 text-center">
        <button
          onClick={clearAll}
          className="text-md font-medium text-slate-950 underline hover:text-slate-900"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
