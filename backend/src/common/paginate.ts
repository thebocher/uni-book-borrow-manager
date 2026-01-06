import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export interface IPaginationMeta {
    itemCount: number;
    totalItems?: number;
    itemsPerPage: number;
    totalPages?: number;
    currentPage: number;
}

export interface IPaginatedResult<DtoT> {
    items: DtoT[];
    meta: IPaginationMeta;
}

export interface IPaginationOptions {
    page: number;
    limit: number;
}

/**
 * Generates a paginated result set from a query.
 * @param query - The TypeORM SelectQueryBuilder instance.
 * @param mapper - A function to map entities to DTOs.
 * @param page - The current page number (1-based).
 * @param pageSize - The number of items per page.
 * @returns a promise that resolves to an array of mapped DTOs.
 */
export async function paginate<EntityT extends ObjectLiteral, DtoT>(
    query: SelectQueryBuilder<EntityT>,
    mapper: (entity: EntityT) => DtoT,
    options: IPaginationOptions,
): Promise<IPaginatedResult<DtoT>> {
    const { page, limit: pageSize } = options;

    const totalItemsQuery = query.clone();

    const offset = (page - 1) * pageSize;
    const paginatedQuery = query.skip(offset).take(pageSize);

    const items = await paginatedQuery
        .getMany()
        .then((entities) => entities.map((element) => mapper(element)));

    const totalItems = await totalItemsQuery.getCount();

    const meta: IPaginationMeta = {
        itemCount: await query.getCount(),
        totalPages: Math.ceil(totalItems / pageSize),
        totalItems,
        itemsPerPage: pageSize,
        currentPage: page,
    };

    return { items, meta } as IPaginatedResult<DtoT>;
}
