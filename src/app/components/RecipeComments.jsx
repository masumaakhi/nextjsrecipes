// src/components/RecipeComments.jsx
"use client";
import { useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaReply, FaThumbtack } from "react-icons/fa";

export default function RecipeComments({ recipeId, userId, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReply, setActiveReply] = useState(null);

  // ✅ Post a new comment
  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    const res = await fetch(`/api/recipes/${recipeId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, text: commentText }),
    });

    const data = await res.json();
    if (data.success) {
      setComments(data.comments);
      setCommentText("");
    }
  };

  // ✅ Reply to a comment
  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;
    const res = await fetch(`/api/recipes/${recipeId}/comments/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, userId, text: replyText }),
    });

    const data = await res.json();
    if (data.success) {
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? data.comment : c))
      );
      setReplyText("");
      setActiveReply(null);
    }
  };

  // ✅ Like or Dislike a comment
  const handleReaction = async (commentId, type) => {
    const res = await fetch(`/api/recipes/${recipeId}/comments/like`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, userId, type }),
    });

    const data = await res.json();
    if (data.success) {
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? data.comment : c))
      );
    }
  };

  // ✅ Pin/Unpin a comment
  const handlePin = async (commentId, pinned) => {
    const res = await fetch(`/api/recipes/${recipeId}/comments/pin`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, pinned }),
    });

    const data = await res.json();
    if (data.success) {
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? data.comment : c))
      );
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>

      {/* Comment Input */}
      <textarea
        className="w-full border p-3 rounded-md mb-2"
        rows="3"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button
        onClick={handlePostComment}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Post Comment
      </button>

      {/* Comments List */}
      <div className="mt-8 space-y-6">
        {comments
          .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)) // Pinned first
          .map((comment) => (
            <div key={comment._id} className="border-b pb-4">
              <div className="flex justify-between">
                <p className="font-semibold">{comment.user?.name || "User"}</p>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="mt-1 text-gray-700">{comment.text}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
                <button
                  onClick={() => handleReaction(comment._id, "like")}
                  className="flex items-center gap-1 hover:text-green-600"
                >
                  <FaThumbsUp /> {comment.likes?.length || 0}
                </button>
                <button
                  onClick={() => handleReaction(comment._id, "dislike")}
                  className="flex items-center gap-1 hover:text-red-600"
                >
                  <FaThumbsDown /> {comment.dislikes?.length || 0}
                </button>
                <button
                  onClick={() =>
                    setActiveReply(activeReply === comment._id ? null : comment._id)
                  }
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <FaReply /> Reply
                </button>
                <button
                  onClick={() => handlePin(comment._id, !comment.pinned)}
                  className={`flex items-center gap-1 ${
                    comment.pinned ? "text-yellow-500" : "hover:text-yellow-500"
                  }`}
                >
                  <FaThumbtack /> {comment.pinned ? "Pinned" : "Pin"}
                </button>
              </div>

              {/* Reply Input */}
              {activeReply === comment._id && (
                <div className="mt-3 pl-6">
                  <textarea
                    className="w-full border p-2 rounded-md mb-2 text-sm"
                    rows="2"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button
                    onClick={() => handleReply(comment._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Post Reply
                  </button>
                </div>
              )}

              {/* Replies */}
              {comment.replies?.length > 0 && (
                <div className="mt-3 space-y-2 pl-6 border-l-2 border-gray-200">
                  {comment.replies.map((reply) => (
                    <div key={reply._id}>
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-800">{reply.user?.name || "User"}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
