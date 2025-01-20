"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const [name, setName] = useState("");
  const [abhaId, setAbhaId] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const fetchEmail = searchParams.get("email");
  const cleanedEmail = fetchEmail?.replace(/"/g, "");

  const handlSubmit = async () => {
    try {
      setIsLoading(true); // Set loading to true at the start

      const response = await fetch("/admin/api/register-patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          abhaId,
          age,
          gender,
          height,
          weight,
          phoneNumber,
          city,
          state,
          zip,
          country,
          cleanedEmail,
        }),
      });

      const data = await response.json();

      if (response.status === 404) {
        setError("Admin not exists");
        setSuccess("");
      } else if (response.status === 409) {
        setError(`${data.data.role} already exists`);
        setSuccess("");
      } else if (response.status === 201) {
        setSuccess("User has been successfully registered");
        setError("");
        resetFormFields(); // Clear the form fields
      } else {
        setError("Unexpected error occurred");
        setSuccess("");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to create user");
      setSuccess("");
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  // Helper function to reset form fields
  const resetFormFields = () => {
    setName("");
    setAge("");
    setGender("");
    setHeight("");
    setWeight("");
    setCity("");
    setState("");
    setZip("");
    setCountry("");
    setPhoneNumber("");
    setAbhaId("");
  };

  return (
    <div>
      <Navbar data={cleanedEmail || ""} />
      <Sidebar data={cleanedEmail || ""} />
      <div className="flex items-center justify-center my-16 px-4">
        <div className="bg-white shadow-md hover:shadow-lg rounded-lg p-6 sm:p-8 w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
          <h2 className="text-2xl font-bold text-center text-black mb-6">
            Register Patient
          </h2>
          <div>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                type="text"
                id="name"
                className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Abha Id */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                ABHA ID
              </label>
              <input
                value={abhaId}
                onChange={(e) => {
                  setAbhaId(e.target.value);
                }}
                type="number"
                id="abha id"
                className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your ABHA ID"
              />
            </div>

            {/* Age */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Age
              </label>
              <input
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                }}
                type="number"
                id="age"
                className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your age"
              />
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Height */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Height
              </label>
              <input
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                }}
                type="number"
                id="height"
                className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your height in cm"
              />
            </div>

            {/* Weight */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Weight
              </label>
              <input
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                }}
                type="number"
                id="weight"
                className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your weight in kg"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Phone Number
              </label>
              <input
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

            {/* City */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                City
              </label>
              <input
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                type="text"
                id="city"
                className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your city"
              />
            </div>

            {/* State */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                State
              </label>
              <input
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                }}
                type="text"
                id="state"
                className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your state"
              />
            </div>

            {/* Zip */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Zip
              </label>
              <input
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value);
                }}
                type="text"
                id="zip"
                className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your zip code"
              />
            </div>

            {/* Country */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Country
              </label>
              <input
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                }}
                type="text"
                id="country"
                className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your country"
              />
            </div>

            <button
              onClick={handlSubmit}
              type="submit"
              className="w-full bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600 transition"
            >
              {isLoading ? "Loading..." : "Register"}
            </button>
          </div>
          <h1 className="text-center text-sm text-gray-600">
            <button className="text-sky-600 hover:underline focus:outline-none"></button>
            {error && <p className="text-red-500 text-lg">{error}</p>}
            {success && <p className=" text-green-500 text-lg">{success}</p>}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Page;
