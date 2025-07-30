// // app/dashboard/page.jsx (for both user/admin)

// import React from "react";
// import Link from "next/link";
// import { FaUser, FaUtensils, FaCheckCircle, FaClock, FaEdit, FaTrash, FaTags } from "react-icons/fa";

// const Dashboard = ({ isAdmin }) => {
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <h1 className="text-3xl font-bold mb-6">{isAdmin ? "Admin" : "User"} Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//         {!isAdmin ? (
//           <>
//             <DashboardCard title="My Recipes" icon={<FaUtensils />} link="/dashboard/my-recipes" />
//             <DashboardCard title="Add New Recipe" icon={<FaEdit />} link="/dashboard/add-recipe" />
//             <DashboardCard title="Profile Settings" icon={<FaUser />} link="/dashboard/profile" />
//           </>
//         ) : (
//           <>
//             <DashboardCard title="Pending Recipes" icon={<FaClock />} link="/admin/pending-recipes" />
//             <DashboardCard title="Manage Recipes" icon={<FaCheckCircle />} link="/admin/all-recipes" />
//             <DashboardCard title="Users" icon={<FaUser />} link="/admin/users" />
//             <DashboardCard title="Categories" icon={<FaTags />} link="/admin/categories" />
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// const DashboardCard = ({ title, icon, link }) => (
//   <Link
//     href={link}
//     className="flex items-center gap-4 p-5 bg-white rounded-xl shadow hover:shadow-md transition"
//   >
//     <span className="text-2xl text-orange-500">{icon}</span>
//     <h2 className="text-lg font-semibold">{title}</h2>
//   </Link>
// );

// export default Dashboard;

"use client"
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (data.user.role === "admin") {
        router.replace("/dashboard/admin");
      } else {
        router.replace("/dashboard/user");
      }
    }
  }, [data, status, router]);

  return <p>Redirecting...</p>;
}