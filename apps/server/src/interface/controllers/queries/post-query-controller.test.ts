import { describe, expect, it, vi } from "vitest";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Container } from "inversify";
import { PostQueryController } from "./post-query-controller";
import {
  GetPostQueryServiceInput,
  ListPostQueryServiceInput,
  type PostQueryService,
} from "@/application/queries/post-service";
import { err, InternalServerError, ok } from "@/errors";
import { getPostsRouteConfig, listPostsRouteConfig } from "@/openapi/path/post";
import { postSchemaMock } from "@/tests/mocks";
import type {
  GetPostsResponse,
  ListPostsResponse,
} from "@/openapi/schema/post";
import { generateRandomArray } from "@/utils/array";
import { RequestClient } from "@/tests/request";
import { QUERY_SERVICE_BINDINGS } from "@/inversify";

describe("PostQueryController", () => {
  const service = {
    get: vi.fn(),
    list: vi.fn(),
  } satisfies PostQueryService;

  const container = new Container();
  container
    .bind<PostQueryService>(QUERY_SERVICE_BINDINGS.PostQueryService)
    .toConstantValue(service);
  container.bind(PostQueryController).toSelf();

  const controller = container.get(PostQueryController);

  const app = new OpenAPIHono();
  app.openapi(getPostsRouteConfig, (c) => controller.get(c));
  app.openapi(listPostsRouteConfig, (c) => controller.list(c));
  const client = new RequestClient(app, "/posts");
  const e = new InternalServerError();
  const errorResponse = { message: e.message };

  describe("get", () => {
    const post = postSchemaMock();

    it("500", async () => {
      service.get.mockResolvedValueOnce(err(e));
      const res = await client.request("GET", `/${post.id}`);
      expect(res.status).toBe(e.status);
      expect(await res.json()).toEqual(errorResponse);
    });

    it("200", async () => {
      const response = { post } satisfies GetPostsResponse;
      service.get.mockResolvedValueOnce(ok(response));
      const res = await client.request("GET", `/${post.id}`);
      expect(service.get).toHaveBeenCalledWith(
        new GetPostQueryServiceInput(post.id),
      );
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(response);
    });
  });

  describe("list", () => {
    const posts = generateRandomArray(() => postSchemaMock(), {
      min: 4,
      max: 4,
    });
    const limit = "4";
    const page = "3";

    it("500", async () => {
      service.list.mockResolvedValueOnce(err(e));
      const res = await client.request("GET", `?limit=${limit}&page=${page}`);
      expect(res.status).toBe(e.status);
      expect(await res.json()).toEqual(errorResponse);
    });

    it("200", async () => {
      const response = { posts } satisfies ListPostsResponse;
      service.list.mockResolvedValueOnce(ok(response));
      const res = await client.request("GET", `?limit=${limit}&page=${page}`);
      expect(service.list).toHaveBeenCalledWith(
        new ListPostQueryServiceInput(limit, page),
      );
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(response);
    });
  });
});
