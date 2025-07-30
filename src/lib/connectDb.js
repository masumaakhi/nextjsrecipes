import mongoose from "mongoose";

mongoose.set("debug", true); // optionally move before

const connectDb = async () => {
	if (mongoose.connection.readyState === 1) {
		console.log("✅ MongoDB already connected");
		return;
	}

	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			dbName: "NextjsFoodRecipes", // optional but recommended
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("✅ MongoDB connected");
	} catch (err) {
		console.error("❌ MongoDB connection error:", err);
		throw err;
	}
};

export default connectDb;
