import { Brackets, SelectQueryBuilder } from "typeorm";
import { SearchTypeEnum } from "../enums/search-type.enum";


export const applySearch = <T>(
  query: SelectQueryBuilder<T>,
  searchTerm: string,
  columns: string[],
  searchType: SearchTypeEnum = SearchTypeEnum.PARTIAL,
  caseSensitive: boolean = false,
) => {
  if (!searchTerm) return;

  query.andWhere(new Brackets(qb => {
    columns.forEach(column => {
      if (searchType === SearchTypeEnum.EXACT) {
        // Exact match (case-sensitive or insensitive)
        const condition = caseSensitive
          ? `${column} = :searchTerm`
          : `LOWER(${column}) = LOWER(:searchTerm)`;
        qb.orWhere(condition, { searchTerm });
      } else {
        // Partial match (LIKE)
        const condition = caseSensitive
          ? `${column} LIKE :searchTerm`
          : `LOWER(${column}) LIKE LOWER(:searchTerm)`;
        qb.orWhere(condition, { searchTerm: `%${searchTerm}%` });
      }
    });
  }));
};
