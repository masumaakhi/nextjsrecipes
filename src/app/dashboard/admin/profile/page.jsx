"use client";

import { useEffect, useState } from "react";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/admin/profile", {
          method: "GET",
          credentials: "include", // ✅ ensure cookies/sessions go with the request
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          setError(errData.message || "Failed to load profile");
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data.success) {
          setAdmin(data.admin);
          setStats(data.stats);
        } else {
          setError(data.message || "Admin not found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-28 px-4">
      {/* Header */}
      <div className="flex items-center gap-6 mb-10">
        <img
          src="/avater1.jpg"
          alt="avater1.jpg"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{admin?.name}</h1>
          <p className="text-slate-800">{admin?.email}</p>
          <p className="text-sm text-slate-700">Role: {admin?.role}</p>
          <p className="text-sm text-slate-700">
            Joined: {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "N/A"}
          </p>
          <p className="text-sm text-slate-700">
            Last Login: {admin?.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 text-slate-600 lg:grid-cols-6 gap-4 text-center mb-10">
          <StatCard value={stats.totalUsers} label="Total Users" />
          <StatCard value={stats.totalRecipes} label="Total Recipes" />
          <StatCard value={stats.pending} label="Pending" color="text-amber-600" />
          <StatCard value={stats.approved} label="Approved" color="text-green-600" />
          <StatCard value={stats.rejected} label="Rejected" color="text-red-600" />
          <StatCard value={stats.totalFavorites} label="Total Favorites" color="text-purple-600" />
        </div>
      )}
    </div>
  );
}

function StatCard({ value, label, color }) {
  return (
    <div className="p-4 rounded-xl shadow bg-white">
      <h3 className={`text-xl font-bold ${color || "text-slate-900"}`}>{value}</h3>
      <p className="text-slate-600 text-sm">{label}</p>
    </div>
  );
}
