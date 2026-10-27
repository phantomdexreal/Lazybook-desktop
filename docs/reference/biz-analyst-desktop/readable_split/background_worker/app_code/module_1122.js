// webpack module #1122 (from background_worker, BA Mobile Connector 8.4.41)
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
            a.Master.compare(this.endingAt, e.endingAt) &&
            a.Master.compare(this.startingFrom, e.startingFrom) &&
            a.Master.compare(this.rate, e.rate) &&
            a.Master.compare(this.discount, e.discount) &&
            a.Master.compare(this.rateUnit, e.rateUnit)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (n.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            (a.endingAt = n.TallyUtil.parseQuantity(n.TallyUtil.getJsonValue(t, "endingat"))),
            (a.startingFrom = n.TallyUtil.parseQuantity(
              n.TallyUtil.getJsonValue(t, "startingfrom"),
            )),
            (a.rate = n.TallyUtil.parseRate(n.TallyUtil.getJsonValue(t, "rate"))),
            (a.discount = n.TallyUtil.parseNumber(n.TallyUtil.getJsonValue(t, "discount"))),
            (a.rateUnit = n.TallyUtil.parseRateUnit(n.TallyUtil.getJsonValue(t, "rate"))),
            a
          );
        }),
        e
      );
    })();
  t.default = i;
};
