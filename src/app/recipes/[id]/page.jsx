// // // app/recipes/[id]/page.jsx

// // "use client";
// // import Image from "next/image";

// // export default function RecipeDetails() {
// //   const recipe = {
// //     title: "Mixed Greens with Sun-Dried Tomato Dressing",
// //     imageUrl: "/s4.jpg", // Use a local image from public/ folder or dummy URL
// //     description:
// //       "This vibrant salad is a blend of fresh greens tossed with a zesty sun-dried tomato dressing.",
// //     ingredients: [
// //       "2 cups mixed greens",
// //       "1/4 cup sun-dried tomatoes",
// //       "2 tbsp olive oil",
// //       "1 tbsp vinegar",
// //       "Salt & pepper to taste",
// //     ],
// //     instructions: [
// //       "Wash and dry the greens.",
// //       "Chop sun-dried tomatoes finely.",
// //       "Whisk olive oil, vinegar, salt, and pepper.",
// //       "Toss all together and serve fresh.",
// //     ],
// //     category: "Salad",
// //     nutrition: {
// //       calories: 220,
// //       fat: 10,
// //       protein: 5,
// //       carbs: 20,
// //       sugar: 3,
// //       cholesterol: 0,
// //       sodium: 180,
// //     },
// //     createdBy: { name: "Chef Alex" },
// //     prepTime: "10 min",
// //     cookTime: "0 min",
// //     servings: "2 people",
// //   };

// //   const comments = [
// //     {
// //       name: "Sara Johnson",
// //       time: "40min ago",
// //       comment: "Wow, this recipe is a flavor explosion!",
// //       replies: 26,
// //       avatar: "/avatar1.jpg",
// //     },
// //     {
// //       name: "Jessica Martinez",
// //       time: "20min ago",
// //       comment: "I agree with you, very delicious.",
// //       replies: 10,
// //       avatar: "/avatar2.jpg",
// //     },
// //     {
// //       name: "David Wilson",
// //       time: "1hr ago",
// //       comment: "This has become a staple in my weekly menu!",
// //       replies: 46,
// //       avatar: "/avatar3.jpg",
// //     },
// //   ];

// //   return (
// //     <div className="max-w-6xl mx-auto mt-28 px-4">
// //       <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>

// //       <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
// //         <span>👩‍🍳 {recipe.createdBy?.name}</span>
// //         <span>📅 Yesterday</span>
// //         <span>💬 25</span>
// //         <span>⭐ 4.8</span>
// //         {/* 👍 Like / 👎 Dislike */}
// //           <button className="flex items-center gap-1 text-gray-700 hover:text-green-500">
// //             👍 <span>28</span>
// //           </button>
// //           <button className="flex items-center gap-1 text-gray-700 hover:text-red-500">
// //             👎 <span>Dislike</span>
// //           </button>
// //       </div>

// //       <p className="text-gray-700 mb-6">{recipe.description}</p>

// //       <div className="relative mb-8">
// //         <Image
// //           src={recipe.imageUrl}
// //           alt={recipe.title}
// //           width={1000}
// //           height={500}
// //           className="rounded-xl object-cover w-full max-h-[500px]"
// //         />
// //         <button className="absolute inset-0 flex items-center justify-center">
// //           <div className="bg-white/80 p-4 rounded-full shadow-lg">▶️</div>
// //         </button>
// //       </div>

// //       <div className="flex gap-6 text-sm text-gray-600 mb-6">
// //         <span>
// //           <strong>Prep Time:</strong> {recipe.prepTime}
// //         </span>
// //         <span>
// //           <strong>Cook Time:</strong> {recipe.cookTime}
// //         </span>
// //         <span>
// //           <strong>Servings:</strong> {recipe.servings}
// //         </span>
// //         <span>🖨️</span>
// //       </div>

// //       <div className="flex flex-col md:flex-row gap-10">
// //         <div className="flex-1 space-y-6">
// //           <div>
// //             <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
// //             <ul className="space-y-1 text-gray-800">
// //               {recipe.ingredients.map((item, i) => (
// //                 <li key={i}>
// //                   <label className="inline-flex items-center gap-2">
// //                     <input type="checkbox" className="form-checkbox" />
// //                     {item}
// //                   </label>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>

// //           <div>
// //             <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
// //             <ol className="list-decimal pl-5 space-y-2 text-gray-800">
// //               {recipe.instructions.map((step, i) => (
// //                 <li key={i}>{step}</li>
// //               ))}
// //             </ol>
// //           </div>
// //         </div>

// //         <div className="w-full md:w-80 space-y-8">
// //           <div className="bg-gray-50 p-4 rounded-lg shadow">
// //             <h3 className="text-lg font-semibold mb-2">Nutrition Facts</h3>
// //             <ul className="text-sm text-gray-700 space-y-1">
// //               <li>
// //                 <strong>Calories:</strong> {recipe.nutrition.calories}
// //               </li>
// //               <li>
// //                 <strong>Total Fat:</strong> {recipe.nutrition.fat}g
// //               </li>
// //               <li>
// //                 <strong>Protein:</strong> {recipe.nutrition.protein}g
// //               </li>
// //               <li>
// //                 <strong>Carbs:</strong> {recipe.nutrition.carbs}g
// //               </li>
// //               <li>
// //                 <strong>Sugar:</strong> {recipe.nutrition.sugar}g
// //               </li>
// //               <li>
// //                 <strong>Cholesterol:</strong> {recipe.nutrition.cholesterol}mg
// //               </li>
// //               <li>
// //                 <strong>Sodium:</strong> {recipe.nutrition.sodium}mg
// //               </li>
// //             </ul>
// //           </div>

// //           <div>
// //             <h3 className="text-lg font-semibold mb-2">Fresh Recipes</h3>
// //             <ul className="text-sm space-y-1">
// //               <li>🌟 Spinach and Cheese Pasta</li>
// //               <li>🌟 Fancy Glazed Donuts</li>
// //               <li>🌟 Cheesy Breakfast Burger</li>
// //             </ul>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Comments Section */}
// //       <div className="mt-16">
// //         <h2 className="text-2xl font-semibold mb-6">Comments</h2>

// //         <div className="space-y-6">
// //           {comments.map((c, i) => (
// //             <div key={i} className="border-b pb-4">
// //               <div className="flex items-start gap-4">
// //                 <img
// //                   src={c.avatar}
// //                   alt={c.name}
// //                   className="w-10 h-10 rounded-full object-cover"
// //                 />
// //                 <div className="flex-1">
// //                   <div className="flex justify-between text-sm">
// //                     <p className="font-semibold text-gray-800">{c.name}</p>
// //                     <span className="text-gray-500">{c.time}</span>
// //                   </div>
// //                   <p className="text-gray-700 mt-2">{c.comment}</p>
// //                   <div className="flex items-center text-sm gap-4 mt-2 text-gray-500">
// //                     <button className="hover:text-red-500">💬 Reply</button>
// //                     <span>❤️ {c.replies}</span>
// //                   </div>
// //                 </div>
// //                 <div className="cursor-pointer text-gray-400">⋯</div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         <div className="mt-4">
// //           <button className="px-4 py-1 border rounded-full text-sm text-gray-600 hover:bg-gray-100">
// //             Load more comments
// //           </button>
// //         </div>

// //         <div className="mt-10">
// //           <h3 className="text-xl font-semibold mb-2">
// //             Rate this recipe and share your opinion
// //           </h3>

// //           <div className="flex gap-1 mb-3 text-red-500 text-xl">
// //             <span>★</span>
// //             <span>★</span>
// //             <span>★</span>
// //             <span>★</span>
// //             <span className="text-gray-300">★</span>
// //           </div>

// //           <textarea
// //             rows="4"
// //             placeholder="Type here..."
// //             className="w-full p-3 border rounded-md text-sm focus:outline-none"
// //           />

// //           <span className="mt-2 mb-2 bg-red-500 text-black px-6 py-2 rounded hover:bg-red-600">
// //             Post
// //           </span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Image from "next/image";

// export default function RecipeDetails() {
//   const { id } = useParams();
//   const [recipe, setRecipe] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState("");
//   const [likes, setLikes] = useState(0);
//   const [dislikes, setDislikes] = useState(0);
//   const [userReaction, setUserReaction] = useState(null);
//   const [rating, setRating] = useState(0);
//   const [avgRating, setAvgRating] = useState(0);
//   const [ratingCount, setRatingCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchRecipe() {
//       const res = await fetch(`/api/recipes/${id}`);
//       const data = await res.json();

//       if (data.success) {
//         setRecipe(data.recipe);
//         setComments(data.recipe.comments || []);
//         setLikes(data.recipe.likes?.length || 0);
//         setDislikes(data.recipe.dislikes?.length || 0);
//       }
//     }

//     async function fetchRatingInfo() {
//       const res = await fetch(`/api/recipes/${id}/rating`);
//       const data = await res.json();
//       if (res.ok) {
//         setRating(data.rating); // user's rating
//         setAvgRating(data.average); // avg rating
//         setRatingCount(data.count); // total ratings
//       }
//     }

//     if (id) {
//       fetchRecipe();
//       fetchRatingInfo();
//       setLoading(false);
//     }
//   }, [id]);

//   const handleReaction = async (type) => {
//     const res = await fetch(`/api/recipes/${id}/like`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ type }),
//     });
//     const data = await res.json();
//     if (data.success) {
//       setLikes(data.likes);
//       setDislikes(data.dislikes);
//       setUserReaction(type);
//     }
//   };

//   const handlePostComment = async () => {
//     if (!commentText.trim()) return;
//     const res = await fetch(`/api/recipes/${id}/comments`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text: commentText }),
//     });
//     const data = await res.json();
//     if (data.success) {
//       setComments((prev) => [
//         ...prev,
//         { text: commentText, user: { name: "You" }, createdAt: new Date() },
//       ]);
//       setCommentText("");
//     }
//   };

//   const handleRate = async (value) => {
//     const res = await fetch(`/api/recipes/${id}/rating`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ value }),
//     });
//     const data = await res.json();
//     if (res.ok) {
//       setRating(value);
//       setAvgRating(data.average);
//       setRatingCount(data.count);
//     }
//   };

//   if (loading) return <p className="mt-20 text-center">Loading...</p>;
//   if (!recipe) return <p className="mt-20 text-center text-red-600">Recipe not found</p>;

//   return (
//     <div className="max-w-6xl mx-auto mt-28 px-4">
//       <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>

//       <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
//         <span>👩‍🍳 {recipe.createdBy?.name}</span>
//         <span>📅 {new Date(recipe.createdAt).toLocaleDateString()}</span>
//         <span>💬 {comments.length}</span>
//         <span>⭐ {avgRating} ({ratingCount})</span>
//         <button
//           onClick={() => handleReaction("like")}
//           className={`flex items-center gap-1 hover:text-green-500 ${
//             userReaction === "like" ? "text-green-600" : "text-gray-700"
//           }`}
//         >
//           👍 <span>{likes}</span>
//         </button>
//         <button
//           onClick={() => handleReaction("dislike")}
//           className={`flex items-center gap-1 hover:text-red-500 ${
//             userReaction === "dislike" ? "text-red-600" : "text-gray-700"
//           }`}
//         >
//           👎 <span>{dislikes}</span>
//         </button>
//       </div>

//       <p className="text-gray-700 mb-6">{recipe.description}</p>

//       <div className="relative mb-8">
//         <Image
//           src={recipe.imageUrl}
//           alt={recipe.title}
//           width={1000}
//           height={500}
//           className="rounded-xl object-cover w-full max-h-[500px]"
//         />
//       </div>

//       <div className="flex gap-6 text-sm text-gray-600 mb-6">
//         <span><strong>Prep Time:</strong> {recipe.prepTime} min</span>
//         <span><strong>Cook Time:</strong> {recipe.cookTime} min</span>
//         <span><strong>Servings:</strong> {recipe.servings}</span>
//       </div>

//       <div className="flex flex-col md:flex-row gap-10">
//         <div className="flex-1 space-y-6">
//           <div>
//             <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
//             <ul className="space-y-1 text-gray-800">
//               {(recipe.ingredients || []).map((item, i) => (
//                 <li key={i}>
//                   <label className="inline-flex items-center gap-2">
//                     <input type="checkbox" className="form-checkbox" />
//                     {item}
//                   </label>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
//             <ol className="list-decimal pl-5 space-y-2 text-gray-800">
//               {(recipe.instructions || []).map((step, i) => (
//                 <li key={i}>{step}</li>
//               ))}
//             </ol>
//           </div>
//         </div>

//         <div className="w-full md:w-80 space-y-8">
//           <div className="bg-gray-50 p-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold mb-2">Nutrition Facts</h3>
//             <ul className="text-sm text-gray-700 space-y-1">
//               <li><strong>Calories:</strong> {recipe.nutrition.calories}</li>
//               <li><strong>Fat:</strong> {recipe.nutrition.fat}g</li>
//               <li><strong>Protein:</strong> {recipe.nutrition.protein}g</li>
//               <li><strong>Carbs:</strong> {recipe.nutrition.carbs}g</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Comments Section */}
//       <div className="mt-16">
//         <h2 className="text-2xl font-semibold mb-6">Comments</h2>

//         <div className="space-y-6">
//           {comments.map((c, i) => (
//             <div key={i} className="border-b pb-4">
//               <div className="flex items-start gap-4">
//                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                   <span className="text-gray-600 text-sm">👤</span>
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex justify-between text-sm">
//                     <p className="font-semibold text-gray-800">
//                       {recipe.createdBy?.name || "User"}
//                     </p>
//                     <span className="text-gray-500">
//                       {c.createdAt
//                         ? new Date(c.createdAt).toLocaleDateString()
//                         : ""}
//                     </span>
//                   </div>
//                   <p className="text-gray-700 mt-2">{c.text}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-10">
//           <h3 className="text-xl font-semibold mb-2">
//             Rate this recipe and share your opinion
//           </h3>

//           <div className="flex gap-1 mb-3 text-red-500 text-xl cursor-pointer">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <span
//                 key={star}
//                 onClick={() => handleRate(star)}
//                 className={star <= rating ? "text-red-500" : "text-gray-300"}
//               >
//                 ★
//               </span>
//             ))}
//             <span className="ml-2 text-sm text-gray-600">
//               Avg: {avgRating} ⭐
//             </span>
//           </div>

//           <textarea
//             rows="4"
//             placeholder="Type here..."
//             value={commentText}
//             onChange={(e) => setCommentText(e.target.value)}
//             className="w-full p-3 border rounded-md text-sm focus:outline-none"
//           />

//           <button
//             onClick={handlePostComment}
//             className="mt-2 bg-red-500 text-black px-6 py-2 rounded hover:bg-red-600"
//           >
//             Post
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { formatCount } from "@/lib/formatCount";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
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
        setComments(data.recipe.comments || []);
        setLikes(data.recipe.likes?.length || 0);
        setDislikes(data.recipe.dislikes?.length || 0);
      }
    }

    async function fetchRatingInfo() {
      const res = await fetch(`/api/recipes/${id}/rating`);
      const data = await res.json();
      if (data.success) {
        setRating(0); // initially no user rating
        setAvgRating(Number(data.average || 0)); // ensure number
        setRatingCount(data.count || 0);
      }
    }

    (async () => {
      await fetchRecipe();
      await fetchRatingInfo();
      setLoading(false);
    })();
  }, [id]);

  // ✅ Like/Dislike Handler
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
      setUserReaction(
        userReaction === type ? null : type
      );
    }
  };

  // ✅ Post Main Comment
  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    const res = await fetch(`/api/recipes/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: commentText }),
    });
    const data = await res.json();
    if (data.success) {
      setComments((prev) => [
        ...prev,
        { ...data.comment, user: { name: "You" } },
      ]);
      setCommentText("");
    }
  };

  // ✅ Post Reply
  const handleReply = async (commentIndex) => {
    if (!replyText.trim()) return;
    const commentId = comments[commentIndex]._id;

    const res = await fetch(`/api/recipes/${id}/comments/reply`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, text: replyText }),
    });
    const data = await res.json();

    if (data.success) {
      const updatedComments = [...comments];
      updatedComments[commentIndex].replies.push({
        text: replyText,
        user: { name: "You" },
        createdAt: new Date(),
      });
      setComments(updatedComments);
      setReplyText("");
      setReplyTo(null);
    }
  };

  // ✅ Rating System
  const handleRate = async (value) => {
    const res = await fetch(`/api/recipes/${id}/rating`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    const data = await res.json();
    if (res.ok) {
      setRating(value);
      setAvgRating(data.average);
      setRatingCount(data.count);
    }
  };

  if (loading) return <p className="mt-20 text-center">Loading...</p>;
  if (!recipe) return <p className="mt-20 text-center text-red-600">Recipe not found</p>;

  return (
    <div className="max-w-6xl mx-auto mt-28 px-4">
      <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>

      {/* Top Info */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
        <span>👩‍🍳 {recipe.createdBy?.name}</span>
        <span>📅 {new Date(recipe.createdAt).toLocaleDateString()}</span>
        <span>💬 {comments.length}</span>
        <span>{Number(avgRating).toFixed(1)} ({ratingCount})</span>

        {/* LIKE BUTTON */}
        <button
          onClick={() => handleReaction("like")}
          className={`flex items-center gap-2 px-3 py-1 rounded-full transition
            ${userReaction === "like" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500 hover:text-green-500"}
          `}
        >
          <FaThumbsUp className="w-4 h-4" />
          <span>{formatCount(likes)}</span>
        </button>

        {/* DISLIKE BUTTON */}
        <button
          onClick={() => handleReaction("dislike")}
          className={`flex items-center gap-2 px-3 py-1 rounded-full transition
            ${userReaction === "dislike" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500 hover:text-red-500"}
          `}
        >
          <FaThumbsDown className="w-4 h-4" />
          <span>{formatCount(dislikes)}</span>
        </button>
      </div>

      <p className="text-gray-700 mb-6">{recipe.description}</p>

      {/* Image */}
      <div className="relative mb-8">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          width={1000}
          height={500}
          className="rounded-xl object-cover w-full max-h-[500px]"
        />
      </div>

      {/* Ingredients + Instructions */}
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
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
            <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-800">
              {(recipe.instructions || []).map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Nutrition */}
        <div className="w-full md:w-80 space-y-8">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Nutrition Facts</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><strong>Calories:</strong> {recipe.nutrition.calories}</li>
              <li><strong>Fat:</strong> {recipe.nutrition.fat}g</li>
              <li><strong>Protein:</strong> {recipe.nutrition.protein}g</li>
              <li><strong>Carbs:</strong> {recipe.nutrition.carbs}g</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Reviews & Comments</h2>

        {/* Existing Comments */}
        <div className="space-y-6">
          {comments.map((c, i) => (
            <div key={i} className="border-b pb-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  👤
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <p className="font-semibold text-gray-800">
                      {c.user?.name || "User"}
                    </p>
                    <span className="text-gray-500">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-2">{c.text}</p>

                  {/* Reply Button */}
                  <button
                    onClick={() => setReplyTo(i)}
                    className="text-blue-500 text-xs mt-1"
                  >
                    Reply
                  </button>

                  {/* Replies */}
                  {c.replies?.length > 0 && (
                    <div className="ml-10 mt-3 space-y-2">
                      {c.replies.map((r, ri) => (
                        <div key={ri} className="text-sm text-gray-700 border-l pl-3">
                          <span className="font-semibold">{r.user?.name || "User"}</span>: {r.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyTo === i && (
                    <div className="mt-2">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="border rounded p-1 text-sm w-full"
                      />
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => handleReply(i)}
                          className="text-blue-500 text-xs"
                        >
                          Post Reply
                        </button>
                        <button
                          onClick={() => setReplyTo(null)}
                          className="text-gray-400 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rating & Comment Form */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-2">
            Rate this recipe and share your opinion
          </h3>

          {/* Star Rating */}
          <div className="flex gap-1 mb-3 text-red-500 text-xl cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRate(star)}
                className={star <= (hoverRating || rating) ? "text-red-500" : "text-gray-300"}
              >
                ★
              </span>
            ))}
            {rating > 0 && (
              <button
                onClick={() => handleRate(0)}
                className="ml-2 text-xs text-gray-500"
              >
                {Number(avgRating).toFixed(1)} ⭐
              </button>
            )}
          </div>

          <textarea
            rows="4"
            placeholder="Type here..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full p-3 border rounded-md text-sm focus:outline-none"
          />

          <button
            onClick={handlePostComment}
            className="mt-2 bg-red-500 text-black px-6 py-2 rounded hover:bg-red-600"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
