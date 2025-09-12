import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectDB } from "./Utils/db.js";
import chatRouter from "./Routes/Chat.Routes.js";
import authRouter from "./Routes/Auth.Routes.js";
import paymentRouter from "./Routes/Payment.Routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Allow only your production domain
const allowedOrigins = [
  process.env.FRONTEND_URL1,
  process.env.FRONTEND_URL2,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Not allowed by CORS: ${origin}`), false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Important for cookies over HTTPS (proxy headers from Nginx)
app.set("trust proxy", 1);

// Routes
app.use("/auth", authRouter);
app.use("/api", chatRouter);
app.use("/payments", paymentRouter);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`✅ Backend running on port ${port}`);
      console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
