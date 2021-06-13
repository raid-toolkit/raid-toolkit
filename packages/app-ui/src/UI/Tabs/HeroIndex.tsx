import * as React from 'react';
import type { HeroInfo, HeroSnapshot } from '@raid-toolkit/types';
import { MenuItem } from '@blueprintjs/core';
import { IItemRendererProps, ItemPredicate, Suggest } from '@blueprintjs/select';
import { HeroDetails } from '../Components/HeroDetails';
import { ServiceHost } from '../../ServiceHost';

function selectHeroName(item: HeroSnapshot): string {
  return item.name;
}

function renderHeroSuggestion(item: HeroSnapshot, itemProps: IItemRendererProps): JSX.Element {
  return <MenuItem text={selectHeroName(item)} onClick={itemProps.handleClick} />;
}

export const filterHero: ItemPredicate<HeroSnapshot> = (query, hero, _index, exactMatch) => {
  const normalizedTitle = hero.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } 
    return normalizedTitle.indexOf(normalizedQuery) >= 0;
  
};
export const HeroIndex: React.FC = () => {
  const [selectedHero, setSelectedHero] = React.useState<HeroSnapshot | null>(null);
  const [allHeroes, setAllHeroes] = React.useState<HeroSnapshot[] | undefined>(undefined);
  const fetchData = React.useCallback(() => ServiceHost.appModel.getHeroIndex().then(setAllHeroes), [setAllHeroes]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const onFilterChanged = React.useCallback(
    (activeItem: HeroSnapshot | null, _isCreateNewItem: boolean) => setSelectedHero(activeItem),
    [setSelectedHero]
  );

  const filteredHeroes = React.useMemo(() => (selectedHero ? [selectedHero] : []), [selectedHero]);

  const onRenderCell = React.useCallback((item?: HeroSnapshot, _index?: number) => (
    <div
      style={{
          float: 'left',
          width: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      data-is-focusable
    >
      {item && <HeroDetails hero={item} />}
    </div>
    ), []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="bp3-card bp3-elevation-3">
        Champion name:
        {' '}
        <Suggest
          items={allHeroes ?? []}
          itemPredicate={filterHero}
          itemRenderer={renderHeroSuggestion}
          inputValueRenderer={selectHeroName}
          onActiveItemChange={onFilterChanged}
          noResults={<MenuItem disabled text="No results." />}
        />
      </div>

      {filteredHeroes.map(onRenderCell)}
    </div>
  );
};
