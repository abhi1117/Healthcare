import PatientSchema from "@/backend/models/patientDetails";
import { connectToDb } from "@/backend/database/db";

export const GET = async () =>{
    try{
        await connectToDb();

        const patient= await PatientSchema.findOne({phoneNumber:6281284310});
        if(!patient){
            return new Response(JSON.stringify({message:'Patient not Exist'}),{status:404});
        }else{
            return new Response(JSON.stringify({message:'Success',data:patient}),{status:200});
        }

    }catch(err){
        console.error("Error:", err);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
    }

}