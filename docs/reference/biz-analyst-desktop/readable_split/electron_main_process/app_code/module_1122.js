// webpack module #1122 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = r(5),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !(
            !a.Master.compare(this.orderNumber, e.orderNumber) ||
            !a.Master.compare(this.orderDate, e.orderDate)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (i.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            (a.orderNumber = i.TallyUtil.getStringValue(t, "basicpurchaseorderno")),
            i.Util.isNotNull(r) &&
            i.Util.isNotNull(r.company) &&
            i.Util.isNotNull(r.company.timezone)
              ? (a.orderDate = i.TallyUtil.parseDate(
                  i.TallyUtil.getStringValue(t, "basicorderdate"),
                  i.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone,
                ))
              : (a.orderDate = i.TallyUtil.parseDate(
                  i.TallyUtil.getStringValue(t, "basicorderdate"),
                  i.DateUtil.FORMAT_YYYYMMDD,
                )),
            a
          );
        }),
        e
      );
    })();
  t.default = o;
};
