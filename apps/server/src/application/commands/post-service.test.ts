import { describe, expect, it, vi } from "vitest";
import {
  CreatePostCommand,
  DeletePostCommand,
  PostApplicationService,
  UpdatePostCommand,
} from "./post-service";
import type { PostRepository } from "@/domain/repositories/post-repository";
import { err, InternalServerError, ok } from "@/errors";
import { postMock } from "@/tests/mocks";
import { fixDate } from "@/utils/date";
import { Post } from "@/domain/entities/post";

describe("CreatePostCommand", () => {
  const { content } = postMock();
  const command = new CreatePostCommand(content);

  describe("getPostContent", () => {
    it("should return post content", () => {
      expect(command.getPostContent()).toBe(content);
    });
  });
});

describe("UpdatePostCommand", () => {
  const { id, content } = postMock();
  const command = new UpdatePostCommand(id.value!, content);

  describe("getPostId", () => {
    it("should return PostId", () => {
      expect(command.getPostId()).toEqual(id);
    });
  });

  describe("getPostContent", () => {
    it("should return post content", () => {
      expect(command.getPostContent()).toBe(content);
    });
  });
});

describe("DeletePostCommand", () => {
  const { id } = postMock();
  const command = new DeletePostCommand(id.value!);

  describe("getPostId", () => {
    it("should return PostId", () => {
      expect(command.getPostId()).toEqual(id);
    });
  });
});

describe("PostApplicationService", () => {
  fixDate();
  const postRepository = {
    findById: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  } satisfies PostRepository;
  const postApplicationService = new PostApplicationService(postRepository);
  const error = err(new InternalServerError());

  describe("create", () => {
    const { content } = postMock();
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
