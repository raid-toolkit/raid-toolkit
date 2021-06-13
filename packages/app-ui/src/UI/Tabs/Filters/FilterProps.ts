export interface FilterProps<T> {
  onFilterChanged: (filter: (item: T) => boolean) => void;
}
