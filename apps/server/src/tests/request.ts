import type { OpenAPIHono } from "@hono/zod-openapi";

type Method = "GET" | "HEAD" | "PUT" | "PATCH" | "POST" | "DELETE" | "OPTIONS";

export class RequestClient {
  constructor(
    private readonly app: OpenAPIHono,
    private readonly baseUrl?: RequestInfo | URL,
  ) {}

  async request(
    method: Method,
    input?: RequestInfo | URL,
    init?: Omit<RequestInit, "method" | "body"> & { body?: unknown },
  ) {
    const res = await this.app.request(`${this.baseUrl || ""}${input || ""}`, {
      headers: init?.body
        ? new Headers({ "Content-Type": "application/json" })
        : undefined,
      ...init,
      method,
      body: init?.body ? JSON.stringify(init.body) : undefined,
    });

    return res;
  }
}
