import type { RouteConfig } from "@hono/zod-openapi";
import { ErrorResponseSchema, SuccessResponseSchema } from "./schema/response";

export const errorResponses = {
  400: {
    content: {
      "application/json": {
        schema: ErrorResponseSchema,
      },
    },
    description: "bad request",
  },
  404: {
    content: {
      "application/json": {
        schema: ErrorResponseSchema,
      },
    },
    description: "not found",
  },
  500: {
    content: {
      "application/json": {
        schema: ErrorResponseSchema,
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
