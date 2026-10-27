// webpack module #625 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(24),
    a = r(13),
    o = r(10),
    s = r(2609),
    n = r(2);
  function u() {
    var e = s.SYNC_DEFAULT_VALUE,
      r = i.default.get(i.default.SYNC_SETTINGS, e),
      a = {
        intervalMins: t.INTERVAL_MINS,
        deletedVouchersDays: t.DELETED_VOUCHERS_DAYS,
        deletedVouchersIntervalHours: t.DELETED_VOUCHERS_INTERVAL_HOURS,
        deletedVoucherIntervalMinutes: t.SYNC_DELETED_VOUCHER_INTERVAL_MINUTES,
        deletedVoucherSyncEnable: !0,
        tallyRetryAttempts: t.TALLY_QUERY_RETRY_ATTEMPTS,
      };
    return (
      o.isNotNull(r) &&
        (o.isNotNull(r.intervalMins) && (a.intervalMins = r.intervalMins),
        o.isNotNull(r.deletedVouchersDays) && (a.deletedVouchersDays = r.deletedVouchersDays),
        o.isNotNull(r.deletedVouchersIntervalHours) &&
          (a.deletedVouchersIntervalHours = r.deletedVouchersIntervalHours),
        o.isNotNull(r.deletedVoucherIntervalMinutes) &&
          (a.deletedVoucherIntervalMinutes = r.deletedVoucherIntervalMinutes),
        o.isNotNull(r.deletedVoucherSyncEnable) &&
          (a.deletedVoucherSyncEnable = r.deletedVoucherSyncEnable),
        o.isNotNull(r.tallyRetryAttempts) && (a.tallyRetryAttempts = r.tallyRetryAttempts)),
      a
    );
  }
  ((t.INTERVAL_MINS = 5),
    (t.DELETED_VOUCHERS_DAYS = 365),
    (t.DELETED_VOUCHERS_INTERVAL_HOURS = 24),
    (t.SYNC_DELETED_VOUCHER_INTERVAL_MINUTES = 60),
    (t.TALLY_QUERY_RETRY_ATTEMPTS = 2),
    (t.saveSyncSettings = function (e, t) {
      void 0 === t && (t = !0);
      var r = u();
      return (
        o.isNotNull(e.intervalMins) && (r.intervalMins = e.intervalMins),
        o.isNotNull(e.deletedVouchersDays) && (r.deletedVouchersDays = e.deletedVouchersDays),
        o.isNotNull(e.deletedVouchersIntervalHours) &&
          (r.deletedVouchersIntervalHours = e.deletedVouchersIntervalHours),
        o.isNotNull(e.deletedVoucherIntervalMinutes) &&
          (r.deletedVoucherIntervalMinutes = e.deletedVoucherIntervalMinutes),
        o.isNotNull(e.deletedVoucherSyncEnable) &&
          (r.deletedVoucherSyncEnable = e.deletedVoucherSyncEnable),
        o.isNotNull(e.tallyRetryAttempts) && (r.tallyRetryAttempts = e.tallyRetryAttempts),
        i.default.set(i.default.SYNC_SETTINGS, r),
        !0 === t && n.Util.restartApp(a.app),
        e
      );
    }),
    (t.getSyncSetting = u));
};
