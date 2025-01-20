"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

interface PatientDetails {
  name: string;
  age: number;
  gender: string;
  phoneNumber: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  height: string;
  weight: string;
  tests: [];
  createdAt: string;
}

interface Test {
  bookingId: string;
  role: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  timestamp: string;
  tests: {
    test_id: string;
    test_name: string;
    test_result: string;
  }[];
}

interface Result {
  test_result: string;
}

const Page = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const searchParams = useSearchParams();

  const patientId = searchParams.get("patientId");
  const secretKey = searchParams.get("secretKey");
  const email = searchParams.get("email");
  const cleanEmail = email?.replace(/"/g, "");

  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(
    null
  );
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState("");
  const [testResultsData, setTestResultsData] = useState<{
    [key: string]: string | null;
  }>({});

  //   Fetch patient details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientDataParams = { patientId: patientId ?? "" };
        const queryParams = new URLSearchParams(patientDataParams).toString();
        const response = await fetch(
          `/doctor/api/getPatientDetails?${queryParams}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        // Separating patient details and tests
        setPatientDetails(data?.data);
        setTests(data?.data?.tests || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [patientId]);

  // Fetch access token
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch("/doctor/api/getAccessToken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret_key: secretKey }),
        });

        if (response.ok) {
          const result = await response.json();
          setAccessToken(result["access-token"]);
        } else {
          setError("Failed to fetch access token");
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
        setError("An error occurred while fetching the access token.");
      }
    };

    if (secretKey) fetchAccessToken();
  }, [secretKey]);

  //   Check test results
  const handleCheckResults = async (bookingId: string) => {
    console.log(bookingId);

    try {
      const response = await fetch("/doctor/api/getTestResults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: bookingId,
          accessToken: accessToken,
        }),
      });
      const data = await response.json();
      console.log(data);

      // Update the test result data with "Pending result" if the result is empty
      if (data.result.length === 0) {
        setTestResultsData((prevState) => ({
          ...prevState,
          [bookingId]: "Pending result",
        }));
      } else {
        setTestResultsData((prevState) => ({
          ...prevState,
          [bookingId]: data.result
            .map((result: Result) => result.test_result)
            .join(", "),
        }));
      }
    } catch (error) {
      console.log(error);
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
          {/* Patient Details */}
          {patientDetails ? (
            <div className="bg-white shadow-lg rounded-lg p-8 mb-8 mt-8">
              <h2 className="text-3xl font-bold mb-6 text-sky-500 border-b-2 border-sky-500 pb-2">
                Patient Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {[
                  { label: "Name", value: patientDetails.name },
                  { label: "Age", value: patientDetails.age },
                  { label: "Gender", value: patientDetails.gender },
                  { label: "Phone", value: patientDetails.phoneNumber },
                  { label: "City", value: patientDetails.city },
                  { label: "State", value: patientDetails.state },
                  { label: "Country", value: patientDetails.country },
                  { label: "Zip", value: patientDetails.zip },
                  { label: "Weight", value: `${patientDetails.weight} kg` },
                  { label: "Height", value: `${patientDetails.height} cm` },
                  {
                    label: "Registered on",
                    value: new Date(patientDetails.createdAt).toLocaleString(),
                  },
                ].map((detail, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-sky-50 hover:bg-sky-100 transition-colors rounded-lg p-4"
                  >
                    <span className="font-medium text-sky-600 text-sm md:text-base w-1/3">
                      {detail.label}:
                    </span>
                    <span className="text-gray-700 text-sm md:text-base w-2/3">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>Loading patient details...</p>
          )}

          {/* Test Series */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-sky-400 border-b-2 border-sky-400 pb-2">
              Test Series
              {error && <span className="text-red-500 ml-2">{error}</span>}
            </h2>

            {tests.length > 0 ? (
              <div>
                {tests.map((test, index) => (
                  <div key={index} className="mb-8 border border-gray-300">
                    {/* General Details Row */}
                    <div className="bg-sky-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-sky-600">
                        Test #{index + 1}
                      </h3>
                      <div className="flex flex-wrap md:flex-nowrap justify-between mb-4">
                        <div className="flex-1 p-1">
                          <strong>Booking ID:</strong> {test.bookingId}
                        </div>
                        <div className="flex-1 p-1">
                          <strong>Role:</strong> {test.role}
                        </div>
                        <div className="flex-1 p-1">
                          <strong>Email:</strong> {test.email}
                        </div>
                        <div className="flex-1 p-1 whitespace-nowrap">
                          <strong>Booked on:</strong>{" "}
                          {new Date(test.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Test Series Table */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h4 className="text-xl font-semibold text-sky-600 relative top-2">
                        Test Details
                      </h4>
                      <div className="flex justify-end relative bottom-6 right-4">
                        <button
                          onClick={() => handleCheckResults(test.bookingId)}
                          className=" bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded"
                        >
                          Check Results
                        </button>
                      </div>
                      <table className="w-full table-auto text-left border-separate border-spacing-1">
                        <thead>
                          <tr className="bg-sky-50 text-sky-600 text-xs md:text-sm">
                            <th className="py-2 px-3 border-b border-sky-200 text-left">
                              Test ID
                            </th>
                            <th className="py-2 px-3 border-b border-sky-200 text-left">
                              Test Name
                            </th>
                            <th className="py-2 px-3 border-b border-sky-200 text-left">
                              Test Result
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {test.tests.map((testItem, index) => (
                            <tr key={index}>
                              <td className="py-2 px-3 border-b">
                                {testItem.test_id}
                              </td>
                              <td className="py-2 px-3 border-b">
                                {testItem.test_name}
                              </td>
                              <td className="py-2 px-3 border-b">
                                {testResultsData[test.bookingId]
                                  ? testResultsData[test.bookingId]
                                  : ""}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No test series found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
