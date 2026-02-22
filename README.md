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
import { honeycomb, Req, Res, Next } from "@sufalctl/honeycomb";
import path from "node:path";

const app = honeycomb();

// ===================== Config ===================== //

app.set("views", path.join(__dirname, "views"));
app.set("static", path.join(__dirname, "public"));

// ===================== Global Middleware ===================== //

app.use((req: Req, res: Res, next: Next) => {
  console.log("Global Middleware Triggered");
  next();
});

// ===================== Routes ===================== //

app.get("/", (req: Req, res: Res) => {
  res.send("Hello from Honeycomb 🍯");
});

app.get("/login", (req: Req, res: Res) => {
  res
    .cookie("tokenName", "token", {
      HttpOnly: true,
      Secure: true,
      SameSite: "strict",
      MaxAge: 24 * 60 * 60 * 1000,
    })
    .status(200)
    .send("Logged In");
});

app.post(
  "/post",
  (req: Req, res: Res, next: Next) => {
    console.log("Middleware 1");
    next();
  },
  (req: Req, res: Res, next: Next) => {
    console.log("Middleware 2");
    next();
  },
  (req: Req, res: Res) => {
    const { id, name } = req.body;
    res.json({ success: true, message: `${id}: ${name}` });
  }
);

app.put("/path/:id/:name", (req: Req, res: Res) => {
  const { id, name } = req.params;
  res.json({ success: true, message: `${id}: ${name}` });
});

app.delete("/path", (req: Req, res: Res) => {
  const { name } = req.query;
  res.json({ success: true, message: `Delete ${name}` });
});

// ===================== Server ===================== //

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
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
