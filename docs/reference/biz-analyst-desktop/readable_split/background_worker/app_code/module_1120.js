// webpack module #1120 (from background_worker, BA Mobile Connector 8.4.41)
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
            n.Master.compare(this.name, e.name) &&
            n.Master.compare(this.sortOrder, e.sortOrder) &&
            n.Master.compare(this.amount, e.amount)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (a.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var n = new e();
          return (
            (n.name = a.TallyUtil.getStringValue(t, "payheadname")),
            (n.sortOrder = parseInt(a.TallyUtil.getStringValue(t, "payheadsortorder"))),
            (n.amount = -1 * a.TallyUtil.parseAmount(a.TallyUtil.getJsonValue(t, "amount"))),
            n
          );
        }),
        e
      );
    })();
  t.default = i;
};
