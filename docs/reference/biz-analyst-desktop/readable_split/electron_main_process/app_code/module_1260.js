// webpack module #1260 (from electron_main_process, BA Mobile Connector 8.4.41)
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
            a.Master.compare(this.stateName, e.stateName) &&
            a.Master.compare(this.mrpRate, e.mrpRate) &&
            a.Master.compare(this.mrpRateUnit, e.mrpRateUnit)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (i.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            (a.stateName = i.TallyUtil.getStringValue(t, "statename")),
            (a.mrpRate = i.TallyUtil.parseRate(i.TallyUtil.getJsonValue(t, "mrprate"))),
            (a.mrpRateUnit = i.TallyUtil.parseRateUnit(i.TallyUtil.getJsonValue(t, "mrprate"))),
            a
          );
        }),
        e
      );
    })();
  t.default = o;
};
