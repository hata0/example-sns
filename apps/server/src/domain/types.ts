import type { Pagination } from "./value-objects/pagination";

export interface Entity<Id> {
  readonly id: Id;
}

export interface PaginationFilter {
  readonly pagination: Pagination;
}
