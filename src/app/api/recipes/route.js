//src/app/api/recipes/route.js

import { NextResponse } from 'next/server';
import connectDb from '@/lib/connectDb';
import Recipe from '@/models/recipe';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



export async function POST(req) {
  await connectDb();
  const session = await getServerSession(authOptions);
  const userId = session?.user?._id;
  const userRole = session?.user?.role;

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();

    const recipe = await Recipe.create({
      ...data,
      createdBy: userId,
      status: userRole === "admin" ? "approved" : "pending", // ✅ Only admin auto-approves
    });

    return NextResponse.json({ success: true, recipe });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}


export async function DELETE(req) {
  await connectDb();

  try {
    const { id } = await req.json();
    const recipe = await Recipe.findByIdAndDelete(id);
    return NextResponse.json({ success: true, recipe });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function PUT(req) {
  await connectDb();

  try {
    const { id, data } = await req.json();
    const recipe = await Recipe.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ success: true, recipe });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}



// export async function GET(req) {
//   await connectDb();

//   const url = new URL(req.url);
//   const status = url.searchParams.get("status"); // ✅ read ?status=pending

//   try {
//     const filter = status ? { status } : {};
//     const recipes = await Recipe.find(filter).populate("createdBy", "name");
//     return NextResponse.json({ success: true, recipes });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }

// export async function GET(req) {
//   await connectDb();

//   const url = new URL(req.url);
//   const params = url.searchParams;
//   const status = url.searchParams.get("status"); // ✅ read ?status=pending 
//   const filter = { status: "approved" };

 
//   // 🔍 Search keyword from ?search=
//   const search = params.get("search");
//   if (search) {
//     filter.$or = [
//       { title: { $regex: search, $options: "i" } },
//       { description: { $regex: search, $options: "i" } },
//       { ingredients: { $regex: search, $options: "i" } },
//     ];
//   }

//   // 🍽️ Other filters
//   if (params.get("cuisine")) filter["category.cuisine"] = params.get("cuisine");
//   if (params.get("dietType")) filter["category.dietType"] = params.get("dietType");
//   if (params.get("foodType")) filter["category.foodType"] = params.get("foodType");

//   const minCookTime = Number(params.get("minCookTime") || 0);
//   const maxCookTime = Number(params.get("maxCookTime") || 120);
//   const minServings = Number(params.get("minServings") || 1);
//   const maxServings = Number(params.get("maxServings") || 10);

//   filter.cookTime = { $gte: minCookTime, $lte: maxCookTime };
//   filter.servings = { $gte: minServings, $lte: maxServings };

//   try {
//     const recipes = await Recipe.find(filter).populate("createdBy", "name");
//     return NextResponse.json({ success: true, recipes });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }

export async function GET(req) {
  await connectDb();

  const url = new URL(req.url);
  const params = url.searchParams;
  const status = url.searchParams.get("status"); // ✅ read ?status=pending 
  const filter = { status: "approved" }; // ✅ default fallback

  // ✅ override if query includes custom status
  if (status) filter.status = status;

  // 🔍 Search keyword from ?search=
  const search = params.get("search");
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { ingredients: { $regex: search, $options: "i" } },
    ];
  }

  // 🍽️ Other filters
  if (params.get("cuisine")) filter["category.cuisine"] = params.get("cuisine");
  if (params.get("dietType")) filter["category.dietType"] = params.get("dietType");
  if (params.get("foodType")) filter["category.foodType"] = params.get("foodType");

  const minCookTime = Number(params.get("minCookTime") || 0);
  const maxCookTime = Number(params.get("maxCookTime") || 120);
  const minServings = Number(params.get("minServings") || 1);
  const maxServings = Number(params.get("maxServings") || 10);

  filter.cookTime = { $gte: minCookTime, $lte: maxCookTime };
  filter.servings = { $gte: minServings, $lte: maxServings };

  try {
    const recipes = await Recipe.find(filter).populate("createdBy", "name");
    return NextResponse.json({ success: true, recipes });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


export async function PATCH(req) {
  await connectDb();

  try {
    const { id, status } = await req.json();
    const session = await getServerSession(authOptions);
const user = session?.user;

if (!user || user.role !== "admin") {
  return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
}

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    const updated = await Recipe.findByIdAndUpdate(id, { status }, { new: true });

    return NextResponse.json({ success: true, recipe: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// export async function POST(req) {
//   await connectDb();

//   const session = await getServerSession(authOptions);
//   const userId = session?.user?._id;
//   const userRole = session?.user?.role;

//   if (!userId) {
//     return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const data = await req.json();

//     const recipe = await Recipe.create({
//       ...data,
//       createdBy: userId,
//       status: userRole === "admin" ? "approved" : "pending",
//     });

//     return NextResponse.json({ success: true, recipe });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message }, { status: 400 });
//   }
// }

