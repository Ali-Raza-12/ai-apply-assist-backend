import mongoose, { Schema } from "mongoose";

const jobSchema = new mongoose.Schema({
  user: {
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
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

jobSchema.index({ user: 1, hrEmail: 1 }, { unique: true }); 

const Job = mongoose.model("Job", jobSchema);
export default Job;
