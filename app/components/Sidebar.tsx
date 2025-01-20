"use client";

import Link from "next/link";
import React, { useState } from "react";
import logo from "@/public/logo.png";
import Image from "next/image";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative md:bottom-12 md:mt-1">
      {/* Sidebar for larger screens */}
      <div
        className={`h-screen fixed w-[15%] p-4 shadow-lg hover:shadow-xl bg-white rounded-lg text-center overflow-hidden ml-6 transition-all duration-300 ease-in-out ${
          isOpen ? "block" : "hidden"
        } md:block`}
      >
        {/* Logo */}
        <Link
          className="flex justify-center my-4"
          href={{
            pathname: "/admin",
          }}
        >
          <Image
            src={logo}
            alt="Drishti Logo"
            className="w-full"
            width={300}
            height={300}
          />
        </Link>

        <div className="mt-20">
          {/* <div>
            <Link
              href={{
                pathname: "/admin/register-user",
              }}
            >
              <button className="bg-sky-400 text-white text-md font-medium py-3 px-5 rounded shadow-md hover:bg-sky-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300">
                Register User
              </button>
            </Link>
          </div> */}
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <div className="flex md:hidden ml-4 mt-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed top-0 left-0 z-10 w-full h-full bg-gray-800 bg-opacity-50 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="h-full w-4/5 bg-white p-4 shadow-lg relative">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          {/* Sidebar Content for Mobile */}
          <div className="text-center mt-8 mb-12">
            {/* Logo */}
            <Link
              className="flex justify-center my-4 mb-12"
              href={{
                pathname: "/admin",
              }}
            >
              <Image
                src={logo}
                alt="Drishti Logo"
                className=""
                width={140}
                height={140}
              />
            </Link>

            {/* Register Admin */}
            <div>
              <Link
                href={{
                  pathname: "/admin/register-user",
                }}
              >
                <button className="bg-sky-400 text-white text-lg font-medium py-4 px-6 rounded-lg shadow-md hover:bg-sky-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300">
                  Register User
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
