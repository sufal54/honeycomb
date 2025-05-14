
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
import { Honeycomb } from '@sufalctl/honeycomb';

const app = new Honeycomb();

// Global middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route with path parameter
app.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  res.send(`Hello, ${name}!`);
});

// POST route with JSON body
app.post('/data', (req, res) => {
  res.json({ received: req.body });
});

// Start the server
app.listen(3000, () => {
  console.log('Honeycomb server running on http://localhost:3000');
});
```

## Why Honeycomb?

Honeycomb gives you full control with zero bloat. It’s perfect for learning, extending, or building small to mid-sized APIs without the overhead of full frameworks.

## License

MIT
