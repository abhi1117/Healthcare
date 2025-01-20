"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Link from "next/link";

const Page = () => {
  const searchParams = useSearchParams();
  const doctorEmail = searchParams.get("email");
  const cleanEmail = doctorEmail?.replace(/"/g, "");

  const secretKey = searchParams.get("secretKey");

  const [patientData, setPatientData] = useState<{
    totalPatients: {
      _id: string;
      name: string;
      age: number;
      phoneNumber: string;
      gender: string;
    }[];
  }>({
    totalPatients: [],
  });
  const [filteredData, setFilteredData] = useState(patientData.totalPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorDataParams = { email: cleanEmail ?? "" };
        const queryParams = new URLSearchParams(doctorDataParams).toString();
        const response = await fetch(
          `/doctor/api/view-patients?${queryParams}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 404) {
          setError("Doctor not found");
          return;
        }

        if (!response.ok) {
          setError("An error occurred while fetching data");
          return;
        }

        const fetchedData = await response.json();
        setPatientData(fetchedData.data);
        setFilteredData(fetchedData.data.totalPatients);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, [cleanEmail]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

    if (e.target.value.trim() === "") {
      setFilteredData(patientData.totalPatients);
    } else {
      const lowerCaseQuery = e.target.value.toLowerCase();
      setFilteredData(
        patientData.totalPatients.filter(
          (patient) =>
            patient.name.toLowerCase().includes(lowerCaseQuery) ||
            patient.phoneNumber.includes(lowerCaseQuery) ||
            patient.age.toString().includes(lowerCaseQuery) ||
            patient.gender.includes(lowerCaseQuery)
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Navbar */}
      <Navbar email={cleanEmail ?? ""} />

      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Sidebar */}
        <Sidebar email={cleanEmail ?? ""} secretKey={secretKey ?? ""} />

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
              placeholder="Search patients by name or phone number or age or gender..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={searchQuery}
              onChange={handleSearch}
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
          {filteredData.length > 0 ? (
            <div className="overflow-x-auto mt-6">
              <table className="table-auto border-collapse border border-gray-300 w-full mt-4 shadow-lg rounded-lg bg-white">
                <thead className="bg-sky-400 text-white">
                  <tr>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      Name
                    </th>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      Age
                    </th>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      Phone Number
                    </th>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      Gender
                    </th>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      Action
                    </th>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      History
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((patient, index) => (
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
                        {patient.age}
                      </td>
                      <td className="border border-gray-300 px-4 md:px-6 py-3">
                        {patient.phoneNumber}
                      </td>
                      <td className="border border-gray-300 px-4 md:px-6 py-3">
                        {patient.gender}
                      </td>
                      <td className="border border-gray-300 px-4 md:px-6 py-3">
                        <Link
                          href={{
                            pathname: "/doctor/available-tests",
                            query: {
                              email: JSON.stringify(cleanEmail),
                              patientId: patient._id,
                              secretKey: secretKey,
                            },
                          }}
                        >
                          <button className="text-blue-500 hover:underline">
                            Check Available Tests
                          </button>
                        </Link>
                      </td>
                      <td className="border border-gray-300 px-4 md:px-6 py-3">
                        <Link
                          href={{
                            pathname: "/doctor/view-patient-history",
                            query: {
                              email: JSON.stringify(cleanEmail),
                              patientId: patient._id,
                              secretKey: secretKey,
                            },
                          }}
                        >
                          <button className="text-blue-500 hover:underline">
                            View History
                          </button>
                        </Link>
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
