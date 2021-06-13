import * as React from 'react';
import { Button, FocusStyleManager } from '@blueprintjs/core';
import { App } from './App';
import { Splash } from './Splash';
import { ResourceContext, ResourceContextApi } from './ResourceContext';
import { ServiceHost } from '../ServiceHost';

FocusStyleManager.onlyShowFocusOnTabs();

async function initializeApp(setResourceContext: (value: ResourceContextApi) => void) {
  const host = await ServiceHost.appHost.getResourceHost();
  setResourceContext({
    getResourcePath(...resourcePath: string[]) {
      if (host.startsWith('http://')) {
        return [host, resourcePath.join('/').replace(/\/\//, '/')].join('/');
      }
      return [host, ...resourcePath].join('/').replace(/\/\//, '/');
    },
  });
}

export const AppRoot = ({ mode }: { mode: string }) => {
  const [resourceHost, setResourceHost] = React.useState<ResourceContextApi | undefined>();
  const onRetry = React.useCallback(() => {
    initializeApp(setResourceHost);
  }, [setResourceHost]);
  React.useEffect(() => {
    initializeApp(setResourceHost);
  }, []);

  const appUI = React.useMemo(() => {
    if (!resourceHost) {
      return null;
    }
    switch (mode) {
      case 'App':
        return <App />;
      case 'Splash':
        return <Splash />;
      default:
        return null;
    }
  }, [resourceHost, mode]);
  return resourceHost ? (
    <ResourceContext.Provider value={resourceHost}>{appUI}</ResourceContext.Provider>
  ) : (
    <Button onClick={onRetry} text="Retry" />
  );
};
