// src/app/api/recipes/[id]/comments/like/route.js
import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";
import User from "@/models/user"; // <-- ensure this exists
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  await connectDb();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success:false, message:"Unauthorized" }, { status:401 });
    }

     const { id: recipeId } = await params; // no await here
    const { commentId, replyId, type } = await req.json();
    if (!commentId || !["like","dislike"].includes(type)) {
      return NextResponse.json({ success:false, message:"Invalid input" }, { status:400 });
    }

    // ✅ Resolve real Mongo ObjectId from email (MOST RELIABLE)
    const userDoc = await User.findOne({ email: session.user.email }).select("_id");
    if (!userDoc?._id) {
      return NextResponse.json({ success:false, message:"User not found" }, { status:404 });
    }
    const userObjId = new mongoose.Types.ObjectId(String(userDoc._id));

    // ---- read present state to know toggle on/off ----
    if (!replyId) {
      const doc = await Recipe.findOne(
        { _id: recipeId, "comments._id": commentId },
        { "comments.$": 1 }
      );
      if (!doc) return NextResponse.json({ success:false, message:"Comment not found" }, { status:404 });

      const c = doc.comments[0];
      const liked    = (c.likes || []).some(u => String(u) === String(userObjId));
      const disliked = (c.dislikes || []).some(u => String(u) === String(userObjId));

      const update = { $pull:{}, $addToSet:{} };
      if (type === "like") {
        if (disliked) update.$pull["comments.$.dislikes"] = userObjId;
        if (liked)    update.$pull["comments.$.likes"] = userObjId;     // toggle off
        else          update.$addToSet["comments.$.likes"] = userObjId; // toggle on
      } else {
        if (liked)    update.$pull["comments.$.likes"] = userObjId;
        if (disliked) update.$pull["comments.$.dislikes"] = userObjId;  // toggle off
        else          update.$addToSet["comments.$.dislikes"] = userObjId;
      }
      if (!Object.keys(update.$pull).length) delete update.$pull;
      if (!Object.keys(update.$addToSet).length) delete update.$addToSet;

      if (update.$pull || update.$addToSet) {
        await Recipe.updateOne({ _id: recipeId, "comments._id": commentId }, update);
      }
    } else {
      // reply level (arrayFilters)
      const doc = await Recipe.findOne(
        { _id: recipeId, "comments._id": commentId, "comments.replies._id": replyId },
        { "comments.$": 1 }
      );
      if (!doc) return NextResponse.json({ success:false, message:"Reply not found" }, { status:404 });

      const p = doc.comments[0];
      const r = p.replies.id(replyId);
      r.likes = Array.isArray(r.likes) ? r.likes : [];
      r.dislikes = Array.isArray(r.dislikes) ? r.dislikes : [];

      const liked    = r.likes.some(u => String(u) === String(userObjId));
      const disliked = r.dislikes.some(u => String(u) === String(userObjId));

      const update = { $pull:{}, $addToSet:{} };
      if (type === "like") {
        if (disliked) update.$pull["comments.$[c].replies.$[r].dislikes"] = userObjId;
        if (liked)    update.$pull["comments.$[c].replies.$[r].likes"] = userObjId;
        else          update.$addToSet["comments.$[c].replies.$[r].likes"] = userObjId;
      } else {
        if (liked)    update.$pull["comments.$[c].replies.$[r].likes"] = userObjId;
        if (disliked) update.$pull["comments.$[c].replies.$[r].dislikes"] = userObjId;
        else          update.$addToSet["comments.$[c].replies.$[r].dislikes"] = userObjId;
      }
      if (!Object.keys(update.$pull).length) delete update.$pull;
      if (!Object.keys(update.$addToSet).length) delete update.$addToSet;

      if (update.$pull || update.$addToSet) {
        await Recipe.updateOne(
          { _id: recipeId },
          update,
          {
            arrayFilters: [
              { "c._id": new mongoose.Types.ObjectId(commentId) },
              { "r._id": new mongoose.Types.ObjectId(replyId) },
            ],
          }
        );
      }
    }

    // Return populated parent comment
    const populated = await Recipe.findById(recipeId)
      .populate("comments.user", "name email")
      .populate("comments.replies.user", "name email");
    const updatedComment = populated.comments.id(commentId);

    return NextResponse.json({ success:true, comment: updatedComment });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success:false, message:"Server error" }, { status:500 });
  }
}
