import { SortDirectionEnum } from "common/enums/sort-direction.enum";

export interface PaginationOptions {
  page: number;
  limit: number;
  sort_field?: string;
  sort_order?: `${SortDirectionEnum}`;
  search?: string;
}
