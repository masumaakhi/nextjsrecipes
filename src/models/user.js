// import mongoose from "mongoose";
// // import uniqueValidator from "mongoose-unique-validator";

// const userSchema = new mongoose.Schema(
// 	{
// 		name: {
// 			type: String,
// 			required: [true, "Name is required"],
// 			trim: true,
// 			minLength: 1,
// 			maxLength: 20,
// 		},
// 		email: {
// 			type: String,
// 			required: [true, "Email is required"],
// 			index: true,
// 			lowercase: true,
// 			unique: true,
// 			trim: true,
// 			minLength: 5,
// 			maxLength: 30,
// 		},
// 		password: String,
// 		role: {
// 			type: String,
// 			default: "user",
// 		},
// 		image: String,
// 	},
// 	{ timestamps: true },
// );

// // userSchema.plugin(uniqueValidator, " is already taken.");

// export default mongoose.models.User || mongoose.model("User", userSchema);


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: 1,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      minLength: 5,
      maxLength: 50,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Prevents index conflict with null values
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    image: {
      type: String,
      default: "",
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpiredAt: {
      type: Number,
      default: 0,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpiredAt: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
