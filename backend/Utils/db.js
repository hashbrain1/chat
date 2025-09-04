import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo db connected successfully", conn.connection.name);
  } catch (error) {
    console.log("Error in mongo db connection", error);
  }
};
