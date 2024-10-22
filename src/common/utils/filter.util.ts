// src/shared/utils/filter.util.ts
import { SelectQueryBuilder } from 'typeorm';
import { FilterConfig } from '../interfaces/filter.interface';
import { FilterTypeEnum } from '../enums/filter-types.enum';

export const applyFilters = (query: SelectQueryBuilder<any>, filters: FilterConfig[]) => {
  filters.forEach((filter) => {
    switch (filter.type) {
      case FilterTypeEnum.EXACT:
        query.andWhere(`${filter.field} = :${filter.field.replace('.', '_')}`, {
          [filter.field.replace('.', '_')]: filter.value,
        });
        break;

      case FilterTypeEnum.PARTIAL:
        query.andWhere(`${filter.field} LIKE :${filter.field.replace('.', '_')}`, {
          [filter.field.replace('.', '_')]: `%${filter.value}%`,
        });
        break;

      case FilterTypeEnum.IN:
        query.andWhere(`${filter.field} IN (:...${filter.field.replace('.', '_')})`, {
          [filter.field.replace('.', '_')]: filter.value,
        });
        break;

      case FilterTypeEnum.RANGE:
        if (filter.minValue !== undefined && filter.maxValue !== undefined) {
          query.andWhere(`${filter.field} BETWEEN :min_${filter.field.replace('.', '_')} AND :max_${filter.field.replace('.', '_')}`, {
            [`min_${filter.field.replace('.', '_')}`]: filter.minValue,
            [`max_${filter.field.replace('.', '_')}`]: filter.maxValue,
          });
        } else if (filter.minValue !== undefined) {
          query.andWhere(`${filter.field} >= :min_${filter.field.replace('.', '_')}`, {
            [`min_${filter.field.replace('.', '_')}`]: filter.minValue,
          });
        } else if (filter.maxValue !== undefined) {
          query.andWhere(`${filter.field} <= :max_${filter.field.replace('.', '_')}`, {
            [`max_${filter.field.replace('.', '_')}`]: filter.maxValue,
          });
        }
        break;

      case FilterTypeEnum.BOOLEAN:
        query.andWhere(`${filter.field} = :${filter.field.replace('.', '_')}`, {
          [filter.field.replace('.', '_')]: filter.value,
        });
        break;

      case FilterTypeEnum.RELATION:
        query.innerJoinAndSelect(filter.relationField, filter.field)
          .andWhere(`${filter.field} = :${filter.field.replace('.', '_')}`, {
            [filter.field.replace('.', '_')]: filter.value,
          });
        break;

      case FilterTypeEnum.NEGATION:
        query.andWhere(`${filter.field} != :${filter.field.replace('.', '_')}`, {
          [filter.field.replace('.', '_')]: filter.value,
        });
        break;

      case FilterTypeEnum.ARRAY_EXACT:
        // Handle filtering for exact matches in comma-separated string arrays (e.g., tags)
        if (Array.isArray(filter.value)) {
          filter.value.forEach((tag: string, index: number) => {
            query.andWhere(
              `(${filter.field} = :exact_tag_${index} 
                OR ${filter.field} LIKE :start_tag_${index} 
                OR ${filter.field} LIKE :end_tag_${index} 
                OR ${filter.field} LIKE :middle_tag_${index})`,
              {
                [`exact_tag_${index}`]: tag,                      // Exact match for single tag
                [`start_tag_${index}`]: `${tag},%`,               // Tag is at the beginning
                [`end_tag_${index}`]: `%,${tag}`,                 // Tag is at the end
                [`middle_tag_${index}`]: `%,${tag},%`,            // Tag is in the middle
              }
            );
          });
        }
        break;


      default:
        break;
    }
  });
};
