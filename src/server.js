import mongoose from "mongoose";
import app from "./app.js";
import seedSuperAdmin from "./app/DB/index.js";

const PORT = process.env.PORT || 5000; 

let server;

async function bootstrap() {
  try {
    // MongoDB কানেকশন চেষ্টা করা হচ্ছে
    await mongoose.connect(
      "mongodb+srv://nk-traders:nk-traders@atlascluster.gc9l4fl.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster"
    );
    console.log("Database connected successfully");

    // সিডিং অপারেশন
    await seedSuperAdmin();

    // সার্ভার শুরু করা হচ্ছে (যদি ইতিমধ্যে শুরু না হয়ে থাকে)
    if (!server) {
      server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Error during bootstrap process:", error);

    // ত্রুটি ঘটলে সার্ভার বন্ধ করা হচ্ছে
    if (server) {
      server.close(() => {
        console.log("Server closed due to bootstrap failure");
      });
    }

    process.exit(1); // প্রক্রিয়া বন্ধ করা হচ্ছে ত্রুটির কারণে
  }
}

// লোকাল মেশিনে রান করার জন্য
if (process.env.NODE_ENV !== "production") {
  bootstrap();
}

// ভার্সেলের জন্য এক্সপোর্ট
let isServerStarted = false; // সার্ভার শুরু হয়েছে কিনা তা ট্র্যাক করার জন্য

export default async (req, res) => {
  if (!isServerStarted) {
    await bootstrap();
    isServerStarted = true; // সার্ভার শুরু হয়েছে বলে চিহ্নিত করা হচ্ছে
  }

  // Express অ্যাপকে রিকুয়েস্ট এবং রেসপন্স হ্যান্ডেল করতে দেওয়া হচ্ছে
  return app(req, res);
};