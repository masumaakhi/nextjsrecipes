"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, UserCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
// import navigation from "next/navigation";

const Nav = () => {
  const { data } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuDropdown, setMobileMenuDropdown] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null); // NEW for mobile
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/recipes?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Recipes", href: "/recipes" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Add Blog", href: "/addblog" },
  ];
  useEffect(() => {
    console.log("Session data:", data);
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }

      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setMobileMenuDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const userRoutes =
    data?.user?.role === "user"
      ? [
          { label: "My Recipes", href: "/dashboard/user/myrecipes" },
          { label: "Profile", href: "/dashboard/user/profile" },
          { label: "Favorites", href: "/dashboard/user/favorites" },
        ]
      : [];

  const adminRoutes =
    data?.user?.role === "admin"
      ? [
          { label: "Admin Dashboard", href: "/dashboard/admin/admindashboard" },
          { label: "Manage Users", href: "/dashboard/admin/users" },
          { label: "Manage Recipes", href: "/dashboard/admin/recipes" },
          { label: "Pending Recipes", href: "/dashboard/admin/pendingrecipes" },
          { label: "Manage Blogs", href: "/dashboard/admin/blogs" },
          { label: "Pending Blogs", href: "/dashboard/admin/pendingsblogs" },
          { label: "Manage Reviews", href: "/dashboard/admin/reviews" },
          { label: "Manage Comments", href: "/dashboard/admin/comments" },
          { label: "Manage Categories", href: "/dashboard/admin/categories" },
          { label: "Analytics", href: "/dashboard/admin/analytics" },
        ]
      : [];

  const authRoutes = [
    { label: "Login", href: "/auth/signin" },
    { label: "Signup", href: "/auth/signup" },
  ];

  // Handle outside click for desktop dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-opacity-70 shadow-lg backdrop-blur-md pt-1 z-50">
      <div className="xs:max-w-[40rem] max-w-[83rem] mx-auto flex justify-between items-center px-4 py-[0.3rem]">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo513.svg" alt="Logo" width={60} height={60} />
        </Link>

        {/* 🔍 Search Field */}
        <form onSubmit={handleSearch} className="flex  items-center gap-2">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-2 border border-slate-600 text-black rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black p-2 rounded-md hover:bg-gray-200 transition"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8 text-lg items-center text-slate-700">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href}>
                  <span className="hover:text-orange-500 cursor-pointer transition">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}

            {data?.user ? (
              <li className="relative" ref={dropdownRef}>
                {/* Profile icon */}
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="cursor-pointer"
                >
                  {data.user.image ? (
                    <Image
                      src={data.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <UserCircle2 className="w-7 h-7 hover:text-orange-500" />
                  )}
                </div>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md z-50">
                    <ul className="py-2">
                      {userRoutes.concat(adminRoutes).map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="block px-4 py-2 hover:bg-gray-100"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            ) : (
              authRoutes.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>
                    <span className="hover:text-orange-500 cursor-pointer transition">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </nav>

        {/* Mobile menu icon */}
        <div className="md:hidden">
          {menuOpen ? (
            <X className="w-6 h-6" onClick={() => setMenuOpen(false)} />
          ) : (
            <Menu className="w-6 h-6" onClick={() => setMenuOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col text-[1.2rem] bg-opacity-70 shadow-lg backdrop-blur-md px-4 pb-4 pt-2">
          <ul className="space-y-4 text-lg">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-orange-500 transition cursor-pointer"
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {data?.user ? (
              <>
                <li
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setMobileMenuDropdown(!mobileMenuDropdown)}
                >
                  <div className="flex items-center space-x-2">
                    {data.user.image ? (
                      <Image
                        src={data.user.image}
                        alt="Profile"
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                    ) : (
                      <UserCircle2 className="w-7 h-7" />
                    )}
                  </div>
                </li>

                {mobileMenuDropdown && (
                  <div ref={mobileDropdownRef}>
                    {(data.user.role === "admin"
                      ? adminRoutes
                      : userRoutes
                    ).map((item) => (
                      <li key={item.label} className="pl-6">
                        <Link
                          href={item.href}
                          onClick={() => {
                            setMenuOpen(false);
                            setMobileMenuDropdown(false);
                          }}
                          className="hover:text-orange-500 block"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    <li className="pl-6">
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                          setMenuOpen(false);
                          setMobileMenuDropdown(false);
                        }}
                        className="text-red-500"
                      >
                        Logout
                      </button>
                    </li>
                  </div>
                )}
              </>
            ) : (
              authRoutes.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-orange-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Nav;
