import * as React from 'react';
import { Button, HTMLTable } from '@blueprintjs/core';
import { ApplicationGrant } from '@raid-toolkit/app-shared';
import { Tooltip2, Classes } from '@blueprintjs/popover2';
import { ServiceHost } from '../ServiceHost';

export const AppPermissions: React.FC = () => {
  const [version, setVersion] = React.useState(0);
  const [grants, setGrants] = React.useState<Record<string, ApplicationGrant>>({});
  React.useEffect(() => {
    ServiceHost.appModel.getApplicationGrants().then(setGrants);
  }, [version]);

  const onRevoke = React.useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const appId = e.currentTarget.getAttribute('data-app-id');
      if (!appId) {
        return;
      }
      ServiceHost.appModel.revokeAccess(appId).then(() => {
        setVersion((v) => v + 1);
      });
    },
    [setVersion]
  );

  return Object.keys(grants).length === 0 ? (
    <em>No applications have been granted access</em>
  ) : (
    <HTMLTable>
      <thead>
        <tr>
          <th>Application Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(grants).map(([appId, grant]) => (
          <tr key={grant.appId}>
            <td>
              <Tooltip2
                className={Classes.TOOLTIP2_INDICATOR}
                content={(
                  <div>
                    <p>{grant.description}</p>
                    <p>
                      <strong>Scopes: </strong>
                      {grant.scopes.join(' ')}
                    </p>
                  </div>
                )}
              >
                {grant.name}
              </Tooltip2>
            </td>
            <td>
              <Button data-app-id={appId} icon="trash" intent="danger" onClick={onRevoke} />
            </td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
};
