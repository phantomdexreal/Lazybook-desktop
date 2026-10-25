# HOST_BRIDGE — `window.LazyHost` (same contract for Electron and Capacitor; web gets a no-op fallback)

The PWA must run unmodified in a browser, in Electron (`file://`/custom protocol) and in Capacitor. Anything platform-specific goes through this object.
Detect with `const host = window.LazyHost ?? webFallback;` and always check `host.capabilities` before use. Every method returns a Promise and never throws for "unsupported" (resolves `{ok:false, reason:'unsupported'}`).

```ts
interface LazyHost {
  platform: 'web'|'electron'|'android';
  capabilities: { sqlite:boolean, share:boolean, saveFile:boolean, scanBarcode:boolean, location:boolean, contacts:boolean,
                  biometric:boolean, pushToken:boolean, localNotifications:boolean, openData:boolean, update:boolean, passphraseHandoff:boolean };
  appInfo(): Promise<{ nativeVersion:string, pwaVersion:string, contract:number }>;
  shareFile(opts:{ name:string, mime:string, dataBase64:string, text?:string }): Promise<Result>;
  saveFile(opts:{ name:string, mime:string, dataBase64:string }): Promise<Result>;
  openUrl(url:string): Promise<Result>;                        // wa.me / sms: / mailto: / external links
  scanBarcode(): Promise<{ ok:true, value:string, format:string } | Result>;
  getLocation(opts?:{ highAccuracy?:boolean }): Promise<{ ok:true, lat:number, lng:number, accuracy:number } | Result>;
  pickContact(): Promise<{ ok:true, name:string, phones:string[], emails:string[] } | Result>;
  biometricAuth(reason:string): Promise<Result>;
  getPushToken(): Promise<{ ok:true, token:string } | Result>;
  scheduleNotification(n:{ id:string, title:string, body:string, at:number /*epoch ms*/, data?:object }): Promise<Result>;
  cancelNotification(id:string): Promise<Result>;
  sqlite?: {                                                  // present only on hosts with native SQLite (Android)
    open(o:{ name:string, version:number, encrypted:boolean }): Promise<{ ok:true, userVersion:number } | Result>;
    close(name:string): Promise<Result>;
    execute(o:{ name:string, sql:string, params?:any[] }): Promise<{ ok:true, changes:number, lastId?:number } | Result>;
    executeBatch(o:{ name:string, statements:{ sql:string, params?:any[] }[], transaction:boolean }): Promise<{ ok:true, changes:number } | Result>;  // <= 1000 statements
    query(o:{ name:string, sql:string, params?:any[] }): Promise<{ ok:true, rows:object[] } | Result>;
    getUserVersion(name:string): Promise<{ ok:true, version:number } | Result>;
    setUserVersion(o:{ name:string, version:number }): Promise<Result>;
    deleteDatabase(name:string): Promise<Result>;
    getInfo(name:string): Promise<{ ok:true, sizeBytes:number, pageCount:number, walMode:boolean, encrypted:boolean } | Result>;
  };
  checkForUpdate(): Promise<Result>;                           // native updater (APK / Electron)
  desktop?: { openDataFolder(): Promise<Result>, getPassphraseHandoff(): Promise<{ ok:true, passphrase:string }|Result> };
}
type Result = { ok:true } | { ok:false, reason:string };
```
SQLite rules: parameters only (never concatenated SQL); the host runs one connection with a serialised queue; the PWA's `lib/store/sqliteAdapter.js` is the only caller; failure codes `SQLITE_BUSY|SQLITE_CORRUPT|SQLITE_FULL|KEY_UNAVAILABLE|UNKNOWN`.
Rules: the bridge is the ONLY native surface; no other globals. Electron preload exposes it with `contextBridge`; Capacitor implements it in `native/hostBridge.ts`. Add methods only via `SHARED_CHANGELOG.md`.
