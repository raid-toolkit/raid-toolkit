import * as React from 'react';
import { List } from 'office-ui-fabric-react/lib/List';
import type { IRectangle } from 'office-ui-fabric-react/lib/Utilities';
import { Affinity, Faction, Rarity, Hero, HeroSnapshot } from '@raid-toolkit/types';
import { Drawer, Intent, Spinner } from '@blueprintjs/core';
import { EnumStrings } from '@raid-toolkit/app-shared';
import { firstBy } from 'thenby';
import { HeroCard, ITEM_OUTER_HEIGHT, MIN_ITEM_WIDTH } from '../Components/HeroCard';
import { Filter, SelectFilter } from './Filters';
import { ResourceImage } from '../Components';
import { HeroDetails } from '../Components/HeroDetails';
import { ErrorMessage } from '../Components/Error';
import { SelectSort, Sort } from './Filters/SelectSort';
import { calculateDamage, CalculateDamageMode } from '../Components/CalculateDamage';
import { ServiceHost } from '../../ServiceHost';

const ROWS_PER_PAGE = 12;

function makeRarityFilter(value: Rarity): Filter<HeroSnapshot, Rarity> {
  return {
    name: Rarity[value],
    value,
    propertyDisplayName: 'Rarity',
    propertyName: 'rarity',
    getProperty(hero) {
      return hero.type.rarity;
    },
  };
}

function makeAffinityFilter(value: Affinity): Filter<HeroSnapshot, Affinity> {
  return {
    name: Affinity[value],
    value,
    propertyDisplayName: 'Affinity',
    propertyName: 'affinity',
    getProperty(hero) {
      return hero.type.affinity;
    },
  };
}

function makeFactionFilter(value: Faction): Filter<HeroSnapshot, Faction> {
  return {
    name: EnumStrings.faction[value],
    value,
    propertyDisplayName: 'Faction',
    propertyName: 'faction',
    getProperty(hero) {
      return hero.type.faction;
    },
    getTagProps() {
      return {
        icon: <ResourceImage path={`FractionAvatars/${value.toString()}.png`} style={{ maxHeight: 24 }} />,
      };
    },
    renderTag() {
      return Faction[value];
    },
  };
}

function makeHeroFilter(value: HeroSnapshot): Filter<HeroSnapshot, string> {
  return { name: value.name, value: value.name, propertyDisplayName: 'Hero', propertyName: 'name' };
}

function makeTeamFilter(teamName: string): Filter<HeroSnapshot, string> {
  return {
    name: teamName,
    value: teamName,
    propertyDisplayName: 'Team',
    propertyName: 'teams',
    predicate(setup) {
      return setup.teams.includes(teamName);
    },
  };
}

const filters: Filter<HeroSnapshot, Rarity | Faction | Affinity>[] = [
  ...[Rarity.Legendary, Rarity.Epic, Rarity.Rare, Rarity.Uncommon, Rarity.Common].map(makeRarityFilter),
  ...[
    Faction.BannerLords,
    Faction.HighElves,
    Faction.SacredOrder,
    Faction.Barbarians,
    Faction.OgrynTribes,
    Faction.Lizardmen,
    Faction.Skinwalkers,
    Faction.Orcs,
    Faction.Demonspawn,
    Faction.UndeadHordes,
    Faction.DarkElves,
    Faction.KnightRevenant,
    Faction.Dwarves,
    Faction.ShadowKin,
  ].map(makeFactionFilter),
  ...[Affinity.Force, Affinity.Magic, Affinity.Spirit, Affinity.Void].map(makeAffinityFilter),
];

const defaultSortFn = firstBy<HeroSnapshot>('level', 'desc')
  .thenBy<HeroSnapshot>((hero) => hero.type.ascended, 'desc')
  .thenBy<HeroSnapshot>((hero) => hero.type.rarity, 'desc')
  .thenBy<HeroSnapshot>((hero) => hero.type.affinity, 'desc');

const sorts: Sort<HeroSnapshot>[] = [
  { name: 'Rarity', delegate: (hero) => hero.type.rarity },
  { name: 'Rank', delegate: firstBy<HeroSnapshot>('rank').thenBy((hero) => hero.type.ascended) },
  { name: 'Level', delegate: 'level' },
  { name: 'Name', delegate: 'name', defaultDirection: 'asc' },
  { name: 'ATK', delegate: (a, b) => a.stats.Attack - b.stats.Attack },
  { name: 'DEF', delegate: (a, b) => a.stats.Defense - b.stats.Defense },
  { name: 'HP', delegate: (a, b) => a.stats.Health - b.stats.Health },
  { name: 'C.RATE', delegate: (a, b) => a.stats.CriticalChance - b.stats.CriticalChance },
  { name: 'C.DMG', delegate: (a, b) => a.stats.CriticalDamage - b.stats.CriticalDamage },
  { name: 'ACC', delegate: (a, b) => a.stats.Accuracy - b.stats.Accuracy },
  { name: 'RES', delegate: (a, b) => a.stats.Resistance - b.stats.Resistance },
  { name: 'SPD', delegate: (a, b) => a.stats.Speed - b.stats.Speed },
  { name: 'Affinity', delegate: (hero) => hero.type.affinity, defaultDirection: 'asc' },
  { name: 'Faction', delegate: (hero) => hero.type.faction, defaultDirection: 'asc' },
  {
    name: 'Damage (A1)',
    delegate: (a, b) =>
      calculateDamage(a.skills[0], a.stats, [], a.masteries ?? [], { mode: CalculateDamageMode.Average }) -
      calculateDamage(b.skills[0], b.stats, [], b.masteries ?? [], { mode: CalculateDamageMode.Average }),
  },
];

function makeHeroFilters(heroes: HeroSnapshot[]): Filter<HeroSnapshot, string>[] {
  const heroFilters = new Map<number, HeroSnapshot>();
  for (const hero of heroes) {
    heroFilters.set(hero.typeId - (hero.typeId % 10), hero);
  }
  return Array.from(heroFilters.values()).map(makeHeroFilter);
}

export const Heroes: React.FC = () => {
  const [filter, setFilter] = React.useState<((item: HeroSnapshot) => boolean) | undefined>(undefined);
  const [sort, setSort] = React.useState<(a: HeroSnapshot, b: HeroSnapshot) => number>(() => defaultSortFn);
  const [allHeroes, setAllHeroes] = React.useState<HeroSnapshot[] | undefined>(undefined);
  const [selectedHero, setSelectedHero] = React.useState<HeroSnapshot | undefined>();
  const [error, setError] = React.useState<Error | undefined>();
  const [teamNames, setTeamNames] = React.useState<string[] | undefined>(undefined);
  const mergedFilters: Filter<HeroSnapshot, any>[] = React.useMemo(
    () => [...filters, ...(allHeroes ? makeHeroFilters(allHeroes) : []), ...(teamNames?.map(makeTeamFilter) ?? [])],
    [allHeroes, teamNames]
  );
  const fetchData = React.useCallback(() => ServiceHost.appModel.getHeroes().then(setAllHeroes), [setAllHeroes]);

  React.useEffect(() => {
    // TODO: Re-enable teams
    // ServiceHost.appModel.getTeamNames().then(setTeamNames);
    fetchData().catch(setError);
  }, []);

  const onFilterChanged = React.useCallback((filter: (item: HeroSnapshot) => boolean) => setFilter(() => filter), []);
  const onSortChanged = React.useCallback((sort: ((a: HeroSnapshot, b: HeroSnapshot) => number) | undefined) => {
    setSort(() => sort ?? defaultSortFn);
  }, []);

  const filteredHeroes = React.useMemo(() => {
    if (!allHeroes || !filter) {
      return allHeroes;
    }
    return allHeroes.filter(filter);
  }, [filter, allHeroes]);

  const sortedAndFilteredHeroes = React.useMemo(() => {
    if (!filteredHeroes) {
      return filteredHeroes;
    }
    if (!sort) {
      return filteredHeroes;
    }
    return [...filteredHeroes].sort(sort);
  }, [sort, filteredHeroes]);

  const columnCount = React.useRef(0);
  const rowHeight = React.useRef(0);
  const getItemCountForPage = React.useCallback((itemIndex?: number, surfaceRect?: IRectangle) => {
    if (itemIndex === 0 && surfaceRect) {
      columnCount.current = Math.floor(surfaceRect.width / MIN_ITEM_WIDTH);
      rowHeight.current = Math.ceil(surfaceRect.height / 100);
    }
    const itemCount = columnCount.current * ROWS_PER_PAGE;
    return itemCount;
  }, []);

  const onSelect = React.useCallback(
    (item: Hero) => {
      setSelectedHero(item as HeroSnapshot);
    },
    [setSelectedHero]
  );

  const clearSelection = React.useCallback(() => {
    setSelectedHero(undefined);
  }, [setSelectedHero]);

  const onRenderCell = React.useCallback(
    (item?: HeroSnapshot, index?: number) => (
      <div
        key={`hero_${item?.id}_${index}`}
        style={{
            float: 'left',
            width: `${100 / columnCount.current  }%`,
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        data-is-focusable
      >
        {item && <HeroCard onSelect={onSelect} hero={item} />}
      </div>
      ),
    [setSelectedHero]
  );

  const getPageHeight = React.useCallback((): number => ITEM_OUTER_HEIGHT * ROWS_PER_PAGE, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="bp3-card bp3-elevation-3" style={{ display: 'flex', flexDirection: 'row', zIndex: 1, gap: 20 }}>
        <h3 style={{ margin: 0, alignSelf: 'center' }}>Filters</h3>
        <div style={{ flex: 1 }}>
          <SelectFilter filters={mergedFilters} onFilterChanged={onFilterChanged} />
        </div>
        <h3 style={{ margin: 0, alignSelf: 'center' }}>Sort</h3>
        <div style={{ flex: 1 }}>
          <SelectSort sorts={sorts} onSortChanged={onSortChanged} />
        </div>
      </div>

      {sortedAndFilteredHeroes ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'scroll',
            paddingTop: 10,
            paddingBottom: 10,
          }}
          data-is-scrollable
        >
          <List
            style={{ width: '100%', position: 'relative' }}
            items={sortedAndFilteredHeroes}
            getItemCountForPage={getItemCountForPage}
            getPageHeight={getPageHeight}
            onRenderCell={onRenderCell}
            renderedWindowsAhead={2}
          />

          <Drawer onClose={clearSelection} isOpen={!!selectedHero} size="75%" position="bottom">
            {selectedHero && <HeroDetails hero={selectedHero} />}
          </Drawer>
        </div>
      ) : (
        <div
          style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          {error ? (
            <ErrorMessage error={error} />
          ) : (
            <>
              <Spinner size={100} intent={Intent.PRIMARY} />
              <h3>Loading heroes...</h3>
            </>
          )}
        </div>
      )}
    </div>
  );
};
