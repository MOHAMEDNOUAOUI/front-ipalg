export type GenericState<T, F> = {
  data: T[];
  totalPages: number;
  totalElements: number;
  message: string;
  isLoading: boolean;
  numberOfElements: number;
  selectedData: T | null;
  selectedRows: T[] | [];
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
  selectedRowsData: () => T[];
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
  updateSelectedRow: (data: T) => void;
  setAllRowsSelected: (selected: boolean) => void;
  loadData: () => void;
}
