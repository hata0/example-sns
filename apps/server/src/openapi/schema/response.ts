import { z } from "@hono/zod-openapi";

export const ErrorResponseSchema = z
  .object({
    message: z.string().openapi({ example: "bad request" }),
  })
  .openapi("ErrorResponse");
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const SuccessResponseSchema = z
  .object({
    message: z.literal("success").openapi({ example: "success" }),
  })
  .openapi("SuccessResponse");
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
