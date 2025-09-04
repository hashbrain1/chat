import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectDB } from "./Utils/db.js";
import router from "./Routes/Chat.Routes.js";

const app = express();
const port = 5000;

dotenv.config();

const allowedOrigins = [
  process.env.FRONTEND_URL,       // production (e.g. https://yourfrontend.com)
   process.env.FRONTEND_URL1,
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api",router)

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
