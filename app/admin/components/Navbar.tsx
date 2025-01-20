"use client";

import Link from "next/link";
import React, { useState } from "react";

const Navbar = ({ data }: { data: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white shadow-lg py-4 px-6 md:w-[80%] md:py-8 md:relative md:left-32 md:top-5 md:mx-auto rounded-md transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center space-x-8">
          <div className="text-center">
            <h1 className="text-sm text-gray-500">Active User:</h1>
            <h1 className="font-bold">{data}</h1>
          </div>
          <Link href="/">
            <button className="bg-sky-400 hover:bg-sky-300 py-2 px-4 text-white rounded transition-all duration-300">
              Log out
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4">
          <div className="text-center mb-4">
            <h1 className="text-sm text-gray-500">Active User:</h1>
            <h1 className="font-bold">{data}</h1>
          </div>
          <Link href="/">
            <button className="w-full bg-sky-500 hover:bg-sky-400 py-2 px-4 text-white rounded-lg transition-all duration-300">
              Log out
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
