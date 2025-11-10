import fs from "fs-extra";
import path from "path";

const CONFIG_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".netcrux",
  "config.json"
);

const invalidateToken = async () => {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      await fs.remove(CONFIG_PATH);
      console.log("Old token invalidated successfully. Please login again.");
    }
  } catch (error) {
    console.error("Failed to invalidate token:", error.message);
  }
};

export default invalidateToken;
