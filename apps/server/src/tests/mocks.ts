import { faker } from "@faker-js/faker";
import type { Post as PostRecord } from "@/infrastructure/database/postgresql/generated/prisma";
import { Post } from "@/domain/entities/post";
import { PostId } from "@/domain/value-objects/ids";
import type { Post as PostSchema } from "@/openapi/schema/post";

export const prismaPostMock = (): PostRecord => {
  const createdAt = faker.date.anytime();

  return {
    id: faker.string.uuid(),
    content: faker.lorem.lines(),
    createdAt,
    updatedAt: faker.date.future({ refDate: createdAt }),
  };
};

export const postMock = (): Post => {
  const id = faker.string.uuid();
  const content = faker.lorem.lines();
  const createdAt = faker.date.anytime();
  const updatedAt = faker.date.future({ refDate: createdAt });

  return new Post(new PostId(id), content, createdAt, updatedAt);
};

export const postSchemaMock = (): PostSchema => {
  const id = faker.string.uuid();
  const content = faker.lorem.lines();
  const createdAt = faker.date.anytime();
  const updatedAt = faker.date.future({ refDate: createdAt });

  return {
    id,
    content,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
};
