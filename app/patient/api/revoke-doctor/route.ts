import PatientSchema from "@/backend/models/patientDetails";
import DoctorSchema from "@/backend/models/doctorDetails";
import { connectToDb } from "@/backend/database/db";

export const POST = async (req: Request) => {
  try {
    const { doctorId, patientId } = await req.json();

    // Validate input
    if (!doctorId || !patientId) {
      return new Response(
        JSON.stringify({ message: "Doctor ID and Patient ID are required" }),
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDb();

    // Remove patientId from the doctor's `totalPatients` field
    const doctorUpdate = await DoctorSchema.findByIdAndUpdate(
      doctorId,
      { $pull: { totalPatients: patientId } },
      { new: true }
    );

    if (!doctorUpdate) {
      return new Response(
        JSON.stringify({ message: "Doctor not found" }),
        { status: 404 }
      );
    }
/*
    // Remove doctorId from the patient's `doctor` field
    const patientUpdate = await PatientSchema.findByIdAndUpdate(
      patientId,
      { $unset: { doctor: "" } }, // Unset the doctor field
      { new: true }
    );*/
    const patientUpdate = await PatientSchema.findByIdAndUpdate(
      patientId,
      {$pull:{totalDoctors:doctorId}}
    )
    if (!patientUpdate) {
      return new Response(
        JSON.stringify({ message: "Patient not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Patient removed from doctor and vice versa successfully",
        updatedDoctor: doctorUpdate,
        updatedPatient: patientUpdate,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
