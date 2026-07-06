import { Router, Request, Response } from "express";
import PortalUser from "../models/PortalUser";
import { authenticate } from "../middleware/auth";
import { getBotCollection } from "../config/db";

const router = Router();

router.get("/search", authenticate, async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || "").trim();

    if (!q || q.length < 2) {
      res.json({ success: true, users: [] });
      return;
    }

    const regex = new RegExp(q, "i");
    const users = await PortalUser.find({
      $or: [
        { name: regex },
        { email: regex },
        { githubUsername: regex },
        { linkedinUsername: regex },
      ],
    })
      .select("-passwordHash")
      .limit(20)
      .lean();

    const results = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      githubUsername: u.githubUsername,
      linkedinUsername: u.linkedinUsername,
      avatarUrl: u.avatarUrl,
    }));

    res.json({ success: true, users: results });
  } catch (err: any) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

router.get("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await PortalUser.findById(req.params.id).select("-passwordHash").lean();
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    let stats = { score: 0, mergedPRs: 0, openPRs: 0 };

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
    console.error("User fetch error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
