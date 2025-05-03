import { faker } from "@faker-js/faker";
import { afterAll, beforeAll, vi } from "vitest";

export const fixDate = () => {
  const now = faker.date.anytime();

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  return now;
};
