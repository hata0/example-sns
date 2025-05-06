import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, type RouteConfig } from "@hono/zod-openapi";
import { bearerAuth } from "hono/bearer-auth";
import { basicAuth } from "hono/basic-auth";
import { handleError, handleZodError } from "@/errors";

export const newApp = () => {
  const app = new OpenAPIHono({
    defaultHook: handleZodError,
  });
  app.onError(handleError);

  if (process.env.NODE_ENV !== "development") {
    const token = process.env.BEARER_TOKEN;
    const username = process.env.BASIC_AUTH_USERNAME;
    const password = process.env.BASIC_AUTH_PASSWORD;

    if (!token) {
      throw new Error("bearer token is required");
    }
    if (!username) {
      throw new Error("basic auth username is required");
    }
    if (!password) {
      throw new Error("basic auth password is required");
    }

    app.use(
      "/doc",
      bearerAuth({
        token,
      }),
    );
    app.use(
      "/swagger-ui",
      basicAuth({
        username,
        password,
      }),
    );
  }

  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "API",
    },
  });
  app.get(
    "/swagger-ui",
    swaggerUI({
      url: "/doc",
      requestInterceptor: `
        request => {
          if (request.url === '/doc') {
            request.headers['authorization'] = \`Bearer bearer-token\`;
          }
          return request;
        }
      `,
    }),
  );

  return app;
};

export type App = ReturnType<typeof newApp>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const _openapi: App["openapi"];
export type AppContext<R extends RouteConfig> = Parameters<
  Parameters<typeof _openapi<R>>[1]
>[0];
