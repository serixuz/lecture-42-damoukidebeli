/** `null` means "Any" - the parameter is not sent to the API. */
export interface ProductFilter {
  vegeterian: boolean | null;
  nuts: boolean | null;
  spiciness: number | null;
  categoryId: number | null;
}

export const EMPTY_FILTER: ProductFilter = {
  vegeterian: null,
  nuts: null,
  spiciness: null,
  categoryId: null,
};

export function hasActiveFilter(filter: ProductFilter): boolean {
  return Object.values(filter).some((value) => value !== null);
}
