// webpack module #1139 (from background_worker, BA Mobile Connector 8.4.41)
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
            n.Master.compare(this.eWayBillApplicable, e.eWayBillApplicable) &&
            n.Master.compare(this.eWayBillApplicableFrom, e.eWayBillApplicableFrom) &&
            n.Master.compare(this.eWayBillApplicableType, e.eWayBillApplicableType) &&
            n.Master.compare(this.eWayBillApplicableAmount, e.eWayBillApplicableAmount) &&
            n.Master.compare(this.eWayBillApplicableForIntra, e.eWayBillApplicableForIntra) &&
            n.Master.compare(this.eWayBillApplicableAmountIntra, e.eWayBillApplicableAmountIntra)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (a.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r, n, i) {
          var o = new e();
          return (
            (o.eWayBillApplicable = a.TallyUtil.getBoolean(t.isewaybillapplicable, "$")),
            a.Util.isNotNull(r) && a.Util.isNotNull(r.timezone)
              ? (o.eWayBillApplicableFrom = a.TallyUtil.parseDate(
                  a.TallyUtil.getJsonValue(t.ewaybillapplicabledate, "$"),
                  a.DateUtil.FORMAT_YYYYMMDD,
                  r.timezone,
                ))
              : (o.eWayBillApplicableFrom = a.TallyUtil.parseDate(
                  a.TallyUtil.getJsonValue(t.ewaybillapplicabledate, "$"),
                  a.DateUtil.FORMAT_YYYYMMDD,
                )),
            (o.eWayBillApplicableType = a.TallyUtil.getStringValue(t.ewaybillapplicabletype, "$")),
            (o.eWayBillApplicableAmount = a.TallyUtil.getFloatValue(
              t.ewaybillapplicableamount,
              "$",
            )),
            (o.eWayBillApplicableForIntra = a.TallyUtil.getBoolean(
              t.isewaybillapplicableforintra,
              "$",
            )),
            (o.eWayBillApplicableAmountIntra = a.TallyUtil.getFloatValue(
              t.ewaybillapplicableamountintra,
              "$",
            )),
            o
          );
        }),
        e
      );
    })();
  t.default = i;
};
