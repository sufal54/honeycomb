import { IncomingMessage, ServerResponse } from "node:http";

export class Req extends IncomingMessage {

    params = Object.assign({});

    query = Object.assign({});

    body = Object.assign({});
}

export class Res extends ServerResponse {
    status(code: number): this {
        this.statusCode = code;
        return this
    }
    json(body: Object): void {
        this.setHeader("Content-Type", "application/json");
        this.end(JSON.stringify(body));
    }
    send(body: string): void {
        this.setHeader("Content-Type", "text/plain");
        this.end(body);
    }
}
