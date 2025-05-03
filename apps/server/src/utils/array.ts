import { faker } from "@faker-js/faker";

export const generateRandomArray = <T>(
  generatorFn: () => T,
  { min, max }: { min?: number; max?: number } = {},
) => {
  const length = faker.number.int({ min: min ?? 1, max: max ?? 10 });
  return Array.from({ length }, generatorFn);
};
