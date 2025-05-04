import { describe, expect, it, vi } from "vitest";
import { PostPostgresQueryService } from "./post-postgres-service";
import type { PostRepository } from "@/domain/repositories/post-repository";
import { err, InternalServerError, ok, ValidationError } from "@/errors";
import {
  GetPostQueryServiceInput,
  ListPostQueryServiceInput,
} from "@/application/queries/post-service";
import { postMock } from "@/tests/mocks";
import { generateRandomArray } from "@/utils/array";

describe("PostPostgresQueryService", () => {
  const postRepository = {
    findById: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  } satisfies PostRepository;
  const error = err(new InternalServerError());
  const postQueryService = new PostPostgresQueryService(postRepository);

  describe("get", () => {
    const post = postMock();
    const input = new GetPostQueryServiceInput(post.id.value!);

    it("err", async () => {
      postRepository.findById.mockResolvedValueOnce(error);
      const res = await postQueryService.get(input);
      expect(res).toEqual(error);
    });

    it("ok", async () => {
      postRepository.findById.mockResolvedValueOnce(ok(post));
      const res = await postQueryService.get(input);
      expect(postRepository.findById).toHaveBeenCalledWith(post.id);
      expect(res).toEqual(
        ok({
          post: {
            id: post.id.value!,
            content: post.content,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
          },
        }),
      );
    });
  });

  describe("list", () => {
    it("getPaginationでValidationError", async () => {
      const input = new ListPostQueryServiceInput(0, 1);
      const res = await postQueryService.list(input);
      expect(res.isErr()).toBe(true);
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(ValidationError);
    });

    const input = new ListPostQueryServiceInput(1, 1);

    it("findManyでerr", async () => {
      postRepository.findMany.mockResolvedValueOnce(error);
      const res = await postQueryService.list(input);
      expect(res).toEqual(error);
    });

    it("ok", async () => {
      const posts = generateRandomArray(() => postMock());
      postRepository.findMany.mockResolvedValueOnce(ok(posts));
      const res = await postQueryService.list(input);
      expect(postRepository.findMany).toHaveBeenCalledWith({
        pagination: input.getPagination()._unsafeUnwrap(),
      });
      expect(res).toEqual(
        ok({
          posts: posts.map((p) => ({
            id: p.id.value!,
            content: p.content,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          })),
        }),
      );
    });
  });
});
