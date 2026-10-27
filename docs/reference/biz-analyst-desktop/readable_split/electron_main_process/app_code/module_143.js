// webpack module #143 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = (function () {
    function e() {}
    return ((e.KEY = "syncSettings"), e);
  })();
  ((t.default = i),
    (t.SYNC_INTERVAL_MINS = 5),
    (t.SYNC_DELETED_VOUCHERS_INTERVAL_HOURS = 24),
    (t.SYNC_DELETED_VOUCHERS_DAYS = 300),
    (t.SYNC_DELETED_VOUCHER_INTERVAL_MINUTES = 60),
    (t.TALLY_QUERY_RETRY_ATTEMPTS = 2),
    (t.SYNC_DEFAULT_VALUE = {
      intervalMins: t.SYNC_INTERVAL_MINS,
      deletedVouchersIntervalHours: t.SYNC_DELETED_VOUCHERS_INTERVAL_HOURS,
      deletedVouchersDays: t.SYNC_DELETED_VOUCHERS_DAYS,
      deletedVoucherIntervalMinutes: t.SYNC_DELETED_VOUCHER_INTERVAL_MINUTES,
      deletedVoucherSyncEnable: !0,
      tallyRetryAttempts: t.TALLY_QUERY_RETRY_ATTEMPTS,
    }));
};
