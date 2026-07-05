import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Artifact from "../models/Artifact";
import Keeper from "../models/Keeper";
import BotConfig from "../models/BotConfig";
import PortalUser from "../models/PortalUser";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

const withError = (res: Response, err: any, label: string) => {
  console.error(`Admin ${label} error:`, err);
  res.status(500).json({ error: `Failed to ${label}` });
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

const ALLOWED_ARTIFACT_FIELDS = ["name", "code", "description", "imageUrl", "dateCreated", "status"];
const ALLOWED_KEEPER_FIELDS = ["name", "role", "chroniclesCount", "reputationPoints", "imageUrl", "status"];
const ALLOWED_USER_FIELDS = ["name", "role", "githubUsername", "password"];

function pickFields(body: Record<string, any>, allowed: string[]): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  return result;
}

// ─── Public endpoints (no auth needed) ───────────────────────────────

router.get("/public/artifacts", async (_req: Request, res: Response) => {
  try {
    const items = await Artifact.find().sort({ dateCreated: -1 }).lean();
    res.json({ success: true, artifacts: items });
  } catch (err) {
    withError(res, err, "fetch public artifacts");
  }
});

router.get("/public/keepers", async (_req: Request, res: Response) => {
  try {
    const items = await Keeper.find().sort({ chroniclesCount: -1 }).lean();
    const ranked = items.map((k, i) => ({ rank: i + 1, ...k }));
    res.json({ success: true, keepers: ranked });
  } catch (err) {
    withError(res, err, "fetch public keepers");
  }
});

router.get("/public/bot-config", async (_req: Request, res: Response) => {
  try {
    let config = await BotConfig.findOneAndUpdate(
      {},
      { $setOnInsert: {} },
      { upsert: true, new: true },
    );
    res.json({ success: true, config });
  } catch (err) {
    withError(res, err, "fetch public bot config");
  }
});

// ─── Protected admin endpoints (auth required) ──────────────────────

router.use(authenticate, requireRole("admin"));

const mapUser = (u: any) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  githubUsername: u.githubUsername,
  avatarUrl: u.avatarUrl,
  createdAt: u.createdAt,
});

// ─── Artifacts ───────────────────────────────────────────────────────

router.get("/artifacts", async (_req: Request, res: Response) => {
  try {
    const items = await Artifact.find().sort({ dateCreated: -1 }).lean();
    res.json({ success: true, artifacts: items });
  } catch (err) {
    withError(res, err, "fetch artifacts");
  }
});

router.post("/artifacts", async (req: Request, res: Response) => {
  try {
    const data = pickFields(req.body, ALLOWED_ARTIFACT_FIELDS);
    if (!data.name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const artifact = await Artifact.create(data);
    res.status(201).json({ success: true, artifact });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({ error: "An artifact with this code already exists" });
      return;
    }
    withError(res, err, "create artifact");
  }
});

router.put("/artifacts/:id", async (req: Request, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "Invalid artifact ID" });
      return;
    }
    const data = pickFields(req.body, ALLOWED_ARTIFACT_FIELDS);
    const artifact = await Artifact.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!artifact) {
      res.status(404).json({ error: "Artifact not found" });
      return;
    }
    res.json({ success: true, artifact });
  } catch (err) {
    withError(res, err, "update artifact");
  }
});

router.delete("/artifacts/:id", async (req: Request, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "Invalid artifact ID" });
      return;
    }
    const artifact = await Artifact.findByIdAndDelete(req.params.id);
    if (!artifact) {
      res.status(404).json({ error: "Artifact not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    withError(res, err, "delete artifact");
  }
});


// ─── Keepers ─────────────────────────────────────────────────────────

router.get("/keepers", async (_req: Request, res: Response) => {
  try {
    const items = await Keeper.find().sort({ chroniclesCount: -1 }).lean();
    res.json({ success: true, keepers: items });
  } catch (err) {
    withError(res, err, "fetch keepers");
  }
});

router.post("/keepers", async (req: Request, res: Response) => {
  try {
    const data = pickFields(req.body, ALLOWED_KEEPER_FIELDS);
    if (!data.name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const keeper = await Keeper.create(data);
    res.status(201).json({ success: true, keeper });
  } catch (err) {
    withError(res, err, "create keeper");
  }
});

router.put("/keepers/:id", async (req: Request, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "Invalid keeper ID" });
      return;
    }
    const data = pickFields(req.body, ALLOWED_KEEPER_FIELDS);
    const keeper = await Keeper.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!keeper) {
      res.status(404).json({ error: "Keeper not found" });
      return;
    }
    res.json({ success: true, keeper });
  } catch (err) {
    withError(res, err, "update keeper");
  }
});

router.delete("/keepers/:id", async (req: Request, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "Invalid keeper ID" });
      return;
    }
    const keeper = await Keeper.findByIdAndDelete(req.params.id);
    if (!keeper) {
      res.status(404).json({ error: "Keeper not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    withError(res, err, "delete keeper");
  }
});



// ─── Bot Config ──────────────────────────────────────────────────────

router.get("/bot-config", async (_req: Request, res: Response) => {
  try {
    let config = await BotConfig.findOneAndUpdate(
      {},
      { $setOnInsert: {} },
      { upsert: true, new: true },
    );
    res.json({ success: true, config });
  } catch (err) {
    withError(res, err, "fetch bot config");
  }
});

router.put("/bot-config", async (req: Request, res: Response) => {
  try {
    const allowedFields = ["hydraulicPressure", "laserIntensity", "opticArraySync", "coreTemperature", "overclockActive"];
    const data = pickFields(req.body, allowedFields);
    const config = await BotConfig.findOneAndUpdate({}, data, { new: true, upsert: true, runValidators: true });
    res.json({ success: true, config });
  } catch (err) {
    withError(res, err, "update bot config");
  }
});



// ─── Users ───────────────────────────────────────────────────────────

router.get("/users", async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || "").trim();
    let query = {};
    if (q.length >= 2) {
      const regex = new RegExp(escapeRegex(q), "i");
      query = { $or: [{ name: regex }, { email: regex }, { githubUsername: regex }] };
    }
    const users = await PortalUser.find(query).select("-passwordHash").sort({ createdAt: -1 }).lean();
    res.json({ success: true, users: users.map(mapUser) });
  } catch (err) {
    withError(res, err, "fetch users");
  }
});

router.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, githubUsername } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "name, email, and password are required" });
      return;
    }
    if (typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({ error: "name must be a non-empty string" });
      return;
    }
    if (typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ error: "Invalid email format" });
      return;
    }
    if (typeof password !== "string" || password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }
    const validRoles = ["contributor", "admin"];
    const userRole = validRoles.includes(role) ? role : "contributor";

    const existing = await PortalUser.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ error: "A user with this email already exists" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await PortalUser.create({ name: name.trim(), email: email.toLowerCase(), passwordHash, role: userRole, githubUsername });
    res.status(201).json({ success: true, user: mapUser(user) });
  } catch (err) {
    withError(res, err, "create user");
  }
});

router.put("/users/:id", async (req: Request, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }
    const data = pickFields(req.body, ALLOWED_USER_FIELDS);
    if (data.role) {
      const validRoles = ["contributor", "admin"];
      if (!validRoles.includes(data.role)) {
        res.status(400).json({ error: "Invalid role" });
        return;
      }
    }
    if (data.password) {
      if (typeof data.password !== "string" || data.password.length < 8) {
        res.status(400).json({ error: "Password must be at least 8 characters" });
        return;
      }
      data.passwordHash = await bcrypt.hash(data.password, 12);
      delete data.password;
    }

    const user = await PortalUser.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).select("-passwordHash");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ success: true, user: mapUser(user) });
  } catch (err) {
    withError(res, err, "update user");
  }
});

router.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }
    const user = await PortalUser.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (user.role === "admin") {
      const adminCount = await PortalUser.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        res.status(400).json({ error: "Cannot delete the last admin user" });
        return;
      }
    }
    await PortalUser.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    withError(res, err, "delete user");
  }
});

export default router;
