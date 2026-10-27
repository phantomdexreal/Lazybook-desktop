// webpack module #1254 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = r(5),
    o = (function () {
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
          return (i.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            i.Util.isNotNull(r) &&
            i.Util.isNotNull(r.company) &&
            i.Util.isNotNull(r.company.timezone)
              ? (a.date = i.TallyUtil.parseDate(
                  i.TallyUtil.getStringValue(t, "date"),
                  i.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone,
                ))
              : (a.date = i.TallyUtil.parseDate(
                  i.TallyUtil.getStringValue(t, "date"),
                  i.DateUtil.FORMAT_YYYYMMDD,
                )),
            (a.rate = i.TallyUtil.parseRate(i.TallyUtil.getStringValue(t, "rate"))),
            (a.rateUnit = i.TallyUtil.parseRateUnit(i.TallyUtil.getJsonValue(t, "rate"))),
            a
          );
        }),
        e
      );
    })();
  t.default = o;
};
