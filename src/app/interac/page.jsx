"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Interactions({ recipeId }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
  fetch(`/api/recipes/${recipeId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data?.success && data?.recipe) {
        setLikes(data.recipe.likes?.length || 0);
        setDislikes(data.recipe.dislikes?.length || 0);
        setComments(data.recipe.comments || []);
      } else {
        console.error("Failed to fetch recipe:", data.message);
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
    });
}, [recipeId]);
  const handleLike = async () => {
    const res = await fetch(`/api/recipes/${recipeId}/like`, { method: "POST" });
    const data = await res.json();
    setLikes(data.likes);
  };

  const handleDislike = async () => {
    const res = await fetch(`/api/recipes/${recipeId}/dislike`, { method: "POST" });
    const data = await res.json();
    setDislikes(data.dislikes);
  };

  const handleComment = async () => {
    if (!text) return;
    await fetch(`/api/recipes/${recipeId}/comments`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    setText("");
    // Refresh comments
    const res = await fetch(`/api/recipes/${recipeId}/comments`);
    const data = await res.json();
    setComments(data.comments);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this recipe",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="mt-[10rem] space-y-4">
      <div className="flex gap-4 items-center">
        <button onClick={handleLike} className="text-green-600 hover:underline">
          👍 {likes}
        </button>
        <button onClick={handleDislike} className="text-red-600 hover:underline">
          👎 {dislikes}
        </button>
        <button onClick={handleShare} className="text-blue-600 hover:underline">
          🔗 Share
        </button>
      </div>

      <div>
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          placeholder="Leave a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleComment}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Post Comment
        </button>
      </div>

      <div className="space-y-2">
        {comments.map((c, i) => (
          <div key={i} className="border p-2 rounded">
            <p className="text-sm font-semibold">{c.user?.name || "User"}</p>
            <p className="text-gray-700">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
