import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Container } from "inversify";
import { PostgresDatabase } from "../database/postgresql";
import { PostPostgresRepository } from "./post-postgres-repository";
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
import { setupDatabase } from "@/tests/db";
import { DATABASE_BINDINGS } from "@/inversify";
import type { PostRepository } from "@/domain/repositories/post-repository";

describe("PostPostgresRepository", () => {
  const posts = generateRandomArray(() => prismaPostMock());
  let client: PostgresDatabase;
  let repository: PostRepository;

  beforeAll(async () => {
    await setupDatabase();

    const container = new Container();
    container
      .bind<PostgresDatabase>(DATABASE_BINDINGS.PostgresDatabase)
      .to(PostgresDatabase);
    container.bind(PostPostgresRepository).toSelf();

    client = new PostgresDatabase();
    await client.post.createMany({ data: posts });

    repository = container.get(PostPostgresRepository);
  });
  afterAll(async () => {
    await client.post.deleteMany();
  });

  describe("findById", () => {
    it("EmptyIdError", async () => {
      const id = PostId.createAsNull();
      const res = await repository.findById(id);
      expect(res).toEqual(err(new EmptyIdError()));
    });

    it("NotFoundError", async () => {
      const { id } = postMock();
      const res = await repository.findById(id);
      expect(res).toEqual(err(new NotFoundError()));
    });

    it("ok", async () => {
      const { id, content, createdAt, updatedAt } = posts[0];
      const res = await repository.findById(new PostId(id));
      expect(res).toEqual(
        ok(new Post(new PostId(id), content, createdAt, updatedAt)),
      );
    });
  });

  describe("create", () => {
    it("NonEmptyIdError", async () => {
      const post = postMock();
      const res = await repository.create(post);
      expect(res).toEqual(err(new NonEmptyIdError()));
    });

    it("ok", async () => {
      const { content } = postMock();
      const newPost = Post.createNew(content);
      const res = await repository.create(newPost);
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
      const res = await repository.update(post);
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
      const res = await repository.update(updatedPost);
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
      const res = await repository.delete(id);
      expect(res).toEqual(err(new EmptyIdError()));
    });

    it("ok", async () => {
      const { id } = posts[0];
      const res = await repository.delete(new PostId(id));
      expect(res).toEqual(ok());
      const record = await client.post.findUnique({ where: { id } });
      expect(record).toBeNull();
    });
  });
});
