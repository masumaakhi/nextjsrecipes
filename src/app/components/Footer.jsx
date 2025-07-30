"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#f1f7f9] px-6 py-12">
      <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-2">
        {/* Share Your Recipes Section */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Share Your Recipes</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6 text-center">
            Share your culinary creativity with the world! Submit your own delicious recipes and join our growing foodie community.
          </p>
          <Link href="/addrecipes" className="inline-block lg:ml-[16rem] text-center bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors">
            Add Recipe
          </Link>
        </div>

        {/* Footer Links */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-around text-center gap-10 sm:gap-0">
          {/* Flavors & Feasts */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Flavors & Feasts</h3>
            <ul className="space-y-2 text-gray-700 text-center">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/services">Our Services</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/affiliate">Affiliate Program</Link></li>
            </ul>
          </div>

          {/* Get Help */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Get Help</h3>
            <ul className="space-y-2 text-gray-700 text-center">
              <li><Link href="/faq">FAQs</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/shipping">Shipping</Link></li>
              <li><Link href="/returns">Returns</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Follow Us</h3>
            <ul className="space-y-2 text-gray-700 text-center">
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>

      <hr className="mt-12 border-gray-300" />
      <p className="text-center text-gray-600 text-sm pt-6">
        © {new Date().getFullYear()} Flavors & Feasts. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
