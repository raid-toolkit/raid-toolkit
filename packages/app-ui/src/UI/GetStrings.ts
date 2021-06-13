import React from 'react';
import type { AppModelStrings } from '@raid-toolkit/types';
import { ServiceHost } from '../ServiceHost';

let appModelStrings: Promise<AppModelStrings>;

export function getStrings(): Promise<AppModelStrings> {
  if (!appModelStrings) {
    appModelStrings = ServiceHost.appModel.getStrings();
  }
  return appModelStrings;
}

export function useStrings(): AppModelStrings | undefined {
  const [appStrings, setAppStrings] = React.useState<AppModelStrings | undefined>();
  React.useEffect(() => {
    getStrings().then(setAppStrings);
  }, []);
  return appStrings;
}
