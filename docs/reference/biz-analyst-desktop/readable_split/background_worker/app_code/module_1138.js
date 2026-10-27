// webpack module #1138 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(5),
    a = r(0),
    i = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            n.Master.compare(this.eInvoiceApplicable, e.eInvoiceApplicable) &&
            n.Master.compare(this.eInvoiceApplicableFrom, e.eInvoiceApplicableFrom) &&
            n.Master.compare(this.eInvoiceBillPlace, e.eInvoiceBillPlace) &&
            n.Master.compare(this.eInvoiceDefaultPeriod, e.eInvoiceDefaultPeriod) &&
            n.Master.compare(this.dateOfSync, e.dateOfSync) &&
            n.Master.compare(this.sendEWayBillWithEInvoice, e.sendEWayBillWithEInvoice)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (a.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r, n, i) {
          var o = new e();
          return (
            (o.eInvoiceApplicable = a.TallyUtil.getBoolean(t.einvappl, "$")),
            a.Util.isNotNull(r) && a.Util.isNotNull(r.timezone)
              ? (o.eInvoiceApplicableFrom = a.TallyUtil.parseDate(
                  a.TallyUtil.getJsonValue(t.einvapplfrom, "$"),
                  a.DateUtil.FORMAT_YYYYMMDD,
                  r.timezone,
                ))
              : (o.eInvoiceApplicableFrom = a.TallyUtil.parseDate(
                  a.TallyUtil.getJsonValue(t.einvapplfrom, "$"),
                  a.DateUtil.FORMAT_YYYYMMDD,
                )),
            (o.eInvoiceBillPlace = a.TallyUtil.getStringValue(t.gsteinvbillfromplace, "$")),
            (o.eInvoiceDefaultPeriod = a.TallyUtil.getIntValue(t.gsteinvreportperiod, "$")),
            (o.sendEWayBillWithEInvoice = a.TallyUtil.getBoolean(t.isgsteinvinclewaybill, "$")),
            n
              ? a.Util.isNotNull(r.syncFrom)
                ? (o.dateOfSync = r.syncFrom)
                : a.Util.isNotNull(r.startingFrom)
                  ? (o.dateOfSync = r.startingFrom)
                  : (o.dateOfSync = r.booksFrom)
              : (o.dateOfSync = i),
            o
          );
        }),
        e
      );
    })();
  t.default = i;
};
