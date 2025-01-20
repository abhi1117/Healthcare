import AdminSchema from "@/backend/models/adminDetails";
import { connectToDb } from "@/backend/database/db";
import SuperAdminSchema from "@/backend/models/supeAdminDetails";

export const POST = async (req: Request) => {
  try {
   // const data=await req.json();
    const { name, email, password, phoneNumber, data } = await req.json();
   // console.log('super admin email*************:',data);
    await connectToDb();

    const superAdmin=await SuperAdminSchema.findOne({email:data});

    // Check if the admin already exists
    const existingAdmin = await AdminSchema.findOne({ email });
    if (existingAdmin) {
      return new Response(
        JSON.stringify({ message: "Admin already exists", admin: existingAdmin }),
        { status: 409 }
      );
    }

    // Create a new admin
    const newAdmin = await AdminSchema.create({
      name,
      email,
      password,
      phoneNumber,
      superAdmin: superAdmin._id, // Assign the superAdminId to the admin
    });

    // Update the superAdmin document to push the admin's ID
    await SuperAdminSchema.findByIdAndUpdate(
      superAdmin._id,
      { $push: { totalAdmin: newAdmin._id } },
      { new: true }
    );

    return new Response(
      JSON.stringify({ message: "Admin created successfully", admin: newAdmin}),
      { status: 201 }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
