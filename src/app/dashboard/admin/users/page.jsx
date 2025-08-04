//src/app/dashboard/admin/users/page.jsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function UsersTable() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch("/api/users"); // or fetch all
            const data = await res.json();
            if (data.success) setUsers(data.users);
        };

        fetchUsers();
    }, []);

    return (
        <div className="max-w-5xl rounded-xl shadow-md bg-opacity-70 backdrop-blur pb-2.5  mx-auto mt-24 mb-8 px-4">
            <h2 className="text-3xl font-bold mb-6 text-slate-950 text-center">Users</h2>
            <div className="overflow-x-auto  bg-opacity-70 backdrop-blur">
                <table className="w-full text-md text-left text-gray-500 py-4 ">
                    <thead className="text-md border-b text-gray-700 uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className=" border-b">
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap"
                                 >
                                    {user.name}
                                </th>
                                <td className="px-6 py-4 text-slate-800">{user.email}</td>
                                <td className="px-6 py-4 text-slate-800">{user.role}</td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/dashboard/admin/users/${user._id}`}
                                        className="text-blue-600 text-center text-md hover:text-blue-800 hover:underline"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}