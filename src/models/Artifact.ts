import mongoose, { Schema, Document } from "mongoose";

export interface IArtifact extends Document {
  code: string;
  name: string;
  description: string;
  category: "Architectural" | "Mythological" | "Technical" | "Relic";
  imageUrl: string;
  loadIndex: number;
  purityIndex: number;
  cyberMeshLevel: number;
  archivist: string;
  dateCreated: string;
  createdAt: Date;
  updatedAt: Date;
}

const ArtifactSchema = new Schema<IArtifact>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["Architectural", "Mythological", "Technical", "Relic"], required: true },
  imageUrl: { type: String, default: "" },
  loadIndex: { type: Number, default: 50, min: 10, max: 100 },
  purityIndex: { type: Number, default: 75, min: 50, max: 100 },
  cyberMeshLevel: { type: Number, default: 5, min: 1, max: 10 },
  archivist: { type: String, default: "Archivist" },
  dateCreated: { type: String, default: () => new Date().toISOString().split("T")[0] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ArtifactSchema.pre("save", function () {
  this.updatedAt = new Date();
});

const ArtifactModel: mongoose.Model<IArtifact> =
  (mongoose.models.Artifact as mongoose.Model<IArtifact>) ||
  mongoose.model<IArtifact>("Artifact", ArtifactSchema);

export default ArtifactModel;
