# 🌐 NetCrux Client CLI

> **Expose your local server to the internet securely — powered by the NetCrux Tunnel Network.**

[![npm version](https://img.shields.io/npm/v/netcrux-client-cli.svg)](https://www.npmjs.com/package/netcrux-client-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)

---

## 🚀 Overview

**NetCrux** is a lightweight, secure, and developer-friendly tunneling tool that lets you **expose your local servers to the internet** through an encrypted WebSocket tunnel.

Use it to test webhooks, demo web apps, or share local projects — without deploying them publicly.

This is the **CLI client** for connecting to the NetCrux tunneling network.

---

## ✨ Features

- 🔒 **Secure WebSocket Tunnel** — All traffic is encrypted end-to-end.  
- 👤 **Authentication System** — Login and manage your tunnels via NetCrux account.  
- ⚙️ **Multiple Tiers** — Free, Pro, and Enterprise tiers with different capabilities.  
- 🔁 **Persistent Connections** — Keeps your tunnel alive even if your app restarts.  
- 🌍 **Custom Subdomains** — Reserve a subdomain for your tunnel.  
- 📦 **Simple CLI Interface** — Easy to use, no config files required.

---

## 📦 Installation

Install **NetCrux Client CLI** globally from npm:

```bash
npm install -g netcrux-client-cli
````

---

## 🧠 Usage

### 1. Start a Tunnel

Expose your local port (for example, port `3000`):

```bash
netcrux -p 3000
```

If you’re not logged in, NetCrux will automatically ask for your email and password, or offer to create a new account.

---

### 2. Use Custom Subdomain (Pro Users)

You can specify a custom subdomain using the `-n` flag (available for Pro and Enterprise tiers):

```bash
netcrux -p 3000 -n myapp
```

**Output:**

```bash
✔ Connected to tunnel server
Socket ID: YbAH508Z7__jkq21AAAF
⠹ Registering tunnel...
✔ Tunnel registered successfully

🔗 Public URL: https://myapp.tunnel.hcodes.tech
```
---

## 🔐 Authentication Flow

1. Run `netcrux -p <port>`
2. If unauthenticated:

   * CLI prompts with two options:

     * 🆕 **Sign Up** — Create a new NetCrux account
     * 🔐 **Login** — Use your existing credentials
3. Once authenticated, a secure tunnel is created automatically.
4. Credentials are stored locally for future sessions.

---


## 🧩 Example

Run a local Node.js app and expose it instantly:

```bash
node app.js
netcrux -p 3000
```

You’ll get a secure public URL like:

```
https://uecpztgsxx.tunnel.hcodes.tech
```

---

## 🔐 Authentication Tiers

| Tier           | Description         | Features                                   |
| -------------- | ------------------- | ------------------------------------------ |
| **Free**       | Basic tunnel access | Random subdomain, limited uptime           |
| **Pro**        | Premium user        | Custom subdomain, persistent tunnels       |
| **Enterprise** | Advanced users      | Custom domain, analytics, uptime guarantee |

---

## 🧰 Commands

| Command                            | Description                         |
| ---------------------------------- | ----------------------------------- |
| `netcrux -p <port>`                | Expose a local port                 |
| `netcrux -p <port> -n <subdomain>` | Expose with custom subdomain        |


---

## 🛠️ Tech Stack

* **Node.js + Commander** — CLI Framework
* **Socket.IO** — Real-time encrypted tunnel communication
* **Axios** — API interaction and authentication
* **Ora & Chalk** — Modern CLI animations and color output
* **fs-extra & dotenv** — Configuration and file management

---

## ⚠️ Deprecation Notice

> 🔴 Versions prior to **2.0.0** are deprecated.
> Please upgrade to the latest version for authentication and tiered access support:

```bash
npm install -g netcrux-client-cli@latest
```

---

## 🧑‍💻 Author

**Himanshu Raj**
Developer | Backend Engineer | Blockchain Enthusiast

[GitHub](https://github.com/Himanshuraj677) • [LinkedIn](https://www.linkedin.com/in/himanshu-raj-ba7643207/)

---

## 📄 License

This project is licensed under the **MIT License**.
Feel free to fork, contribute, and improve NetCrux!

---

## 💬 Feedback & Support

For feature requests, bug reports, or issues:

* 🐛 Report bugs on [GitHub Issues](https://github.com/Himanshuraj677/NetCrux-cli/issues)
* 💡 Feature suggestions are always welcome!

---

### ⭐ If you like this project, consider giving it a star!

```bash
npm star netcrux-client-cli
```

> *“Develop faster, demo smarter — with NetCrux.”*
