import SuperAdminSchema from "@/backend/models/supeAdminDetails";
import AdminSchema from "@/backend/models/adminDetails";
import DoctorSchema from "@/backend/models/doctorDetails";
import PatientSchema from "@/backend/models/patientDetails";
import { connectToDb } from "@/backend/database/db";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();
    console.log(email, password);
    await connectToDb();

    // Check if there are no super admins; if not, create the first one
    const superAdminCount = await SuperAdminSchema.countDocuments();
    if (superAdminCount === 0) {
      const newSuperAdmin = await SuperAdminSchema.create({ email, password });
      return new Response(
        JSON.stringify({
          message: "SuperAdmin created successfully",
          role: "superadmin",
          data: newSuperAdmin,
        }),
        { status: 201 }
      );
    }

    // Check if the email/password matches a SuperAdmin
    const superAdminData = await SuperAdminSchema.findOne({ email, password });
    if (superAdminData) {
      return new Response(
        JSON.stringify({
          message: "Login successful",
          role: "superadmin",
          data: superAdminData,
        }),
        { status: 200 }
      );
    }

    // If not a SuperAdmin, check if it's an Admin
    const adminData = await AdminSchema.findOne({ email, password });
    if (adminData) {
      return new Response(
        JSON.stringify({
          message: "Login successful",
          role: "admin",
          data: adminData,
        }),
        { status: 200 }
      );
    }

    // If not an Admin, check if it's a Doctor
    const doctorData = await DoctorSchema.findOne({ email, password });
    if (doctorData) {
      return new Response(
        JSON.stringify({
          message: "Login Successful",
          role: "doctor",
          data: doctorData,
        }),
        { status: 200 }
      );
    }

    // If not a Doctor, check if it's a Patient
    const patientData = await PatientSchema.findOne({ email, password });
    if (patientData) {
      return new Response(
        JSON.stringify({
          message: "Login Successful",
          role: "patient",
          data: patientData,
        }),
        { status: 200 }
      );
    }

    // If no match is found in either SuperAdmin or Admin or doctor or patient
    //  console.log("Email or password is incorrect");
    return new Response(
      JSON.stringify({
        success: false,
        error: "Email or password is incorrect",
      }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
