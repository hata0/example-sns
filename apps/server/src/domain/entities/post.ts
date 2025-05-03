import type { Entity } from "../types";
import { PostId } from "../value-objects/ids";

export class Post implements Entity<PostId> {
  constructor(
    public readonly id: PostId,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static createNew(content: string): Post {
    return new Post(PostId.createAsNull(), content, new Date(), new Date());
  }

  update(content: string): Post {
    return new Post(this.id, content, this.createdAt, new Date());
  }
}
