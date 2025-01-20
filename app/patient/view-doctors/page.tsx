"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

interface Doctor {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  // Add other properties as needed
}

const Page = () => {
  const searchParams = useSearchParams();
  const doctorEmail = searchParams.get("email");
  const cleanEmail = doctorEmail?.replace(/"/g, "");
  // const secretKey = searchParams.get("secretKey");

  const [error, setError] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/patient/api/fetch-doctors", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 404) {
          setError("No doctors found");
          return;
        }

        if (!response.ok) {
          setError("An error occurred while fetching data");
          return;
        }

        const fetchedData = await response.json();
        setDoctors(fetchedData.doctors);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, [cleanEmail]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Navbar */}
      <Navbar email={cleanEmail ?? ""} />

      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="col-span-1 md:col-span-4 p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-700 my-6">
            Total Doctors
          </h1>
          {error && <p className="text-red-600 font-semibold">{error}</p>}
          {!error && doctors.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <thead className="bg-sky-400 text-white">
                  <tr>
                    <th className="py-3 px-6 text-left text-sm font-semibold border border-white">
                      Name
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold border border-white">
                      Email
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold border border-white">
                      Phone Number
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold border border-white">
                      Gender
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold border border-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor, index) => (
                    <tr
                      key={doctor._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } border-t border-gray-300 hover:bg-gray-100`}
                    >
                      <td className="py-3 px-6 text-sm text-gray-700 border border-gray-300">
                        {doctor.name || "N/A"}
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-700 border border-gray-300">
                        {doctor.email || "N/A"}
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-700 border border-gray-300">
                        {doctor.phoneNumber || "N/A"}
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-700 border border-gray-300">
                        {doctor.gender || "N/A"}
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-700 border border-gray-300">
                        <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                          Revoke Doctor
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
