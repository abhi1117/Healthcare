import AdminSchema from "@/backend/models/adminDetails";
import PatientSchema from "@/backend/models/patientDetails";
import { connectToDb } from "@/backend/database/db";

export const POST = async (req: Request) => {
  try {
    const {
      name,
      age,
      gender,
      height,
      weight,
      phoneNumber,
      city,
      state,
      zip,
      country,
      cleanedEmail,
      abhaId
    } = await req.json();

    await connectToDb();

    // Validate the doctor's using email
    const admin = await AdminSchema.findOne({ email: cleanedEmail });
    if (!admin) {
      return new Response(JSON.stringify({ message: "Admin not found" }), {
        status: 404,
      });
    }

    // Check if the patient already exists
    const existingPatient = await PatientSchema.findOne({ phoneNumber });
    if (existingPatient) {
      return new Response(
        JSON.stringify({
          message: "Patient already exists",
          data: existingPatient,
        }),
        { status: 409 }
      );
    }

    // Create new patient
    const createdEntity = await PatientSchema.create({
      name,
      age,
      gender,
      height,
      weight,
      phoneNumber,
      city,
      state,
      zip,
      country,
      admin: admin._id, 
      abhaId
    });

    // Add Patient ID to doctor's `totalPatients`
    await AdminSchema.findByIdAndUpdate(
      admin._id,
      { $push: { totalPatients: createdEntity._id } },
      { new: true }
    );

    return new Response(
      JSON.stringify({
        message: `Patient created successfully`,
        data: createdEntity,
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
