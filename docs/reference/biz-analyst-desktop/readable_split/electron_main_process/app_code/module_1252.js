// webpack module #1252 (from electron_main_process, BA Mobile Connector 8.4.41)
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
            a.Master.compare(this.endingAt, e.endingAt) &&
            a.Master.compare(this.startingFrom, e.startingFrom) &&
            a.Master.compare(this.rate, e.rate) &&
            a.Master.compare(this.discount, e.discount) &&
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
            (a.endingAt = i.TallyUtil.parseQuantity(i.TallyUtil.getJsonValue(t, "endingat"))),
            (a.startingFrom = i.TallyUtil.parseQuantity(
              i.TallyUtil.getJsonValue(t, "startingfrom"),
            )),
            (a.rate = i.TallyUtil.parseRate(i.TallyUtil.getJsonValue(t, "rate"))),
            (a.discount = i.TallyUtil.parseNumber(i.TallyUtil.getJsonValue(t, "discount"))),
            (a.rateUnit = i.TallyUtil.parseRateUnit(i.TallyUtil.getJsonValue(t, "rate"))),
            a
          );
        }),
        e
      );
    })();
  t.default = o;
};
