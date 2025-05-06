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
    init?: Omit<RequestInit, "headers" | "method"> & {
      headers?: HeadersInit;
      jsonBody?: unknown;
    },
  ) {
    const res = await this.app.request(`${this.baseUrl || ""}${input || ""}`, {
      headers: new Headers(
        init?.jsonBody
          ? {
              "Content-Type": "application/json",
              ...init?.headers,
            }
          : init?.headers,
      ),
      method,
      body: init?.jsonBody ? JSON.stringify(init.jsonBody) : undefined,
      ...init,
    });

    return res;
  }
}
