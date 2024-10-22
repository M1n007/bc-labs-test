export interface PaginationResponse<T = any> {
  items: T[];
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_next_page?: boolean
  has_previous_page?: boolean
}
