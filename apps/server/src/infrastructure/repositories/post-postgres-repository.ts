import { inject, injectable } from "inversify";
import { PostgresDatabase } from "@/db/postgresql";
import { Post } from "@/domain/entities/post";
import type { PostRepository } from "@/domain/repositories/post-repository";
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
import { DATABASE_BINDINGS } from "@/inversify";

@injectable()
export class PostPostgresRepository implements PostRepository {
  constructor(
    @inject(DATABASE_BINDINGS.PostgresDatabase)
    private readonly db: PostgresDatabase,
  ) {}

  async findById(id: PostId): Promise<Result<Post, AppError>> {
    if (id.value === null) {
      return err(new EmptyIdError());
    }

    const post = await this.db.post.findUnique({ where: { id: id.value } });
    if (post === null) {
      return err(new NotFoundError());
    }
    return ok(this.mapToPost(post));
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

    await this.db.post.create({ data: { content, createdAt, updatedAt } });
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

    await this.db.post.update({
      where: { id: id.value },
      data: { content, createdAt, updatedAt },
    });
    return ok();
  }

  async delete(id: PostId): Promise<Result<void, AppError>> {
    if (id.value === null) {
      return err(new EmptyIdError());
    }

    await this.db.post.delete({ where: { id: id.value } });
    return ok();
  }
}
