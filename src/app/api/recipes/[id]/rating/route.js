// // // // src/app/api/recipes/[id]/rating/route.js
// // // import connectDb from "@/lib/connectDb";
// // // import Recipe from "@/models/recipe";
// // // import { getServerSession } from "next-auth";
// // // import { authOptions } from "@/lib/auth";
// // // import { NextResponse } from "next/server";

// // // // Save or update a user's rating
// // // export async function PUT(req, { params }) {
// // //    const { id } = await params;
// // //   try {
// // //     await connectDb();
// // //     const session = await getServerSession(authOptions);
// // //     if (!session) {
// // //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// // //     }

// // //     const { value } = await req.json();
// // //     if (!value || value < 1 || value > 5) {
// // //       return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
// // //     }

// // //     const recipe = await Recipe.findById(params.id);
// // //     if (!recipe) {
// // //       return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
// // //     }

// // //     const userId = session.user.id;

// // //     // Add or update the user's rating
// // //     const existing = recipe.ratings.find((r) => {
// // //       const uid = r?.user ? (typeof r.user === "object" ? r.user._id : r.user) : null;
// // //       return uid && uid.toString() === userId;
// // //     });

// // //     if (existing) {
// // //       existing.value = value; // update
// // //     } else {
// // //       recipe.ratings.push({ user: userId, value }); // add
// // //     }

// // //     await recipe.save();

// // //     const ratings = recipe.ratings.filter(r => r?.user && r.value);
// // //     const total = ratings.length;
// // //     const average = ratings.reduce((sum, r) => sum + r.value, 0) / total;

// // //     return NextResponse.json({
// // //       success: true,
// // //       average: average.toFixed(1),
// // //       count: total,
// // //     });
// // //   } catch (err) {
// // //     console.error("PUT /rating error:", err);
// // //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// // //   }
// // // }

// // // // Get current user's rating and recipe average rating
// // // export async function GET(req, { params }) {
  
// // //   try {
// // //     await connectDb();
// // //      const { id } = await params;
// // //     const session = await getServerSession(authOptions);
// // //     if (!session)
// // //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// // //     const recipe = await Recipe.findById(params.id);
// // //     if (!recipe)
// // //       return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

// // //     const userId = session.user.id;
// // //     const ratings = recipe.ratings.filter(r => r?.user && r.value);

// // //     const userRating = ratings.find((r) => {
// // //       const uid = typeof r.user === "object" ? r.user._id : r.user;
// // //       return uid?.toString() === userId;
// // //     });

// // //     const total = ratings.length;
// // //     const avg =
// // //       total > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / total : 0;

// // //     return NextResponse.json({
// // //       rating: userRating?.value || 0,
// // //       average: avg.toFixed(1),
// // //       count: total,
// // //     });
// // //   } catch (err) {
// // //     console.error("GET /rating error:", err);
// // //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// // //   }
// // // }


// // import connectDb from "@/lib/connectDb";
// // import Recipe from "@/models/recipe";
// // import { getServerSession } from "next-auth";
// // import { authOptions } from "@/lib/auth";
// // import { NextResponse } from "next/server";

// // // Save or update a user's rating
// // export async function PUT(req, { params }) {
// //   const { id } = params;
// //   try {
// //     await connectDb();
// //     const session = await getServerSession(authOptions);
// //     if (!session) {
// //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //     }

// //     const { value } = await req.json();
// //     if (value && (value < 1 || value > 5)) {
// //       return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
// //     }

// //     const recipe = await Recipe.findById(params.id);
// //     if (!recipe) {
// //       return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
// //     }

// //     const userId = session.user.id;

// //     // Add or update the user's rating
// //     let existingRating = recipe.ratings.find(
// //       (r) => r.user?.toString() === userId
// //     );

// //     if (value === 0) {
// //       // Logic for clearing the rating
// //       if (existingRating) {
// //         recipe.ratings.pull({ _id: existingRating._id });
// //       }
// //     } else {
// //       if (existingRating) {
// //         existingRating.value = value; // update
// //       } else {
// //         recipe.ratings.push({ user: userId, value }); // add
// //       }
// //     }

// //     await recipe.save();

// //     const ratings = recipe.ratings.filter((r) => r?.user && r.value);
// //     const total = ratings.length;
// //     // Prevent division by zero to avoid NaN
// //     const average = total > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / total : 0;

// //     return NextResponse.json({
// //       success: true,
// //       average: average.toFixed(1),
// //       count: total,
// //     });
// //   } catch (err) {
// //     console.error("PUT /rating error:", err);
// //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// //   }
// // }

// // // Get current user's rating and recipe average rating
// // export async function GET(req, { params }) {
// //   const { id } = params;
// //   try {
// //     await connectDb();
// //     const session = await getServerSession(authOptions);

// //     const recipe = await Recipe.findById(params.id);
// //     if (!recipe)
// //       return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

// //     const ratings = recipe.ratings.filter((r) => r?.user && r.value);
// //     const total = ratings.length;
// //     const avg = total > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / total : 0;
    
// //     let userRating = 0;
// //     if (session) {
// //       const userId = session.user.id;
// //       const existing = ratings.find((r) => r.user?.toString() === userId);
// //       if (existing) {
// //         userRating = existing.value;
// //       }
// //     }

// //     return NextResponse.json({
// //       userRating: userRating, // Renamed for clarity
// //       average: avg.toFixed(1),
// //       count: total,
// //     });
// //   } catch (err) {
// //     console.error("GET /rating error:", err);
// //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// //   }
// // }


// // src/app/api/recipes/[id]/rating/route.js

// import connectDb from "@/lib/connectDb";
// import Recipe from "@/models/recipe";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { NextResponse } from "next/server";

// // PUT — Save or Update user rating
// export async function PUT(req, { params }) {
//   const { id } = params;
//   try {
//     await connectDb();
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { value } = await req.json();
//     if (!value || value < 1 || value > 5) {
//       return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
//     }

//     const recipe = await Recipe.findById(id);
//     if (!recipe) {
//       return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
//     }

//     const userId = session.user.id;
//     const existingRating = recipe.ratings.find((r) => {
//       const uid = typeof r.user === "object" ? r.user._id : r.user;
//       return uid?.toString() === userId;
//     });

//     if (existingRating) {
//       existingRating.value = value;
//     } else {
//       recipe.ratings.push({ user: userId, value });
//     }

//     await recipe.save();

//     const ratings = recipe.ratings.filter((r) => r?.user && r.value);
//     const total = ratings.length;
//     const average =
//       total > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / total : 0;

//     return NextResponse.json({
//       success: true,
//       average: average.toFixed(1),
//       count: total,
//     });
//   } catch (err) {
//     console.error("PUT /rating error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// // GET — Get current user rating & average rating
// export async function GET(req, { params }) {
//   const { id } = params;
//   const recipeId = id;
//   try {
//     await connectDb();
//     const session = await getServerSession(authOptions);
//     if (!session)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const recipe = await Recipe.findById(id);
//     if (!recipe)
//       return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

//     const userId = session.user.id;
//     const ratings = recipe.ratings.filter((r) => r?.user && r.value);

//     const userRating = ratings.find((r) => {
//       const uid = typeof r.user === "object" ? r.user._id : r.user;
//       return uid?.toString() === userId;
//     });

//     const total = ratings.length;
//     const average =
//       total > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / total : 0;

//     return NextResponse.json({
//       success: true,
//   rating: userRating?.value || 0,
//   average: avg.toFixed(1),
//   count: total,
//     });
//   } catch (err) {
//     console.error("GET /rating error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


// ✅ /src/app/api/recipes/[id]/rating/route.js
import { NextResponse } from 'next/server';
import connectDb from '@/lib/connectDb';
import Recipe from '@/models/recipe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(req, { params }) {
  await connectDb();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const recipeId = params.id;
  const { value } = await req.json(); // ⭐⭐ comes from body
  const userId = session.user._id;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 });
    }

    const existing = recipe.ratings.find(r => r.user.toString() === userId.toString());

    if (existing) {
      existing.value = value; // update old rating
    } else {
      recipe.ratings.push({ user: userId, value }); // new rating
    }

    await recipe.save();

    // Calculate average and count
    const total = recipe.ratings.reduce((sum, r) => sum + r.value, 0);
    const count = recipe.ratings.length;
    const average = count ? total / count : 0;

    return NextResponse.json({
      success: true,
      average: average.toFixed(1),
      count,
      rating: value,
    });

  } catch (error) {
    console.error("Rating API Error:", error); // 👈 log this!
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  await connectDb();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || session?.user?._id;

  try {
    const recipe = await Recipe.findById(params.id);
    if (!recipe) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });

    const ratings = recipe.ratings;
    const total = ratings.length;
    const avg = total > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / total : 0;
    const userRating = ratings.find((r) => r.user.toString() === userId);

    return NextResponse.json({
      rating: userRating?.value || 0,
      average: avg.toFixed(1),
      count: total,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}