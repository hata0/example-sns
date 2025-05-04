import { PostId } from "@/domain/value-objects/ids";
import { Pagination } from "@/domain/value-objects/pagination";
import { ValidationError, type AppError, type Result } from "@/errors";

// TODO: Dtoはopenapiの定義に基づくようにする

export class GetPostQueryServiceInput {
  constructor(private readonly postId: string) {}

  getPostId(): PostId {
    return new PostId(this.postId);
  }
}

export interface GetPostQueryServiceDto {
  post: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  };
}

export class ListPostQueryServiceInput {
  constructor(
    private readonly limit: number,
    private readonly page: number,
  ) {}

  getPagination(): Result<Pagination, ValidationError> {
    return Pagination.create(this.limit, this.page);
  }
}

export interface ListPostQueryServiceDto {
  posts: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface PostQueryService {
  get(
    input: GetPostQueryServiceInput,
  ): Promise<Result<GetPostQueryServiceDto, AppError>>;
  list(
    input: ListPostQueryServiceInput,
  ): Promise<Result<ListPostQueryServiceDto, AppError>>;
}
