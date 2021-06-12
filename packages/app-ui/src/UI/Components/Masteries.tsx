import * as React from 'react';
import { MasteryKindId, StatusEffect } from '@raid-toolkit/types';
import { ResourceImage } from './ResourceImage';

export const damageMasteries: [MasteryKindId, number][] = [
  [MasteryKindId.HeartofGlory, 0.05],
  [MasteryKindId.SingleOut, 0.08],
  [MasteryKindId.ShieldBreaker, 0.25],
  [MasteryKindId.RuthlessAmbush, 0.08],
  [MasteryKindId.BringItDown, 0.06],
  [MasteryKindId.Methodical, 0.1],
  [MasteryKindId.KillStreak, 0.06],
];

export interface MasteriesProps {
  items: MasteryKindId[];
  enabled: MasteryKindId[];
  onChanged: (effects: MasteryKindId[]) => void;
}

export const Masteries: React.FC<MasteriesProps> = ({ items, enabled, onChanged }) => {
  const onClick = React.useCallback<React.MouseEventHandler<HTMLImageElement>>(
    (event) => {
      if (!event.currentTarget) {
        return;
      }
      const statusEffectAttr = event.currentTarget.getAttribute('mastery-id');
      if (!statusEffectAttr) {
        return;
      }
      const statusEffect = parseInt(statusEffectAttr, 10);
      if (enabled.includes(statusEffect)) {
        onChanged(enabled.filter((item) => item !== statusEffect));
      } else {
        onChanged(enabled.concat(statusEffect));
      }
    },
    [enabled]
  );
  return (
    <div>
      {items.map((masteryId) => (
        <ResourceImage
          path={`MasteryIcons/${masteryId}.png`}
          mastery-id={masteryId}
          onClick={onClick}
          style={{ opacity: enabled.includes(masteryId) ? 1 : 0.35, height: 24 }}
        />
      ))}
    </div>
  );
};
