import * as React from 'react';
import { Overlay, Classes, Button } from '@blueprintjs/core';
import { OAuthAuthorizationRequest } from '@raid-toolkit/app-shared';
import { ServiceHost } from '../ServiceHost';

export const AuthOverlay: React.FC = () => {
  const [requests, setRequests] = React.useState<OAuthAuthorizationRequest[]>([]);
  React.useEffect(() => {
    ServiceHost.appModel.on('request-access', (request) => setRequests((requests) => [...requests, request]));
  }, []);

  const request = React.useMemo(() => requests[0], [requests]);
  const onGrant = React.useCallback(() => {
    ServiceHost.appModel.grantAccess({
      appId: request.appId,
      description: request.description,
      name: request.name,
      scopes: Object.keys(request.scopes),
      secret: '', // will be filled in by API
    });
    setRequests((requests) => requests.filter((entry) => entry !== request));
  }, [request]);

  const onDeny = React.useCallback(() => {
    ServiceHost.appModel.denyAccess(request.appId);
    setRequests((requests) => requests.filter((entry) => entry !== request));
  }, [request]);

  return (
    <Overlay
      className={Classes.OVERLAY_CONTAINER}
      isOpen={!!request}
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      autoFocus
      enforceFocus
    >
      {request && (
        <div
          className={`${[Classes.CARD, Classes.ELEVATION_4].join(' ')}`}
          style={{ width: 400, left: 'calc(50vw - 200px)', marginTop: '10vh' }}
        >
          <h1>Grant access</h1>
          <p>
            <strong>{request.name}</strong>
            {' '}
            would like to access the following data:
          </p>
          <ul>
            {Object.entries(request.scopes).map(([scope, reason]) => (
              <li key={scope}>
                <strong>{scope}</strong>
                :
                {reason}
              </li>
            ))}
          </ul>
          <h3>Description</h3>
          <p>{request.description}</p>
          <Button intent="success" text="Grant" onClick={onGrant} />
          {' '}
          <Button intent="danger" text="Deny" onClick={onDeny} />
        </div>
      )}
    </Overlay>
  );
};
