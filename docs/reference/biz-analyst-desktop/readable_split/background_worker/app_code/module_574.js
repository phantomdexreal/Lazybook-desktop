// webpack module #574 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(26),
    a = r(15),
    i = r(11),
    o = r(1616),
    s = r(0);
  function u() {
    var e = o.SYNC_DEFAULT_VALUE,
      r = n.default.get(n.default.SYNC_SETTINGS, e),
      a = {
        intervalMins: t.INTERVAL_MINS,
        deletedVouchersDays: t.DELETED_VOUCHERS_DAYS,
        deletedVouchersIntervalHours: t.DELETED_VOUCHERS_INTERVAL_HOURS,
        deletedVoucherIntervalMinutes: t.SYNC_DELETED_VOUCHER_INTERVAL_MINUTES,
        deletedVoucherSyncEnable: !0,
        tallyRetryAttempts: t.TALLY_QUERY_RETRY_ATTEMPTS,
      };
    return (
      i.isNotNull(r) &&
        (i.isNotNull(r.intervalMins) && (a.intervalMins = r.intervalMins),
        i.isNotNull(r.deletedVouchersDays) && (a.deletedVouchersDays = r.deletedVouchersDays),
        i.isNotNull(r.deletedVouchersIntervalHours) &&
          (a.deletedVouchersIntervalHours = r.deletedVouchersIntervalHours),
        i.isNotNull(r.deletedVoucherIntervalMinutes) &&
          (a.deletedVoucherIntervalMinutes = r.deletedVoucherIntervalMinutes),
        i.isNotNull(r.deletedVoucherSyncEnable) &&
          (a.deletedVoucherSyncEnable = r.deletedVoucherSyncEnable),
        i.isNotNull(r.tallyRetryAttempts) && (a.tallyRetryAttempts = r.tallyRetryAttempts)),
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
        i.isNotNull(e.intervalMins) && (r.intervalMins = e.intervalMins),
        i.isNotNull(e.deletedVouchersDays) && (r.deletedVouchersDays = e.deletedVouchersDays),
        i.isNotNull(e.deletedVouchersIntervalHours) &&
          (r.deletedVouchersIntervalHours = e.deletedVouchersIntervalHours),
        i.isNotNull(e.deletedVoucherIntervalMinutes) &&
          (r.deletedVoucherIntervalMinutes = e.deletedVoucherIntervalMinutes),
        i.isNotNull(e.deletedVoucherSyncEnable) &&
          (r.deletedVoucherSyncEnable = e.deletedVoucherSyncEnable),
        i.isNotNull(e.tallyRetryAttempts) && (r.tallyRetryAttempts = e.tallyRetryAttempts),
        n.default.set(n.default.SYNC_SETTINGS, r),
        !0 === t && s.Util.restartApp(a.app),
        e
      );
    }),
    (t.getSyncSetting = u));
};
