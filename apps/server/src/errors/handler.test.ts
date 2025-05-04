import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { describe, expect, it } from "vitest";
import { handleError, handleZodError } from "./handler";
import { InternalServerError } from "./error";

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

  it("result.successがfalseの場合、400", async () => {
    const res = await app.request("/abc");

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      message: 'Validation error: Expected number, received nan at "id"',
    });
  });

  it("それ以外の場合、200になる", async () => {
    const res = await app.request("/1");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: 1 });
  });
});

describe("handleError", () => {
  it("500", async () => {
    const app = new OpenAPIHono();
    app.onError(handleError);

    app.get("/", () => {
      throw new Error();
    });

    const res = await app.request("/");

    const e = new InternalServerError();
    expect(res.status).toBe(e.status);
    expect(await res.json()).toEqual({ message: e.message });
  });
});
