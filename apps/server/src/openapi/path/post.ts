import { createRoute } from "@hono/zod-openapi";
import {
  CreatePostsBodySchema,
  GetPostsResponseSchema,
  ListPostsQuerySchema,
  ListPostsResponseSchema,
  PostParamsSchema,
  UpdatePostsBodySchema,
} from "../schema/post";
import { errorResponses, successResponse } from "../responses";

export const getPostsRouteConfig = createRoute({
  tags: ["posts"],
  path: "/posts/{id}",
  method: "get",
  request: {
    params: PostParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetPostsResponseSchema,
        },
      },
      description: "get posts response",
    },
    ...errorResponses,
  },
});
export type GetPostsRoute = typeof getPostsRouteConfig;

export const listPostsRouteConfig = createRoute({
  tags: ["posts"],
  path: "/posts",
  method: "get",
  request: {
    query: ListPostsQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ListPostsResponseSchema,
        },
      },
      description: "list posts response",
    },
    ...errorResponses,
  },
});
export type ListPostsRoute = typeof listPostsRouteConfig;

export const createPostsRouteConfig = createRoute({
  tags: ["posts"],
  path: "/posts",
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreatePostsBodySchema,
        },
      },
    },
  },
  responses: {
    ...successResponse,
    ...errorResponses,
  },
});
export type CreatePostsRoute = typeof createPostsRouteConfig;

export const updatePostsRouteConfig = createRoute({
  tags: ["posts"],
  path: "/posts/{id}",
  method: "put",
  request: {
    params: PostParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdatePostsBodySchema,
        },
      },
    },
  },
  responses: {
    ...successResponse,
    ...errorResponses,
  },
});
export type UpdatePostsRoute = typeof updatePostsRouteConfig;

export const deletePostsRouteConfig = createRoute({
  tags: ["posts"],
  path: "/posts/{id}",
  method: "delete",
  request: {
    params: PostParamsSchema,
  },
  responses: {
    ...successResponse,
    ...errorResponses,
  },
});
export type DeletePostsRoute = typeof deletePostsRouteConfig;
