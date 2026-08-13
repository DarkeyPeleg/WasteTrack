export const PAGE_SIZE = 8;

export function parsePage(value?: string) {
  const page = Number(value);
  if (!Number.isInteger(page) || page < 1) return 1;
  return page;
}

export function totalPages(count: number, size = PAGE_SIZE) {
  return Math.max(1, Math.ceil(count / size));
}

export function paginationSkip(page: number, size = PAGE_SIZE) {
  return (page - 1) * size;
}
