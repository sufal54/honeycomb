# 🍯 Honeycomb

<p align="center">
  <b>Minimal. Express-inspired. Zero dependencies.</b>
</p>

<p align="center">
  Honeycomb is a clean and lightweight web framework inspired by Express.js —  
  built entirely from scratch using <b>raw TypeScript</b> with <b>no external libraries</b>.
</p>

---

## 📌 Table of Contents
- [Installation](#-installation)
- [Features](#-features)
- [Quick Example](#-quick-example)
- [Middleware System](#-middleware-system)
- [Routing](#-routing)
- [Why Honeycomb?](#-why-honeycomb)
- [License](#-license)

---

## 📦 Installation

```bash
npm install @sufalctl/honeycomb
```

# ✨ Features
<details> <summary><b>⚡ Core</b></summary>

- Lightweight & fast

- Zero dependencies

- Built with raw TypeScript

- Inspired by Express.js

</details> <details> <summary><b>🌐 HTTP & Routing</b></summary>

- .get(), .post(), .put(), .delete()

- Path parameters (/user/:id)

- Query parameters

- Clean routing system

</details> <details> <summary><b>🧩 Middleware</b></summary>

- Global middleware via .use()

- Route-specific middleware

- Multiple middleware layers per route

- Express-style next() flow

</details> <details> <summary><b>📨 Request & Response</b></summary>

- JSON & text body parsing

- res.send() for plain text

- res.json() for JSON responses

- Status chaining (res.status(200).json(...))

- Cookie read & write support

</details>

# 🚀 Quick Example

```ts
// Import the honeycomb framework and necessary types for TypeScript
import { honeycomb, Req, Res, Next } from "@sufalctl/honeycomb";

// Import Node.js built-in 'path' module for handling file and directory paths
import path from "node:path";

// Initialize the app using the honeycomb framework
const app = honeycomb();

// ===================== Configuration ===================== //

// Set the path to the views directory (for rendering templates like EJS or HTML)
app.set("views", path.join(__dirname, "views"));

// Set the path to serve static files (CSS, JS, images, etc.)
app.set("static", path.join(__dirname, "public"));

// ===================== Global Middleware ===================== //

// This middleware runs for all routes and methods
app.use((req: Req, res: Res, next: Next) => {
console.log("Global Middleware Triggered");
next();
});

// ===================== Routes ===================== //

// GET: Root route - renders a view with some user data
app.get("/", (req: Req, res: Res) => {
const data = {
username: "Alice",
age: 30,
skills: ["JavaScript", "TypeScript", "EJS"],
};

// Render 'hello' view (hello.ejs) and pass the data
res.render("hello", data);
});

// GET: /login - sets a secure HTTP-only cookie
app.get("/login", (req: Req, res: Res) => {
res
.cookie("tokenName", "token", {
HttpOnly: true,        // Prevent access from JavaScript
Secure: true,          // Ensures cookie is only sent over HTTPS
SameSite: "strict",    // Prevents CSRF attacks
MaxAge: 24 * 60 * 60 * 1000, // Cookie expiry in milliseconds (1 day)
})
.status(200)
.send("Hello From Server");
});

// POST: /post - example with multiple middlewares
app.post(
"/post",
// Middleware 1
(req: Req, res: Res, next: Next) => {
console.log("Middleware 1");
next();
},
// Middleware 2
(req: Req, res: Res, next: Next) => {
console.log("Middleware 2");
next();
},
// Main handler
(req: Req, res: Res) => {
try {
const { id, name } = req.body; // Make sure body parsing middleware is enabled if needed
res.status(200).json({ success: true, message: ${id}: ${name} });
} catch (e) {
res.status(500).json({ success: false, message: "Internal Server Error" });
}
}
);

// PUT: /path/:id/:name - route with path parameters
app.put("/path/:id/:name", (req: Req, res: Res) => {
try {
const { id, name } = req.params;
res.status(200).json({ success: true, message: ${id}: ${name} });
} catch (e) {
res.status(500).json({ success: false, message: "Internal Server Error" });
}
});

// DELETE: /path?name=Alice - route using query parameters
app.delete("/path", (req: Req, res: Res) => {
try {
const { name } = req.query;
res.status(200).json({ success: true, message: Delete ${name} });
} catch (e) {
res.status(500).json({ success: false, message: "Internal Server Error" });
}
});

// ===================== Server Listener ===================== //

// Start the server and listen on port 3000
app.listen(3000, () => {
console.log("Server Started on http://localhost:3000");
});
```

# 🧠 Middleware System

Honeycomb’s middleware system is simple and predictable:

```ts
app.use((req, res, next) => {
  // runs on every request
  next();
});

app.get(
  "/route",
  middleware1,
  middleware2,
  handler
);
```
- Middleware executes in order

- next() controls flow

- Fully type-safe with Req, Res, and Next

# 🛣️ Routing

Supported patterns:

```raw
/                → root
/user/:id        → path params
/search?name=... → query params
```
Access data via:
```ts
req.params
req.query
req.body
```

# 🤔 Why Honeycomb?

Honeycomb is designed for developers who want:

🧠 To understand how frameworks work internally

⚙️ Full control without magic

🪶 Zero bloat

🧪 A learning-friendly codebase

🚀 A solid base for small to mid-sized APIs

If Express feels too heavy and raw http feels too low-level — Honeycomb sits perfectly in between.

📜 License

MIT

<p align="center"> <b>🍯 Sweet. Simple. From first principles.</b> </p> 
