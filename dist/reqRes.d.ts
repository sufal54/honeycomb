import { IncomingMessage, ServerResponse } from "node:http";
export declare class Req extends IncomingMessage {
    params: any;
    query: any;
    body: any;
}
export declare class Res extends ServerResponse {
    status(code: number): this;
    json(body: Object): void;
    send(body: string): void;
    cookie(tokenName: string, token: string, { HttpOnly, MaxAge, Secure, SameSite }: {
        HttpOnly?: boolean;
        MaxAge?: number;
        Secure?: boolean;
        SameSite?: string;
    }): this;
}
