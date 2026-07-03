import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import PortalUser from "../src/models/PortalUser";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const email = process.argv[2] || "admin@ieeesoc.com";
  const password = process.argv[3] || "admin123";
  const name = "Admin";

  const existing = await PortalUser.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    const passwordHash = await bcrypt.hash(password, 12);
    await PortalUser.findByIdAndUpdate(existing._id, { passwordHash, role: "admin" });
    console.log(`Password updated for ${email}`);
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await PortalUser.create({ name, email: email.toLowerCase(), passwordHash, role: "admin" });
    console.log(`Admin created: ${email} / ${password}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed();
