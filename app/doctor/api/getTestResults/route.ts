import PatientSchema from "@/backend/models/patientDetails";
import { connectToDb } from "@/backend/database/db";

interface Test {
  bookingId: string;
  result: string;
}

export const POST = async (req: Request) => {
  try {
    const { bookingId, accessToken } = await req.json();

    // console.log("Booking ID:", bookingId);
    await connectToDb();

    // Validate input
    if (!bookingId) {
      return new Response(
        JSON.stringify({ message: "Booking ID is required" }),
        {
          status: 400,
        }
      );
    }

    if (!accessToken) {
      return new Response(
        JSON.stringify({ message: "Access token is required" }),
        { status: 400 }
      );
    }

    // Find the patient entry with the given booking ID in `tests`
    const patientDetails = await PatientSchema.findOne({
      "tests.bookingId": bookingId,
    });

    if (!patientDetails) {
      return new Response(
        JSON.stringify({ message: "Patient with booking ID not found" }),
        { status: 404 }
      );
    }

    // Call the Mobilab API to fetch test results
    const response = await fetch(
      "https://emobilab.in/api-vendor/getTestResults.php",
      {
        method: "POST",
        headers: {
          "mobi-access": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingID: bookingId }), // Ensure bookingId is wrapped in an object
      }
    );

    const responseData = await response.json();
    //    console.log("Response Data:", responseData);

    if (responseData.error) {
      return new Response(JSON.stringify({ message: responseData.message }), {
        status: 400,
      });
    }

    // Update the `result` field in the corresponding test entry
    const updatedPatient = await PatientSchema.findOneAndUpdate(
      { "tests.bookingId": bookingId },
      {
        $set: {
          "tests.$.result": JSON.stringify(responseData.details.test_results), // Store test results as a string
        },
      },
      { new: true }
    );
    // Extract the updated result for the specific test entry
    const updatedTestEntry = updatedPatient?.tests.find(
      (test: Test) => test.bookingId === bookingId
    );

    if (!updatedTestEntry) {
      return new Response(JSON.stringify({ message: "Test entry not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        result: JSON.parse(updatedTestEntry.result), // Return only the result array
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error:", err);
      return new Response(
        JSON.stringify({
          message: "Internal Server Error",
          error: err.message,
        }),
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", err);
      return new Response(
        JSON.stringify({ message: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }
};
