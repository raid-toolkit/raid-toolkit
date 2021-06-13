import * as React from 'react';
import { MultiSelect, IItemRendererProps, ItemPredicate } from '@blueprintjs/select';
import { MenuItem } from '@blueprintjs/core';
import { firstBy } from 'thenby';
import { SortProps } from './SortProps';

export interface Sort<T> {
  name: string;
  rightLabel?: string;
  defaultDirection?: 'asc' | 'desc';
  delegate: keyof T | ((a: T, b: T) => number);
}

export interface SelectSortProps<T> extends SortProps<T> {
  sorts: Sort<T>[];
}

interface SortInfo {
  sortName: string;
  toggle: (event: React.MouseEvent) => void;
  direction: 'asc' | 'desc';
}

export const SelectSort = function SelectSort<T>({ sorts, onSortChanged }: SelectSortProps<T>): JSX.Element {
  const [selectedSorts, setSelectedSorts] = React.useState<SortInfo[]>([]);
  const renderSortTag = React.useCallback((sort: SortInfo) => sort.sortName, []);
  const allSorts = React.useMemo(
    () =>
      sorts.map<Readonly<SortInfo>>((sort) => ({
        sortName: sort.name,
        direction: sort.defaultDirection ?? 'desc',
        toggle: (event: React.MouseEvent) => {
          event.stopPropagation();
          setSelectedSorts((selected) => {
            const newSorts = [...selected];
            const clickedEntryIdx = newSorts.findIndex((sortInfo) => sortInfo.sortName === sort.name);
            if (clickedEntryIdx > -1) {
              newSorts[clickedEntryIdx] = {
                ...newSorts[clickedEntryIdx],
                direction: newSorts[clickedEntryIdx].direction === 'asc' ? 'desc' : 'asc',
              };
            }
            return newSorts;
          });
        },
      })),
    [sorts, setSelectedSorts]
  );
  const getTagProps = React.useCallback(
    (_node: React.ReactNode, index: number): any => {
      const sortInfo = selectedSorts[index];
      const sort = sorts.find((entry) => entry.name === sortInfo.sortName);
      if (!sort) {
        // Not expected...
        return {};
      }
      return {
        icon: sortInfo.direction === 'desc' ? 'caret-down' : 'caret-up',
        onClick: sortInfo.toggle,
      };
    },
    [selectedSorts]
  );

  const renderSort = React.useCallback(
    (sortInfo: SortInfo, { modifiers, handleClick }: IItemRendererProps): JSX.Element | null => {
      if (!modifiers.matchesPredicate) {
        return null;
      }
      const sort = sorts.find((entry) => entry.name === sortInfo.sortName);
      if (!sort) {
        return null;
      }
      return (
        <MenuItem
          active={modifiers.active}
          icon={selectedSorts.includes(sortInfo) ? 'tick' : 'blank'}
          key={sort.name}
          label={sort.rightLabel}
          onClick={handleClick}
          text={sort.name}
          shouldDismissPopover={false}
        />
      );
    },
    [selectedSorts]
  );
  const itemPredicate = React.useCallback<ItemPredicate<SortInfo>>(
    (query, item) => item.sortName.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) > -1,
    []
  );

  const onItemSelect = React.useCallback(
    (sort: SortInfo) => {
      const newSorts = [...selectedSorts];
      const idx = newSorts.indexOf(sort);
      if (idx === -1) {
        newSorts.push(sort);
      } else {
        newSorts.splice(idx, 1);
      }
      setSelectedSorts(newSorts);
      if (newSorts.length === 0) {
        onSortChanged(undefined);
      }
    },
    [selectedSorts, setSelectedSorts]
  );

  React.useEffect(() => {
    function getSortFn(sortInfo: SortInfo) {
      const sort = sorts.find((entry) => entry.name === sortInfo.sortName);
      return sort!.delegate;
    }
    const sortFns = selectedSorts.map(getSortFn) as any[];
    if (sortFns.length === 0) {
      onSortChanged(undefined);
      return;
    }
    let sortFn = firstBy<T>(sortFns[0], selectedSorts[0].direction);
    for (let n = 1; n < sortFns.length; ++n) {
      sortFn = sortFn.thenBy(sortFns[n], selectedSorts[n].direction);
    }
    onSortChanged(sortFn);
  }, [selectedSorts]);

  return (
    <MultiSelect
      fill
      resetOnSelect
      items={allSorts}
      itemPredicate={itemPredicate}
      itemRenderer={renderSort}
      tagRenderer={renderSortTag}
      tagInputProps={{ large: true, tagProps: getTagProps }}
      onItemSelect={onItemSelect}
      onRemove={onItemSelect}
      selectedItems={selectedSorts}
    />
  );
};
