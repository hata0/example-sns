import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PostgresPostRepository } from "./postgres-post-repository";
import { client } from "@/db/postgresql";
import { PostId } from "@/domain/value-objects/ids";
import { postMock, prismaPostMock } from "@/tests/mocks";
import { generateRandomArray } from "@/utils/array";
import {
  EmptyIdError,
  err,
  NonEmptyIdError,
  NotFoundError,
  ok,
} from "@/errors";
import { Post } from "@/domain/entities/post";

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

describe("PostgresPostRepository", () => {
  const postRepository = new PostgresPostRepository(client);

  describe("findById", () => {
    it("EmptyIdError", async () => {
      const id = PostId.createAsNull();
      const res = await postRepository.findById(id);
      expect(res).toEqual(err(new EmptyIdError()));
    });

    it("NotFoundError", async () => {
      const { id } = postMock();
      const res = await postRepository.findById(id);
      expect(res).toEqual(err(new NotFoundError()));
    });

    it("ok", async () => {
      const { id, content, createdAt, updatedAt } = posts[0];
      const res = await postRepository.findById(new PostId(id));
      expect(res).toEqual(
        ok(new Post(new PostId(id), content, createdAt, updatedAt)),
      );
    });
  });

  describe("findMany", () => {
    it("ok", async () => {
      const res = await postRepository.findMany({
        pagination: { limit: 8, page: 2 },
      });
      expect(res.isOk()).toBe(true);
      expect(res._unsafeUnwrap().length).toBe(8);
      expect(res._unsafeUnwrap()[0]).toBeInstanceOf(Post);
    });
  });

  describe("create", () => {
    it("NonEmptyIdError", async () => {
      const post = postMock();
      const res = await postRepository.create(post);
      expect(res).toEqual(err(new NonEmptyIdError()));
    });

    it("ok", async () => {
      const { content } = postMock();
      const newPost = Post.createNew(content);
      const res = await postRepository.create(newPost);
      expect(res).toEqual(ok());
      const record = await client.post.findFirst({
        where: {
          content: newPost.content,
          createdAt: newPost.createdAt,
          updatedAt: newPost.updatedAt,
        },
      });
      expect(typeof record?.id).toBe("string");
    });
  });

  describe("update", () => {
    const { id, content, createdAt, updatedAt } = posts[0];

    it("EmptyIdError", async () => {
      const post = new Post(
        PostId.createAsNull(),
        content,
        createdAt,
        updatedAt,
      );
      const res = await postRepository.update(post);
      expect(res).toEqual(err(new EmptyIdError()));
    });

    it("ok", async () => {
      const { content: updatedContent } = postMock();
      const updatedPost = new Post(
        new PostId(id),
        content,
        createdAt,
        updatedAt,
      ).update(updatedContent);
      const res = await postRepository.update(updatedPost);
      expect(res).toEqual(ok());
      const record = await client.post.findUnique({
        where: { id: updatedPost.id.value! },
      });
      expect(record).toEqual({
        id: updatedPost.id.value,
        content: updatedPost.content,
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt,
      });
    });
  });

  describe("delete", () => {
    it("EmptyIdError", async () => {
      const id = PostId.createAsNull();
      const res = await postRepository.delete(id);
      expect(res).toEqual(err(new EmptyIdError()));
    });

    it("ok", async () => {
      const { id } = posts[0];
      const res = await postRepository.delete(new PostId(id));
      expect(res).toEqual(ok());
      const record = await client.post.findUnique({ where: { id } });
      expect(record).toBeNull();
    });
  });
});
