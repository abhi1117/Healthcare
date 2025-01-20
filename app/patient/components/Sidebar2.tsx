"use client";

import React, { useEffect, useState } from "react";

interface TestDetails {
  timestamp?: string;
  bookingId?: string;
}

interface PatientDetails {
  createdAt: string;
  updatedAt: string;
  tests?: TestDetails[];
}

const Sidebar2: React.FC = () => {
  const [details, setDetails] = useState<PatientDetails | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch("/patient/api/get-details", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.log("Error in fetching data");
          return;
        }

        const data: { data: PatientDetails } = await response.json();

        // Sort data in reverse order based on timestamps
        const sortedDetails = {
          ...data.data,
          tests: data.data.tests?.sort((a, b) => {
            const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return dateB - dateA; // Descending order
          }),
        };

        setDetails(sortedDetails);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchDetails();
  }, []);

  return (
    <div className="relative right-12">
      <div className="h-full pb-12 fixed mt-8 md:w-[20%] sm:w-[50%] w-[90%] p-6 shadow-lg hover:shadow-xl bg-white rounded-lg text-center overflow-y-auto transition-all duration-300 ease-in-out">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Patient Activity Timeline
        </h2>
        {details ? (
          <div className="timeline-container text-left">
            {/* Created At */}
            <div className="timeline-item border-l-4 border-blue-500 pl-4 mb-6">
              <h3 className="text-md font-semibold text-blue-700">
                Record Created
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(details.createdAt).toLocaleDateString()} -{" "}
                {new Date(details.createdAt).toLocaleTimeString()}
              </p>
            </div>
            {/* Updated At */}
            <div className="timeline-item border-l-4 border-green-500 pl-4 mb-6">
              <h3 className="text-md font-semibold text-green-700">
                Record Updated
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(details.updatedAt).toLocaleDateString()} -{" "}
                {new Date(details.updatedAt).toLocaleTimeString()}
              </p>
            </div>
            {/* Tests Registered */}
            {details.tests && details.tests.length > 0 && (
              <div className="timeline-tests">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Tests Registered
                </h3>
                {details.tests.map((test, index) => (
                  <div
                    key={index}
                    className="timeline-item border-l-4 border-purple-500 pl-4 mb-6"
                  >
                    <h4 className="text-md font-semibold text-purple-700">
                      Test {index + 1}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Date:{" "}
                      {test.timestamp
                        ? `${new Date(
                            test.timestamp
                          ).toLocaleDateString()} - ${new Date(
                            test.timestamp
                          ).toLocaleTimeString()}`
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Booking ID: {test.bookingId || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar2;
