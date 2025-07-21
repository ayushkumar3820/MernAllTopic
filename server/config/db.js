import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Print connected URL
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    // Check readyState (1 = connected)
    if (conn.connection.readyState === 1) {
      console.log("✅ MongoDB is ready.");
    } else {
      console.log(`⚠️ MongoDB not ready. State: ${conn.connection.readyState}`);
    }
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};
