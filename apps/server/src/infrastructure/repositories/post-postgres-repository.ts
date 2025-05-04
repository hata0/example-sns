import { getSkip, getTake } from "./utils";
import { PrismaClient } from "@/db/postgresql";
import { Post } from "@/domain/entities/post";
import type {
  PostFilter,
  PostRepository,
} from "@/domain/repositories/post-repository";
import { PostId } from "@/domain/value-objects/ids";
import {
  AppError,
  EmptyIdError,
  err,
  NonEmptyIdError,
  NotFoundError,
  ok,
  Result,
} from "@/errors";
import type { Post as PostRecord } from "@/db/postgresql/generated/prisma";

export class PostPostgresRepository implements PostRepository {
  constructor(private readonly client: PrismaClient) {}

  async findById(id: PostId): Promise<Result<Post, AppError>> {
    if (id.value === null) {
      return err(new EmptyIdError());
    }

    const post = await this.client.post.findUnique({ where: { id: id.value } });
    if (post === null) {
      return err(new NotFoundError());
    }
    return ok(this.mapToPost(post));
  }

  async findMany({
    pagination,
  }: PostFilter): Promise<Result<Post[], AppError>> {
    const posts = await this.client.post.findMany({
      skip: getSkip(pagination),
      take: getTake(pagination),
    });
    return ok(posts.map(this.mapToPost));
  }

  private mapToPost({ id, content, createdAt, updatedAt }: PostRecord): Post {
    return new Post(new PostId(id), content, createdAt, updatedAt);
  }

  async create({
    id,
    content,
    createdAt,
    updatedAt,
  }: Post): Promise<Result<void, AppError>> {
    if (id.value !== null) {
      return err(new NonEmptyIdError());
    }

    await this.client.post.create({ data: { content, createdAt, updatedAt } });
    return ok();
  }

  async update({
    id,
    content,
    createdAt,
    updatedAt,
  }: Post): Promise<Result<void, AppError>> {
    if (id.value === null) {
      return err(new EmptyIdError());
    }

    await this.client.post.update({
      where: { id: id.value },
      data: { content, createdAt, updatedAt },
    });
    return ok();
  }

  async delete(id: PostId): Promise<Result<void, AppError>> {
    if (id.value === null) {
      return err(new EmptyIdError());
    }

    await this.client.post.delete({ where: { id: id.value } });
    return ok();
  }
}
