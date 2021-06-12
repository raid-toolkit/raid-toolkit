import * as React from 'react';

export interface ResourceContextApi {
  getResourcePath(...resourcePath: string[]): string;
}

export const ResourceContext = React.createContext<ResourceContextApi>({
  getResourcePath(...resourcePath: string[]) {
    return `resource://${resourcePath.join('/')}`;
  },
});
