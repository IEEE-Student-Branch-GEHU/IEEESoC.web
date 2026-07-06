import mongoose from "mongoose";

const blockedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export default mongoose.models.BlockedToken || mongoose.model("BlockedToken", blockedTokenSchema);
