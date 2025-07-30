//src/app/models/recipe.js

import mongoose from 'mongoose';

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
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

export default Recipe;
