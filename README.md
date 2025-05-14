# Honeycomb

**Honeycomb** is a clean and minimal web framework inspired by Express.js — built entirely from scratch using **raw TypeScript** with **no external libraries**.

## Installation

To install Honeycomb, run:

```
npm install @sufalctl/honeycomb
```

## Features

- Lightweight and fast
- Built with raw TypeScript (no dependencies)
- HTTP methods: `.get()`, `.post()`, `.put()`, `.delete()`
- Path parameters (e.g., `/user/:id`)
- Query parameter parsing
- Body parsing for JSON and plain text
- Middleware system:
  - Global middleware via `.use()`
  - Route-specific and multi-layered middleware
- Response methods:
  - `.send()` for plain text
  - `.json()` for JSON data
- Cookie support (set and read)

## Example

```ts
import { honeycomb, Req, Res, Next } from "./lib/honeycomb";

const app = honeycomb();

// Global Middleware
app.use((req: Req, res: Res, next: Next) => {
  console.log("Global Middleware");
  next();
});

//Get Request
app.get("/login", (req: Req, res: Res) => {
  // Set Cookie
  res
    .cookie("tokenName", "token", {
      HttpOnly: true,
      Secure: true,
      SameSite: "strict",
      MaxAge: 24 * 60 * 60 * 1000,
    })
    .status(200)
    .send("Hello From Server");
});

// Specific Route or Multiple Layer of Middleware suppoted
// Post Request
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
    try {
      // For Body Parse Method Must be PUT or POST
      const { id, name } = req.body;
      res.status(200).json({ success: true, message: `${id}: ${name}` });
    } catch (e) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

// Path Parameters /path/1/Alice
// Put Request
app.put("/path/:id/:name", (req, res) => {
  try {
    const { id, name } = req.params;
    res.status(200).json({ success: true, message: `${id}: ${name}` });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
// Query /path?name=Alice
// Delete Request
app.delete("/path", (req, res) => {
  try {
    const { name } = req.query;
    res.status(200).json({ success: true, message: `Delete ${name}` });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Listening
app.listen(3000, () => {
  console.log("Server Started");
});
```

## Why Honeycomb?

Honeycomb gives you full control with zero bloat. It’s perfect for learning, extending, or building small to mid-sized APIs without the overhead of full frameworks.

## License

MIT
