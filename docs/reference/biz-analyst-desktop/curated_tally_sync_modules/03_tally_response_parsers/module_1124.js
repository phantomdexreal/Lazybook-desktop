// webpack module #1124 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = r(5),
    i = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            a.Master.compare(this.date, e.date) &&
            a.Master.compare(this.rate, e.rate) &&
            a.Master.compare(this.rateUnit, e.rateUnit)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return n.Util.assign(r, t), r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            n.Util.isNotNull(r) &&
            n.Util.isNotNull(r.company) &&
            n.Util.isNotNull(r.company.timezone)
              ? (a.date = n.TallyUtil.parseDate(
                  n.TallyUtil.getStringValue(t, "date"),
                  n.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone
                ))
              : (a.date = n.TallyUtil.parseDate(
                  n.TallyUtil.getStringValue(t, "date"),
                  n.DateUtil.FORMAT_YYYYMMDD
                )),
            (a.rate = n.TallyUtil.parseRate(n.TallyUtil.getStringValue(t, "rate"))),
            (a.rateUnit = n.TallyUtil.parseRateUnit(n.TallyUtil.getJsonValue(t, "rate"))),
            a
          );
        }),
        e
      );
    })();
  t.default = i;
};
