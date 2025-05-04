import type { Context, Env, ValidationTargets } from "hono";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";
import { InternalServerError } from "./error";

type Result = {
  target: keyof ValidationTargets;
} & (
  | {
      success: true;
      data: unknown;
    }
  | {
      success: false;
      error: ZodError;
    }
);

export const handleZodError = <E extends Env>(
  result: Result,
  c: Context<E>,
) => {
  if (!result.success) {
    return c.json({ message: fromError(result.error).toString() }, 400);
  }
};

export const handleError = <E extends Env>(_: Error, c: Context<E>) => {
  const error500 = new InternalServerError();
  return c.json({ message: error500.message }, error500.status);
};
