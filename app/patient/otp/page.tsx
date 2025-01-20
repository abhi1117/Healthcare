"use client";

import { useState } from "react";

const OtpVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("enterPhone"); // 'enterPhone' or 'enterOtp'
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    setMessage("");
    try {
      const response = await fetch("/patient/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      if (response.ok) {
        setStep("enterOtp");
        setMessage("OTP sent successfully!");
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const verifyOtp = async () => {
    setMessage("");
    try {
      const response = await fetch("/patient/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      if (response.ok) {
        setMessage("OTP verified successfully!");
      } else {
        const data = await response.json();
        setMessage(data.error || "Invalid OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="otp-container">
      {step === "enterPhone" && (
        <>
          <h2>Enter Phone Number</h2>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === "enterOtp" && (
        <>
          <h2>Enter OTP</h2>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter the OTP"
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default OtpVerification;
