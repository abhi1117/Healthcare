"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

interface PatientData {
  id: number;
  name: string;
  age: number;
  gender: string;
  phoneNumber: number;
}

interface Test {
  test_id: string;
  test_name: string;
}

const Page = () => {
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [selectedTests, setSelectedTests] = useState<
    { test_id: string; test_name: string }[]
  >([]);

  const secretKey = searchParams.get("secretKey");
  const patientId = searchParams.get("patientId");
  const doctorEmail = searchParams.get("email");
  const cleanDoctorEmail = doctorEmail?.replace(/"/g, "");
  const role = "Doctor";

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
          //   setSuccess("Access token fetched successfully!");
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

  // Fetch patient details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/doctor/api/getPatientDetails?patientId=${patientId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          setError("Failed to fetch patient data.");
          return;
        }

        const fetchedData = await response.json();
        setPatientData(fetchedData.data || null);
      } catch (error) {
        console.error("Error fetching patient details:", error);
        setError("An error occurred while fetching patient details.");
      }
    };

    fetchData();
  }, [patientId]);

  // Fetch available tests
  const handleGetAvailableTests = async () => {
    try {
      const response = await fetch("/doctor/api/getAvailableTests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken }),
      });

      if (response.ok) {
        const result = await response.json();
        setAvailableTests(result.tests || []);
      } else {
        const result = await response.json();
        setError(result.error || "Failed to fetch tests.");
      }
    } catch (error) {
      console.error("Error fetching available tests:", error);
      setError("An error occurred while fetching the available tests.");
    }
  };

  // Handle checkbox selection
  const handleCheckboxChange = (test: {
    test_id: string;
    test_name: string;
  }) => {
    setSelectedTests((prevSelectedTests) => {
      const exists = prevSelectedTests.some(
        (selected) => selected.test_id === test.test_id
      );
      if (exists) {
        // Remove test if already selected
        return prevSelectedTests.filter(
          (selected) => selected.test_id !== test.test_id
        );
      } else {
        // Add the test
        return [...prevSelectedTests, test];
      }
    });
  };

  // Handle submit
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!selectedTests.length) {
      setError("Please select at least one test.");

      setTimeout(() => {
        setError("");
      }, 5000);

      setSuccess("");
      setIsLoading(false);
      return;
    }

    // console.log(selectedTests, patientId, role, cleanDoctorEmail, accessToken);

    try {
      const response = await fetch("/doctor/api/patientSelectedTests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          selected_tests: selectedTests, // Already contains both test_id and test_name
          role: role,
          email: cleanDoctorEmail,
          accessToken: accessToken,
        }),
      });

      if (response.ok) {
        setSuccess("Tests saved successfully!");
        setSelectedTests([]);
        setIsLoading(false);

        // Hide the success message after 5 seconds
        setTimeout(() => {
          setSuccess(""); // Clear the success message after 5 seconds
        }, 5000);
      } else {
        const result = await response.json();
        setError(result.error || "Failed to save tests.");

        // Hide the success message after 5 seconds
        setTimeout(() => {
          setSuccess(""); // Clear the success message after 5 seconds
        }, 5000);

        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error saving selected tests:", error);
      setError("An error occurred while saving selected tests.");
      // Hide the success message after 5 seconds
      setTimeout(() => {
        setSuccess(""); // Clear the success message after 5 seconds
      }, 5000);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar email={cleanDoctorEmail ?? ""} />

      <div className="grid grid-cols-1 md:grid-cols-5">
        <Sidebar email={cleanDoctorEmail ?? ""} secretKey={secretKey ?? ""} />

        <div className="col-span-1 md:col-span-4 p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-700 my-6">
            Patient Details
          </h1>

          {patientData ? (
            <div className="p-4 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-bold mb-4">Personal Information</h2>
              <div className="flex flex-wrap gap-x-12 gap-y-4">
                <span>
                  <strong className="text-gray-700">Name:</strong>{" "}
                  {patientData.name}
                </span>
                <span>
                  <strong className="text-gray-700">Age:</strong>{" "}
                  {patientData.age}
                </span>
                <span>
                  <strong className="text-gray-700">Gender:</strong>{" "}
                  {patientData.gender}
                </span>
                <span>
                  <strong className="text-gray-700">Phone Number:</strong>{" "}
                  {patientData.phoneNumber}
                </span>
                <button
                  onClick={handleGetAvailableTests}
                  className="relative bottom-2 bg-sky-400 hover:bg-sky-300 py-2 px-4 text-white rounded-lg transition-all duration-300"
                >
                  Get Available Tests
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 mt-6">No patient data available</p>
          )}

          {/* Available Tests Table with checkboxes */}
          {availableTests.length > 0 && (
            <div className="overflow-x-auto mt-6">
              <table className="table-auto border-collapse border border-gray-300 w-full mt-4 shadow-lg rounded-lg bg-white">
                <thead className="bg-sky-400 text-white">
                  <tr>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      Test ID
                    </th>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      Test Name
                    </th>
                    <th className="border border-white px-4 md:px-6 py-3 text-left text-sm md:text-base font-semibold">
                      Select
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {availableTests.map((test, index) => (
                    <tr
                      key={test.test_id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="border border-gray-300 px-4 md:px-6 py-3">
                        {test.test_id}
                      </td>
                      <td className="border border-gray-300 px-4 md:px-6 py-3">
                        {test.test_name}
                      </td>
                      <td className="border border-gray-300 px-4 md:px-6 py-3">
                        <input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(test)}
                          checked={selectedTests.some(
                            (selected) => selected.test_id === test.test_id
                          )}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Submit Button */}

              {error && (
                <p className="text-red-600 font-semibold text-center mt-2">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green-600 font-semibold text-center mt-2">
                  {success}
                </p>
              )}
              <div className="flex justify-center mt-4 ">
                <button
                  onClick={handleSubmit}
                  className="bg-sky-400 text-white py-2 px-4 rounded-md"
                >
                  {isLoading ? "Saving..." : "Book Test"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
