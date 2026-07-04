import mongoose, { Schema, Document } from "mongoose";

export interface IBotConfig extends Document {
  hydraulicPressure: number;
  laserIntensity: number;
  opticArraySync: number;
  coreTemperature: number;
  overclockActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BotConfigSchema = new Schema<IBotConfig>({
  hydraulicPressure: { type: Number, default: 75 },
  laserIntensity: { type: Number, default: 60 },
  opticArraySync: { type: Number, default: 85 },
  coreTemperature: { type: Number, default: 42 },
  overclockActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

BotConfigSchema.pre("save", function () {
  this.updatedAt = new Date();
});

const BotConfigModel: mongoose.Model<IBotConfig> =
  (mongoose.models.BotConfig as mongoose.Model<IBotConfig>) ||
  mongoose.model<IBotConfig>("BotConfig", BotConfigSchema);

export default BotConfigModel;
