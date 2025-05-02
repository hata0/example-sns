import { serve } from "@hono/node-server";
import type { OpenAPIHono } from "@hono/zod-openapi";

export const createHandler = (app: OpenAPIHono) => {
  serve(
    {
      fetch: app.fetch,
      port: 3000,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    },
  );
};
