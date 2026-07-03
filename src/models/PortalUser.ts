import mongoose, { Schema, Document } from "mongoose";

export interface IPortalUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "contributor" | "admin";
  githubUsername?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PortalUserSchema = new Schema<IPortalUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["contributor", "admin"], default: "contributor" },
  githubUsername: { type: String },
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PortalUserSchema.pre("save", function () {
  this.updatedAt = new Date();
});

const PortalUserModel: mongoose.Model<IPortalUser> =
  (mongoose.models.PortalUser as mongoose.Model<IPortalUser>) ||
  mongoose.model<IPortalUser>("PortalUser", PortalUserSchema);

export default PortalUserModel;
