import { z } from "@hono/zod-openapi";
import { PaginationSchema } from "./pagination";

export const PostSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .openapi({ example: "60f315b3-6e6d-4689-9011-01a79974192a" }),
    content: z.string().openapi({ example: "投稿内容だよ" }),
    createdAt: z
      .string()
      .datetime()
      .openapi({ example: "2024-01-01T03:00:00.000Z" }),
    updatedAt: z
      .string()
      .datetime()
      .openapi({ example: "2024-01-01T03:00:00.000Z" }),
  })
  .openapi("Post");
export type Post = z.infer<typeof PostSchema>;

export const PostParamsSchema = z
  .object({
    id: PostSchema.shape.id,
  })
  .openapi("PostParams");
export type PostParams = z.infer<typeof PostParamsSchema>;

export const GetPostsResponseSchema = z
  .object({
    post: PostSchema,
  })
  .openapi("GetPostsResponse");
export type GetPostsResponse = z.infer<typeof GetPostsResponseSchema>;

export const ListPostsQuerySchema = z
  .object({
    limit: PaginationSchema.shape.limit,
    page: PaginationSchema.shape.page,
  })
  .openapi("ListPostsQuery");
export type ListPostsQuery = z.infer<typeof ListPostsQuerySchema>;

export const ListPostsResponseSchema = z
  .object({
    posts: z.array(PostSchema),
  })
  .openapi("ListPostsResponse");
export type ListPostsResponse = z.infer<typeof ListPostsResponseSchema>;

export const CreatePostsBodySchema = z
  .object({
    content: PostSchema.shape.content,
  })
  .openapi("CreatePostsBody");
export type CreatePostsBody = z.infer<typeof CreatePostsBodySchema>;

export const UpdatePostsBodySchema = z
  .object({
    content: PostSchema.shape.content,
  })
  .openapi("UpdatePostBody");
export type UpdatePostsBody = z.infer<typeof UpdatePostsBodySchema>;
