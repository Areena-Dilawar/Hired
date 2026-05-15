import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "employer" | "seeker" | "admin";
  company?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  savedJobs?: mongoose.Types.ObjectId[];
  alertKeyword?: string;
  alertEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["employer", "seeker", "admin"],
      required: true,
    },
    company: { type: String, trim: true },
    avatar: { type: String },
    bio: { type: String, maxlength: 500 },
    skills: [{ type: String }],
    savedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    alertKeyword: { type: String },
    alertEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;