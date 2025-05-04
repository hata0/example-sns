import { describe, expect, it, vi } from "vitest";
import {
  PostApplicationService,
  type CreatePostCommand,
  type DeletePostCommand,
  type UpdatePostCommand,
} from "./post-service";
import type { PostRepository } from "@/domain/repositories/post-repository";
import { err, InternalServerError, ok } from "@/errors";
import { postMock } from "@/tests/mocks";
import { fixDate } from "@/utils/date";
import { Post } from "@/domain/entities/post";

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
    const createPostCommand: CreatePostCommand = {
      getPostContent: () => content,
    };

    it("createでエラー", async () => {
      postRepository.create.mockResolvedValueOnce(error);
      const res = await postApplicationService.create(createPostCommand);
      expect(res).toEqual(error);
    });

    it("ok", async () => {
      postRepository.create.mockResolvedValueOnce(ok());
      const res = await postApplicationService.create(createPostCommand);
      expect(postRepository.create).toHaveBeenCalledWith(
        Post.createNew(content),
      );
      expect(res).toEqual(ok());
    });
  });

  describe("update", () => {
    const post = postMock();
    const { content: updatedContent } = postMock();
    const updatePostCommand: UpdatePostCommand = {
      getPostId: () => post.id,
      getPostContent: () => updatedContent,
    };

    it("findByIdでエラー", async () => {
      postRepository.findById.mockResolvedValueOnce(error);
      const res = await postApplicationService.update(updatePostCommand);
      expect(res).toEqual(error);
    });

    it("updateでエラー", async () => {
      postRepository.findById.mockResolvedValueOnce(ok(post));
      postRepository.update.mockResolvedValueOnce(error);
      const res = await postApplicationService.update(updatePostCommand);
      expect(res).toEqual(error);
    });

    it("ok", async () => {
      postRepository.findById.mockResolvedValueOnce(ok(post));
      postRepository.update.mockResolvedValueOnce(ok());
      const res = await postApplicationService.update(updatePostCommand);
      expect(postRepository.findById).toHaveBeenCalledWith(post.id);
      expect(postRepository.update).toHaveBeenCalledWith(
        post.update(updatedContent),
      );
      expect(res).toEqual(ok());
    });
  });

  describe("delete", () => {
    const post = postMock();
    const deletePostCommand: DeletePostCommand = {
      getPostId: () => post.id,
    };

    it("findByIdでエラー", async () => {
      postRepository.findById.mockResolvedValueOnce(error);
      const res = await postApplicationService.delete(deletePostCommand);
      expect(res).toEqual(error);
    });

    it("deleteでエラー", async () => {
      postRepository.findById.mockResolvedValueOnce(ok(post));
      postRepository.delete.mockResolvedValueOnce(error);
      const res = await postApplicationService.delete(deletePostCommand);
      expect(res).toEqual(error);
    });

    it("ok", async () => {
      postRepository.findById.mockResolvedValueOnce(ok(post));
      postRepository.delete.mockResolvedValueOnce(ok());
      const res = await postApplicationService.delete(deletePostCommand);
      expect(postRepository.findById).toHaveBeenCalledWith(post.id);
      expect(postRepository.delete).toHaveBeenCalledWith(post.id);
      expect(res).toEqual(ok());
    });
  });
});
