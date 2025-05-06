import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { describe, expect, it } from "vitest";
import { HTTPException } from "hono/http-exception";
import { handleError, handleZodError } from "./handler";
import { InternalServerError, UnauthorizedError } from "./error";
import { RequestClient } from "@/tests/request";

describe("handleZodError", () => {
  const exampleRoute = createRoute({
    method: "get",
    path: "/{id}",
    request: {
      params: z.object({
        id: z.coerce.number(),
      }),
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({
              id: z.number(),
            }),
          },
        },
        description: "success",
      },
    },
  });

  const app = new OpenAPIHono({
    defaultHook: handleZodError,
  });
  app.openapi(exampleRoute, (c) => {
    const { id } = c.req.valid("param");
    return c.json({ id }, 200);
  });
  const client = new RequestClient(app);

  it("result.successがfalseの場合、400", async () => {
    const res = await client.request("GET", "/abc");

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      message: 'Validation error: Expected number, received nan at "id"',
    });
  });

  it("それ以外の場合、200になる", async () => {
    const res = await client.request("GET", "/1");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: 1 });
  });
});

describe("handleError", () => {
  it("401", async () => {
    const app = new OpenAPIHono();
    app.onError(handleError);

    app.get("/", () => {
      throw new HTTPException(401);
    });
    const client = new RequestClient(app);

    const res = await client.request("GET", "/");

    const e = new UnauthorizedError();
    expect(res.status).toBe(e.status);
    expect(await res.json()).toEqual({ message: e.message });
  });

  it("500", async () => {
    const app = new OpenAPIHono();
    app.onError(handleError);

    app.get("/", () => {
      throw new Error();
    });
    const client = new RequestClient(app);

    const res = await client.request("GET", "/");

    const e = new InternalServerError();
    expect(res.status).toBe(e.status);
    expect(await res.json()).toEqual({ message: e.message });
  });
});
