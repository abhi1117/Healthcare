import PatientSchema from "@/backend/models/patientDetails";
import { connectToDb } from "@/backend/database/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { patient_id, selected_tests, role, email, accessToken } =
      await req.json();
    //  console.log('Patient selected test', patient_id, selected_tests, role, email, accessToken);

    await connectToDb();

    // Validate the `patient_id`
    if (!patient_id) {
      return new Response(
        JSON.stringify({ message: "Patient ID is required" }),
        {
          status: 400,
        }
      );
    }

    // Find the patient by ID
    const patientDetails = await PatientSchema.findById(patient_id);

    if (!patientDetails) {
      return new Response(JSON.stringify({ message: "Patient not found" }), {
        status: 404,
      });
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    // Prepare the Mobilab request body
    const mobilabRequestBody = {
      fullname: patientDetails.name,
      age: patientDetails.age,
      gender: patientDetails.gender,
      height: patientDetails.height,
      weight: patientDetails.weight,
      phone: patientDetails.phoneNumber,
      city: patientDetails.city,
      state: patientDetails.state,
      zip: patientDetails.zip,
      country: patientDetails.country,
      tests: selected_tests.map((test: { test_id: string }) => ({
        test_id: test.test_id,
      })),
    };

    //  console.log("Mobilab Request Body:", mobilabRequestBody);

    // Call Mobilab Book Test API
    const response = await fetch(
      "https://emobilab.in/api-vendor/bookTest.php",
      {
        method: "POST",
        headers: {
          "mobi-access": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mobilabRequestBody),
      }
    );

    const responseData = await response.json();
    //  console.log("Mobilab Response Data:", responseData);

    if (responseData.error) {
      return new Response(
        JSON.stringify({
          message: "Mobilab booking failed",
          mobilabResponse: responseData,
        }),
        { status: 400 }
      );
    }

    // Update the patient's tests with the booking ID
    const nextIndex = patientDetails.tests.length;
    // console.log('next length:',nextIndex)
    const testEntry = {
      index: nextIndex,
      role,
      email,
      bookingId: responseData.bookingID, // Add booking ID from Mobilab response
      tests: selected_tests,
      timestamp: new Date(),
    };
    //  console.log('test entry:',testEntry)
    patientDetails.tests.push(testEntry);

    // Save the updated patient document
    await patientDetails.save();

    return new Response(
      JSON.stringify({
        message: "Tests updated successfully",
        mobilabResponse: responseData,
        data: patientDetails,
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: String(err) }),
      { status: 500 }
    );
  }
};
