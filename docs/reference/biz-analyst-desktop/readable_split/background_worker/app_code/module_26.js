// webpack module #26 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n,
    a = r(15),
    i = r(11),
    o = r(0);
  n = a.app ? r(603) : a.remote.require("electron-settings");
  var s = (function () {
    function e() {}
    return (
      (e.get = function (t, r) {
        var a,
          s = e.SettingCacheMap.get(t);
        return o.Util.isNotNull(s)
          ? s
          : ((a = i.isNotNull(r) ? n.get(t, r) : n.get(t)),
            e.SettingCacheMap.set(t, a),
            e.SettingCacheMap.get(t));
      }),
      (e.set = function (t, r) {
        (n.set(t, r), e.SettingCacheMap.set(t, r));
      }),
      (e.delete = function (t) {
        (n.delete(t), e.SettingCacheMap.delete(t));
      }),
      (e.has = function (e) {
        return n.has(e);
      }),
      (e.getAll = function () {
        return n.getAll();
      }),
      (e.deleteAll = function () {
        n.deleteAll();
      }),
      (e.setAll = function (e) {
        n.setAll(e);
      }),
      (e.APP_STATE = "appState"),
      (e.TALLY_SETTINGS = "tallySettings"),
      (e.SYNC_SETTINGS = "syncSettings"),
      (e.TUTORIAL_SHOWN_FIRST_RUN = "tutorialShownFirstRun"),
      (e.USER = "user"),
      (e.IS_FIRST_RUN = "isFirstRun"),
      (e.COMPANIES_LAST_SYNC = "companiesLastSyncTime"),
      (e.APP_VER = "appVer"),
      (e.IS_FIRST_SYNC = "isFirstSync"),
      (e.APP_VERSION = "appVersion"),
      (e.APP_SETTINGS = "appSettings"),
      (e.CHUNK_SETTINGS = "chunkSettings"),
      (e.MASTER_CHUNK_SIZE_SETTINGS = "masterChunkSizeSettings"),
      (e.NOTIFICATION_SETTINGS = "notificationSettings"),
      (e.DEVICE = "device"),
      (e.SUBSCRIPTION = "subscription"),
      (e.IS_ADDITIONAL_SETTINGS_SAVED = "isAdditionalSettingsSaved"),
      (e.TALLY_VERSION_INFO = "tallyVersionInfo"),
      (e.TALLY_VERSION_INFO_TIME = "tallyVersionInfoTime"),
      (e.dataVersion = 3),
      (e.RESYNC_DATA = "resyncdata" + e.dataVersion),
      (e.RESYNC_COMPACT_DATA_BUG = "resync_compact_data_bug"),
      (e.DEBUG_BIZANALYST = "debug_bizanalyst"),
      (e.SYNC_COMPLETE_MASTER = "sync_complete_master"),
      (e.PROXY_SETTINGS = "proxySetting"),
      (e.DELETED_VOUCHER_NEW_TYPE = "is_Deleted_voucher_new_type"),
      (e.SettingCacheMap = new Map()),
      e
    );
  })();
  t.default = s;
};
