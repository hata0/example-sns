import { z } from "@hono/zod-openapi";

export const errorResponseSchemaFactory = (exampleMessage: string) => {
  return z
    .object({
      message: z.string().openapi({ example: exampleMessage }),
    })
    .openapi("ErrorResponse");
};
export type ErrorResponse = z.infer<
  ReturnType<typeof errorResponseSchemaFactory>
>;

export const SuccessResponseSchema = z
  .object({
    message: z.literal("success").openapi({ example: "success" }),
  })
  .openapi("SuccessResponse");
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
