"use client";

import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const Page = () => {
  const searchParams = useSearchParams();
  const rawData = searchParams.get("email");
  const data = rawData ? JSON.parse(rawData) : null;
  const [error, setError] = useState("");
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);

  // Fetch admin details
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
          setError("User not found");
          return;
        }

        if (!response.ok) {
          setError("An error occurred while fetching data");
          return;
        }

        const fetchedData = await response.json();
        console.log(fetchedData.data.totalDoctors.length);
        setDoctorCount(fetchedData.data.totalDoctors.length);
        console.log(fetchedData.data.totalPatients.length);
        setPatientCount(fetchedData.data.totalPatients.length);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, [data]);

  return (
    <div>
      <Navbar data={data} />
      <Sidebar data={data} />

      {/* Main Content */}
      <main className=" flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 mt-12 items-center justify-center p-6 text-center">
        {/* Doctor Count Card */}
        <div className="w-full max-w-xs md:max-w-sm">
          <Link
            href={{
              pathname: "/admin/view-doctors",
              query: { email: JSON.stringify(data) },
            }}
          >
            <div className="flex items-center justify-center w-full bg-white rounded-lg shadow-md px-6 py-4 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="bg-sky-500 text-white rounded-full flex items-center justify-center h-14 w-14 text-2xl font-bold mr-4">
                {doctorCount}
              </div>
              <p className="text-lg font-medium">Total Doctors</p>
            </div>
          </Link>
        </div>

        {/* Patient Count Card */}
        <div className="w-full max-w-xs md:max-w-sm">
          <Link
            href={{
              pathname: "/admin/view-patients",
              query: { email: JSON.stringify(data) },
            }}
          >
            <div className="flex items-center justify-center w-full bg-white rounded-lg shadow-md px-6 py-4 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="bg-sky-500 text-white rounded-full flex items-center justify-center h-14 w-14 text-2xl font-bold mr-4">
                {patientCount}
              </div>
              <p className="text-lg font-medium">Total Patients</p>
            </div>
          </Link>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </main>
    </div>
  );
};

export default Page;
