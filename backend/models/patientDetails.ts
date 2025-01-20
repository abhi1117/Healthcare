import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },

    age: {
      type: String,
      required: false,
    },

    gender: {
      type: String,
      role: ["male", "female"],
    },

    height: {
      type: String,
      required: false,
    },

    weight: {
      type: String,
      required: false,
    },

    phoneNumber: {
      type: String,
      required: false,
    },

    city: {
      type: String,
      required: false,
    },

    state: {
      type: String,
      required: false,
    },

    zip: {
      type: String,
      required: false,
    },

    country: {
      type: String,
      required: false,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminSchema",
    },

    totalDoctors: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorSchema",
    },
    tests: [
      {
        index: { type: Number, required: false }, // Incremental index
        role: { type: String, required: false }, // Role associated with the test
        email: { type: String, required: false }, // Email associated with the test
        bookingId:{ type: String, required: false },
        result:{type:String,required:false},
        tests: [
          {
            test_id: { type: String, required: false },
            test_name: { type: String, required: false },
          },
        ],
        timestamp: { type: Date, default: Date.now }, // Timestamp for the entry
      },
    ],
    abhaId: {
      type:String,
      required:false
    }
  },
  {
    timestamps: true,
  }
);

const PatientSchema =
  mongoose.models.PatientSchema ||
  mongoose.model("PatientSchema", patientSchema);

export default PatientSchema;
