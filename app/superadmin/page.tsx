"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const [error, setError] = useState("");
  const [adminCount, setAdminCount] = useState(0);
  const searchParams = useSearchParams();
  const rawData = searchParams.get("email");
  const data = rawData ? JSON.parse(rawData) : null;

  // Fetch admin details
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
        setAdminCount(fetchedData.length);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, [data]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar data={data} />
      <div className="flex flex-1">
        <Sidebar data={data} />

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          {/* Admin Count Card */}
          <Link
            href={{
              pathname: "/superadmin/view-admin",
              query: { data: JSON.stringify(data) },
            }}
          >
            <div className="flex items-center justify-center w-full max-w-sm bg-white rounded-lg shadow-md px-6 py-4 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="bg-sky-500 text-white rounded-full flex items-center justify-center h-14 w-14 text-2xl font-bold mr-4">
                {adminCount}
              </div>
              <p className="text-lg font-medium">Total Admin</p>
            </div>
          </Link>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </main>
      </div>
    </div>
  );
};

export default Page;
