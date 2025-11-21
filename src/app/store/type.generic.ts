export type GenericState<T, F> = {
  data: T[];
  totalPages: number;
  totalElements: number;
  message: string;
  isLoading: boolean;
  numberOfElements: number;
  selectedData: T | null;
  filter: F;
  columns: any[];
};

export interface BaseFilter {
  page: number;
  size: number;
  search: string;
  label: string;
}
export interface BaseStore<T, F extends BaseFilter> {
  // These should be computed signals, not methods
  data: () => T[];
  totalPages: () => number;
  totalElements: () => number;
  message: () => string;
  isLoading: () => boolean;
  numberOfElements: () => number;
  selectedData: () => T | null;
  filter: () => F;
  columns: () => any[];

  // These should be methods
  updateFilter: (filter: Partial<F>) => void;
  setSelectedData: (data: T | null) => void;
  updateSearch: (search: string) => void;
  loadData: () => void;
}
