import DoctorSchema from "@/backend/models/doctorDetails";
import AdminSchema from "@/backend/models/adminDetails";
import { connectToDb } from "@/backend/database/db";

export const POST = async (req: Request) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      role,
      gender,
      secretKey,
      cleanedEmail,
    } = await req.json();

    await connectToDb();
    console.log(secretKey);

    // Validate the admin using cleanedEmail
    const admin = await AdminSchema.findOne({ email: cleanedEmail });
    if (!admin) {
      return new Response(JSON.stringify({ message: "Admin not found" }), {
        status: 404,
      });
    }

    let createdEntity;

    // Check the role and handle accordingly
    if (role === "doctor") {
      // Check if the doctor already exists
      const existingDoctor = await DoctorSchema.findOne({ email });
      if (existingDoctor) {
        return new Response(
          JSON.stringify({
            message: "Doctor already exists",
            data: existingDoctor,
          }),
          { status: 409 }
        );
      }

      // Create new doctor
      createdEntity = await DoctorSchema.create({
        name,
        email,
        password,
        phoneNumber,
        role,
        gender,
        secretKey,
        admin: admin._id, // Associate with the admin
      });

      // Add Doctor ID to Admin's `totalDoctors`
      await AdminSchema.findByIdAndUpdate(
        admin._id,
        { $push: { totalDoctors: createdEntity._id } },
        { new: true }
      );
    } /*else if (role === "patient") {
      // Check if the patient already exists
      const existingPatient = await PatientSchema.findOne({ email });
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
      createdEntity = await PatientSchema.create({
        name,
        email,
        password,
        phoneNumber,
        role,
        gender,
        admin: admin._id, // Associate with the admin
        abhaId
      });

      // Add Patient ID to Admin's `totalPatients`
      await AdminSchema.findByIdAndUpdate(
        admin._id,
        { $push: { totalPatients: createdEntity._id } },
        { new: true }
      );
    } */else {
      return new Response(JSON.stringify({ message: "Invalid role" }), {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({
        message: `${role} created successfully`,
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
