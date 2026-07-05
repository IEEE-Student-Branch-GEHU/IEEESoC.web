import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, seedDevAdmin } from "./src/config/db";
import authRouter from "./src/routes/auth";
import oauthRouter from "./src/routes/oauth";
import usersRouter from "./src/routes/users";
import adminRouter from "./src/routes/admin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || "3001", 10);

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET environment variable is required");
  process.exit(1);
}

const app = express();

const allowedOrigins = [
  "https://ieee-so-c-web.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});
app.use("/api/auth/login", authLimiter);

app.use("/api/auth", authRouter);
app.use("/api/auth", oauthRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  const distPath = path.resolve(__dirname, "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

async function start() {
  await connectDB();
  await seedDevAdmin();
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} [${isProduction ? "production" : "development"}]`);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down...");
    server.close(() => {
      import("mongoose").then(mongoose => {
        mongoose.connection.close(false).then(() => process.exit(0));
      });
    });
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
