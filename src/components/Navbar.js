"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    router.push("/signin");
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Keith's Gown Rental</h1>

        {/* Hamburger Button for Mobile */}
        <button
          className="block md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {/* Hamburger Icon */}
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <button
            onClick={handleSignOut}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Menu (Slide Down) */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-white text-blue-600 shadow-lg rounded-lg p-4">
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
