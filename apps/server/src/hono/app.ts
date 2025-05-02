import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";

export const newApp = () => {
  const app = new OpenAPIHono();

  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "API",
    },
  });
  app.get("/swagger-ui", swaggerUI({ url: "/doc" }));

  return app;
};

export type App = ReturnType<typeof newApp>;
