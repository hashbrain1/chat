import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectDB } from "./Utils/db.js";
import chatRouter from "./Routes/Chat.Routes.js";
import authRouter from "./Routes/Auth.Routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL,       // production (e.g. https://yourfrontend.com)
   process.env.FRONTEND_URL1,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow same-origin (like curl/postman with no origin)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.set("trust proxy", 1);

app.use("/auth",authRouter)
app.use("/api",chatRouter)


const liveServer = async () => {
  try {
   await connectDB();
    app.listen(port, () => {
      console.log(`Backend server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error in liveserver", error);
  }
};

liveServer();
