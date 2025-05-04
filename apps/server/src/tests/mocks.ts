import { faker } from "@faker-js/faker";
import type { Post as PostRecord } from "@/db/postgresql/generated/prisma";
import { Post } from "@/domain/entities/post";
import { PostId } from "@/domain/value-objects/ids";

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
