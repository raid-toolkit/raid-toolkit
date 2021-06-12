export interface SortProps<T> {
  onSortChanged: (filter: undefined | ((a: T, b: T) => number)) => void;
}
