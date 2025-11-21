export type GenericState<T, F> = {
  data: T[];
  totalPages: number;
  totalElements: number;
  message: string;
  isLoading: boolean;
  numberOfElements: number;
  selectedData: T | null;
  filter: F;
  columns?: any[];
};
