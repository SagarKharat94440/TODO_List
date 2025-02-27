import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default async function connect() {
    try {
        if (!process.env.DB_URL) {
            throw new Error("DB_URL is not defined in .env file");
        }

        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);

        console.log("✅ Connected to the database");
    } catch (error) {
        console.error("❌ Database connection error:", error);
        process.exit(1); // Exit the application on failure
    }
}
