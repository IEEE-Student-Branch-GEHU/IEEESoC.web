import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, seedDevAdmin } from "./src/config/db";
import authRouter from "./src/routes/auth";
import oauthRouter from "./src/routes/oauth";
import usersRouter from "./src/routes/users";
import adminRouter from "./src/routes/admin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || "3001", 10);

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET || "session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/auth", oauthRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  const distPath = path.resolve(__dirname, "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

async function start() {
  await connectDB();
  await seedDevAdmin();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT} [${isProduction ? "production" : "development"}]`);
  });
}

start();
