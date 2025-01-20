import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema({
    email:{
        type: String,
        required: false
    },
    password:{
        type:String,
        required:false
    },
    totalAdmin:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'AdminSchema'
    }]
});

//const SuperAdminSchema= mongoose.model("SuperAdminSchema", superAdminSchema);
const SuperAdminSchema = mongoose.models.SuperAdminSchema || mongoose.model("SuperAdminSchema", superAdminSchema);

export default SuperAdminSchema;
