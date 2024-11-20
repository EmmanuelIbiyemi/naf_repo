export type Pagination = {
  page?: number;
  per_page?: number;
};

export type PaginationResponse = {
  page: number;
  pages: number;
  per_page: number;
  total: number;
};
