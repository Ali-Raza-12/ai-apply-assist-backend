import mongoose, { Schema } from "mongoose";

const jobSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  hrEmail: {
    type: String,
    required: true,
  },
  Status: {
    type: String
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

jobSchema.index({ user: 1, hrEmail: 1 }, { unique: true }); 

const Job = mongoose.model("Job", jobSchema);
export default Job;
