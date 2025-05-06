import type { Context, Env, ValidationTargets } from "hono";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";
import { HTTPException } from "hono/http-exception";
import { InternalServerError, UnauthorizedError } from "./error";

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

export const handleError = <E extends Env>(error: Error, c: Context<E>) => {
  if (error instanceof ZodError) {
    // TODO: logの取り方を改善する
    console.log(error);
  } else if (error instanceof HTTPException && error.status === 401) {
    const error401 = new UnauthorizedError();
    return c.json({ message: error401.message }, error401.status);
  }

  const error500 = new InternalServerError();
  return c.json({ message: error500.message }, error500.status);
};
