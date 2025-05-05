import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PostPostgresQueryService } from "./post-postgres-service";
import {
  EmptyIdError,
  err,
  NotFoundError,
  ok,
  ValidationError,
} from "@/errors";
import {
  GetPostQueryServiceInput,
  ListPostQueryServiceInput,
} from "@/application/queries/post-service";
import { postMock, prismaPostMock } from "@/tests/mocks";
import { generateRandomArray } from "@/utils/array";
import { client } from "@/db/postgresql";
import { PostSchema } from "@/openapi/schema";

describe("PostPostgresQueryService", () => {
  const posts = generateRandomArray(() => prismaPostMock(), {
    min: 20,
    max: 30,
  });
  beforeAll(async () => {
    await client.post.createMany({ data: posts });
  });
  afterAll(async () => {
    await client.post.deleteMany();
  });
  const service = new PostPostgresQueryService(client);

  describe("get", () => {
    it("EmptyIdError", async () => {
      const input = new GetPostQueryServiceInput(null!);
      const res = await service.get(input);
      expect(res).toEqual(err(new EmptyIdError()));
    });

    it("NotFoundError", async () => {
      const { id } = postMock();
      const input = new GetPostQueryServiceInput(id.value!);
      const res = await service.get(input);
      expect(res).toEqual(err(new NotFoundError()));
    });

    it("ok", async () => {
      const { id, content, createdAt, updatedAt } = posts[0];
      const input = new GetPostQueryServiceInput(id);
      const res = await service.get(input);
      expect(res).toEqual(
        ok({
          post: {
            id,
            content,
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString(),
          },
        }),
      );
    });
  });

  describe("list", () => {
    it("ValidationError", async () => {
      const input = new ListPostQueryServiceInput(0, 1);
      const res = await service.list(input);
      expect(res.isErr()).toBe(true);
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("ok", async () => {
      const input = new ListPostQueryServiceInput(8, 2);
      const res = await service.list(input);
      expect(res.isOk()).toBe(true);
      expect(res._unsafeUnwrap().posts.length).toBe(8);
      expect(
        res._unsafeUnwrap().posts.find((p) => !PostSchema.safeParse(p).success),
      ).toBeUndefined();
    });
  });
});
