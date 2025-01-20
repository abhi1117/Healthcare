import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:false
    },
    phoneNumber:{
        type:Number,
        required:false
    },
    superAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SuperAdminSchema'
    },
    totalDoctors:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'DoctorSchema'
    }],
    totalPatients:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PatientSchema'
    }]
},{
    timestamps:true
})

const AdminSchema= mongoose.models.AdminSchema || mongoose.model("AdminSchema", adminSchema);

export default AdminSchema;