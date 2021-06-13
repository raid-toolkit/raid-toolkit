import * as React from 'react';
import { Hero, HeroSnapshot, isHeroSnapshot, SkillVisibility } from '@raid-toolkit/types';
import { EnumStrings } from '@raid-toolkit/app-shared';
import { Tab, Tabs } from '@blueprintjs/core';
import { ResourceImage } from './ResourceImage';
import { HeroAvatar } from './HeroAvatar';
import { HeroStats } from './HeroStats';
import { RichString } from './RichString';
import { SkillDamage } from './SkillDamage';

export interface HeroDetailsProps {
  // TODO: re-implemnent hero type view
  hero: HeroSnapshot;
}

export const HeroDetails: React.FC<HeroDetailsProps> = ({ hero }) => {
  const statsTab = React.useMemo(
    () => (
      <div style={{ display: 'flex', flexDirection: 'column', padding: 10, overflowY: 'auto' }}>
        <HeroStats stats={hero.stats} />
      </div>
    ),
    [hero]
  );

  const visibleSkills = React.useMemo(
    () => hero.skills.filter((skill) => skill.visibility === SkillVisibility.Visible),
    [hero]
  );
  const skillsTab = React.useMemo(
    () => (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            maxWidth: 1250,
            alignSelf: 'center',
          }}
        >
          {visibleSkills.map((skill, idx) => (
            <div
              className="bp3-card bp3-elevation-2"
              key={`skill_${idx}`}
              style={{ display: 'flex', flexDirection: 'row', gap: 10, width: 600, margin: 5 }}
            >
              <ResourceImage path={`SkillIcons/!${skill.typeId}.png`} style={{ height: 48, verticalAlign: 'middle' }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <div>
                  <h2 style={{ margin: 0 }}>{skill.name}</h2>
                  <p>
                    <RichString>{skill.description}</RichString>
                  </p>
                </div>
                {skill.doesDamage && (
                  <div>
                    <SkillDamage hero={hero} skill={skill} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    [hero, visibleSkills]
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 10, overflowY: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
        <HeroAvatar
          ascended={hero.type.ascended}
          avatarKey={hero.type.avatarKey}
          level={hero.level}
          rank={hero.rank}
          rarity={hero.type.rarity}
          affinity={hero.type.affinity}
        />
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: 0 }}>{hero.name}</h1>
          <h3 style={{ marginTop: 0, opacity: 0.6 }}>{EnumStrings.role[hero.type.role]}</h3>
          <HeroStats stats={hero.stats} />
        </div>
        <div>
          <ResourceImage path={`FractionAvatars/${hero.type.faction.toString()}.png`} style={{ height: 182 }} />
        </div>
      </div>
      <Tabs>
        <Tab id="skills" title="Skills" panel={skillsTab} />
        <Tab id="stats" title="Stats" panel={statsTab} />
      </Tabs>
    </div>
  );
};
