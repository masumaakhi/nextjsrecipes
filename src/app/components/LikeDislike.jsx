"use client";

import React from 'react'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { formatCount } from "@/lib/formatCount";
const LikeDislike = () => {

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null);

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

  return (
    <div className="flex items-center gap-2 mt-2">
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
          ${loading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <FaThumbsDown className="w-4 h-4" />
        <span className="text-sm font-medium">{formatCount(dislikes)}</span>
      </button>
    </div>

  )
}

export default LikeDislike