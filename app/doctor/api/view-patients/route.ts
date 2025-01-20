// route for viewing patient details
import { connectToDb } from "@/backend/database/db";
import DoctorSchema from "@/backend/models/doctorDetails";
import PatientSchema from "@/backend/models/patientDetails";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    console.log(email);
    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required" }), {
        status: 400,
      });
    }

    await connectToDb();

    const doctor = await DoctorSchema.findOne({ email });
    if (!doctor) {
      return new Response(JSON.stringify({ message: "Doctor not found" }), {
        status: 404,
      });
    } else {
      //   console.log('admin:',admin);

      const totalPatients = await PatientSchema.find({
        _id: { $in: doctor.totalPatients },
      });
      const data = { totalPatients };
      //  console.log('data:',data);
      return new Response(JSON.stringify({ message: "Success", data }), {});
    }
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
