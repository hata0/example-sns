import { describe, expect, it, vi } from "vitest";
import { OpenAPIHono } from "@hono/zod-openapi";
import { PostCommandController } from "./post-command-controller";
import {
  CreatePostCommand,
  DeletePostCommand,
  UpdatePostCommand,
  type PostApplicationService,
} from "@/application/commands/post-service";
import {
  createPostsRouteConfig,
  deletePostsRouteConfig,
  updatePostsRouteConfig,
} from "@/openapi/path/post";
import { err, InternalServerError, ok } from "@/errors";
import { postSchemaMock } from "@/tests/mocks";

describe("PostCommandController", () => {
  const service = {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const controller = new PostCommandController(
    service as unknown as PostApplicationService,
  );
  const app = new OpenAPIHono();
  app.openapi(createPostsRouteConfig, controller.create.bind(controller));
  app.openapi(updatePostsRouteConfig, controller.update.bind(controller));
  app.openapi(deletePostsRouteConfig, controller.delete.bind(controller));
  const e = new InternalServerError();
  const errorResponse = { message: e.message };
  const successStatus = 200;
  const successResponse = { message: "success" };
  const { id, content } = postSchemaMock();

  describe("create", () => {
    it("500", async () => {
      service.create.mockResolvedValueOnce(err(e));
      const res = await app.request("/posts", {
        method: "POST",
        body: JSON.stringify({
          content,
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      expect(res.status).toBe(e.status);
      expect(await res.json()).toEqual(errorResponse);
    });

    it("200", async () => {
      service.create.mockResolvedValueOnce(ok());
      const res = await app.request("/posts", {
        method: "POST",
        body: JSON.stringify({
          content,
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      expect(service.create).toHaveBeenCalledWith(
        new CreatePostCommand(content),
      );
      expect(res.status).toBe(successStatus);
      expect(await res.json()).toEqual(successResponse);
    });
  });

  describe("update", () => {
    it("500", async () => {
      service.update.mockResolvedValueOnce(err(e));
      const res = await app.request(`/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          content,
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      expect(res.status).toBe(e.status);
      expect(await res.json()).toEqual(errorResponse);
    });

    it("200", async () => {
      service.update.mockResolvedValueOnce(ok());
      const res = await app.request(`/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          content,
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      expect(service.update).toHaveBeenCalledWith(
        new UpdatePostCommand(id, content),
      );
      expect(res.status).toBe(successStatus);
      expect(await res.json()).toEqual(successResponse);
    });
  });

  describe("delete", () => {
    it("500", async () => {
      service.delete.mockResolvedValueOnce(err(e));
      const res = await app.request(`/posts/${id}`, {
        method: "DELETE",
      });
      expect(res.status).toBe(e.status);
      expect(await res.json()).toEqual(errorResponse);
    });

    it("200", async () => {
      service.delete.mockResolvedValueOnce(ok());
      const res = await app.request(`/posts/${id}`, {
        method: "DELETE",
      });
      expect(service.delete).toHaveBeenCalledWith(new DeletePostCommand(id));
      expect(res.status).toBe(successStatus);
      expect(await res.json()).toEqual(successResponse);
    });
  });
});
