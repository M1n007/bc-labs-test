// src/shared/interfaces/filter.interface.ts

import { FilterTypeEnum } from "../enums/filter-types.enum";

export interface FilterConfig {
  field: string;         // The field to filter (e.g., 'user.age', 'user.role')
  type: FilterTypeEnum;      // The type of filter (e.g., EXACT, PARTIAL, RANGE, etc.)
  value?: any;           // The value for the filter (e.g., 'John', [1, 2, 3], true, etc.)
  minValue?: any;        // For range filters (the lower bound)
  maxValue?: any;        // For range filters (the upper bound)
  relationField?: string; // For relation filters (e.g., 'role.name')
}
