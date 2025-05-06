import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, type RouteConfig } from "@hono/zod-openapi";
import { handleError, handleZodError } from "@/errors";

export const newApp = () => {
  const app = new OpenAPIHono({
    defaultHook: handleZodError,
  });
  app.onError(handleError);
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const _openapi: App["openapi"];
export type AppContext<R extends RouteConfig> = Parameters<
  Parameters<typeof _openapi<R>>[1]
>[0];
