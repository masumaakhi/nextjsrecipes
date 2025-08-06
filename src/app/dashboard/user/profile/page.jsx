// src/app/dashboard/user/profile/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    const fetchProfile = async () => {
      const res = await fetch(`/api/users/me/profile`);
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setStats(data.stats);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [session]);

  if (status === "loading" || loading) return <p className="text-center mt-20">Loading...</p>;
  if (!session) return <p className="text-center mt-20 text-red-600">Please log in</p>;
  if (!user) return <p className="text-center mt-20 text-red-600">User not found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-28 mb-8 px-4">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-10">
        <img
          src="/avater1.jpg"
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
          <p className="text-slate-600">{user.email}</p>
          <p className="text-sm text-slate-500 mt-1">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Recipe Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-xl shadow bg-white">
          <h3 className="text-xl font-bold text-slate-900">{stats.total}</h3>
          <p className="text-slate-600 text-sm">Total Recipes</p>
        </div>
        <div className="p-4 rounded-xl shadow bg-white">
          <h3 className="text-xl font-bold text-amber-600">{stats.pending}</h3>
          <p className="text-slate-600 text-sm">Pending</p>
        </div>
        <div className="p-4 rounded-xl shadow bg-white">
          <h3 className="text-xl font-bold text-green-600">{stats.approved}</h3>
          <p className="text-slate-600 text-sm">Approved</p>
        </div>
        <div className="p-4 rounded-xl shadow bg-white">
          <h3 className="text-xl font-bold text-red-600">{stats.rejected}</h3>
          <p className="text-slate-600 text-sm">Rejected</p>
        </div>
      </div>
    </div>
  );
}
