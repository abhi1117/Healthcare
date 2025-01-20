"use client";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Sidebar2 from "./components/Sidebar2";
// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface HeartRateEntry {
  bpm: number;
  time: string;
}

interface ActivityData {
  startTime: string;
  endTime: string;
  steps: number;
  calories: number;
  distance: string;
  heartRate: HeartRateEntry[];
  height: string;
  weight: string;
}

const Page = () => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const expiry_date = searchParams.get("expiry_date");

  useEffect(() => {
    // Check if expiry_date is present and validate session expiration
    if (expiry_date) {
      const expiryDateTime = new Date(expiry_date);
      const currentDateTime = new Date();

      // If the session is expired, set error and return
      if (currentDateTime > expiryDateTime) {
        setError("Session expired. Please log in again.");
        setLoading(false);
        return;
      }
    }

    // Proceed with fetching data only if the session is valid
    if (token) {
      const fetchData = async () => {
        try {
          const response = await fetch("/patient/api/fetch-heart-rate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          const result: ActivityData[] = await response.json();
          setData(result);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to load data. Please try again later.");
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [token, expiry_date]);

  // Prepare the data for the graph
  const caloriesData = data.map((entry) => entry.calories);
  const stepsData = data.map((entry) => entry.steps);
  const dates = data.map((entry) =>
    new Date(entry.startTime).toLocaleDateString()
  );

  return (
    <div className="min-h-screen overflow-scroll flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar email={""} />

      <div className="flex flex-grow">
        {/* Left Sidebar */}
        <div className="w-64">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-grow p-8 overflow-auto mt-6 mr-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Patient Activity Data
            </h1>
            {data.length > 0 && (
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 transition duration-300"
              >
                Refresh
              </button>
            )}
          </div>
          {error && <p className="text-red-600">{error}</p>}

          {!loading && data.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              <div className="col-span-1">
                {/* Calories Burnt Chart */}
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Calories Burnt Each Day
                </h2>
                <Chart
                  options={{
                    chart: {
                      id: "calories-burnt-chart",
                      type: "bar",
                      toolbar: { show: false },
                      background: "#f7f7f7",
                      dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 2,
                        opacity: 0.3,
                        blur: 4,
                      },
                    },
                    xaxis: {
                      categories: dates,
                      title: {
                        text: "Date",
                        style: { fontSize: "14px", color: "#333" },
                      },
                    },
                    yaxis: {
                      title: {
                        text: "Calories Burnt",
                        style: { fontSize: "14px", color: "#333" },
                      },
                    },
                    title: {
                      text: "Calories Burnt Each Day",
                      align: "center",
                      style: {
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#333",
                      },
                    },
                    colors: ["#FFD700"],
                    plotOptions: {
                      bar: {
                        borderRadius: 5,
                        horizontal: false,
                        columnWidth: "50%",
                      },
                    },
                    grid: {
                      show: true,
                      borderColor: "#e3e3e3",
                      strokeDashArray: 5,
                    },
                  }}
                  series={[
                    {
                      name: "Calories Burnt",
                      data: caloriesData,
                    },
                  ]}
                  type="line"
                  height={250}
                />
              </div>

              <div className="col-span-1">
                {/* Steps Walked Chart */}
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Steps Walked Each Day
                </h2>
                <Chart
                  options={{
                    chart: {
                      id: "steps-walked-chart",
                      type: "bar",
                      toolbar: { show: false },
                      background: "#f7f7f7",
                      dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 2,
                        opacity: 0.3,
                        blur: 4,
                      },
                    },
                    xaxis: {
                      categories: dates,
                      title: {
                        text: "Date",
                        style: { fontSize: "14px", color: "#333" },
                      },
                    },
                    yaxis: {
                      title: {
                        text: "Steps Walked",
                        style: { fontSize: "14px", color: "#333" },
                      },
                    },
                    title: {
                      text: "Steps Walked Each Day",
                      align: "center",
                      style: {
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#333",
                      },
                    },
                    colors: ["#FFD700"],
                    plotOptions: {
                      bar: {
                        borderRadius: 10,
                        horizontal: false,
                        columnWidth: "50%",
                      },
                    },
                    grid: {
                      show: true,
                      borderColor: "#e3e3e3",
                      strokeDashArray: 5,
                    },
                  }}
                  series={[
                    {
                      name: "Steps Walked",
                      data: stepsData,
                    },
                  ]}
                  type="line"
                  height={250}
                />
              </div>

              {/* Loop through and display activity data */}
              {data.map((entry, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-blue-500 hover:border-yellow-500 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    Activity {index + 1}
                  </h2>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Start Time:</strong> {entry.startTime}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>End Time:</strong> {entry.endTime}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Steps:</strong> {entry.steps}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Calories:</strong> {entry.calories}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Distance:</strong> {entry.distance} km
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Height:</strong> {entry.height}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Weight:</strong> {entry.weight}
                  </div>
                  {entry.heartRate.map((heartRateEntry, index) => (
                    <div className="text-sm text-gray-600 mb-2" key={index}>
                      <strong>Heart Rate:</strong> {heartRateEntry.bpm} bpm at{" "}
                      {heartRateEntry.time}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-4">
              <div className=" "></div>
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <div className="w-64">
          <Sidebar2 />
        </div>
      </div>
    </div>
  );
};

export default Page;
