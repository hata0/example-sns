import type { Context, Env, ValidationTargets } from "hono";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";

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
    return c.json(
      { message: fromError(result.error).toString() },
      { status: 400 },
    );
  }
};

export const handleError = <E extends Env>(_: Error, c: Context<E>) => {
  return c.json({ message: "unexpected error occurred" }, { status: 500 });
};
