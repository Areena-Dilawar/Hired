import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  resumeUrl: string;
  resumePublicId: string;
  coverLetter?: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
  employerNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: { type: String, required: true },
    resumePublicId: { type: String, required: true },
    coverLetter: { type: String, maxlength: 2000 },
    status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "rejected"],
      default: "pending",
    },
    employerNote: { type: String },
  },
  { timestamps: true }
);

ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;