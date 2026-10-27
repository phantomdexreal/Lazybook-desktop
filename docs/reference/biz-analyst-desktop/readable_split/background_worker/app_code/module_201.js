// webpack module #201 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = (function () {
    function e(e, t) {
      ((this.key = e), (this.data = t));
    }
    return (
      (e.LEDGER_CLOSING_SYNC = "LEDGER_CLOSING__SYNC"),
      (e.USER_DETAIL_FETCH_TIME = "USER_DETAIL_FETCH_TIME"),
      (e.USER_FIRST_COMPANY_SYNC = "USER_FIRST_COMPANY_SYNC"),
      (e.IS_ADMIN_LOGIN_IN_TALLY = "IS_ADMIN_LOGIN_IN_TALLY"),
      (e.WEBSOCKET_START_TIME = "WEBSOCKET_START_TIME"),
      (e.VOUCHER_LR_DATE_MIGRATION = "VOUCHER_LR_DATE_MIGRATION"),
      (e.LEDGER_AUTO_REMINDER_SETTING = "LEDGER_AUTO_REMINDER_SETTING"),
      (e.LEDGER_CLOSING_SETTING = "LEDGER_CLOSING_SETTING"),
      (e.COMPANY_RESYC_CHECK = "COMPANY_RESYNC_CHECK"),
      (e.DATA_ENTRY_SYNC_FROM_WEBSOCKET = "DATA_ENTRY_SYNC_FROM_WEBSOCKET"),
      (e.IS_FIRST_COMPANY_ADDED = "IS_FIRST_COMPANY_ADDED"),
      (e.TALLY_QUERY_RETRY = "tally_query_retry"),
      (e.REMINDER_RETRY_INFO = "REMINDER_RETRY_INFO"),
      (e.EINVOICE_DATE_SYNCED = "EINVOICE_DATE_SYNCED"),
      e
    );
  })();
  t.default = n;
};
