// transaction-manager.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

@Injectable()
export class TransactionManagerService {
  constructor(private readonly dataSource: DataSource) { }

  async execute<T>(work: (manager: EntityManager, queryRunner: QueryRunner) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await work(queryRunner.manager, queryRunner);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }
}
