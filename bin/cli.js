#!/usr/bin/env node

import { io } from "socket.io-client";
import axios from "axios";
import { program } from "commander";
import { getToken } from "../lib/auth.js";
import invalidateToken from "../lib/invalidateToken.js";
import ora from "ora";
import chalk from "chalk";


program
  .requiredOption("-p, --port <number>", "local port to expose")
  .option("-n, --name <string>", "requested tunnel name (optional)", "");

program.parse(process.argv);
const opts = program.opts();

if (isNaN(parseInt(opts.port))) {
  console.error(chalk.red("✖ Error:"), "Port must be a number.");
  process.exit(1);
}

if (opts.name && !/^[a-zA-Z0-9-_]+$/.test(opts.name)) {
  console.error(
    chalk.red("✖ Error:"),
    "Tunnel name can only contain letters, numbers, hyphens, and underscores."
  );
  process.exit(1);
}

if (opts.name.length > 32) {
  cconsole.error(chalk.red("✖ Error:"), "Tunnel name cannot exceed 32 characters.");
  process.exit(1);
}

const tunnelServer = process.env.TUNNEL_SERVER || "https://tunnel.hcodes.tech";

let token = await getToken();

const spinner = ora({
  text: chalk.cyan("Connecting to tunnel server..."),
  color: "cyan",
}).start();

const socket = io(tunnelServer, { transports: ["websocket"], auth: { token } });

socket.on("connect", () => {
  spinner.succeed(chalk.green("Connected to tunnel server"));
  console.log(chalk.gray(`Socket ID: ${socket.id}`));

  spinner.start(chalk.cyan("Registering tunnel..."));
  socket.emit("register", { name: opts.name });
});

socket.on("connect_error", async (err) => {
  spinner.fail(chalk.red("Connection failed"));
  if (err.message === "AUTHTOKEN_INVALID" || err.message === "AUTHTOKEN_MISSING") {
    console.log(chalk.yellow("Refreshing session token..."));
    await invalidateToken();
    token = await getToken();
    socket.auth = { token };
    socket.connect();
  }
  else {
    console.error(chalk.red("✖ Connection error:"), err.message);
    process.exit(1);
  }
});

socket.on("registered", (msg) => {
  spinner.succeed(chalk.green("Tunnel registered successfully"));
  console.log(
    chalk.bold(`\n🔗 Public URL: ${chalk.blueBright(msg.url)}`)
  );
});

socket.on("register_error", (err) => {
  spinner.fail(chalk.red("Registration failed"));
  console.error(chalk.red("✖ Error:"), err.message);
  process.exit(1);
});

socket.on("register_warning", ({warnings}) => {
  console.log(chalk.yellow("\n⚠ Warnings:"));
  warnings.forEach((w) => console.log(chalk.yellow(`  - ${w}`)));
});

socket.on("request", async (req) => {
  const { id, method, path, headers, bodyB64 } = req;
  console.log("Raw path received from server:", JSON.stringify(path));

  try {
    const url = `http://127.0.0.1:${opts.port}${path}`;
    const safeHeaders = { ...headers };
    delete safeHeaders.host;
    delete safeHeaders["x-forwarded-for"];
    delete safeHeaders["x-forwarded-proto"];
    delete safeHeaders["x-real-ip"];
    delete safeHeaders.connection;

    const axiosConfig = {
      method: method.toLowerCase(),
      url,
      headers: safeHeaders,
      responseType: "arraybuffer",
      validateStatus: () => true,
    };

    if (bodyB64) {
      axiosConfig.data = Buffer.from(bodyB64, "base64");
    }

    // console.log("Final URL:", url);

    const response = await axios(axiosConfig);
    const respBodyB64 = response.data
      ? Buffer.from(response.data).toString("base64")
      : null;

    // console.log("Received response status:", response.status);

    // if (response.status >= 300 && response.status < 400) {
    //   console.log("Redirect detected:", response.headers.location);
    // }

    socket.emit("response", {
      id,
      statusCode: response.status,
      headers: response.headers,
      bodyB64: respBodyB64,
    });
  } catch (err) {
    socket.emit("response", {
      id,
      statusCode: 502,
      headers: {},
      bodyB64: Buffer.from("client error: " + err.message).toString("base64"),
    });
    console.error(chalk.red("✖ Request error:"), err.message);
  }
});

socket.on("disconnect", () => {
  console.log(chalk.yellow("\n⚠ Disconnected from server"));
});
