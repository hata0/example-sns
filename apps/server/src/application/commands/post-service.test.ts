import { describe, expect, it, vi } from "vitest";
import { Container } from "inversify";
import {
  CreatePostCommand,
  DeletePostCommand,
  PostApplicationService,
  UpdatePostCommand,
} from "./post-service";
import type { PostRepository } from "@/domain/repositories/post-repository";
import { err, InternalServerError, ok } from "@/errors";
import { fixDate } from "@/utils/date";
import { Post } from "@/domain/entities/post";
import { postMock, postSchemaMock } from "@/tests/mocks";
import { PostId } from "@/domain/value-objects/ids";
import { REPOSITORY_BINDINGS } from "@/inversify";

describe("CreatePostCommand", () => {
  const { content } = postSchemaMock();
  const command = new CreatePostCommand(content);

  describe("getPostContent", () => {
    it("should return post content", () => {
      expect(command.getPostContent()).toBe(content);
    });
  });
});

describe("UpdatePostCommand", () => {
  const { id, content } = postSchemaMock();
  const command = new UpdatePostCommand(id, content);

  describe("getPostId", () => {
    it("should return PostId", () => {
      expect(command.getPostId()).toEqual(new PostId(id));
    });
  });

  describe("getPostContent", () => {
    it("should return post content", () => {
      expect(command.getPostContent()).toBe(content);
    });
  });
});

describe("DeletePostCommand", () => {
  const { id } = postSchemaMock();
  const command = new DeletePostCommand(id);

  describe("getPostId", () => {
    it("should return PostId", () => {
      expect(command.getPostId()).toEqual(new PostId(id));
    });
  });
});

describe("PostApplicationService", () => {
  fixDate();
  const postRepository = {
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  } satisfies PostRepository;

  const container = new Container();
  container
    .bind<PostRepository>(REPOSITORY_BINDINGS.PostRepository)
    .toConstantValue(postRepository);
  container.bind(PostApplicationService).toSelf();

  const postApplicationService = container.get(PostApplicationService);
  const error = err(new InternalServerError());

  describe("create", () => {
    const { content } = postSchemaMock();
    const command = new CreatePostCommand(content);

    it("createでエラー", async () => {
      postRepository.create.mockResolvedValueOnce(error);
      const res = await postApplicationService.create(command);
      expect(res).toEqual(error);
    });

    it("ok", async () => {
      postRepository.create.mockResolvedValueOnce(ok());
      const res = await postApplicationService.create(command);
      expect(postRepository.create).toHaveBeenCalledWith(
        Post.createNew(content),
      );
      expect(res).toEqual(ok());
    });
  });

  describe("update", () => {
    const post = postMock();
    const { content: updatedContent } = postMock();
    const command = new UpdatePostCommand(post.id.value!, updatedContent);

    it("findByIdでエラー", async () => {
      postRepository.findById.mockResolvedValueOnce(error);
      const res = await postApplicationService.update(command);
      expect(res).toEqual(error);
    });

    it("updateでエラー", async () => {
      postRepository.findById.mockResolvedValueOnce(ok(post));
      postRepository.update.mockResolvedValueOnce(error);
      const res = await postApplicationService.update(command);
      expect(res).toEqual(error);
    });

    it("ok", async () => {
      postRepository.findById.mockResolvedValueOnce(ok(post));
      postRepository.update.mockResolvedValueOnce(ok());
      const res = await postApplicationService.update(command);
      expect(postRepository.findById).toHaveBeenCalledWith(post.id);
      expect(postRepository.update).toHaveBeenCalledWith(
        post.update(updatedContent),
      );
      expect(res).toEqual(ok());
    });
  });

  describe("delete", () => {
    const post = postMock();
    const command = new DeletePostCommand(post.id.value!);

    it("findByIdでエラー", async () => {
      postRepository.findById.mockResolvedValueOnce(error);
      const res = await postApplicationService.delete(command);
      expect(res).toEqual(error);
    });

    it("deleteでエラー", async () => {
      postRepository.findById.mockResolvedValueOnce(ok(post));
      postRepository.delete.mockResolvedValueOnce(error);
      const res = await postApplicationService.delete(command);
      expect(res).toEqual(error);
    });

    it("ok", async () => {
      postRepository.findById.mockResolvedValueOnce(ok(post));
      postRepository.delete.mockResolvedValueOnce(ok());
      const res = await postApplicationService.delete(command);
      expect(postRepository.findById).toHaveBeenCalledWith(post.id);
      expect(postRepository.delete).toHaveBeenCalledWith(post.id);
      expect(res).toEqual(ok());
    });
  });
});
