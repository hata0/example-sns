import type { RouteConfigToTypedResponse } from "@hono/zod-openapi";
import {
  GetPostQueryServiceInput,
  ListPostQueryServiceInput,
  type PostQueryService,
} from "@/application/queries/post-service";
import type { AppContext } from "@/hono";
import type { GetPostsRoute, ListPostsRoute } from "@/openapi/path/post";
import {
  GetPostsResponseSchema,
  ListPostsResponseSchema,
} from "@/openapi/schema/post";

export class PostQueryController {
  constructor(private readonly service: PostQueryService) {}

  async get(
    c: AppContext<GetPostsRoute>,
  ): Promise<RouteConfigToTypedResponse<GetPostsRoute>> {
    const { id } = c.req.valid("param");
    const input = new GetPostQueryServiceInput(id);
    const res = await this.service.get(input);
    if (res.isErr()) {
      return c.json({ message: res.error.message }, res.error.status);
    }
    return c.json(GetPostsResponseSchema.parse(res.value), 200);
  }

  async list(
    c: AppContext<ListPostsRoute>,
  ): Promise<RouteConfigToTypedResponse<ListPostsRoute>> {
    const { limit, page } = c.req.valid("query");
    const input = new ListPostQueryServiceInput(limit, page);
    const res = await this.service.list(input);
    if (res.isErr()) {
      return c.json({ message: res.error.message }, res.error.status);
    }
    return c.json(ListPostsResponseSchema.parse(res.value), 200);
  }
}
