// src/app/components/CategoryList.jsx
import Link from "next/link";
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";

export const dynamic = "force-dynamic";

const fallbackImg = (name) =>
  `https://source.unsplash.com/featured/800x600?${encodeURIComponent(name)}`;

async function getPopularCategories() {
  await connectDb();

  const rows = await Recipe.aggregate([
    { $match: { status: "approved" } },
    {
      $project: {
        imageUrl: 1,
        likesCount: { $size: { $ifNull: ["$likes", []] } },
        pairs: {
          $concatArrays: [
            { $map: { input: { $ifNull: ["$category.cuisine", []] },   as: "v", in: { name: "$$v", group: "cuisine"   } } },
            { $map: { input: { $ifNull: ["$category.mealType", []] },  as: "v", in: { name: "$$v", group: "mealType" } } },
            { $map: { input: { $ifNull: ["$category.dietType", []] },  as: "v", in: { name: "$$v", group: "dietType" } } },
            { $map: { input: { $ifNull: ["$category.foodType", []] },  as: "v", in: { name: "$$v", group: "foodType" } } },
          ],
        },
      },
    },
    { $unwind: "$pairs" },
    { $match: { "pairs.name": { $type: "string", $ne: "" } } },
    { $sort: { likesCount: -1 } },
    {
      $group: {
        _id: "$pairs.name",
        doc:   { $first: "$$ROOT" },
        group: { $first: "$pairs.group" },
      },
    },
    { $project: { _id: 0, name: "$_id", group: 1, imageUrl: "$doc.imageUrl", likesCount: "$doc.likesCount" } },
    { $sort: { likesCount: -1, name: 1 } },
    { $limit: 6 },
  ]);

  return rows.map((r) => ({
    name: String(r.name).trim(),
    group: r.group,
    imageUrl: r.imageUrl || fallbackImg(r.name),
    likesCount: r.likesCount || 0,
  }));
}

export default async function CategoryList() {
  const categoriesWithTopRecipes = await getPopularCategories();

  return (
    <div className="max-w-[86rem] mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Popular Categories</h2>
        <Link href="/allcategory" className="text-[#681f28] no-underline text-lg hover:text-red-800 transition">
          View more →
        </Link>
      </div>

      {categoriesWithTopRecipes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categoriesWithTopRecipes.map((item) => (
            <div key={`${item.group}-${item.name}`} className="text-center">
              <Link
                href={`/category/${encodeURIComponent(item.name)}?group=${encodeURIComponent(item.group)}`}
                className="no-underline"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="sm:w-[8rem] sm:h-[8rem] w-[10rem] h-[10rem] object-cover rounded-full mx-auto transition-transform duration-500 hover:scale-105 shadow-md"
                  loading="lazy"
                />
                <p className="mt-4 text-xl font-medium text-gray-700 hover:text-[#681f28] transition cursor-pointer capitalize">
                  {item.name}
                </p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No categories found.</p>
      )}
    </div>
  );
}
