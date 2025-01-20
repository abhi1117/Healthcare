"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Page = () => {
  const searchParams = useSearchParams();
  const doctorEmail = searchParams.get("email");
  const cleanEmail = doctorEmail?.replace(/"/g, "");
  const secretKey = searchParams.get("secretKey");

  const [patientData, setPatientData] = useState<{
    totalPatients: {
      _id: string;
      abhaId: string;
      name: string;
      age: number;
      phoneNumber: string;
      gender: string;
    }[];
  }>({
    totalPatients: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(
    patientData.totalPatients
  );

  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/doctor/api/fetch-all-patients", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 404) {
          setError("Patients not found");
          return;
        }

        if (!response.ok) {
          setError("An error occurred while fetching data");
          return;
        }

        const fetchedData = await response.json();
        setPatientData(fetchedData.data);
        setFilteredPatients(fetchedData.data.totalPatients);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, [cleanEmail]);

  const handleAddPatientClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOtp("");
  };

  const handleVerifyOtp = () => {
    if (otp.trim() === "") {
      alert("Please enter the OTP");
      return;
    }
    alert(`OTP ${otp} verified successfully!`);
    handleCloseModal();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = patientData.totalPatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(value) ||
        patient.abhaId.toLowerCase().includes(value) ||
        patient.phoneNumber.includes(value)
    );
    setFilteredPatients(filtered);
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
            Add Patients
          </h1>
          {error && <p className="text-red-600 font-semibold">{error}</p>}

          {/* Search Bar */}
          <div className="mb-6 relative w-1/2">
            <input
              type="text"
              placeholder="Search by Name, ABHA ID, or Phone Number"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={searchTerm}
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
                      Action
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
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={handleAddPatientClick}
                        >
                          Add Patient
                        </button>
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

      {/* OTP Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Verify OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded"
                onClick={handleVerifyOtp}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
