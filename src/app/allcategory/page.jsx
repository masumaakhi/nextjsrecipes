// src/app/allcategory/page.jsx
import Link from "next/link";
import connectDb from "@/lib/connectDb";
import Recipe from "@/models/recipe";

export const dynamic = "force-dynamic";

/** নাম অনুযায়ী একটা fallback টপিক ইমেজ */
const fallbackImg = (name) =>
  `https://source.unsplash.com/featured/800x600?${encodeURIComponent(name)}`;

/**
 * একটি গ্রুপ (cuisine/mealType/dietType/foodType) থেকে
 * ইউনিক ক্যাটাগরি নাম ও একটি রিপ্রেজেন্টেটিভ ইমেজ বের করে আনে।
 * Aggregation ব্যবহার করায় কম কুয়েরি লাগে।
 */
async function getCategoryCards(group) {
  await connectDb();

  const path = `category.${group}`;

  const rows = await Recipe.aggregate([
    { $match: { status: "approved" } },
    { $unwind: { path: `$${path}`, preserveNullAndEmptyArrays: false } },
    // খালি স্ট্রিং ফিল্টার
    { $match: { [path]: { $type: "string", $ne: "" } } },
    // নামভিত্তিক গ্রুপ; প্রথম ইমেজ ধরে নিই
    { $group: { _id: `$${path}`, imageUrl: { $first: "$imageUrl" } } },
    // আউটপুট শেপ
    { $project: { _id: 0, name: "$_id", imageUrl: 1 } },
    // নাম অনুযায়ী sort
    { $sort: { name: 1 } },
  ]);

  // ইমেজ মিসিং হলে fallback বসাই
  return rows.map((r) => ({
    name: String(r.name).trim(),
    imageUrl: r.imageUrl || fallbackImg(r.name),
  }));
}

/** সেকশন কম্পোনেন্ট: খালি হলে শুধু শিরোনাম দেখাবে */
function Section({ title, items, group }) {
  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-slate-900 mb-4">{title}</h2>

      {hasItems && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((cat) => (
            <Link
              href={`/category/${encodeURIComponent(cat.name)}?group=${group}`}
              key={`${group}-${cat.name}`}
              className="block bg-white rounded-xl shadow hover:shadow-lg transition duration-300"
            >
              <div className="overflow-hidden rounded-t-xl">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-700 capitalize">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function AllCategoriesPage() {
  const [cuisine, mealType, dietType, foodType] = await Promise.all([
    getCategoryCards("cuisine"),
    getCategoryCards("mealType"),
    getCategoryCards("dietType"),
    getCategoryCards("foodType"),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        🍽️ All Categories
      </h2>

      <Section title="Cuisines" items={cuisine} group="cuisine" />
      <Section title="Meal Types" items={mealType} group="mealType" />
      <Section title="Diet Types" items={dietType} group="dietType" />
      <Section title="Food Types" items={foodType} group="foodType" />
    </div>
  );
}
