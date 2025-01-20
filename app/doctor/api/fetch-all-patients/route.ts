import PatientSchema from "@/backend/models/patientDetails";
import { connectToDb } from "@/backend/database/db";

export const GET = async () => {
  try {
    await connectToDb();
    const allPatients = await PatientSchema.find({});
    // console.log("all patient:",allPatients);
    if (allPatients.length === 0) {
      return new Response(JSON.stringify({ message: "No Patients Found" }), {
        status: 404,
      });
    } else {
      return new Response(
        JSON.stringify({
          message: "Success",
          data: { totalPatients: allPatients },
        }),
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
