import AdminSchema from "@/backend/models/adminDetails";
import { connectToDb } from "@/backend/database/db";
import DoctorSchema from "@/backend/models/doctorDetails";
import PatientSchema from "@/backend/models/patientDetails";

export const GET = async (req:Request) =>{
    try{
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        if (!email) {
            return new Response(JSON.stringify({ message: "Email is required" }), {
              status: 400,
            });
          }
      
        await connectToDb();

        const admin = await AdminSchema.findOne({ email });
        if (!admin) {
          return new Response(JSON.stringify({ message: "Admin not found" }), {
            status: 404,
          });
        }else{
         //   console.log('admin:',admin);
      
        const totalDoctors = await DoctorSchema.find({
            _id: { $in: admin.totalDoctors },
          });
        const totalPatients = await PatientSchema.find({
            _id: { $in: admin.totalPatients },
          });
        const data = { totalDoctors, totalPatients };
      //  console.log('data:',data);
        return new Response(JSON.stringify({ message: "Success", data }), {
            
        })
    }
    }catch(err){
        console.error("Error:", err);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
          status: 500,
        });    
    }
}