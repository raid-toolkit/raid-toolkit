import * as React from 'react';
import {
  Tab,
  Tabs,
  Navbar,
  Alignment,
  TabId,
  Card,
  Button,
  Elevation,
  ButtonGroup,
  Icon,
  Callout,
} from '@blueprintjs/core';
import { Classes, Popover2 } from '@blueprintjs/popover2';
// import { Shards } from './Tabs/Shards';
import { FiCoffee } from 'react-icons/fi';
import { Rarity } from '@raid-toolkit/types';
import { UserRole , UserSettings } from '@raid-toolkit/app-shared';
import { DataExplorer } from './Tabs/DataExplorer';
import { RarityColors } from './Constants/ShardColors';
import { UpdateButton } from './UpdateButton';
import { ResourceImage } from './Components/ResourceImage';
import { Heroes } from './Tabs/Heroes';
import { ReloadOverlay } from './ReloadOverlay';
import { HeroIndex } from './Tabs/HeroIndex';
import MercyHelp from "../Images/MercyHelp.png";
import { UserSettingsInput } from './UserSettingsInput';

import DiscordLogo from "../Images/Discord-Logo+Wordmark-White.svg";
import { ServiceHost } from '../ServiceHost';
import { AuthOverlay } from './AuthOverlay';
import { AppPermissions } from './AppPermissions';

export const App: React.FC = () => {
  const [tabId, setTabId] = React.useState<TabId>('home');
  const [serverEnabled, setServerEnabled] = React.useState(false);
  const [roles, setRoles] = React.useState<UserRole[]>([]);
  const switchToShards = React.useCallback(() => setTabId('shards'), [setTabId]);

  const saveSettings = React.useCallback((settings: UserSettings) => {
    ServiceHost.appHost.setUserSettings(settings).then(async () => {
      if (settings.alphaUser) {
        await ServiceHost.appModel.accessCheck();
        setRoles(await ServiceHost.appModel.getUserRoles());
      } else {
        setRoles([]);
      }
    });
  }, []);

  const toggleServer = React.useCallback(() => {
    ServiceHost.appHost.toggleServer(!serverEnabled);
    setServerEnabled(!serverEnabled);
  }, [serverEnabled, setServerEnabled]);

  const openServer = React.useCallback(() => {
    serverEnabled && ServiceHost.appHost.openServer();
  }, [serverEnabled]);

  const donate = React.useCallback(() => {
    ServiceHost.appHost.donate();
  }, []);

  const openDiscord = React.useCallback(() => {
    ServiceHost.appHost.openDiscord();
  }, []);

  React.useEffect(() => {
    ServiceHost.appHost.onRender();
    ServiceHost.appHost.getUserSettings().then(async (settings) => {
      if (settings.alphaUser) {
        await ServiceHost.appModel.accessCheck();
        setRoles(await ServiceHost.appModel.getUserRoles());
      }
    });
    ServiceHost.appHost.getServerState().then(setServerEnabled);
  }, []);

  const content = React.useMemo(() => {
    switch (tabId) {
      case 'home': {
        return (
          <Callout intent="warning" style={{ textAlign: 'center' }}>
            <h2>Shard Mercy Rule</h2>
            <p>
              Due to changes in the game, the mercy rule information is no longer available. Due to this recent change,
              and feedback from Plarium, the main focus in the coming weeks for this tool will be to provide more
              transparency to both users and Plarium about what information is being accessed and how it is used.
            </p>
            <p>Once these concerns have been addressed, work will resume on any mercy tracking or other new features</p>
            {/* <img src={MercyHelp} /> */}
            {/* <p>Fill the progress bar to get a guaranteed summon of that rarity!</p>
            <Button onClick={switchToShards}>Check it now</Button> */}
          </Callout>
        );
      }
      // case 'shards': {
      //   return <Shards />;
      // }
      case 'heroes': {
        return <Heroes />;
      }
      case 'hero-index': {
        return <HeroIndex />;
      }
      case 'game-data': {
        return <DataExplorer />;
      }
    }
  }, [tabId]);

  const exportButton = React.useMemo(
    () => (
      <>
        <Button
          key="enableServerBtn"
          style={{
            transition: `max-width 0.25s, background-color 0.25s, min-width 0.25s, background-color 0.25s`,
            maxWidth: serverEnabled ? 360 : 0, // hardcoded width required to make size animation work
            minWidth: serverEnabled ? 275 : 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
          disabled={!serverEnabled}
          onClick={openServer}
          intent="success"
          title="Enable server"
        >
          {serverEnabled ? 'Server listening at http://localhost:5656/v1' : ''}
        </Button>

        <Button
          icon="cloud"
          title={serverEnabled ? 'Disable server' : 'Enable server'}
          intent={serverEnabled ? 'success' : undefined}
          onClick={toggleServer}
        />
      </>
    ),
    [serverEnabled, toggleServer]
  );
  const donateButton = React.useMemo(
    () => (
      <Popover2
        interactionKind="click"
        popoverClassName={Classes.POPOVER2_CONTENT}
        placement="bottom-end"
        content={(
          <div style={{ width: 500, padding: 20, cursor: 'default' }}>
            <h2>Help support RAID Toolkit ☕</h2>
            <p>
              If you find this tool useful and would like to show your appreciation, you can buy me a coffee to help
              fuel my late night addictions to Raid and coding.
            </p>
            <p className="bp3-text-muted">
              ...so what if my coffee happens to come in rarities of
              {' '}
              <span style={{ color: RarityColors[Rarity.Rare] }}>rare</span>
              ,
              {' '}
              <span style={{ color: RarityColors[Rarity.Epic] }}>epic</span>
              , and
              {' '}
              <span style={{ color: RarityColors[Rarity.Legendary] }}>legendary</span>
              ?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
              <ButtonGroup>
                <Button
                  className={Classes.POPOVER2_DISMISS}
                  onClick={donate}
                  icon={<FiCoffee color="white" size={16} strokeWidth={2.5} />}
                  intent="success"
                  text="Buy me a coffee"
                />
                <Button className={Classes.POPOVER2_DISMISS} intent="primary" text="Dismiss" />
              </ButtonGroup>
            </div>
          </div>
        )}
        renderTarget={({ isOpen, ref, ...targetProps }) => (
          <Button
            icon={<FiCoffee color="#a7b6c2" size={16} strokeWidth={2.5} />}
            title="Buy me a coffee"
            elementRef={ref as any}
            {...targetProps}
          />
        )}
      />
    ),
    []
  );

  const settingsButton = React.useMemo(
    () => (
      <Popover2
        interactionKind="click"
        popoverClassName={Classes.POPOVER2_CONTENT}
        placement="bottom-end"
        autoFocus
        enforceFocus
        content={(
          <div style={{ width: 500, padding: 20, cursor: 'default' }}>
            <h2>Settings</h2>
            <UserSettingsInput onSaveSettings={saveSettings} />
          </div>
        )}
        renderTarget={({ isOpen, ref, ...targetProps }) => (
          <Button icon="settings" title="Settings" elementRef={ref as any} {...targetProps} />
        )}
      />
    ),
    [saveSettings]
  );

  const accessButton = React.useMemo(
    () => (
      <Popover2
        interactionKind="click"
        popoverClassName={Classes.POPOVER2_CONTENT}
        placement="bottom-end"
        autoFocus
        enforceFocus
        content={(
          <div style={{ padding: 20, cursor: 'default' }}>
            <h2>Apps</h2>
            <AppPermissions />
          </div>
        )}
        renderTarget={({ isOpen, ref, ...targetProps }) => (
          <Button icon="key" title="Application Access" elementRef={ref as any} {...targetProps} />
        )}
      />
    ),
    []
  );

  const discordButton = React.useMemo(
    () => (
      <Button
        icon={<img src={DiscordLogo} style={{ height: 22, margin: -4, opacity: 0.8 }} />}
        onClick={openDiscord}
        title="Discord"
      />
    ),
    []
  );

  return React.useMemo(
    () => (
      <div style={{ paddingTop: 50, height: '100%' }}>
        <Navbar fixedToTop>
          <Navbar.Group>
            <Navbar.Heading style={{ marginRight: 25 }}>RAID Toolkit</Navbar.Heading>
          </Navbar.Group>
          <Navbar.Group align={Alignment.LEFT}>
            <Tabs id="AppTabs" large onChange={setTabId} selectedTabId={tabId}>
              <Tab style={{ lineHeight: '50px' }} id="home">
                Home
              </Tab>
              {/* <Tab style={{ lineHeight: '50px' }} id="shards">
                Shards
              </Tab> */}
              <Tab style={{ lineHeight: '50px' }} id="heroes">
                Heroes
              </Tab>
            </Tabs>
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            <ButtonGroup>
              {exportButton}
              {donateButton}
              {settingsButton}
              {accessButton}
              {discordButton}
            </ButtonGroup>
            <ButtonGroup style={{ paddingLeft: 20 }}>
              <UpdateButton />
            </ButtonGroup>
          </Navbar.Group>

          {roles.includes(UserRole.AlphaUser) && (
            <Navbar.Group align={Alignment.RIGHT} style={{ marginRight: 20 }}>
              <div style={{ paddingRight: 20, opacity: 0.4 }}>
                <Icon icon="eye-open" />
                {' '}
                Alpha user
              </div>
              <Tabs id="AppTabs" large onChange={setTabId} selectedTabId={tabId}>
                <Tab style={{ lineHeight: '50px' }} id="hero-index">
                  Index
                </Tab>
                <Tab style={{ lineHeight: '50px' }} id="game-data">
                  Data Explorer
                </Tab>
              </Tabs>
            </Navbar.Group>
          )}
        </Navbar>
        <div style={{ height: '100%', overflowY: 'auto' }}>{content}</div>
        <ReloadOverlay />
        <AuthOverlay />
      </div>
    ),
    [exportButton, donateButton, settingsButton, accessButton, discordButton, setTabId, tabId, content, roles]
  );
};
