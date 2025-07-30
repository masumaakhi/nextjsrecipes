// src/app/models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
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
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;