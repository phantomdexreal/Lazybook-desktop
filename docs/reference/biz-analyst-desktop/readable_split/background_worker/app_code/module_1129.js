// webpack module #1129 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

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
            a.Master.compare(this.stateName, e.stateName) &&
            a.Master.compare(this.mrpRate, e.mrpRate) &&
            a.Master.compare(this.mrpRateUnit, e.mrpRateUnit)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (n.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            (a.stateName = n.TallyUtil.getStringValue(t, "statename")),
            (a.mrpRate = n.TallyUtil.parseRate(n.TallyUtil.getJsonValue(t, "mrprate"))),
            (a.mrpRateUnit = n.TallyUtil.parseRateUnit(n.TallyUtil.getJsonValue(t, "mrprate"))),
            a
          );
        }),
        e
      );
    })();
  t.default = i;
};
