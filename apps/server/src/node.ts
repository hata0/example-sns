import { serve } from "@hono/node-server";
import type { OpenAPIHono } from "@hono/zod-openapi";

export const createHandler = (app: OpenAPIHono) => {
  const port = process.env.PORT;

  if (!port) {
    throw new Error("port is required");
  }

  serve(
    {
      fetch: app.fetch,
      port: Number(port),
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    },
  );
};
