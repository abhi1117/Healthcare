import PatientSchema from "@/backend/models/patientDetails";
import { connectToDb } from "@/backend/database/db";

export const GET = async(req:Request)=>{
    try{
      const { searchParams } = new URL(req.url);
      const patientId = searchParams.get("patientId");
      await connectToDb();
      if(!patientId){
        return new Response(JSON.stringify({ message: "Patient ID is required" }), {
          status: 400,
        })
      }else{
        const patientDetails = await PatientSchema.findById(patientId);
        if(patientDetails){
          return new Response(JSON.stringify({ message: "Success", data: patientDetails }), {
            status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        })
      }else{
        return new Response(JSON.stringify({ message:'Patient Not Found'}),{status:404})
      }
    }

    }catch(err){
        console.error("Error:", err);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
          status: 500,
        });
    }
}