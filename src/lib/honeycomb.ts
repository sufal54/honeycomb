import { createServer } from "node:http";
import { Req, Res } from "./reqRes";
import path from "node:path";
import fs from "fs";

type Next = () => void;
type Middleware = (req: Req, res: Res, next: Next) => void;
type FinalHandle = (req: Req, res: Res) => void;
type RouterHandle = Middleware | FinalHandle;

class App {
    private routes: Record<string, Array<{
        path: string,
        regex: RegExp,
        paramNames: string[],
        queryNames: string[],
        handler: FinalHandle
    }>> = {};
    private middleware: Middleware[] = [];

    private settings: Record<string, string> = {};

    private ejs: any;

    use(middleware: Middleware) {
        this.middleware.push(middleware);
    }

    set(key: string, value: string) {
        this.settings[key] = value;
    }

    async rendeViews(view: string, data: Record<string, any>) {
        let ejs: typeof import("ejs");
        try {
            ejs = require("ejs");
        } catch (err) {
            throw new Error("EJS is not installed. Please run: npm install ejs");
        }
        const viewDir = this.settings["views"] || "./views";
        const filePath = path.join(viewDir, `${view}.ejs`);

        if (!fs.existsSync(filePath)) {
            throw new Error(`view "${view}.ejs" not found`);
        }

        return await ejs.renderFile(filePath, data || {}, { async: true });
    }

    private serveStaticFile(req: Req, res: Res): boolean {
        const staticDir = this.settings["static"] || "./public";
        const url = req.url || "/"
        const filePath = path.join(staticDir, decodeURIComponent(url));

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const types: Record<string, string> = {
                ".css": "text/css",
                ".js": "application/javascript",
                ".png": "image/png",
                ".jpg": "image/jpg",
                ".svg": "image/svg+xml"
            }

            const ext = path.extname(filePath).toLowerCase();
            const contentType = types[ext] || "application/octet-stream";

            res.writeHead(200, { "content-type": contentType });
            fs.createReadStream(filePath).pipe(res);
            return true;
        }
        return false;
    }

    // overload
    private appRoute(method: string, path: string, handle: FinalHandle): void;
    private appRoute(method: string, path: string, m1: Middleware, handle: FinalHandle): void;
    private appRoute(method: string, path: string, m1: Middleware, m2: Middleware, handle: FinalHandle): void;
    private appRoute(method: string, path: string, ...handles: RouterHandle[]): void;

    private appRoute(method: string, path: string, ...handles: RouterHandle[]) {

        if (!this.routes[method]) {
            this.routes[method] = [];
        }

        const middlewares = handles.slice(0, -1) as Middleware[];
        const finalHandler = handles[handles.length - 1] as FinalHandle;
        const { regex, paramNames, queryNames } = this.pathToRegex(path);
        this.routes[method].push({
            path,
            regex,
            paramNames,
            queryNames,
            handler: (req, res) => {
                let i = 0;
                const next = () => {
                    const middleware = middlewares[i++];
                    if (middleware) {
                        middleware(req, res, next);
                    } else {
                        finalHandler(req, res);
                    }
                };
                next();
            }
        })
    }

    // overload
    get(path: string, handle: FinalHandle): void;
    get(path: string, m1: Middleware, handle: FinalHandle): void;
    get(path: string, m1: Middleware, m2: Middleware, handle: FinalHandle): void;
    get(path: string, ...handles: RouterHandle[]): void;

    get(path: string, ...handles: RouterHandle[]) {
        this.appRoute('GET', path, ...handles);
    }

    //overload
    post(path: string, handle: FinalHandle): void;
    post(path: string, m1: Middleware, handle: FinalHandle): void;
    post(path: string, m1: Middleware, m2: Middleware, handle: FinalHandle): void;
    post(path: string, ...handles: RouterHandle[]): void;

    post(path: string, ...handles: RouterHandle[]) {
        this.appRoute('POST', path, ...handles);
    }

    put(path: string, handle: FinalHandle): void;
    put(path: string, m1: Middleware, handle: FinalHandle): void;
    put(path: string, m1: Middleware, m2: Middleware, handle: FinalHandle): void;
    put(path: string, ...handles: RouterHandle[]): void;

    put(path: string, ...handles: RouterHandle[]) {
        this.appRoute('PUT', path, ...handles);
    }

    delete(path: string, handle: FinalHandle): void;
    delete(path: string, m1: Middleware, handle: FinalHandle): void;
    delete(path: string, m1: Middleware, m2: Middleware, handle: FinalHandle): void;
    delete(path: string, ...handles: RouterHandle[]): void;

    delete(path: string, ...handles: RouterHandle[]) {
        this.appRoute('DELETE', path, ...handles);
    }


    listen(port: number, callback?: () => void) {
        const server = createServer((req, res) => {

            const newReq = Object.setPrototypeOf(req, Req.prototype) as Req;
            const newRes = Object.setPrototypeOf(res, Res.prototype) as Res;
            let i = 0;
            const next = () => {
                const middleware = this.middleware[i++];
                if (middleware) {
                    middleware(newReq, newRes, next);
                } else {
                    this.handleRequest(newReq, newRes);
                }
            }
            next();
        });
        server.listen(port, callback);
    }

    private async handleRequest(req: Req, res: Res) {
        const method = req.method || "GET";
        const routers = this.routes[method];
        if (!routers) {
            res.status(404).json({ success: false, message: "Not Found" });
        }
        if (this.serveStaticFile(req, res)) {
            return;
        }

        res.render = async (view: string, data?: Record<string, any>): Promise<void> => {
            res.writeHead(200, { "content-type": "text/html" });
            const html = await this.rendeViews(view, data || {});
            res.end(html);
        }


        const url = req.url || "/";
        const [pathName, queryString = ""] = url.split("?");

        const params = new URLSearchParams(queryString);
        const query: Record<string, string> = {};
        for (const [key, value] of params.entries()) {
            query[key] = value;
        }

        req.query = Object.assign(query);

        await this.bodyParsed(req);

        for (const route of routers) {
            if (pathName == route.path) {
                return route.handler(req, res);
            }
            const match = url.match(route.regex);
            if (match) {
                const params: Record<string, string> = {};
                route.paramNames.forEach((name, index) => {
                    params[name] = match[index + 1];
                });

                req.params = params;

                return route.handler(req, res);
            }
        }
        res.status(404).json({ success: false, message: "Not Found" });
    }
    private async bodyParsed(req: Req) {
        if (req.method === "POST" || req.method == "PUT") {
            let body = "";

            req.body = await new Promise((resolve, reject) => {
                req.on("data", (chunk) => body += chunk);
                req.on("end", () => {
                    try {
                        resolve(body ? JSON.parse(body) : {});
                    } catch (err) {
                        reject(new Error("Invalid JSON in request body"));
                    }
                });
                req.on("error", reject);
            });
        } else {
            req.body = {};
        }
    }

    private pathToRegex(path: string) {
        const paramNames: string[] = [];

        const queryNames: string[] = [];

        const regexStr = path.replace(/:([^\/]+)/g, (_, key) => {
            paramNames.push(key);
            return '([^\\/]+)';
        });
        const regex = new RegExp(`^${regexStr}$`);
        return { regex, paramNames, queryNames };
    }

}


export const honeycomb = () => new App();

export { Res, Req, Next };

