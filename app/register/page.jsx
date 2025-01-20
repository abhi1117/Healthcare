"use client";

import { useState } from "react";

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  // Function to handle sending OTP
  const handleSendOtp = async () => {
    const response = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("OTP sent! Please check your phone.");
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  // Function to handle verifying OTP
  const handleVerifyOtp = async () => {
    const response = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, otp }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("OTP verified successfully!");
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={handleSendOtp}>Send OTP</button>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerifyOtp}>Verify OTP</button>

      <p>{message}</p>
    </div>
  );
};

export default Register;
