import { describe, expect, it } from "vitest";
import {
  GetPostQueryServiceInput,
  ListPostQueryServiceInput,
} from "./post-service";
import { postMock } from "@/tests/mocks";
import { ok, ValidationError } from "@/errors";

describe("GetPostQueryServiceInput", () => {
  const { id } = postMock();

  describe("getPostId", () => {
    it("should return PostId", () => {
      const input = new GetPostQueryServiceInput(id.value!);
      expect(input.getPostId()).toEqual(id);
    });
  });
});

describe("ListPostQueryServiceInput", () => {
  describe("getPagination", () => {
    it("ValidationError", () => {
      const input = new ListPostQueryServiceInput(0, 1);
      const res = input.getPagination();
      expect(res.isErr()).toBe(true);
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("ok", () => {
      const input = new ListPostQueryServiceInput(10, 2);
      const res = input.getPagination();
      expect(res).toEqual(ok({ limit: 10, page: 2 }));
    });
  });
});
