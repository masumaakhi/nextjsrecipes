// // // app/recipes/[id]/page.jsx

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import ShareButtons from "@/app/components/ShareButtons";
import RecipeComments from "@/app/components/RecipeComments";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { formatCount } from "@/lib/formatCount";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null);

  const [rating, setRating] = useState(0);
const [hoverRating, setHoverRating] = useState(0);
const [avgRating, setAvgRating] = useState(0);
const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
        const res = await fetch(`/api/recipes/${id}`);
        const data = await res.json();

        if (data.success) {
          setRecipe(data.recipe);

        setLikes(data.recipe.likes?.length || 0);
        setDislikes(data.recipe.dislikes?.length || 0);
      }
    }

    // async function fetchRatingInfo() {
    //   const res = await fetch(`/api/recipes/${id}/rating`);
    //   const data = await res.json();
    //   if (data.success) {
    //     setRating(0); // initially no user rating
    //     setAvgRating(Number(data.average || 0)); // ensure number
    //     setRatingCount(data.count || 0);
    //   }
    // }

    (async () => {
      await fetchRecipe();
      setLoading(false);
    })();
  }, [id]);

  // // ✅ Like/Dislike Handler
  // const handleReaction = async (type) => {
  //   const res = await fetch(`/api/recipes/${id}/like`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ type }),
  //   });
  //   const data = await res.json();
  //   if (data.success) {
  //     setLikes(data.likes);
  //     setDislikes(data.dislikes);
  //     setUserReaction(
  //       userReaction === type ? null : type
  //     );
  //   }
  // };

  useEffect(() => {
    const fetchReactions = async () => {
      const res = await fetch(`/api/recipes/${id}/like`);
      const data = await res.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserReaction(data.userReaction); // 👈 এটা দিয়ে active দেখাবে
    };

    fetchReactions();
  }, [id]);

  const handleReaction = async (type) => {
    const res = await fetch(`/api/recipes/${id}/like`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const data = await res.json();
    if (data.success) {
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserReaction(data.userReaction); // 👈 নতুন রিঅ্যাকশন
    }
  };



  // ✅ Rating System
  // const handleRate = async (value) => {
  //   const res = await fetch(`/api/recipes/${id}/rating`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ value }),
  //   });
  //   const data = await res.json();
  //   if (res.ok) {
  //     setRating(value);
  //     setAvgRating(data.average);
  //     setRatingCount(data.count);
  //   }
  // };
//Fetch Rating
useEffect(() => {
  const fetchUserRating = async () => {
    try {
      const res = await fetch(`/api/recipes/${id}/rating`);
      const data = await res.json();
      if (data.success) {
        setRating(data.rating);
        setAvgRating(data.average);
        setRatingCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };
  fetchUserRating();
}, [id]);

 const handleRate = async (value) => {
  try {
    const res = await fetch(`/api/recipes/${id}/rating`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    const data = await res.json();
    if (data.success) {
      setRating(data.rating);
      setAvgRating(data.average);
      setRatingCount(data.count);
    } else {
      console.error("Rating failed:", data.message);
    }
  } catch (error) {
    console.error("Rating error:", error);
  }
};

  if (loading) return <p className="mt-20 text-center">Loading...</p>;
  if (!recipe)
    return <p className="mt-20 text-center text-red-600">Recipe not found</p>;

  return (
    <div className="max-w-6xl mx-auto mt-28 mb-1.5 px-4">
      <h1 className="text-4xl text-slate-900 font-bold mb-2">{recipe.title}</h1>

      {/* Top Info */}
      <div className="flex items-center gap-4 text-sm text-slate-900 mb-6">
        <span>👩‍🍳 {recipe.createdBy?.name}</span>
        <span>📅 {new Date(recipe.createdAt).toLocaleDateString()}</span>

        <span>
          {Number(avgRating).toFixed(1)} ({ratingCount})
        </span>

        {/* LIKE BUTTON */}
        {/* <button
          onClick={() => handleReaction("like")}
          className={`flex items-center gap-2 px-3 py-1 rounded-full transition
            ${userReaction === "like" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500 hover:text-green-500"}
          `}
        >
          <FaThumbsUp className="w-4 h-4" />
          <span>{formatCount(likes)}</span>
        </button> */}

        {/* DISLIKE BUTTON */}
        {/* <button
          onClick={() => handleReaction("dislike")}
          className={`flex items-center gap-2 px-3 py-1 rounded-full transition
            ${userReaction === "dislike" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500 hover:text-red-500"}
          `}
        >
          <FaThumbsDown className="w-4 h-4" />
          <span>{formatCount(dislikes)}</span>
        </button> */}

        {/* LIKE BUTTON */}
        <button
          onClick={() => handleReaction("like")}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition 
      ${
        userReaction === "like"
          ? "bg-green-100 text-green-600"
          : "bg-gray-100 text-gray-500 hover:text-green-500 hover:bg-green-50"
      }
    `}
        >
          <FaThumbsUp className="w-4 h-4" />
          <span className="text-sm font-medium">{formatCount(likes)}</span>
        </button>

        {/* DISLIKE BUTTON */}
        <button
          onClick={() => handleReaction("dislike")}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition 
      ${
        userReaction === "dislike"
          ? "bg-red-100 text-red-600"
          : "bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50"
      }
    `}
        >
          <FaThumbsDown className="w-4 h-4" />
          <span className="text-sm font-medium">{formatCount(dislikes)}</span>
        </button>
        <ShareButtons title={recipe.title} text={recipe.description} />
      </div>

      <p className="text-slate-800 mb-6">{recipe.description}</p>

      {/* Image */}
      <div className="relative mb-8">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
          width={800}
          height={300}
          className="rounded-xl object-cover w-full max-h-[400px]"
            />
          </div>
          
      {/* Ingredients + Instructions */}
      <div className="flex flex-col text-slate-900 md:flex-row gap-10">
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-2xl text-slate-900 font-semibold mb-2">
              Ingredients
            </h2>
            <ul className="space-y-1 text-gray-800">
              {(recipe.ingredients || []).map((item, i) => (
                <li key={i}>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox" />
                    {item}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl text-slate-950 font-semibold mb-2">
              Instructions
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-slate-800">
              {(recipe.instructions || []).map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Nutrition */}
        <div className="w-full md:w-80 space-y-8">
          <div className="rounded-xl shadow-2xl bg-opacity-70 backdrop-blur p-4">
            <h3 className="text-lg text-slate-900 font-semibold mb-2">
              Nutrition Facts
            </h3>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>
                <strong>Calories:</strong> {recipe.nutrition.calories}
              </li>
              <li>
                <strong>Fat:</strong> {recipe.nutrition.fat}g
              </li>
              <li>
                <strong>Protein:</strong> {recipe.nutrition.protein}g
              </li>
              <li>
                <strong>Carbs:</strong> {recipe.nutrition.carbs}g
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-16">
        <h2 className="text-2xl text-slate-950 font-semibold mb-6">
          Reviews & Comments
        </h2>

        {/* Rating Section */}
        <div className="mb-8">
          <h3 className="text-xl text-slate-900 font-semibold mb-2">
            Rate this recipe and share your opinion
          </h3>

          {/* ⭐ Star Rating Display */}
          <div className="flex gap-1 mb-3 text-red-500 text-xl cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRate(star)}
                className={
                  star <= (hoverRating || rating)
                    ? "text-red-500"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
            
            {/* Clear Rating Button */}
            {rating > 0 && (
              <button
                onClick={() => handleRate(0)}
                className="ml-2 text-xs text-gray-700"
              >
                {Number(avgRating).toFixed(1)} ⭐
              </button>
            )}
          </div>

          {/* Rating Summary */}
          <span className="text-sm text-slate-600">
            Average: {Number(avgRating).toFixed(1)} • {ratingCount} ratings
          </span>
        </div>

        {/* RecipeComments Component */}
        <RecipeComments recipeId={id} />
      </div>
    </div>
  );
}
