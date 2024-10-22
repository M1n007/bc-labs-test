export interface PaginatedResult<T = any> {
  items: T[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}
