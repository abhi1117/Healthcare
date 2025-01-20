"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Page = () => {
  const searchParams = useSearchParams();
  const rawData = searchParams.get("email");
  const data = rawData ? JSON.parse(rawData) : null;
  const [adminData, setAdminData] = useState<{
    totalPatients: {
      _id: string;
      name: string;
      abhaId: string;
      phoneNumber: string;
      gender: string;
    }[];
  }>({
    totalPatients: [],
  });
  const [filteredPatients, setFilteredPatients] = useState<
    {
      _id: string;
      name: string;
      abhaId: string;
      phoneNumber: string;
      gender: string;
    }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminDataParams = { email: data };
        const queryParams = new URLSearchParams(adminDataParams).toString();
        const response = await fetch(`/admin/api/fetch-users?${queryParams}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 404) {
          setError("Admin not found");
          return;
        }

        if (!response.ok) {
          setError("An error occurred while fetching data");
          return;
        }

        const fetchedData = await response.json();
        setAdminData(fetchedData.data);
        setFilteredPatients(fetchedData.data.totalPatients); // Initialize filtered patients
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, [data]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredPatients(
      adminData.totalPatients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(query) ||
          patient.abhaId.toLowerCase().includes(query) ||
          patient.phoneNumber.includes(query) ||
          patient.gender.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Navbar */}
      <Navbar data={data} />

      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Sidebar */}
        <Sidebar data={data} />

        {/* Main Content */}
        <div className="col-span-1 md:col-span-4 p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-700 my-6">
            Total Patients
          </h1>
          {error && <p className="text-red-600 font-semibold">{error}</p>}

          {/* Search Bar */}
          <div className="mb-4 relative w-1/2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search patients by name, ABHA ID, phone..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 absolute top-4 left-3 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.1-6.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
              />
            </svg>
          </div>

          {/* Patients Table */}
          {filteredPatients.length > 0 ? (
            <div className="overflow-x-auto mt-6">
              <table className="table-auto border-collapse border border-gray-300 w-full mt-4 shadow-lg rounded-lg bg-white">
                <thead className="bg-sky-400 text-white">
                  <tr>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      Name
                    </th>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      ABHA ID
                    </th>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      Phone Number
                    </th>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      Gender
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient, index) => (
                    <tr
                      key={patient._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="border border-gray-300 px-4 md:px-6 py-3">
                        {patient.name}
                      </td>
                      <td className="border border-gray-300 px-4 md:px-6 py-3">
                        {patient.abhaId}
                      </td>
                      <td className="border border-gray-300 px-4 md:px-6 py-3">
                        {patient.phoneNumber}
                      </td>
                      <td className="border border-gray-300 px-4 md:px-6 py-3">
                        {patient.gender}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 mt-6">No patients data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
