import { getSkip, getTake } from "./utils";
import {
  EmptyIdError,
  err,
  NotFoundError,
  ok,
  type AppError,
  type Result,
} from "@/errors";
import type {
  GetPostQueryServiceInput,
  ListPostQueryServiceInput,
  PostQueryService,
} from "@/application/queries/post-service";
import type { PrismaClient } from "@/db/postgresql";
import type { Post as PostRecord } from "@/db/postgresql/generated/prisma";
import type { Post as PostSchema } from "@/openapi/schema/post";
import type {
  GetPostsResponse,
  ListPostsResponse,
} from "@/openapi/schema/post";

export class PostPostgresQueryService implements PostQueryService {
  constructor(private readonly client: PrismaClient) {}

  async get(
    input: GetPostQueryServiceInput,
  ): Promise<Result<GetPostsResponse, AppError>> {
    const id = input.getPostId();
    if (id.value === null) {
      return err(new EmptyIdError());
    }
    const record = await this.client.post.findUnique({
      where: { id: id.value },
    });
    if (record === null) {
      return err(new NotFoundError());
    }
    return ok({ post: this.mapToPost(record) });
  }

  async list(
    input: ListPostQueryServiceInput,
  ): Promise<Result<ListPostsResponse, AppError>> {
    const paginationOrError = input.getPagination();
    if (paginationOrError.isErr()) {
      return err(paginationOrError.error);
    }
    const records = await this.client.post.findMany({
      skip: getSkip(paginationOrError.value),
      take: getTake(paginationOrError.value),
    });
    return ok({ posts: records.map(this.mapToPost) });
  }

  private mapToPost({
    id,
    content,
    createdAt,
    updatedAt,
  }: PostRecord): PostSchema {
    return {
      id: id,
      content,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }
}
