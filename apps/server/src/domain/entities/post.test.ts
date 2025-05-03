import { describe, expect, it } from "vitest";
import { Post } from "./post";
import { fixDate } from "@/utils/date";
import { postMock } from "@/tests/mocks";

describe("Post", () => {
  const now = fixDate();

  describe("createNew", () => {
    it("新しいPostを返す", () => {
      const { content } = postMock();
      const post = Post.createNew(content);
      expect(post.id.value).toBeNull();
      expect(post.content).toBe(content);
      expect(post.createdAt).toEqual(now);
      expect(post.updatedAt).toEqual(now);
    });
  });

  describe("update", () => {
    it("更新されたPostを返す", () => {
      const { content } = postMock();
      const post = postMock();
      const updatedPost = post.update(content);
      expect(updatedPost.id.value).toBe(post.id.value);
      expect(updatedPost.content).toBe(content);
      expect(updatedPost.createdAt).toEqual(post.createdAt);
      expect(updatedPost.updatedAt).toEqual(now);
    });
  });
});
