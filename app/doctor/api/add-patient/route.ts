import DoctorSchema from "@/backend/models/doctorDetails";
import PatientSchema from "@/backend/models/patientDetails";
import { connectToDb } from "@/backend/database/db";

export const POST = async (req:Request) =>{
    try{
        const {patientEmail,doctorEmail}= await req.json(); 
        await connectToDb();
        const doctor = await DoctorSchema.findOne({email:doctorEmail});
        const patient = await PatientSchema.findOne({email:patientEmail})
        if(!doctor){
            return new Response(JSON.stringify({message:'Doctor Not Found'}),{status:404})
        }else if(!patient){
            return new Response(JSON.stringify({message:'Patient Not Found'}),{status:404})
        }else{

            await PatientSchema.findByIdAndUpdate(
                patient._id,
                {$push:{totalDoctors:doctor._id}}
            )

            await DoctorSchema.findByIdAndUpdate(
                doctor._id,
                {$push:{totalPatients:patient._id}}
            )
            return new Response(JSON.stringify({message:'Patient Added Successfully'}),{status:200})
        }
    }catch(err){
        console.error("Error:", err);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
    }
}