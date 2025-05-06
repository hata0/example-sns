import { PostId } from "@/domain/value-objects/ids";
import { Pagination } from "@/domain/value-objects/pagination";
import { ValidationError, type AppError, type Result } from "@/errors";
import type {
  GetPostsResponse,
  ListPostsResponse,
} from "@/openapi/schema/post";

export class GetPostQueryServiceInput {
  constructor(private readonly postId: string) {}

  getPostId(): PostId {
    return new PostId(this.postId);
  }
}

export class ListPostQueryServiceInput {
  constructor(
    private readonly limit: string,
    private readonly page: string,
  ) {}

  getPagination(): Result<Pagination, ValidationError> {
    return Pagination.create(Number(this.limit), Number(this.page));
  }
}

export interface PostQueryService {
  get(
    input: GetPostQueryServiceInput,
  ): Promise<Result<GetPostsResponse, AppError>>;
  list(
    input: ListPostQueryServiceInput,
  ): Promise<Result<ListPostsResponse, AppError>>;
}
