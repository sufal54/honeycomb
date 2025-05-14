"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Res = exports.Req = void 0;
const node_http_1 = require("node:http");
class Req extends node_http_1.IncomingMessage {
    constructor() {
        super(...arguments);
        this.params = Object.assign({});
        this.query = Object.assign({});
        this.body = Object.assign({});
    }
}
exports.Req = Req;
class Res extends node_http_1.ServerResponse {
    status(code) {
        this.statusCode = code;
        return this;
    }
    json(body) {
        this.setHeader("Content-Type", "application/json");
        this.end(JSON.stringify(body));
    }
    send(body) {
        this.setHeader("Content-Type", "text/plain");
        this.end(body);
    }
    cookie(tokenName, token, { HttpOnly = false, MaxAge, Secure = false, SameSite }) {
        this.setHeader("Set-Cookie", `${tokenName}=${token}; Max-Age=${MaxAge}; ${Secure ? "Secure;" : ""} ${HttpOnly ? "HttpOnly;" : ""} ${SameSite ? SameSite + ";" : ""}`);
        return this;
    }
}
exports.Res = Res;
