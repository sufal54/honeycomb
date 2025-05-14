import { IncomingMessage, ServerResponse } from "node:http";

export class Req extends IncomingMessage {
    params = Object.assign({});
    query = Object.assign({});
    body = Object.assign({});
}

export class Res extends ServerResponse {
    status(code: number): this {
        this.statusCode = code;
        return this;
    }

    json(body: Object): void {
        this.setHeader("Content-Type", "application/json");
        this.end(JSON.stringify(body));
    }

    send(body: string): void {
        this.setHeader("Content-Type", "text/plain");
        this.end(body);
    }

    cookie(tokenName: string, token: string, { HttpOnly = false, MaxAge, Secure = false, SameSite }: { HttpOnly?: boolean, MaxAge?: number, Secure?: boolean, SameSite?: string }): this {
        this.setHeader("Set-Cookie",
            `${tokenName}=${token}; Max-Age=${MaxAge}; ${Secure ? "Secure;" : ""} ${HttpOnly ? "HttpOnly;" : ""} ${SameSite ? SameSite + ";" : ""}`
        )
        return this;
    }
}
