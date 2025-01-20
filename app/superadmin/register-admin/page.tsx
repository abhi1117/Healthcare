"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useSearchParams } from "next/navigation";
import Sidebar from "../components/Sidebar";

// import Navbar from "./components/Navbar";

const RegisterAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const rawData = searchParams.get("data");
  const data = rawData ? JSON.parse(rawData) : null;

  const router = useRouter();

  const handlSubmit = async () => {
    setIsLoading(true);

    if (!name || !email || !password || !phoneNumber) {
      setError("Please enter email and password");
      return;
    }

    try {
      const response = await fetch("/superadmin/api/register-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phoneNumber, data }),
      });
      if (response.status === 409) {
        setIsLoading(false);
        setError("Admin already exists");
      } else if (response.status === 200 || 201) {
        setIsLoading(false);
        setSuccess("Admin registered successfully");
        setName("");
        setEmail("");
        setPassword("");
        setPhoneNumber("");
        router.push(
          `/superadmin?email=${encodeURIComponent(JSON.stringify(data))}`
        );
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alert("An error occurred during login");
    }
  };

  return (
    <div>
      <Navbar data={data} />
      <Sidebar data={data} />
      <div className="min-h-screen flex items-center justify-center relative bottom-6 max-sm:bottom-36 z-0">
        <div className="bg-white shadow-md hover:shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-black mb-6">
            Admin Registration
          </h2>
          <div className="">
            {/* Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="name"
                className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                id="email"
                className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                id="password"
                className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your password"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Phone Number
              </label>
              <input
                required
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
                type="number"
                id="phone number"
                className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your phone number"
              />
            </div>
            <button
              onClick={handlSubmit}
              type="submit"
              className="w-full bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600 transition"
            >
              {isLoading ? "Loading" : "Submit"}
            </button>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            {success && (
              <p className="text-green-500 text-center mt-4">{success}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdmin;
