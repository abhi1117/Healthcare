"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll event
  const handleScroll = () => {
    if (window.scrollY > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  // Add and clean up event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Toggle the menu visibility
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 mx-auto flex items-center justify-between px-12 animate-slideIn ${
        scrolled ? "mt-0 py-5" : "mt-2 py-6"
      } shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out z-50 bg-white`}
    >
      {" "}
      {/* Logo at the start for small screens and centered for larger screens */}
      <div className="flex justify-start items-start max-sm:w-full  ">
        <Link href="/" className="flex items-center">
          <div className="flex flex-wrap items-center space-x-2 mb-2 md:mb-0">
            <Image
              alt="IIT Logo"
              src="/iit_logo.jpg"
              className="h-12 w-auto md:h-10"
              width={200}
              height={200}
            />
            <Image
              alt="Charak Logo"
              src="/charak_logo.png"
              className="h-12 w-auto md:h-10"
              width={200}
              height={200}
            />
            <Image
              alt="Drishti Logo"
              src="/drishti_logo.png"
              className="h-12 w-auto md:h-10"
              width={200}
              height={200}
            />
          </div>
        </Link>
      </div>
      {/* Hamburger Menu for smaller screens */}
      <div className="md:hidden flex items-center ml-auto">
        <button
          onClick={handleMenuToggle}
          className="text-gray-500 hover:text-black focus:outline-none"
          aria-label="Toggle navigation"
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
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      {/* Drop down menu for Large/Medium Screens */}
      <div className="hidden md:flex space-x-10 md:relative">
        <div className="relative">
          <button className="relative text-gray-500 hover:text-black text-lg after:content-[''] after:block after:w-full after:h-0.5 after:bg-sky-500 after:absolute after:bottom-0 after:left-0 after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out after:translate-y-2">
            About
          </button>
        </div>
        <button className="relative text-gray-500 hover:text-black text-lg after:content-[''] after:block after:w-full after:h-0.5 after:bg-sky-500 after:absolute after:bottom-0 after:left-0 after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out after:translate-y-2">
          Services
        </button>
        <button className="relative text-gray-500 hover:text-black text-lg after:content-[''] after:block after:w-full after:h-0.5 after:bg-sky-500 after:absolute after:bottom-0 after:left-0 after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out after:translate-y-2">
          Application Areas
        </button>
        <button className="relative text-gray-500 hover:text-black text-lg after:content-[''] after:block after:w-full after:h-0.5 after:bg-sky-500 after:absolute after:bottom-0 after:left-0 after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out after:translate-y-2">
          Contact
        </button>{" "}
      </div>
      {/* Dropdown Menu for smaller screens */}
      <div
        className={`absolute top-24 mt-2 left-0 bg-white shadow-2xl w-full z-50 ${
          isMenuOpen ? "block opacity-100 max-h-screen" : "max-h-0 opacity-0"
        } transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="md:hidden space-y-4 shadow-lg z-50">
          <div className="flex flex-col space-y-4 mt-3">
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/services"
              className="block w-full text-center text-gray-600 hover:text-black text-lg"
            >
              About
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/about"
              className="block w-full text-center text-gray-600 hover:text-black text-lg"
            >
              Services
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/about"
              className="block w-full text-center text-gray-600 hover:text-black text-lg"
            >
              Application Areas
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/about"
              className="block w-full text-center text-gray-600 hover:text-black text-lg pb-4"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
