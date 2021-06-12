import * as React from 'react';
import { StatusEffect } from '@raid-toolkit/types';
import { ResourceImage } from './ResourceImage';

export interface StatusEffectsProps {
  items: StatusEffect[];
  enabled: StatusEffect[];
  onChanged: (effects: StatusEffect[]) => void;
}

export const StatusEffects: React.FC<StatusEffectsProps> = ({ items, enabled, onChanged }) => {
  const onClick = React.useCallback<React.MouseEventHandler<HTMLImageElement>>(
    (event) => {
      if (!event.currentTarget) {
        return;
      }
      const statusEffectAttr = event.currentTarget.getAttribute('status-effect');
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
      {items.map((effect) => (
        <ResourceImage
          // TODO: Make a map for this icon name
          path={`StatusEffectIcons/${StatusEffect[effect]}.png`}
          status-effect={effect}
          onClick={onClick}
          style={{ opacity: enabled.includes(effect) ? 1 : 0.35, height: 24 }}
        />
      ))}
    </div>
  );
};
