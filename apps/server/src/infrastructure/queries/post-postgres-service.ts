import type { Post } from "@/domain/entities/post";
import type { PostRepository } from "@/domain/repositories/post-repository";
import { err, ok, type AppError, type Result } from "@/errors";
import type {
  GetPostQueryServiceDto,
  GetPostQueryServiceInput,
  ListPostQueryServiceDto,
  ListPostQueryServiceInput,
  PostQueryService,
} from "@/application/queries/post-service";

export class PostPostgresQueryService implements PostQueryService {
  constructor(private readonly postRepository: PostRepository) {}

  async get(
    input: GetPostQueryServiceInput,
  ): Promise<Result<GetPostQueryServiceDto, AppError>> {
    const postOrError = await this.postRepository.findById(input.getPostId());
    if (postOrError.isErr()) {
      return err(postOrError.error);
    }
    return ok({
      post: this.mapToPost(postOrError.value),
    });
  }

  async list(
    input: ListPostQueryServiceInput,
  ): Promise<Result<ListPostQueryServiceDto, AppError>> {
    const paginationOrError = input.getPagination();
    if (paginationOrError.isErr()) {
      return err(paginationOrError.error);
    }
    const postsOrError = await this.postRepository.findMany({
      pagination: paginationOrError.value,
    });
    if (postsOrError.isErr()) {
      return err(postsOrError.error);
    }
    return ok({
      posts: postsOrError.value.map(this.mapToPost),
    });
  }

  // TODO: openapiで型をつける
  private mapToPost({ id, content, createdAt, updatedAt }: Post) {
    return {
      id: id.value!,
      content,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }
}
