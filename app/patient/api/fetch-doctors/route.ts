import DoctorSchema from "@/backend/models/doctorDetails";
import { connectToDb } from "@/backend/database/db";

export const GET = async () => {
  try {
    // Connect to the database
    await connectToDb();

    // Fetch all doctors from the DoctorSchema
    const doctors = await DoctorSchema.find({});

    // Check if there are any doctors
    if (!doctors || doctors.length === 0) {
      return new Response(JSON.stringify({ message: "No doctors found" }), {
        status: 404,
      });
    }

    // Return the list of doctors
    return new Response(
      JSON.stringify({ message: "Doctors retrieved successfully", doctors }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
