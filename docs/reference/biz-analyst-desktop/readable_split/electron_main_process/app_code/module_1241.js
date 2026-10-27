// webpack module #1241 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(5),
    a = r(32),
    o = r(2),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            i.Master.compare(this.name, e.name) &&
            i.Master.compare(this.sortOrder, e.sortOrder) &&
            i.Master.compare(this.amount, e.amount) &&
            i.Master.compare(this.payHeads, e.payHeads)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((o.Util.assign(r, t), o.Util.isNotNull(t.payHeads) && t.payHeads.length > 0)) {
            r.payHeads = [];
            for (var i = 0, s = t.payHeads; i < s.length; i++) {
              var n = s[i];
              r.payHeads.push(a.PayHead.toObject(n));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var i = new e();
          ((i.name = o.TallyUtil.getStringValue(t, "employeename")),
            (i.sortOrder = parseInt(o.TallyUtil.getStringValue(t, "employeesortorder"))),
            (i.amount = -1 * o.TallyUtil.parseAmount(o.TallyUtil.getJsonValue(t, "amount"))));
          for (
            var s = [],
              n = 0,
              u = o.TallyUtil.parseArray(o.TallyUtil.getJsonValue(t, "payheadallocations.list"));
            n < u.length;
            n++
          ) {
            var p = u[n];
            if (null != p) {
              var c = a.PayHead.convert(p, r);
              s.push(c);
            }
          }
          return ((i.payHeads = s), i);
        }),
        e
      );
    })();
  t.default = s;
};
