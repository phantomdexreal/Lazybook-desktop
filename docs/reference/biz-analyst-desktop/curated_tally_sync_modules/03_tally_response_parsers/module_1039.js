// webpack module #1039 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = r(5),
    i = (function () {
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
          return n.Util.assign(r, t), r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            (a.orderNumber = n.TallyUtil.getStringValue(t, "basicpurchaseorderno")),
            n.Util.isNotNull(r) &&
            n.Util.isNotNull(r.company) &&
            n.Util.isNotNull(r.company.timezone)
              ? (a.orderDate = n.TallyUtil.parseDate(
                  n.TallyUtil.getStringValue(t, "basicorderdate"),
                  n.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone
                ))
              : (a.orderDate = n.TallyUtil.parseDate(
                  n.TallyUtil.getStringValue(t, "basicorderdate"),
                  n.DateUtil.FORMAT_YYYYMMDD
                )),
            a
          );
        }),
        e
      );
    })();
  t.default = i;
};
