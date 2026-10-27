// webpack module #567 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(566),
    a = r(24),
    i = r(200);
  ((t.CLOSE_APP = "close_bizanalyst_app"),
    (t.closeApp = a.createAliasedAction(t.CLOSE_APP, function () {
      return { type: t.CLOSE_APP, payload: n.APP_STATE_CLOSE };
    })),
    (t.MINIMIZE_APP = "minimize_bizanalyst_app"),
    (t.minimizeApp = a.createAliasedAction(t.MINIMIZE_APP, function () {
      return { type: t.MINIMIZE_APP, payload: n.APP_STATE_MINIMIZE };
    })),
    (t.OPEN_APP = "open_bizanalyst_app"),
    (t.openApp = a.createAliasedAction(t.OPEN_APP, function () {
      return { type: t.OPEN_APP, payload: n.APP_STATE_OPEN };
    })),
    (t.RESTORE_APP = "restore_bizanalyst_app"),
    (t.restoreApp = a.createAliasedAction(t.RESTORE_APP, function () {
      return { type: t.RESTORE_APP, payload: n.APP_STATE_RUNNING };
    })),
    (t.SET_FIRST_SYNC_COMPLETE = "set_first_sync_complete"),
    (t.setFirstSyncComplete = a.createAliasedAction(t.SET_FIRST_SYNC_COMPLETE, function (e) {
      return { type: t.SET_FIRST_SYNC_COMPLETE, payload: i.setFirstSyncVal(e) };
    })),
    (t.CLEAR_FIRST_SYNC_COMPLETE = "clear_first_sync_complete"),
    (t.cleanFirstSyncComplete = a.createAliasedAction(t.CLEAR_FIRST_SYNC_COMPLETE, function () {
      return { type: t.CLEAR_FIRST_SYNC_COMPLETE, payload: !1 };
    })),
    (t.RESTART_APP = "restart_app"),
    (t.restartApp = a.createAliasedAction(t.RESTART_APP, function (e) {
      return { type: t.RESTART_APP, payload: e };
    })));
};
