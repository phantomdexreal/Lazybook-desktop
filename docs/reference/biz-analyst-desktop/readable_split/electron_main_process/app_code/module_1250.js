// webpack module #1250 (from electron_main_process, BA Mobile Connector 8.4.41)
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
            i.Master.compare(this.name, e.name) &&
            i.Master.compare(this.sortOrder, e.sortOrder) &&
            i.Master.compare(this.amount, e.amount)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (a.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var i = new e();
          return (
            (i.name = a.TallyUtil.getStringValue(t, "payheadname")),
            (i.sortOrder = parseInt(a.TallyUtil.getStringValue(t, "payheadsortorder"))),
            (i.amount = -1 * a.TallyUtil.parseAmount(a.TallyUtil.getJsonValue(t, "amount"))),
            i
          );
        }),
        e
      );
    })();
  t.default = o;
};
