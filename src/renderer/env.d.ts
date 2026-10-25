import type { LbApi } from '../shared/ipc';

declare global {
  interface Window {
    lb: LbApi;
  }
}
