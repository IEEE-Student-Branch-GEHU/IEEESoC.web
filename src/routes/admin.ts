import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Artifact from "../models/Artifact";
import Keeper from "../models/Keeper";
import BotConfig from "../models/BotConfig";
import PortalUser from "../models/PortalUser";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const withError = (res: Response, err: any, label: string) => {
  console.error(`Admin ${label} error:`, err);
  res.status(500).json({ error: `Failed to ${label}` });
};

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
    let config = await BotConfig.findOne();
    if (!config) {
      config = await BotConfig.create({});
    }
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
  linkedinUsername: u.linkedinUsername,
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
    const artifact = await Artifact.create(req.body);
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
    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid artifact ID" });
      return;
    }
    const artifact = await Artifact.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
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
    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid artifact ID" });
      return;
    }
    const artifact = await Artifact.findByIdAndDelete(id);
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
    const keeper = await Keeper.create(req.body);
    res.status(201).json({ success: true, keeper });
  } catch (err) {
    withError(res, err, "create keeper");
  }
});

router.put("/keepers/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid keeper ID" });
      return;
    }
    const keeper = await Keeper.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
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
    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid keeper ID" });
      return;
    }
    const keeper = await Keeper.findByIdAndDelete(id);
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
    let config = await BotConfig.findOne();
    if (!config) {
      config = await BotConfig.create({});
    }
    res.json({ success: true, config });
  } catch (err) {
    withError(res, err, "fetch bot config");
  }
});

router.put("/bot-config", async (req: Request, res: Response) => {
  try {
    const config = await BotConfig.findOneAndUpdate({}, req.body, { new: true, upsert: true, runValidators: true });
    res.json({ success: true, config });
  } catch (err) {
    withError(res, err, "update bot config");
  }
});



// ─── Users ───────────────────────────────────────────────────────────

router.get("/users", async (req: Request, res: Response) => {
  try {
    let query = {};
    if (req.query.q !== undefined) {
      if (typeof req.query.q !== "string") {
        res.status(400).json({ error: "Search query q must be a string" });
        return;
      }
      const q = req.query.q.trim();
      if (q.length >= 2) {
        const escapedQ = escapeRegExp(q);
        const regex = new RegExp(escapedQ, "i");
        query = {
          $or: [
            { name: regex },
            { email: regex },
            { githubUsername: regex },
            { linkedinUsername: regex },
          ],
        };
      }
    }
    const users = await PortalUser.find(query).select("-passwordHash").sort({ createdAt: -1 }).lean();
    res.json({ success: true, users: users.map(mapUser) });
  } catch (err) {
    withError(res, err, "fetch users");
  }
});

router.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, githubUsername, linkedinUsername } = req.body;
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "name, email, and password must be strings" });
      return;
    }
    if (role !== undefined && (typeof role !== "string" || !["admin", "contributor"].includes(role))) {
      res.status(400).json({ error: "role must be 'admin' or 'contributor'" });
      return;
    }
    if (githubUsername !== undefined && githubUsername !== null && typeof githubUsername !== "string") {
      res.status(400).json({ error: "githubUsername must be a string" });
      return;
    }
    if (linkedinUsername !== undefined && linkedinUsername !== null && typeof linkedinUsername !== "string") {
      res.status(400).json({ error: "linkedinUsername must be a string" });
      return;
    }

    const emailStr = String(email).toLowerCase();
    const existing = await PortalUser.findOne({ email: emailStr });
    if (existing) {
      res.status(409).json({ error: "A user with this email already exists" });
      return;
    }
    const passwordHash = await bcrypt.hash(String(password), 12);
    const user = await PortalUser.create({
      name: String(name),
      email: emailStr,
      passwordHash: String(passwordHash),
      role: String(role || "contributor") as "admin" | "contributor",
      githubUsername: githubUsername ? String(githubUsername) : undefined,
      linkedinUsername: linkedinUsername ? String(linkedinUsername) : undefined,
    });
    res.status(201).json({ success: true, user: mapUser(user) });
  } catch (err) {
    withError(res, err, "create user");
  }
});

router.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const update: {
      name?: string;
      role?: "admin" | "contributor";
      githubUsername?: string | null;
      linkedinUsername?: string | null;
      passwordHash?: string;
    } = {};

    if (req.body.name !== undefined) {
      if (typeof req.body.name !== "string") {
        res.status(400).json({ error: "name must be a string" });
        return;
      }
      update.name = String(req.body.name);
    }
    if (req.body.role !== undefined) {
      if (typeof req.body.role !== "string" || !["admin", "contributor"].includes(req.body.role)) {
        res.status(400).json({ error: "role must be admin or contributor" });
        return;
      }
      update.role = req.body.role as "admin" | "contributor";
    }
    if (req.body.githubUsername !== undefined) {
      if (req.body.githubUsername !== null && typeof req.body.githubUsername !== "string") {
        res.status(400).json({ error: "githubUsername must be a string or null" });
        return;
      }
      update.githubUsername = req.body.githubUsername === null ? null : String(req.body.githubUsername);
    }
    if (req.body.linkedinUsername !== undefined) {
      if (req.body.linkedinUsername !== null && typeof req.body.linkedinUsername !== "string") {
        res.status(400).json({ error: "linkedinUsername must be a string or null" });
        return;
      }
      update.linkedinUsername = req.body.linkedinUsername === null ? null : String(req.body.linkedinUsername);
    }
    if (req.body.password !== undefined) {
      if (typeof req.body.password !== "string") {
        res.status(400).json({ error: "password must be a string" });
        return;
      }
      update.passwordHash = await bcrypt.hash(String(req.body.password), 12);
    }

    const user = await PortalUser.findByIdAndUpdate(id, { $set: update }, { new: true }).select("-passwordHash");
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
    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }
    const user = await PortalUser.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    withError(res, err, "delete user");
  }
});

export default router;
