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

## Why Honeycomb?

Honeycomb gives you full control with zero bloat. It’s perfect for learning, extending, or building small to mid-sized APIs without the overhead of full frameworks.

## License

MIT
