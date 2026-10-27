// webpack module #1269 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(5),
    a = r(2),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            i.Master.compare(this.eInvoiceApplicable, e.eInvoiceApplicable) &&
            i.Master.compare(this.eInvoiceApplicableFrom, e.eInvoiceApplicableFrom) &&
            i.Master.compare(this.eInvoiceBillPlace, e.eInvoiceBillPlace) &&
            i.Master.compare(this.eInvoiceDefaultPeriod, e.eInvoiceDefaultPeriod) &&
            i.Master.compare(this.dateOfSync, e.dateOfSync) &&
            i.Master.compare(this.sendEWayBillWithEInvoice, e.sendEWayBillWithEInvoice)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (a.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r, i, o) {
          var s = new e();
          return (
            (s.eInvoiceApplicable = a.TallyUtil.getBoolean(t.einvappl, "$")),
            a.Util.isNotNull(r) && a.Util.isNotNull(r.timezone)
              ? (s.eInvoiceApplicableFrom = a.TallyUtil.parseDate(
                  a.TallyUtil.getJsonValue(t.einvapplfrom, "$"),
                  a.DateUtil.FORMAT_YYYYMMDD,
                  r.timezone,
                ))
              : (s.eInvoiceApplicableFrom = a.TallyUtil.parseDate(
                  a.TallyUtil.getJsonValue(t.einvapplfrom, "$"),
                  a.DateUtil.FORMAT_YYYYMMDD,
                )),
            (s.eInvoiceBillPlace = a.TallyUtil.getStringValue(t.gsteinvbillfromplace, "$")),
            (s.eInvoiceDefaultPeriod = a.TallyUtil.getIntValue(t.gsteinvreportperiod, "$")),
            (s.sendEWayBillWithEInvoice = a.TallyUtil.getBoolean(t.isgsteinvinclewaybill, "$")),
            i
              ? a.Util.isNotNull(r.syncFrom)
                ? (s.dateOfSync = r.syncFrom)
                : a.Util.isNotNull(r.startingFrom)
                  ? (s.dateOfSync = r.startingFrom)
                  : (s.dateOfSync = r.booksFrom)
              : (s.dateOfSync = o),
            s
          );
        }),
        e
      );
    })();
  t.default = o;
};
