import mongoose from "mongoose";

let MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  if (!MONGODB_URI) {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    MONGODB_URI = mongod.getUri();
    console.log("🧪 Using in-memory MongoDB");
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

export async function seedDevAdmin() {
  const count = await mongoose.models.PortalUser?.countDocuments();
  if (count && count > 0) return;
  try {
    const { default: bcrypt } = await import("bcryptjs");
    const { default: PortalUser } = await import("../models/PortalUser");
    const hash = await bcrypt.hash("admin123", 12);
    await PortalUser.findOneAndUpdate(
      { email: "admin@ieeesoc.com" },
      { name: "Admin", email: "admin@ieeesoc.com", passwordHash: hash, role: "admin" },
      { upsert: true },
    );
    console.log("✅ Dev admin seeded: admin@ieeesoc.com / admin123");
  } catch {
    // models may not be loaded yet — safe to ignore
  }
}

export function getBotCollection(name: string) {
  return mongoose.connection.db.collection(name);
}
