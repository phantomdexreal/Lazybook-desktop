// webpack module #1262 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i,
    a = (function () {
      function e() {
        ((this.tallyUpdatedAt = -1),
          (this.serverUpdatedAt = -1),
          (this.uptoDate = !1),
          (this.firstSync = !1),
          (this.syncType = e.SYNC_ALTERID),
          (this.lastCompleteSyncAt = -1),
          (this.lastDeleteSyncAt = -1),
          (this.lastDeletedAlterId = -1));
      }
      return (
        (e.prototype.getName = function () {
          return "SyncMetadata";
        }),
        (e.SYNC_LEGACY = 0),
        (e.SYNC_ALTERID = 1),
        e
      );
    })();
  ((t.default = a),
    (function (e) {
      ((e[(e.LEGACY = a.SYNC_LEGACY)] = "LEGACY"), (e[(e.ALTERID = a.SYNC_ALTERID)] = "ALTERID"));
    })(i || (i = {})));
};
