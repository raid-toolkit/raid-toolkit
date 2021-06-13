import * as React from 'react';
import { MultiSelect, IItemRendererProps, ItemPredicate } from '@blueprintjs/select';
import { ITagProps, MenuItem } from '@blueprintjs/core';
import { DefaultedMap } from '@raid-toolkit/utils';
import { FilterProps } from './FilterProps';

export interface SimpleFilter<T, U> {
  name: string;
  propertyName: keyof T;
  propertyDisplayName?: string;
  getProperty?: (value: T) => U;
  predicate?: (value: T) => boolean;
  getTagProps?: () => ITagProps;
  renderTag?: () => React.ReactNode;
  value: U;
}

export interface ComplexFilter<T, U> {
  name: string;
  propertyName: string;
  propertyDisplayName?: string;
  getProperty: (value: T) => U;
  predicate?: (value: T) => boolean;
  getTagProps?: () => ITagProps;
  renderTag?: () => React.ReactNode;
  value: U;
}

export type Filter<T, U> = SimpleFilter<T, U> | ComplexFilter<T, U>;

export interface SelectFilterProps<T, U> extends FilterProps<T> {
  filters: Filter<T, U>[];
}

export const SelectFilter = function SelectFilter<T, U>({
  filters,
  onFilterChanged,
}: SelectFilterProps<T, U>): JSX.Element {
  const [selectedFilters, setSelectedFilters] = React.useState<Filter<T, U>[]>([]);

  const renderFilterTag = React.useCallback((filter: Filter<T, U>) => filter.renderTag?.() ?? filter.name, []);
  const getTagProps = React.useCallback(
    (_node: React.ReactNode, index: number): any => selectedFilters[index]?.getTagProps?.() ?? {},
    [selectedFilters]
  );
  const renderFilter = React.useCallback(
    (filter: Filter<T, U>, { modifiers, handleClick }: IItemRendererProps): JSX.Element | null => {
      if (!modifiers.matchesPredicate) {
        return null;
      }
      return (
        <MenuItem
          active={modifiers.active}
          icon={selectedFilters.includes(filter) ? 'tick' : 'blank'}
          key={filter.name}
          label={filter.propertyDisplayName ?? filter.propertyName.toString()}
          onClick={handleClick}
          text={filter.name}
          shouldDismissPopover={false}
        />
      );
    },
    [selectedFilters]
  );

  const onItemSelect = React.useCallback(
    (filter: Filter<T, U>) => {
      const newFilters = [...selectedFilters];
      const idx = newFilters.indexOf(filter);
      if (idx === -1) {
        newFilters.push(filter);
      } else {
        newFilters.splice(idx, 1);
      }
      setSelectedFilters(newFilters);
      const propertyFilters = new DefaultedMap<string, ((item: T) => boolean)[]>(() => []);
      for (const { predicate, propertyName, getProperty, value } of newFilters) {
        if (predicate) {
          propertyFilters.get(propertyName as string).push(predicate);
        } else {
          const getPropertyFn = getProperty ?? ((item: T) => item[propertyName as keyof T]);
          propertyFilters.get(propertyName as string).push((item) => getPropertyFn(item) === value);
        }
      }
      const groupedFilters = Array.from(propertyFilters.values()).map(
        (filters) => (item: T) => filters.some((filter) => filter(item))
      );
      const collapsedFilter = (item: T) => groupedFilters.every((filter) => filter(item));
      onFilterChanged(collapsedFilter);
      // onFilterChanged(newFilters.map(({name, propertyName, value, getProperty}) => (item: T) => getProperty(item) === filter.value));
    },
    [selectedFilters, setSelectedFilters]
  );

  const itemPredicate = React.useCallback<ItemPredicate<Filter<T, U>>>(
    (query, item) =>
      item.name.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) > -1 ||
      (item.propertyDisplayName ?? item.propertyName.toString())
        .toLocaleLowerCase()
        .indexOf(query.toLocaleLowerCase()) > -1,
    []
  );

  return (
    <MultiSelect
      fill
      resetOnSelect
      items={filters}
      itemPredicate={itemPredicate}
      itemRenderer={renderFilter}
      tagRenderer={renderFilterTag}
      tagInputProps={{ large: true, tagProps: getTagProps }}
      onItemSelect={onItemSelect}
      onRemove={onItemSelect}
      selectedItems={selectedFilters}
    />
  );
};
