import { Router, Request, Response } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import PortalUser from "../models/PortalUser";
import { signToken, type JwtPayload } from "../middleware/auth";

const router = Router();

const FRONTEND_URL = process.env.APP_URL || "http://localhost:3000";

async function findOrCreateUser(profile: any, provider: "google" | "github") {
  const email = profile.emails?.[0]?.value || profile.username + "@" + provider + ".oauth";
  const name = profile.displayName || profile.username;
  const avatarUrl = profile.photos?.[0]?.value;
  const providerId = profile.id;
  const githubUsername = provider === "github" ? profile.username : undefined;

  const existing = await PortalUser.findOne({
    $or: [{ provider, providerId }, { email: email.toLowerCase() }],
  }).lean();

  if (existing) {
    const updated = await PortalUser.findByIdAndUpdate(
      existing._id,
      { $set: { provider, providerId, name, avatarUrl, githubUsername } },
      { returnDocument: "after" },
    ).lean();
    return updated;
  }

  const created = await PortalUser.create({
    name,
    email: email.toLowerCase(),
    provider,
    providerId,
    githubUsername,
    avatarUrl,
    role: "contributor",
  });
  return created.toObject();
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.APP_URL || "http://localhost:3001"}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await findOrCreateUser(profile, "google");
          done(null, user as any);
        } catch (err) {
          console.error("GoogleStrategy error:", err);
          done(err as Error);
        }
      },
    ),
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.APP_URL || "http://localhost:3001"}/api/auth/github/callback`,
        scope: ["user:email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await findOrCreateUser(profile, "github");
          done(null, user as any);
        } catch (err) {
          console.error("GitHubStrategy error:", err);
          done(err as Error);
        }
      },
    ),
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

  router.get(
    "/google/callback",
    (req: Request, res: Response, next) => {
      passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}?auth=failed` }, (err: any, user: any) => {
        if (err) {
          console.error("Google OAuth error:", err);
          res.redirect(`${FRONTEND_URL}?auth=error`);
          return;
        }
        if (!user) {
          res.redirect(`${FRONTEND_URL}?auth=failed`);
          return;
        }
        try {
          const payload: JwtPayload = { id: String(user._id), email: user.email, role: user.role };
          const token = signToken(payload);
          res.redirect(`${FRONTEND_URL}#token=${token}`);
        } catch (e) {
          console.error("Google callback error:", e);
          res.redirect(`${FRONTEND_URL}?auth=error`);
        }
      })(req, res, next);
    },
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }));

  router.get(
    "/github/callback",
    (req: Request, res: Response, next) => {
      passport.authenticate("github", { session: false, failureRedirect: `${FRONTEND_URL}?auth=failed` }, (err: any, user: any) => {
        if (err) {
          console.error("GitHub OAuth error:", err);
          res.redirect(`${FRONTEND_URL}?auth=error`);
          return;
        }
        if (!user) {
          res.redirect(`${FRONTEND_URL}?auth=failed`);
          return;
        }
        try {
          const payload: JwtPayload = { id: String(user._id), email: user.email, role: user.role };
          const token = signToken(payload);
          res.redirect(`${FRONTEND_URL}#token=${token}`);
        } catch (e) {
          console.error("GitHub callback error:", e);
          res.redirect(`${FRONTEND_URL}?auth=error`);
        }
      })(req, res, next);
    },
  );
}

export default router;
