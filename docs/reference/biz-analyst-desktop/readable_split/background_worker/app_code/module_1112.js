// webpack module #1112 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(5),
    a = r(28),
    i = r(0),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            n.Master.compare(this.name, e.name) &&
            n.Master.compare(this.sortOrder, e.sortOrder) &&
            n.Master.compare(this.amount, e.amount) &&
            n.Master.compare(this.payHeads, e.payHeads)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((i.Util.assign(r, t), i.Util.isNotNull(t.payHeads) && t.payHeads.length > 0)) {
            r.payHeads = [];
            for (var n = 0, o = t.payHeads; n < o.length; n++) {
              var s = o[n];
              r.payHeads.push(a.PayHead.toObject(s));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var n = new e();
          ((n.name = i.TallyUtil.getStringValue(t, "employeename")),
            (n.sortOrder = parseInt(i.TallyUtil.getStringValue(t, "employeesortorder"))),
            (n.amount = -1 * i.TallyUtil.parseAmount(i.TallyUtil.getJsonValue(t, "amount"))));
          for (
            var o = [],
              s = 0,
              u = i.TallyUtil.parseArray(i.TallyUtil.getJsonValue(t, "payheadallocations.list"));
            s < u.length;
            s++
          ) {
            var p = u[s];
            if (null != p) {
              var c = a.PayHead.convert(p, r);
              o.push(c);
            }
          }
          return ((n.payHeads = o), n);
        }),
        e
      );
    })();
  t.default = o;
};
