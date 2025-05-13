import { honeycomb, Req, Res, Next } from "./lib/honeycomb";

const app = honeycomb();

// Global Middleware
app.use((req: Req, res: Res, next: Next) => {
    console.log("Global Middleware");
    next();
})

//Get Request
app.get("/get", (req: Req, res: Res) => {
    res.status(200).send("Hello From Server");
});

// Specific Route or Multiple Layer of Middleware suppoted
// Post Request
app.post("/post", (req: Req, res: Res, next: Next) => {
    console.log("Middleware 1");
    next();
}, (req: Req, res: Res, next: Next) => {
    console.log("Middleware 2");
    next();
}, (req: Req, res: Res) => {
    try {
        // For Body Parse Method Must be PUT or POST 
        const { id, name } = req.body;
        res.status(200).json({ success: true, message: `${id}: ${name}` });
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

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
})
