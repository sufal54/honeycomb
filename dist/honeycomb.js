"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Req = exports.Res = exports.honeycomb = void 0;
const node_http_1 = require("node:http");
const reqRes_1 = require("./reqRes");
Object.defineProperty(exports, "Req", { enumerable: true, get: function () { return reqRes_1.Req; } });
Object.defineProperty(exports, "Res", { enumerable: true, get: function () { return reqRes_1.Res; } });
class App {
    constructor() {
        this.routes = {};
        this.middleware = [];
    }
    use(middleware) {
        this.middleware.push(middleware);
    }
    appRoute(method, path, ...handles) {
        if (!this.routes[method]) {
            this.routes[method] = [];
        }
        const middlewares = handles.slice(0, -1);
        const finalHandler = handles[handles.length - 1];
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
                    }
                    else {
                        finalHandler(req, res);
                    }
                };
                next();
            }
        });
    }
    get(path, ...handles) {
        this.appRoute('GET', path, ...handles);
    }
    post(path, ...handles) {
        this.appRoute('POST', path, ...handles);
    }
    put(path, ...handles) {
        this.appRoute('PUT', path, ...handles);
    }
    delete(path, ...handles) {
        this.appRoute('DELETE', path, ...handles);
    }
    listen(port, callback) {
        const server = (0, node_http_1.createServer)((req, res) => {
            const newReq = Object.setPrototypeOf(req, reqRes_1.Req.prototype);
            const newRes = Object.setPrototypeOf(res, reqRes_1.Res.prototype);
            let i = 0;
            const next = () => {
                const middleware = this.middleware[i++];
                if (middleware) {
                    middleware(newReq, newRes, next);
                }
                else {
                    this.handleRequest(newReq, newRes);
                }
            };
            next();
        });
        server.listen(port, callback);
    }
    handleRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const method = req.method || "GET";
            const routers = this.routes[method];
            if (!routers) {
                res.status(404).json({ success: false, message: "Not Found" });
            }
            const url = req.url || "/";
            const [pathName, queryString = ""] = url.split("?");
            const params = new URLSearchParams(queryString);
            const query = {};
            for (const [key, value] of params.entries()) {
                query[key] = value;
            }
            req.query = Object.assign(query);
            yield this.bodyParsed(req);
            for (const route of routers) {
                if (pathName == route.path) {
                    return route.handler(req, res);
                }
                const match = url.match(route.regex);
                if (match) {
                    const params = {};
                    route.paramNames.forEach((name, index) => {
                        params[name] = match[index + 1];
                    });
                    req.params = params;
                    return route.handler(req, res);
                }
            }
            res.status(404).json({ success: false, message: "Not Found" });
        });
    }
    bodyParsed(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.method === "POST" || req.method == "PUT") {
                let body = "";
                req.body = yield new Promise((resolve, reject) => {
                    req.on("data", (chunk) => body += chunk);
                    req.on("end", () => {
                        try {
                            resolve(body ? JSON.parse(body) : {});
                        }
                        catch (err) {
                            reject(new Error("Invalid JSON in request body"));
                        }
                    });
                    req.on("error", reject);
                });
            }
            else {
                req.body = {};
            }
        });
    }
    pathToRegex(path) {
        const paramNames = [];
        const queryNames = [];
        const regexStr = path.replace(/:([^\/]+)/g, (_, key) => {
            paramNames.push(key);
            return '([^\\/]+)';
        });
        const regex = new RegExp(`^${regexStr}$`);
        return { regex, paramNames, queryNames };
    }
}
const honeycomb = () => new App();
exports.honeycomb = honeycomb;
