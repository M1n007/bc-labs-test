import { SelectQueryBuilder } from "typeorm";

export const applyPagination = <T>(query: SelectQueryBuilder<T>, page: number, limit: number) => {
  const offset = (page - 1) * limit;
  query.skip(offset).take(limit);
};
