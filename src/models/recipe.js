//src/app/models/recipe.js

import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, min: 1, max: 5, required: true },
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  pinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  // User ratings per comment
        ratings: [
          {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            value: { type: Number, min: 1, max: 5 },
          },
        ],

  replies: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      text: { type: String, required: true },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      ratings: [
              {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                value: { type: Number, min: 1, max: 5 },
              },
            ],
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    prepTime: {
      type: Number,
      required: [true, "Preparation time is required"],
    },
    cookTime: {
      type: Number,
      required: [true, "Cooking time is required"],
    },
    servings: {
      type: Number,
      required: [true, "Servings are required"],
    },
    ingredients: {
      type: [String],
      required: [true, "Ingredients are required"],
    },
    instructions: {
      type: [String],
      required: [true, "Instructions are required"],
    },
    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
    },
    category: {
      cuisine: {
        type: [String],
        default: [],
      },
      mealType: {
        type: [String],
        default: [],
      },
      dietType: {
        type: [String],
        default: [],
      },
      foodType: {
        type: [String],
        default: [],
      },
    },
    status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
      comments: [commentSchema],
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      ratings: [ratingSchema],
  }, 

  {
    timestamps: true,
  }
);

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

export default Recipe;
