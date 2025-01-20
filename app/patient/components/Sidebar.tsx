import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [dropdownOpen3, setDropdownOpen3] = useState(false);
  const [dropdownOpen4, setDropdownOpen4] = useState(false);

  return (
    <div className="relative md:bottom-24 md:mt-2">
      {/* Sidebar for larger screens */}
      <div
        className={`h-screen fixed md:w-[17%] sm:w-[50%] w-[80%] p-4 shadow-lg hover:shadow-xl bg-white rounded-lg text-center overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "block" : "hidden"
        } md:block`}
      >
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden relative left-36 bottom-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
        )}
        <Link
          className="flex justify-center my-4"
          href={{
            pathname: "/patient",
          }}
        >
          <div className="flex flex-row items-center space-x-2 justify-center">
            <Image
              alt="IIT Logo"
              src="/iit_logo.jpg"
              className="h-12 w-auto md:h-10"
              width={600}
              height={600}
            />
            <Image
              alt="Charak Logo"
              src="/charak_logo.png"
              className="h-12 w-auto md:h-10"
              width={600}
              height={600}
            />
            <Image
              alt="Drishti Logo"
              src="/drishti_logo.png"
              className="h-12 w-auto md:h-10"
              width={600}
              height={600}
            />
          </div>
        </Link>

        <div className="flex flex-col justify-start items-start text-start text-gray-500 mt-20 ml-5 space-y-5">
          {/* Existing Buttons */}
          <div>
            <Link href="/patient/api/auth">
              <button className="text-md font-medium hover:text-gray-700 py-3 transition-all duration-300">
                Connect Google Fit
              </button>
            </Link>
          </div>
          <div>
            <Link href="/patient/view-doctors">
              <button className="  text-md font-medium hover:text-gray-700 py-3 transition-all duration-300">
                View Doctors
              </button>
            </Link>
          </div>

          {/* Access Health Data */}
          <div className=" max-sm:ml-14">
            <button
              onClick={() => setDropdownOpen1(!dropdownOpen1)}
              className="flex items-start text-md font-medium hover:text-gray-700 py-3 transition-all duration-300"
            >
              <span className="whitespace-nowrap">Access Health Data</span>
              <svg
                className={`w-5 h-5 ml-7 transition-transform duration-300 ${
                  dropdownOpen1 ? "rotate-180" : "rotate-0"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen1 && (
              <div className="absolute left-10 mt-2 ml-1 w-44 bg-white border border-gray-200 rounded shadow-md z-10">
                <Link href="/patient/option1">
                  <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Option 1
                  </p>
                </Link>
                <Link href="/patient/option2">
                  <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Option 2
                  </p>
                </Link>
                <Link href="/patient/option3">
                  <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Option 3
                  </p>
                </Link>
              </div>
            )}
          </div>

          {/* Digital Prescription */}
          <div className=" max-sm:ml-14">
            <button
              onClick={() => setDropdownOpen2(!dropdownOpen2)}
              className="flex items-center text-md font-medium hover:text-gray-700 py-3 transition-all duration-300"
            >
              <span className="whitespace-nowrap">Digital Prescription</span>
              <svg
                className={`w-5 h-5 ml-7 transition-transform duration-300 ${
                  dropdownOpen2 ? "rotate-180" : "rotate-0"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen2 && (
              <div className="absolute left-10 mt-2 ml-1 w-44 bg-white border border-gray-200 rounded shadow-md z-10">
                <Link href="/patient/option1">
                  <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Option 1
                  </p>
                </Link>
                <Link href="/patient/option2">
                  <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Option 2
                  </p>
                </Link>
                <Link href="/patient/option3">
                  <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Option 3
                  </p>
                </Link>
              </div>
            )}
          </div>

          {/* Edit Health Data */}
          <div className=" max-sm:ml-14">
            <button
              onClick={() => setDropdownOpen3(!dropdownOpen3)}
              className="flex items-center text-md font-medium hover:text-gray-700 py-3 transition-all duration-300"
            >
              <span className="whitespace-nowrap">Edit Health Data</span>
              <svg
                className={`w-5 h-5 ml-12 relative transition-transform duration-300 ${
                  dropdownOpen3 ? "rotate-180" : "rotate-0"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen3 && (
              <div className="absolute left-10 mt-2 ml-1 w-44 bg-white border border-gray-200 rounded shadow-md z-10">
                <Link href="/patient/option1">
                  <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Option 1
                  </p>
                </Link>
                <Link href="/patient/option2">
                  <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Option 2
                  </p>
                </Link>
                <Link href="/patient/option3">
                  <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Option 3
                  </p>
                </Link>
              </div>
            )}
          </div>

          {/* Diagnostic Tools */}
          <div className=" max-sm:ml-14">
            <button
              onClick={() => setDropdownOpen4(!dropdownOpen4)}
              className="flex items-center  text-md font-medium hover:text-gray-700 py-3 transition-all duration-300"
            >
              <span className="whitespace-nowrap"> Diagnostic Tools</span>
              <svg
                className={`w-5 h-5 ml-12 transition-transform duration-300 ${
                  dropdownOpen4 ? "rotate-180" : "rotate-0"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen4 && (
              <div className="absolute left-10 mt-2 ml-1 w-44 bg-white border border-gray-200 rounded shadow-md z-10">
                <Link href="/patient/option1">
                  <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Option 1
                  </p>
                </Link>
                <Link href="/patient/option2">
                  <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Option 2
                  </p>
                </Link>
                <Link href="/patient/option3">
                  <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Option 3
                  </p>
                </Link>
              </div>
            )}
          </div>
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
    </div>
  );
};

export default Sidebar;
