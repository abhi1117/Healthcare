"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Page = () => {
  const searchParams = useSearchParams();
  const rawData = searchParams.get("data");
  const data = rawData ? JSON.parse(rawData) : null;
  const [adminData, setAdminData] = useState<
    { _id: string; name: string; email: string; phoneNumber: string }[]
  >([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminDataParams = { email: data };
        const queryParams = new URLSearchParams(adminDataParams).toString();
        const response = await fetch(
          `/superadmin/api/fetch-admin?${queryParams}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 404) {
          setError("Admin not found");
          return;
        }

        if (!response.ok) {
          setError("An error occurred while fetching data");
          return;
        }

        const fetchedData = await response.json();
        setAdminData(fetchedData);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, [data]);

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
            Total Admin Data
          </h1>
          {error && <p className="text-red-600 font-semibold">{error}</p>}

          {adminData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse border border-gray-300 w-full mt-4 shadow-lg rounded-lg bg-white">
                <thead className="bg-sky-400 text-white">
                  <tr>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      Name
                    </th>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      Email
                    </th>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      Phone Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.map((admin, index) => (
                    <tr
                      key={admin._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="border border-gray-300 px-4 md:px-6 py-3">
                        {admin.name}
                      </td>
                      <td className="border border-gray-300 px-4 md:px-6 py-3">
                        {admin.email}
                      </td>
                      <td className="border border-gray-300 px-4 md:px-6 py-3">
                        {admin.phoneNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 mt-6">No admin data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
