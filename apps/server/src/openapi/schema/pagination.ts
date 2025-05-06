import { z } from "@hono/zod-openapi";

export const PaginationSchema = z
  .object({
    limit: z.coerce.number().min(1).openapi({ example: 10 }),
    page: z.coerce.number().min(1).openapi({ example: 3 }),
  })
  .openapi("Pagination");
