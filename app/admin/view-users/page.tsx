"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const rawData = searchParams.get("email");
  const data = rawData ? JSON.parse(rawData) : null;

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
        console.log(fetchedData);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, [data]);

  return (
    <div>
      View Users
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Page;
