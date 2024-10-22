import { SelectQueryBuilder } from "typeorm";

export const applyRelations = <T>(
  query: SelectQueryBuilder<T>,
  entityAlias: string,
  relations: { relation: string, alias?: string }[]
) => {
  relations.forEach(({ relation, alias }) => {
    query.leftJoinAndSelect(`${entityAlias}.${relation}`, alias || relation);
  });
};
