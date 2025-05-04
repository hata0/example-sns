import { describe, expect, it } from "vitest";
import { Pagination } from "./pagination";
import { err, ok, ValidationError } from "@/errors";

describe("Pagination", () => {
  describe("create", () => {
    it("limitでValidationError", () => {
      const paginationOrError = Pagination.create(0, 1);
      expect(paginationOrError).toEqual(
        err(new ValidationError("limit must be greater than or equal to 1")),
      );
    });

    it("pageでValidationError", () => {
      const paginationOrError = Pagination.create(1, 0);
      expect(paginationOrError).toEqual(
        err(new ValidationError("page must be greater than or equal to 1")),
      );
    });

    it("ok", () => {
      const paginationOrError = Pagination.create(1, 1);
      expect(paginationOrError).toEqual(ok({ limit: 1, page: 1 }));
    });
  });
});
