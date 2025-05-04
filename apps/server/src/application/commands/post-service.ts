import { Post } from "@/domain/entities/post";
import type { PostRepository } from "@/domain/repositories/post-repository";
import type { PostId } from "@/domain/value-objects/ids";
import { err, ok, type AppError, type Result } from "@/errors";

export interface CreatePostCommand {
  getPostContent(): string;
}

export interface UpdatePostCommand {
  getPostId(): PostId;
  getPostContent(): string;
}

export interface DeletePostCommand {
  getPostId(): PostId;
}

export class PostApplicationService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(command: CreatePostCommand): Promise<Result<void, AppError>> {
    const post = Post.createNew(command.getPostContent());
    const res = await this.postRepository.create(post);
    if (res.isErr()) {
      return err(res.error);
    }
    return ok();
  }

  async update(command: UpdatePostCommand): Promise<Result<void, AppError>> {
    const postOrError = await this.postRepository.findById(command.getPostId());
    if (postOrError.isErr()) {
      return err(postOrError.error);
    }
    const updatedPost = postOrError.value.update(command.getPostContent());
    const res = await this.postRepository.update(updatedPost);
    if (res.isErr()) {
      return err(res.error);
    }
    return ok();
  }

  async delete(command: DeletePostCommand): Promise<Result<void, AppError>> {
    const postOrError = await this.postRepository.findById(command.getPostId());
    if (postOrError.isErr()) {
      return err(postOrError.error);
    }
    const res = await this.postRepository.delete(command.getPostId());
    if (res.isErr()) {
      return err(res.error);
    }
    return ok();
  }
}
