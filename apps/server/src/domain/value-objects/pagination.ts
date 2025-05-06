import { z } from "zod";
import { err, ok, ValidationError, type Result } from "@/errors";

const limitSchema = z.number().min(1);
const pageSchema = z.number().min(1);

export class Pagination {
  private constructor(
    public readonly limit: number,
    public readonly page: number,
  ) {}

  static create(
    limit: number,
    page: number,
  ): Result<Pagination, ValidationError> {
    const res = this.validate(limit, page);
    if (res.isErr()) {
      return err(res.error);
    }
    return ok(new Pagination(limit, page));
  }

  private static validate(
    limit: number,
    page: number,
  ): Result<void, ValidationError> {
    const limitOrError = limitSchema.safeParse(limit);
    if (!limitOrError.success) {
      return err(
        new ValidationError("limit must be greater than or equal to 1"),
      );
    }
    const pageOrError = pageSchema.safeParse(page);
    if (!pageOrError.success) {
      return err(
        new ValidationError("page must be greater than or equal to 1"),
      );
    }
    return ok();
  }
}
