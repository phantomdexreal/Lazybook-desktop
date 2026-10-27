// webpack module #1270 (from electron_main_process, BA Mobile Connector 8.4.41)
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
            i.Master.compare(this.eWayBillApplicable, e.eWayBillApplicable) &&
            i.Master.compare(this.eWayBillApplicableFrom, e.eWayBillApplicableFrom) &&
            i.Master.compare(this.eWayBillApplicableType, e.eWayBillApplicableType) &&
            i.Master.compare(this.eWayBillApplicableAmount, e.eWayBillApplicableAmount) &&
            i.Master.compare(this.eWayBillApplicableForIntra, e.eWayBillApplicableForIntra) &&
            i.Master.compare(this.eWayBillApplicableAmountIntra, e.eWayBillApplicableAmountIntra)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (a.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r, i, o) {
          var s = new e();
          return (
            (s.eWayBillApplicable = a.TallyUtil.getBoolean(t.isewaybillapplicable, "$")),
            a.Util.isNotNull(r) && a.Util.isNotNull(r.timezone)
              ? (s.eWayBillApplicableFrom = a.TallyUtil.parseDate(
                  a.TallyUtil.getJsonValue(t.ewaybillapplicabledate, "$"),
                  a.DateUtil.FORMAT_YYYYMMDD,
                  r.timezone,
                ))
              : (s.eWayBillApplicableFrom = a.TallyUtil.parseDate(
                  a.TallyUtil.getJsonValue(t.ewaybillapplicabledate, "$"),
                  a.DateUtil.FORMAT_YYYYMMDD,
                )),
            (s.eWayBillApplicableType = a.TallyUtil.getStringValue(t.ewaybillapplicabletype, "$")),
            (s.eWayBillApplicableAmount = a.TallyUtil.getFloatValue(
              t.ewaybillapplicableamount,
              "$",
            )),
            (s.eWayBillApplicableForIntra = a.TallyUtil.getBoolean(
              t.isewaybillapplicableforintra,
              "$",
            )),
            (s.eWayBillApplicableAmountIntra = a.TallyUtil.getFloatValue(
              t.ewaybillapplicableamountintra,
              "$",
            )),
            s
          );
        }),
        e
      );
    })();
  t.default = o;
};
