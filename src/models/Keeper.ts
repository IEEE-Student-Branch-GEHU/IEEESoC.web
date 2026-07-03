import mongoose, { Schema, Document } from "mongoose";

export interface IKeeper extends Document {
  name: string;
  role: string;
  chroniclesCount: number;
  reputationPoints: number;
  imageUrl: string;
  status: "active" | "dormant" | "synchronizing";
  createdAt: Date;
  updatedAt: Date;
}

const KeeperSchema = new Schema<IKeeper>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  chroniclesCount: { type: Number, default: 0 },
  reputationPoints: { type: Number, default: 0 },
  imageUrl: { type: String, default: "" },
  status: { type: String, enum: ["active", "dormant", "synchronizing"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

KeeperSchema.pre("save", function () {
  this.updatedAt = new Date();
});

const KeeperModel: mongoose.Model<IKeeper> =
  (mongoose.models.Keeper as mongoose.Model<IKeeper>) ||
  mongoose.model<IKeeper>("Keeper", KeeperSchema);

export default KeeperModel;
