import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  description: string;
  requirements?: string;
  salary?: string;
  skills: string[];
  postedBy: mongoose.Types.ObjectId;
  isActive: boolean;
  applicationCount: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "remote"],
      required: true,
    },
    description: { type: String, required: true },
    requirements: { type: String },
    salary: { type: String },
    skills: [{ type: String }],
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
    applicationCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

JobSchema.index({ title: "text", company: "text", description: "text" });
JobSchema.index({ type: 1, isActive: 1 });
JobSchema.index({ postedBy: 1, createdAt: -1 });
JobSchema.index({ createdAt: -1 });

const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);

export default Job;