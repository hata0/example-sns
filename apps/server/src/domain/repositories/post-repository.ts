import type { Post } from "../entities/post";
import type { PostId } from "../value-objects/ids";
import type { AppError, Result } from "@/errors";

export interface PostRepository {
  findById(id: PostId): Promise<Result<Post, AppError>>;
  create(post: Post): Promise<Result<void, AppError>>;
  update(post: Post): Promise<Result<void, AppError>>;
  delete(id: PostId): Promise<Result<void, AppError>>;
}
