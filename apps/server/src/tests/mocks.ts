import { faker } from "@faker-js/faker";
import type { Post } from "@/db/postgresql/generated/prisma";

export const prismaPostMock = (): Post => {
  const createdAt = faker.date.anytime();

  return {
    id: faker.string.uuid(),
    content: faker.lorem.lines(),
    createdAt,
    updatedAt: faker.date.future({ refDate: createdAt }),
  };
};
