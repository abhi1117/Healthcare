import Twilio from "twilio";
import { NextResponse } from "next/server";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFromNumber = process.env.TWILIO_FROM_NUMBER;
const client = new Twilio(accountSid, authToken);

export async function POST(req) {
  try {
    const { phoneNumber } = await req.json();
    console.log("Received phone number:", phoneNumber);
    console.log("accountSid", accountSid);
    console.log("authToken", authToken);
    console.log("twilioFromNumber", twilioFromNumber);

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: twilioFromNumber,
      to: phoneNumber,
    });

    // Store OTP securely (e.g., in a database, session, or cache)
    // For simplicity, log it here. Replace this with real storage logic.
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
