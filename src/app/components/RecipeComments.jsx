// src/components/RecipeComments.jsx
"use client";
import { useState, useEffect, useMemo } from "react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaReply,
  FaThumbtack,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export default function RecipeComments({ recipeId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  // activeReply: { commentId, replyId|null }
  const [activeReply, setActiveReply] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  // prevent rapid double click: pending map by key "c:commentId" or "r:commentId:replyId"
  const [pending, setPending] = useState({});

  // helpers
  const keyC = (cid) => `c:${cid}`;
  const keyR = (cid, rid) => `r:${cid}:${rid}`;

  useEffect(() => {
    const load = async () => {
      try {
        // session থেকে user id
        const s = await fetch("/api/auth/session");
        const sdata = await s.json().catch(() => ({}));
        setCurrentUserId(sdata?.user?.id || sdata?.user?._id || null);

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
      if (data.success) setComments((prev) => [data.comment, ...prev]);
    } catch {}
  };

  const handleReplyPost = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`/api/recipes/${recipeId}/comments/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, text: replyText }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.comment) {
          setComments((prev) =>
            prev.map((c) => (c._id === commentId ? data.comment : c))
          );
        }
        setReplyText("");
        setActiveReply(null);
      }
    } catch {}
  };

  // ---------- optimistic toggles ----------
  const toggleArrays = (arr = [], userId, shouldAdd) => {
    const set = new Set(arr.map(String));
    const uid = String(userId);
    if (shouldAdd) set.add(uid);
    else set.delete(uid);
    return Array.from(set);
  };

  const optimisticUpdateComment = (commentId, type) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c._id !== commentId) return c;
        const liked = c.likes?.some((u) => String(u) === String(currentUserId));
        const disliked = c.dislikes?.some((u) => String(u) === String(currentUserId));
        let likes = c.likes || [];
        let dislikes = c.dislikes || [];

        if (type === "like") {
          const nowLike = !liked; // toggle
          likes = toggleArrays(likes, currentUserId, nowLike);
          if (disliked && nowLike) {
            // remove dislike if switching to like
            dislikes = toggleArrays(dislikes, currentUserId, false);
          }
          if (!nowLike) {
            // just removed like, nothing else
          }
        } else {
          const nowDislike = !disliked;
          dislikes = toggleArrays(dislikes, currentUserId, nowDislike);
          if (liked && nowDislike) {
            likes = toggleArrays(likes, currentUserId, false);
          }
        }
        return { ...c, likes, dislikes };
      })
    );
  };

  const optimisticUpdateReply = (commentId, replyId, type) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c._id !== commentId) return c;
        const replies = (c.replies || []).map((r) => {
          if (r._id !== replyId) return r;
          const liked = r.likes?.some((u) => String(u) === String(currentUserId));
          const disliked = r.dislikes?.some(
            (u) => String(u) === String(currentUserId)
          );
          let likes = r.likes || [];
          let dislikes = r.dislikes || [];

          if (type === "like") {
            const nowLike = !liked;
            likes = toggleArrays(likes, currentUserId, nowLike);
            if (disliked && nowLike) {
              dislikes = toggleArrays(dislikes, currentUserId, false);
            }
          } else { // type === "dislike"
            const nowDislike = !disliked;
            dislikes = toggleArrays(dislikes, currentUserId, nowDislike);
            // <-- পরিবর্তন এখানে
            if (liked && nowDislike) {
              // যদি ইউজার এখন dislike করে এবং আগে like করা ছিল, তাহলে like সরিয়ে দাও
              likes = toggleArrays(likes, currentUserId, false);
            }
          }
          return { ...r, likes, dislikes };
        });
        return { ...c, replies };
      })
    );
  };


  const handleCommentReaction = async (commentId, type) => {
    if (!currentUserId) return; // need user
    const k = keyC(commentId);
    if (pending[k]) return;
    setPending((p) => ({ ...p, [k]: true }));

    optimisticUpdateComment(commentId, type);
    try {
      const res = await fetch(`/api/recipes/${recipeId}/comments/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, type }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? data.comment : c))
        );
      }
    } catch {
      // (optional) rollback could be implemented
    } finally {
      setPending((p) => {
        const n = { ...p };
        delete n[k];
        return n;
      });
    }
  };

  const handleReplyReaction = async (commentId, replyId, type) => {
    if (!currentUserId) return;
    const k = keyR(commentId, replyId);
    if (pending[k]) return;
    setPending((p) => ({ ...p, [k]: true }));

    optimisticUpdateReply(commentId, replyId, type);
    try {
      const res = await fetch(`/api/recipes/${recipeId}/comments/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, replyId, type }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.comment) {
          setComments((prev) =>
            prev.map((c) => (c._id === commentId ? data.comment : c))
          );
        } else if (data.reply) {
          setComments((prev) =>
            prev.map((c) =>
              c._id !== commentId
                ? c
                : {
                    ...c,
                    replies: (c.replies || []).map((r) =>
                      r._id === replyId ? data.reply : r
                    ),
                  }
            )
          );
        }
      }
    } catch {
      // (optional) rollback
    } finally {
      setPending((p) => {
        const n = { ...p };
        delete n[k];
        return n;
      });
    }
  };

  const handlePin = async (commentId, pinned) => {
    try {
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
    } catch {}
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const isLiked = (arr = []) =>
    currentUserId && arr.some((u) => String(u) === String(currentUserId));
  const isDisliked = (arr = []) =>
    currentUserId && arr.some((u) => String(u) === String(currentUserId));

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
          .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
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

                  {/* Comment actions */}
                  <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
                    <button
                      disabled={pending[keyC(comment._id)]}
                      onClick={() =>
                        handleCommentReaction(comment._id, "like")
                      }
                      className={`flex items-center gap-1 ${
                        isLiked(comment.likes) ? "text-green-600" : "hover:text-green-600"
                      } disabled:opacity-50`}
                    >
                      <FaThumbsUp /> {comment.likes?.length || 0}
                    </button>
                    <button
                      disabled={pending[keyC(comment._id)]}
                      onClick={() =>
                        handleCommentReaction(comment._id, "dislike")
                      }
                      className={`flex items-center gap-1 ${
                        isDisliked(comment.dislikes)
                          ? "text-red-600"
                          : "hover:text-red-600"
                      } disabled:opacity-50`}
                    >
                      <FaThumbsDown /> {comment.dislikes?.length || 0}
                    </button>
                    <button
                      onClick={() =>
                        setActiveReply(
                          activeReply &&
                            activeReply.commentId === comment._id &&
                            activeReply.replyId == null
                            ? null
                            : { commentId: comment._id, replyId: null }
                        )
                      }
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      <FaReply /> Reply
                    </button>
                    <button
                      onClick={() => handlePin(comment._id, !comment.pinned)}
                      className={`flex items-center gap-1 ${
                        comment.pinned
                          ? "text-yellow-500"
                          : "hover:text-yellow-500"
                      }`}
                    >
                      <FaThumbtack /> {comment.pinned ? "Pinned" : "Pin"}
                    </button>
                  </div>

                  {/* Reply input under comment */}
                  {activeReply &&
                    activeReply.commentId === comment._id &&
                    activeReply.replyId == null && (
                      <div className="mt-3 pl-6">
                        <textarea
                          className="w-full border p-2 rounded-md mb-2 text-sm"
                          rows="2"
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button
                          onClick={() => handleReplyPost(comment._id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Post Reply
                        </button>
                      </div>
                    )}

                  {/* Replies */}
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
                        {comment.replies.length}{" "}
                        {comment.replies.length === 1 ? "reply" : "replies"}
                      </button>

                      {expandedReplies[comment._id] && (
                        <div className="mt-3 space-y-3">
                          {comment.replies.map((reply) => {
                            const liked = isLiked(reply.likes);
                            const disliked = isDisliked(reply.dislikes);
                            const pend = pending[keyR(comment._id, reply._id)];
                            return (
                              <div
                                key={reply._id}
                                className="border-l-2 border-gray-200 pl-4"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                                    {reply.user?.name?.charAt(0)?.toUpperCase() ||
                                      "U"}
                                  </div>

                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <p className="font-semibold text-sm">
                                        {reply.user?.name || "User"}
                                      </p>
                                      <span className="text-xs text-gray-500">
                                        {new Date(
                                          reply.createdAt
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>

                                    <p className="text-gray-700 text-sm mt-1">
                                      {reply.text}
                                    </p>

                                    {/* Reply actions (reply-level) */}
                                    <div className="flex items-center gap-4 text-gray-500 text-xs mt-2">
                                      <button
                                        disabled={pend}
                                        onClick={() =>
                                          handleReplyReaction(
                                            comment._id,
                                            reply._id,
                                            "like"
                                          )
                                        }
                                        className={`flex items-center gap-1 ${
                                          liked
                                            ? "text-green-600"
                                            : "hover:text-green-600"
                                        } disabled:opacity-50`}
                                      >
                                        <FaThumbsUp className="w-3 h-3" />{" "}
                                        {reply.likes?.length || 0}
                                      </button>
                                      <button
                                        disabled={pend}
                                        onClick={() =>
                                          handleReplyReaction(
                                            comment._id,
                                            reply._id,
                                            "dislike"
                                          )
                                        }
                                        className={`flex items-center gap-1 ${
                                          disliked
                                            ? "text-red-600"
                                            : "hover:text-red-600"
                                        } disabled:opacity-50`}
                                      >
                                        <FaThumbsDown className="w-3 h-3" />{" "}
                                        {reply.dislikes?.length || 0}
                                      </button>
                                      <button
                                        onClick={() =>
                                          setActiveReply(
                                            activeReply &&
                                              activeReply.commentId ===
                                                comment._id &&
                                              activeReply.replyId === reply._id
                                              ? null
                                              : {
                                                  commentId: comment._id,
                                                  replyId: reply._id,
                                                }
                                          )
                                        }
                                        className="flex items-center gap-1 hover:text-blue-600"
                                      >
                                        <FaReply className="w-3 h-3" /> Reply
                                      </button>
                                    </div>

                                    {/* reply-on-reply input */}
                                    {activeReply &&
                                      activeReply.commentId === comment._id &&
                                      activeReply.replyId === reply._id && (
                                        <div className="mt-3">
                                          <textarea
                                            className="w-full border p-2 rounded-md mb-2 text-sm"
                                            rows="2"
                                            placeholder="Write a reply..."
                                            value={replyText}
                                            onChange={(e) =>
                                              setReplyText(e.target.value)
                                            }
                                          />
                                          <button
                                            onClick={() =>
                                              handleReplyPost(comment._id)
                                            }
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                          >
                                            Post Reply
                                          </button>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
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
