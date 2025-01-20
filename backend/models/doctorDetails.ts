import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["doctor", "patient"],
      required: false,
    },

    gender: {
      type: String,
      role: ["male", "female"],
    },

    secretKey: {
      type: String,
      required: false,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminSchema",
    },

    totalPatients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PatientSchema",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const DoctorSchema =
  mongoose.models.DoctorSchema || mongoose.model("DoctorSchema", doctorSchema);

export default DoctorSchema;
