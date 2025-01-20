import { NextResponse } from "next/server";

// Mock storage for OTPs (replace with database or Redis in production)
const otpStore = {};

export async function POST(req) {
  try {
    const { phoneNumber, otp } = await req.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required" },
        { status: 400 }
      );
    }

    // Retrieve stored OTP
    const storedOtp = otpStore[phoneNumber]; // Replace with real database logic

    if (!storedOtp) {
      return NextResponse.json(
        { error: "No OTP found for this phone number" },
        { status: 400 }
      );
    }

    if (otp === storedOtp) {
      return NextResponse.json(
        { message: "OTP verified successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
