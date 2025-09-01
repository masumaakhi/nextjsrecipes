// src/app/components/CategoryList.jsx
import Link from "next/link";
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";
import { unstable_noStore as noStore } from "next/cache";

const fallbackImg = (name) =>
  `https://source.unsplash.com/featured/800x600?${encodeURIComponent(name)}`;

// শুধু FOOD TYPE ধরার জন্য আপডেটেড কুয়েরি
async function getPopularFoodTypes() {
  noStore();               // ⬅️ ক্যাশিং অফ (কম্পোনেন্ট লেভেল)
  await connectDb();

  const rows = await Recipe.aggregate([
    { $match: { status: "approved" } }, // চাইলে এটা বাদ দাও
    {
      $addFields: {
        likesCount: { $size: { $ifNull: ["$likes", []] } },
      },
    },
    // foodType ফ্ল্যাট করা
    {
      $unwind: {
        path: "$category.foodType",
        preserveNullAndEmptyArrays: false,
      },
    },
    { $match: { "category.foodType": { $type: "string", $ne: "" } } },
    // বেশি লাইকড রেসিপি আগে, প্রতিটি foodType-এর প্রথমটাকে নাও
    { $sort: { likesCount: -1 } },
    {
      $group: {
        _id: "$category.foodType",
        imageUrl: { $first: "$imageUrl" },
        likesCount: { $first: "$likesCount" },
      },
    },
    { $project: { _id: 0, name: "$_id", imageUrl: 1, likesCount: 1 } },
    { $sort: { likesCount: -1, name: 1 } },
    { $limit: 6 }, // চাইলে বাড়াও/সরাও
  ]);

  return rows.map((r) => ({
    name: String(r.name).trim(),
    imageUrl: r.imageUrl || fallbackImg(r.name),
    likesCount: r.likesCount || 0,
  }));
}

export default async function CategoryList() {
  const items = await getPopularFoodTypes();

  return (
    <div className="max-w-[86rem] mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Popular Food Types</h2>
        <Link
          href="/allcategory"
          className="text-[#681f28] no-underline text-lg hover:text-red-800 transition"
        >
          View more →
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {items.map((item) => (
            <div key={item.name} className="text-center">
              <Link
                href={`/category/${encodeURIComponent(item.name)}?group=foodType`}
                className="no-underline"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  className="sm:w-[8rem] sm:h-[8rem] w-[10rem] h-[10rem] object-cover rounded-full mx-auto transition-transform duration-500 hover:scale-105 shadow-md"
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
