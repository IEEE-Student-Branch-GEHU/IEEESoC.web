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
    if (!name || !email || !password) {
      res.status(400).json({ error: "name, email, and password are required" });
      return;
    }
    if (typeof password !== "string" || password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
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

    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
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
    const { name, password, githubUsername, linkedinUsername } = req.body;
    const update: any = {};

    if (name) update.name = name;
    if (githubUsername !== undefined) update.githubUsername = githubUsername;
    if (linkedinUsername !== undefined) update.linkedinUsername = linkedinUsername;
    if (password) {
      update.passwordHash = await bcrypt.hash(password, 12);
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
    if (!name || !email || !password) {
      res.status(400).json({ error: "name, email, and password are required" });
      return;
    }
    if (typeof password !== "string" || password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
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
