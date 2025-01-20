import SuperAdminSchema from "@/backend/models/supeAdminDetails";
import { connectToDb } from "@/backend/database/db";
import AdminSchema from "@/backend/models/adminDetails";

export const GET = async (req: Request) => {
  try {
    // Parse query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required" }), {
        status: 400,
      });
    }

     // Connect to the database
     await connectToDb();

     // Example logic for fetching admin data
     const superAdmin = await SuperAdminSchema.findOne({ email });
 
     if (!superAdmin) {
       return new Response(JSON.stringify({ message: "Admin not found" }), {
         status: 404,
         headers: { "Content-Type": "application/json" },
       });
     }
     const totalAdmins = await AdminSchema.find({
        _id: { $in: superAdmin.totalAdmin },
      });
    //  console.log("Total admins:", totalAdmins);
      if (!totalAdmins.length) {
        return new Response(JSON.stringify({ message: "No admins found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      return new Response(JSON.stringify(totalAdmins), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
 
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
