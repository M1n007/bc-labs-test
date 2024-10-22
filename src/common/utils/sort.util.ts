// src/shared/utils/sort.util.ts
import { SelectQueryBuilder } from 'typeorm';
import { SortDirectionEnum } from '../enums/sort-direction.enum';

export const applySorting = (
  query: SelectQueryBuilder<any>,
  sortField: string,
  sortDirection: SortDirectionEnum = SortDirectionEnum.ASC,
  allowedSortFields: string[] = [], // List of allowed fields for sorting
) => {
  if (sortField && allowedSortFields.includes(sortField)) {
    query.addOrderBy(sortField, sortDirection);
  }
};
