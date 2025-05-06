import type { App } from "@/hono";
import { container } from "@/infrastructure/di/container";
import { PostCommandController } from "@/interface/controllers/commands/post-command-controller";
import { PostQueryController } from "@/interface/controllers/queries/post-query-controller";
import {
  COMMAND_CONTROLLER_BINDINGS,
  QUERY_CONTROLLER_BINDINGS,
} from "@/inversify";
import {
  createPostsRouteConfig,
  deletePostsRouteConfig,
  getPostsRouteConfig,
  listPostsRouteConfig,
  updatePostsRouteConfig,
} from "@/openapi/path/post";

export const registerPostApi = (app: App) => {
  const postQueryController = container.get<PostQueryController>(
    QUERY_CONTROLLER_BINDINGS.PostQueryController,
  );
  const postCommandController = container.get<PostCommandController>(
    COMMAND_CONTROLLER_BINDINGS.PostCommandController,
  );

  app.openapi(getPostsRouteConfig, (c) => postQueryController.get(c));
  app.openapi(listPostsRouteConfig, (c) => postQueryController.list(c));
  app.openapi(createPostsRouteConfig, (c) => postCommandController.create(c));
  app.openapi(updatePostsRouteConfig, (c) => postCommandController.update(c));
  app.openapi(deletePostsRouteConfig, (c) => postCommandController.delete(c));
};
