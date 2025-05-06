import type { RouteConfig } from "@hono/zod-openapi";
import {
  errorResponseSchemaFactory,
  SuccessResponseSchema,
} from "./schema/response";

export const errorResponses = {
  400: {
    content: {
      "application/json": {
        schema: errorResponseSchemaFactory("bad request"),
      },
    },
    description: "bad request",
  },
  401: {
    content: {
      "application/json": {
        schema: errorResponseSchemaFactory("unauthorized"),
      },
    },
    description: "unauthorized",
  },
  404: {
    content: {
      "application/json": {
        schema: errorResponseSchemaFactory("not found"),
      },
    },
    description: "not found",
  },
  500: {
    content: {
      "application/json": {
        schema: errorResponseSchemaFactory("internal server error"),
      },
    },
    description: "internal server error",
  },
} satisfies RouteConfig["responses"];

export const successResponse = {
  200: {
    content: {
      "application/json": {
        schema: SuccessResponseSchema,
      },
    },
    description: "success",
  },
} satisfies RouteConfig["responses"];
