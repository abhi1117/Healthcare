"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handlSubmit = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("login/api/authentication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      const passEmail = data.data?.email; // Use optional chaining to safely access the property
      console.log(passEmail);

      // Check the response status
      // if response has error
      if (response.status === 404) {
        setIsLoading(false);
        setError("Email id or password is incorrect");
      }

      // if role is superadmin
      else if ((response.status === 200 || 201) && data.role === "superadmin") {
        console.log(data.role);
        router.push(
          `/superadmin?email=${encodeURIComponent(JSON.stringify(passEmail))}`
        );
      }

      // if role is admin
      else if ((response.status === 200 || 201) && data.role === "admin") {
        router.push(
          `/admin?email=${encodeURIComponent(JSON.stringify(passEmail))}`
        );
      }

      // If role is doctor
      if (data.role === "doctor") {
        // Check if secretKey exists
        if (data.data?.secretKey) {
          const secretKey = data.data.secretKey;

          // Navigate with both passEmail and secretKey
          router.push(
            `/doctor?email=${encodeURIComponent(
              passEmail
            )}&secretKey=${encodeURIComponent(secretKey)}`
          );
        } else if (response.status === 200 || response.status === 201) {
          // Navigate with just passEmail if secretKey doesn't exist
          router.push(`/doctor?email=${encodeURIComponent(passEmail)}`);
        }
      }

      // if role is patient
      else if ((response.status === 200 || 201) && data.role === "patient") {
        router.push(
          `/patient?email=${encodeURIComponent(JSON.stringify(passEmail))}`
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow-md hover:shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-black mb-6">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <div className="">
            {!isLogin && (
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Enter your name"
                />
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
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
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
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
            <button
              onClick={handlSubmit}
              type="submit"
              className="w-full bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600 transition"
            >
              {isLoading ? "Loading..." : isLogin ? "Login" : "Sign up"}

              {/* {isLogin ? "Login" : "Sign Up"} */}
            </button>
          </div>
          <h1 className="text-center text-sm text-gray-600 mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleForm}
              className="text-sky-600 hover:underline focus:outline-none"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </h1>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthPage;
