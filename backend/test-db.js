const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

// Load .env
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "dji-drone-store";

console.log("--------------------------------------------------");
console.log("Testing MongoDB Atlas Connection...");
console.log("Target Database:", dbName);
console.log("URI:", uri ? uri.replace(/:([^:@]+)@/, ":****@") : "NOT SET");
console.log("--------------------------------------------------");

if (!uri) {
  console.error("Error: MONGODB_URI is not set in .env!");
  process.exit(1);
}

mongoose
  .connect(uri, {
    serverSelectionTimeoutMS: 5000,
    dbName: dbName,
  })
  .then(async () => {
    console.log(" SUCCESS! Connected to MongoDB Atlas successfully.");
    console.log("Host:", mongoose.connection.host);
    console.log("Database Name:", mongoose.connection.name);
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections in database:", collections.map((c) => c.name));
    
    await mongoose.disconnect();
    console.log("Connection closed cleanly.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Connection Failed!");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);

    if (err.message && err.message.includes("SSL alert number 80")) {
      console.error("\n Root Cause: IP Address Whitelist (Network Access)");
      console.error("Your MongoDB Atlas cluster rejected the connection because your current public IP is not in the Atlas IP Access List.");
      console.error("To fix this:");
      console.error("1. Open MongoDB Atlas (https://cloud.mongodb.com)");
      console.error("2. Go to 'Security' -> 'Network Access'");
      console.error("3. Click 'Add IP Address'");
      console.error("4. Choose 'Add Current IP Address' or 'Allow Access From Anywhere (0.0.0.0/0)'");
      console.error("5. Click 'Confirm' and wait 1 minute for it to apply.");
    }
    process.exit(1);
  });
