export interface UpdateDetails {
  releaseNotes: string;
  releaseName: string;
  releaseDate: Date;
  updateURL: string;
}

export enum AutoUpdateState {
  Initializing = 'initializing',
  UpdateAvailable = 'update-available',
  UpdateDownloaded = 'update-downloaded',
  CheckingForUpdate = 'checking-for-update',
  UpdateNotAvailable = 'update-not-available',
  BeforeApplyUpdate = 'before-quit-for-update',
  Error = 'error',
}

export interface UpdatePendingState {
  state: Exclude<AutoUpdateState, AutoUpdateState.UpdateDownloaded>;
}
export interface UpdateAvailableState {
  state: AutoUpdateState.UpdateDownloaded;
  details: UpdateDetails;
}
export type UpdateState = UpdatePendingState | UpdateAvailableState;
