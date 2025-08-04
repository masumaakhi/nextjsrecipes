// import React from "react";
// import recipes from "../data/imagedata";  // রিলেটিভ path ঠিক আছে কিনা চেক করো

// const Header = () => {
//   const selected = [];
//   const seen = new Set();

//   for (const r of recipes) {
//     if (!seen.has(r.category)) {
//       selected.push(r);
//       seen.add(r.category);
//     }
//   }

//   // এখন তুমি selected এর প্রথম রেসিপি ইউজ করতে পারো
//   const recipe = selected[0];

//   // যেহেতু তোমার আগের UI-তে অনেক ভেরিয়েবল ছিল, নিচে সেগুলো অ্যাসাইন করে নিই:
//   const likes = recipe.visits || 0;
//   const reviews = 0; // যদি আলাদা ডাটা না থাকে
//   const relatedDishes = recipes.filter((r) => r.category === recipe.category && r.id !== recipe.id).slice(0, 5);

//   return (
//     <div className="mt-[6rem] font-sans px-6 py-10">
//       {/* Main Grid */}
//       <div className="grid md:grid-cols-3 gap-8 items-center">
//         {/* Left Image */}
//         <div className="flex justify-center">
//           <div className="relative w-[300px] h-[300px] rounded-full transform -translate-y-5">
//             <img src={recipe.image} alt={recipe.title}
//             className="rounded-full w-full h-full object-cover ring-2 ring-white z-10 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.45)]"
//             />
//             <div className="absolute inset-0 rounded-full bg-black opacity-25 blur-3xl z-0"></div>
//           </div>
//         </div>

//         {/* Center Text */}
//         <div className="text-center md:text-left">
//           <p className="text-slate-800 text-sm">#1 Most loved dish</p>
//           <h1 className="text-4xl font-bold text-gray-800 leading-tight">
//             {recipe.title.split(" ")[0]}
//             <br />
//             <span className="text-6xl font-extrabold">{recipe.title.split(" ").slice(1).join(" ")}</span>
//           </h1>
//           <div className="flex gap-4 mt-6 justify-center md:justify-start">
//             <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
//               ▶ Play video
//             </button>
//             <button className="bg-gray-200 text-black px-4 py-2 rounded-full hover:bg-gray-300">
//               🍽️ Order food
//             </button>
//           </div>
//         </div>

//         {/* Right Card */}
//         <div className="bg-white max-w-[2rem] rounded-3xl shadow-lg px-6 py-10">
//           <div className="flex justify-between items-center mb-4">
//             <span className="text-sm font-semibold">Overview</span>
//             <span className="text-sm text-slate-800">Ingredients</span>
//           </div>
//           <div className="text-3xl font-bold text-orange-500">{recipe.rating} ⭐</div>
//           <p className="font-semibold text-gray-800 mt-2">{recipe.title}</p>
//           <p className="text-sm text-gray-500 mt-2">{recipe.description?.substring(0, 100)}</p>
//           <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
//             <span>👍 {likes}</span>
//             <span>💬 {reviews}</span>
//           </div>
//         </div>
//       </div>

//       {/* Related Dishes */}
//       <h2 className="text-xl font-bold mt-10 mb-4">You may also like</h2>
//       <div className=" flex items-center gap-4 overflow-x-auto scrollbar-hide">
//         {recipes.length > 0 ? (
//           recipes.map((dish) => (
//             <div
//               key={dish.id}
//               className="max-w-[140px] max-h-[250px] w-[140px] h-[200px] flex flex-col items-center justify-center gap-[8px] p-4 rounded-xl hover:bg-gray-400"
//             >
//               <img src={dish.image} alt={dish.title} className="w-20 h-20 rounded-full object-cover shadow-md" />
//               <p className="text-sm mt-2 text-center font-semibold">{dish.title}</p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">No related dishes found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Header;
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import recipes from "../data/imagedata";

const Header = () => {
  const [index, setIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(0);
  const recipe = recipes[index];
  const likes = recipe.visits || 0;
  const reviews = 0;

  // Filter related dishes (optional, but useful for real cases)
  const relatedDishes = recipes
    .filter((r) => r.category === recipe.category && r.id !== recipe.id)
    .slice(0, 5);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % recipes.length);
      setHoverIndex((prev) => (prev + 1) % recipes.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-[8rem] font-sans px-6 py-10 relative overflow-hidden">
      {/* Scrolling Background */}
      <div className="absolute inset-0 z-0" />

      {/* Grid Layout */}
      <div className="grid md:grid-cols-3 gap-8 items-center relative z-10">
        {/* Left Image Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={recipe.id}
            initial={{ y: -80, opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
            exit={{ x: -200, opacity: 0, rotate: -100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="relative w-[300px] h-[300px] md:w-[250px] md:h-[250px] rounded-full">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="rounded-full w-full h-full object-cover ring-2 ring-white z-10 shadow-xl"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Center Text */}
        <div className="text-center md:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={recipe.title}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <p className="text-slate-600 text-sm">#1 Most loved dish</p>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {recipe.title.split(" ")[0]}
                <br />
                <span className="text-6xl font-extrabold">
                  {recipe.title.split(" ").slice(1).join(" ")}
                </span>
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* Static Buttons */}
          <div className="flex gap-4 mt-6 justify-center md:justify-start">
            <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
              ▶ Play video
            </button>
            <button className="bg-gray-200 text-black px-4 py-2 rounded-full hover:bg-gray-300">
              🍽️ Order food
            </button>
          </div>
        </div>

        {/* Right Static Card with Animated Inner Content */}
        <div className="bg-gray-200 max-w-[23rem] mt-5 backdrop-blur scale-105 rounded-3xl shadow-lg px-6 py-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-700 font-semibold">Overview</span>
            <span className="text-sm text-slate-800">Ingredients</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-3xl font-bold text-orange-500">
                {recipe.rating} ⭐
              </div>
              <p className="font-semibold text-gray-800 mt-2">{recipe.title}</p>
              <p className="text-sm text-gray-800 mt-2">
                {recipe.description?.substring(0, 100)}
              </p>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>👍 {likes}</span>
                <span>💬 {reviews}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Related Section with Auto Hover Animation */}
      <h2 className="text-xl text-slate-800 font-bold mt-10 mb-4">You may also like</h2>
     <div className="flex items-center gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide max-w-full py-2 z-10 relative">

        {recipes.map((dish, i) => (
          <div
            key={dish.id}
            className={`max-w-[140px] w-[140px] h-[200px] flex flex-col items-center justify-center gap-[8px] p-4 rounded-xl transition-all duration-300 ${
              i === hoverIndex
                ? "bg-gray-200 backdrop-blur  scale-105 shadow-md"
                : "bg-transparent"
            }`}
          >
            <img
              src={dish.image}
              alt={dish.title}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-20 lg:h-20 rounded-full scale-3d object-cover shadow-md"
            />
            <p className="text-sm mt-2 text-slate-800 text-center font-semibold">
              {dish.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;

