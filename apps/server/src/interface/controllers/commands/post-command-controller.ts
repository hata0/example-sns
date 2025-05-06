import type { RouteConfigToTypedResponse } from "@hono/zod-openapi";
import { inject, injectable } from "inversify";
import {
  CreatePostCommand,
  DeletePostCommand,
  PostApplicationService,
  UpdatePostCommand,
} from "@/application/commands/post-service";
import type { AppContext } from "@/hono";
import type {
  CreatePostsRoute,
  DeletePostsRoute,
  UpdatePostsRoute,
} from "@/openapi/path/post";
import { APPLICATION_SERVICE_BINDINGS } from "@/inversify";

@injectable()
export class PostCommandController {
  constructor(
    @inject(APPLICATION_SERVICE_BINDINGS.PostApplicationService)
    private readonly service: PostApplicationService,
  ) {}

  async create(
    c: AppContext<CreatePostsRoute>,
  ): Promise<RouteConfigToTypedResponse<CreatePostsRoute>> {
    const { content } = c.req.valid("json");
    const command = new CreatePostCommand(content);
    const res = await this.service.create(command);
    if (res.isErr()) {
      return c.json({ message: res.error.message }, res.error.status);
    }
    return c.json({ message: "success" as const }, 200);
  }

  async update(
    c: AppContext<UpdatePostsRoute>,
  ): Promise<RouteConfigToTypedResponse<UpdatePostsRoute>> {
    const { id } = c.req.valid("param");
    const { content } = c.req.valid("json");
    const command = new UpdatePostCommand(id, content);
    const res = await this.service.update(command);
    if (res.isErr()) {
      return c.json({ message: res.error.message }, res.error.status);
    }
    return c.json({ message: "success" as const }, 200);
  }

  async delete(
    c: AppContext<DeletePostsRoute>,
  ): Promise<RouteConfigToTypedResponse<DeletePostsRoute>> {
    const { id } = c.req.valid("param");
    const command = new DeletePostCommand(id);
    const res = await this.service.delete(command);
    if (res.isErr()) {
      return c.json({ message: res.error.message }, res.error.status);
    }
    return c.json({ message: "success" as const }, 200);
  }
}
