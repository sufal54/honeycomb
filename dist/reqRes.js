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
    render(view, data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.writeHead(400, { "content-type": "text/plain" });
            this.end();
        });
    }
}
exports.Res = Res;
