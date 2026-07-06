import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import PortalUser from "../models/PortalUser";
import BlockedToken from "../models/BlockedToken";
import { authenticate, requireRole, signToken, JwtPayload } from "../middleware/auth";
import { getBotCollection } from "../config/db";

const router = Router();

router.post("/signup", authenticate, requireRole("admin"), async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, githubUsername, linkedinUsername } = req.body;
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" || password.length < 8) {
      res.status(400).json({ error: "name, email, and password (at least 8 chars) must be strings" });
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

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await PortalUser.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || "contributor",
      githubUsername,
      linkedinUsername,
    });

    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, githubUsername: user.githubUsername, linkedinUsername: user.linkedinUsername },
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "email and password must be strings" });
      return;
    }

    const user = await PortalUser.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const payload: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = signToken(payload);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        githubUsername: user.githubUsername,
        linkedinUsername: user.linkedinUsername,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/logout", authenticate, async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(400).json({ error: "No token provided" });
      return;
    }

    const decoded = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    const expiresAt = new Date(decoded.exp * 1000);

    await BlockedToken.create({ token, expiresAt });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (err: any) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Failed to logout" });
  }
});

router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await PortalUser.findById(req.user!.id).select("-passwordHash");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    let stats = {
      score: 0,
      mergedPRs: 0,
      openPRs: 0,
      totalPRs: 0,
    };

    if (user.githubUsername) {
      const botUsers = getBotCollection("users");
      const botUser = await botUsers.findOne({ username: user.githubUsername });
      if (botUser) {
        const prs = getBotCollection("pullrequests");
        const prCounts = await prs.aggregate([
          { $match: { author: botUser._id } },
          { $group: { _id: "$state", count: { $sum: 1 } } },
        ]).toArray();

        for (const row of prCounts) {
          if (row._id === "merged") stats.mergedPRs = row.count;
          if (row._id === "open") stats.openPRs = row.count;
          stats.totalPRs += row.count;
        }

        stats.score = botUser.score || 0;
      }
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        githubUsername: user.githubUsername,
        linkedinUsername: user.linkedinUsername,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
      stats,
    });
  } catch (err: any) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.patch("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const update: any = {};
    if (req.body.name !== undefined) {
      if (typeof req.body.name !== "string") {
        res.status(400).json({ error: "name must be a string" });
        return;
      }
      update.name = req.body.name;
    }
    if (req.body.githubUsername !== undefined) {
      if (req.body.githubUsername !== null && typeof req.body.githubUsername !== "string") {
        res.status(400).json({ error: "githubUsername must be a string or null" });
        return;
      }
      update.githubUsername = req.body.githubUsername;
    }
    if (req.body.linkedinUsername !== undefined) {
      if (req.body.linkedinUsername !== null && typeof req.body.linkedinUsername !== "string") {
        res.status(400).json({ error: "linkedinUsername must be a string or null" });
        return;
      }
      update.linkedinUsername = req.body.linkedinUsername;
    }
    if (req.body.password !== undefined) {
      if (typeof req.body.password !== "string" || req.body.password.length < 8) {
        res.status(400).json({ error: "password must be a string of at least 8 characters" });
        return;
      }
      update.passwordHash = await bcrypt.hash(req.body.password, 12);
    }

    const user = await PortalUser.findByIdAndUpdate(req.user!.id, update, { new: true }).select("-passwordHash");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ success: true, user });
  } catch (err: any) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

router.post("/setup", async (req: Request, res: Response) => {
  try {
    const { name, email, password, githubUsername, linkedinUsername } = req.body;
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" || password.length < 8) {
      res.status(400).json({ error: "name, email, and password (at least 8 chars) must be strings" });
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

    const adminExists = await PortalUser.countDocuments({ role: "admin" });
    if (adminExists > 0) {
      res.status(400).json({ error: "An admin already exists. Use signup with admin credentials instead." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await PortalUser.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $setOnInsert: { name, email: email.toLowerCase(), passwordHash, role: "admin", githubUsername, linkedinUsername } },
      { upsert: true, new: true },
    );

    res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role, githubUsername: user.githubUsername, linkedinUsername: user.linkedinUsername } });
  } catch (err: any) {
    console.error("Setup error:", err);
    res.status(500).json({ error: "Failed to create admin" });
  }
});

export default router;
