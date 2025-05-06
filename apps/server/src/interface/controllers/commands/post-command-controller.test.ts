import { describe, expect, it, vi } from "vitest";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Container } from "inversify";
import { PostCommandController } from "./post-command-controller";
import {
  CreatePostCommand,
  DeletePostCommand,
  PostApplicationService,
  UpdatePostCommand,
} from "@/application/commands/post-service";
import {
  createPostsRouteConfig,
  deletePostsRouteConfig,
  updatePostsRouteConfig,
} from "@/openapi/path/post";
import { err, InternalServerError, ok } from "@/errors";
import { postSchemaMock } from "@/tests/mocks";
import { RequestClient } from "@/tests/request";
import { APPLICATION_SERVICE_BINDINGS } from "@/inversify";

describe("PostCommandController", () => {
  const service = {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const container = new Container();
  container
    .bind<PostApplicationService>(
      APPLICATION_SERVICE_BINDINGS.PostApplicationService,
    )
    .toConstantValue(service as unknown as PostApplicationService);
  container.bind(PostCommandController).toSelf();

  const controller = container.get(PostCommandController);

  const app = new OpenAPIHono();
  app.openapi(createPostsRouteConfig, (c) => controller.create(c));
  app.openapi(updatePostsRouteConfig, (c) => controller.update(c));
  app.openapi(deletePostsRouteConfig, (c) => controller.delete(c));
  const client = new RequestClient(app, "/posts");
  const e = new InternalServerError();
  const errorResponse = { message: e.message };
  const successStatus = 200;
  const successResponse = { message: "success" };
  const { id, content } = postSchemaMock();

  describe("create", () => {
    it("500", async () => {
      service.create.mockResolvedValueOnce(err(e));
      const res = await client.request("POST", "", {
        body: {
          content,
        },
      });
      expect(res.status).toBe(e.status);
      expect(await res.json()).toEqual(errorResponse);
    });

    it("200", async () => {
      service.create.mockResolvedValueOnce(ok());
      const res = await client.request("POST", "", {
        body: {
          content,
        },
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
      const res = await client.request("PUT", `/${id}`, {
        body: {
          content,
        },
      });
      expect(res.status).toBe(e.status);
      expect(await res.json()).toEqual(errorResponse);
    });

    it("200", async () => {
      service.update.mockResolvedValueOnce(ok());
      const res = await client.request("PUT", `/${id}`, {
        body: {
          content,
        },
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
      const res = await client.request("DELETE", `/${id}`);
      expect(res.status).toBe(e.status);
      expect(await res.json()).toEqual(errorResponse);
    });

    it("200", async () => {
      service.delete.mockResolvedValueOnce(ok());
      const res = await client.request("DELETE", `/${id}`);
      expect(service.delete).toHaveBeenCalledWith(new DeletePostCommand(id));
      expect(res.status).toBe(successStatus);
      expect(await res.json()).toEqual(successResponse);
    });
  });
});
