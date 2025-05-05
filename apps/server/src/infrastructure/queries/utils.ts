import type { Pagination } from "@/domain/value-objects/pagination";

export const getSkip = ({ limit, page }: Pagination): number => {
  return limit * (page - 1);
};

export const getTake = ({ limit }: Pagination): number => {
  return limit;
};
