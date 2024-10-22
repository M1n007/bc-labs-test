import { Injectable } from '@nestjs/common';
import { PaginationOptions } from '../interfaces/pagination-options.interface';
import { PaginationResponse } from '../interfaces/pagination-response.interface';
import { FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class PaginationService {

  // Method 1: Pagination directly on the repository
  async paginateRepository<T>(
    repository: Repository<T>,
    options: PaginationOptions,
    findOptions?: FindManyOptions<T>
  ): Promise<PaginationResponse<T>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await repository.findAndCount({
      skip: skip,
      take: limit,
      ...findOptions
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      total_items: totalItems,
      total_pages: totalPages,
      page: page,
      limit: limit,
      has_next_page: page < totalPages,
      has_previous_page: page > 1,
    };
  }

  // Method 2: Pagination using a custom query builder
  async paginateQueryBuilder<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: PaginationOptions
  ): Promise<PaginationResponse<T>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      total_items: totalItems,
      total_pages: totalPages,
      page: page,
      limit: limit,
      has_next_page: page < totalPages,
      has_previous_page: page > 1,
    };
  }
}
