import { Router, Request, Response } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import PortalUser from "../models/PortalUser";
import { signToken, type JwtPayload } from "../middleware/auth";

const router = Router();

const FRONTEND_URL = process.env.APP_URL || "http://localhost:3000";

function findOrCreateUser(profile: any, provider: "google" | "github"): Promise<any> {
  const email = profile.emails?.[0]?.value || profile.username + "@github.oauth";
  const name = profile.displayName || profile.username;
  const avatarUrl = profile.photos?.[0]?.value;
  const providerId = profile.id;
  const githubUsername = provider === "github" ? profile.username : undefined;

  return PortalUser.findOneAndUpdate(
    { provider, providerId },
    { $setOnInsert: { name, email, provider, providerId, githubUsername, avatarUrl, role: "contributor" } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
}

if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env.APP_URL || "http://localhost:3001"}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await findOrCreateUser(profile, "google");
          done(null, user as any);
        } catch (err) {
          done(err as Error);
        }
      },
    ),
  );
}

if (process.env.GITHUB_CLIENT_ID) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: `${process.env.APP_URL || "http://localhost:3001"}/api/auth/github/callback`,
        scope: ["user:email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await findOrCreateUser(profile, "github");
          done(null, user as any);
        } catch (err) {
          done(err as Error);
        }
      },
    ),
  );
}

passport.serializeUser((user: any, done) => done(null, user._id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await PortalUser.findById(id).lean();
    done(null, user as any);
  } catch (err) {
    done(err);
  }
});

if (process.env.GOOGLE_CLIENT_ID) {
  router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

  router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}?auth=failed` }),
    (req: Request, res: Response) => {
      const user = req.user as any;
      const payload: JwtPayload = { id: String(user._id), email: user.email, role: user.role };
      const token = signToken(payload);
      res.redirect(`${FRONTEND_URL}?token=${token}`);
    },
  );
}

if (process.env.GITHUB_CLIENT_ID) {
  router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }));

  router.get(
    "/github/callback",
    passport.authenticate("github", { session: false, failureRedirect: `${FRONTEND_URL}?auth=failed` }),
    (req: Request, res: Response) => {
      const user = req.user as any;
      const payload: JwtPayload = { id: String(user._id), email: user.email, role: user.role };
      const token = signToken(payload);
      res.redirect(`${FRONTEND_URL}?token=${token}`);
    },
  );
}

export default router;
