export interface Pagination {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
}

export class PaginatedResult<T> {
    items?: T;
    pagination?: Pagination;
}