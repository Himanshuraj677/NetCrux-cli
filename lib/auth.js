import fs from "fs-extra";
import axios from "axios";
import path from "path";
import inquirer from "inquirer";
import dotenv from "dotenv";

dotenv.config();

const CONFIG_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".netcrux",
  "config.json"
);
const SERVER_URL = process.env.TUNNEL_SERVER || "https://tunnel.hcodes.tech";

export async function getToken() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = await fs.readJson(CONFIG_PATH);
      if (data?.token) {
        return data.token;
      } else {
        console.warn("Config file found but token missing.");
      }
    }
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "Choose an option:",
        choices: ["Login", "Signup", "Exit"],
      },
    ]);

    if (choice === "Exit") {
      console.log("Exiting...");
      process.exit(0);
    }

    const { email, password } = await inquirer.prompt([
      {
        type: "input",
        name: "email",
        message: "Enter your email:",
      },
      {
        type: "password",
        name: "password",
        message: "Enter your password:",
        mask: "*",
      },
    ]);

    let endpoint = choice === "Signup" ? "/api/register" : "/api/login";
    const res = await axios.post(`${SERVER_URL}${endpoint}`, {
      email,
      password,
    });
    if (res.status !== 200 && res.status !== 201) {
      console.error("Authentication failed:", res.data.error || "Unknown error");
      process.exit(1);
    }
    const token = res.data.token;
    await fs.ensureDir(path.dirname(CONFIG_PATH));
    await fs.writeJson(CONFIG_PATH, { token }, { spaces: 2 });
    return token;
  } catch (error) {
    console.error("Authentication failed:", error.response?.data?.error || error.message);
    process.exit(1);
  }
}
