// src/components/RecipeComments.jsx
"use client";
import { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown, FaReply, FaThumbtack, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function RecipeComments({ recipeId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReply, setActiveReply] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});

  // Fetch comments on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/recipes/${recipeId}/comments`);
        const data = await res.json();
        if (data.success) setComments(data.comments || []);
      } catch {}
    };
    if (recipeId) load();
  }, [recipeId]);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    const text = commentText;
    setCommentText("");
    try {
      const res = await fetch(`/api/recipes/${recipeId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [data.comment, ...prev]);
      }
    } catch {}
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;
    const res = await fetch(`/api/recipes/${recipeId}/comments/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, text: replyText }),
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

  const handleReaction = async (commentId, type) => {
    const res = await fetch(`/api/recipes/${recipeId}/comments/like`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, type }),
    });
    const data = await res.json();
    if (data.success) {
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? data.comment : c))
      );
    }
  };

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

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  return (
    <div>
      {/* Comment Input */}
      <div className="mb-8">
        <textarea
          className="w-full p-3 border text-slate-900 border-gray-500 rounded-md text-md focus:outline-none"
          rows="4"
          placeholder="Type here..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          onClick={handlePostComment}
          className="mt-2 px-6 py-2 text-slate-100 bg-amber-600 rounded hover:bg-amber-700 text-md"
        >
          Post
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments
          .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)) // Pinned first
          .map((comment) => (
            <div key={comment._id} className="border-b text-gray-500 pb-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  👤
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <p className="font-semibold text-slate-800">
                      {comment.user?.name || "User"}
                    </p>
                    <span className="text-slate-600">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700 mt-2">{comment.text}</p>

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

              {/* Replies Dropdown */}
              {comment.replies?.length > 0 && (
                <div className="mt-3 pl-6">
                  <button
                    onClick={() => toggleReplies(comment._id)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {expandedReplies[comment._id] ? (
                      <FaChevronUp className="w-3 h-3" />
                    ) : (
                      <FaChevronDown className="w-3 h-3" />
                    )}
                    {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                  </button>

                  {/* Expanded Replies */}
                  {expandedReplies[comment._id] && (
                    <div className="mt-3 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="border-l-2 border-gray-200 pl-4">
                          <div className="flex items-start gap-3">
                            {/* User Icon */}
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                              {reply.user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="font-semibold text-sm">{reply.user?.name || "User"}</p>
                                <span className="text-xs text-gray-500">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              <p className="text-gray-700 text-sm mt-1">{reply.text}</p>
                              
                              {/* Reply Actions */}
                              <div className="flex items-center gap-4 text-gray-500 text-xs mt-2">
                                <button
                                  onClick={() => handleReaction(comment._id, "like")}
                                  className="flex items-center gap-1 hover:text-green-600"
                                >
                                  <FaThumbsUp className="w-3 h-3" /> {reply.likes?.length || 0}
                                </button>
                                <button
                                  onClick={() => handleReaction(comment._id, "dislike")}
                                  className="flex items-center gap-1 hover:text-red-600"
                                >
                                  <FaThumbsDown className="w-3 h-3" /> {reply.dislikes?.length || 0}
                                </button>
                                <button
                                  onClick={() =>
                                    setActiveReply(activeReply === comment._id ? null : comment._id)
                                  }
                                  className="flex items-center gap-1 hover:text-blue-600"
                                >
                                  <FaReply className="w-3 h-3" /> Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
