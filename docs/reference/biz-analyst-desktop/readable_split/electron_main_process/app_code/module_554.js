// webpack module #554 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(32),
    a = r(5),
    o = r(2),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !(
            !a.Master.compare(this.name, e.name) || !a.Master.compare(this.employees, e.employees)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((o.Util.assign(r, t), o.Util.isNotNull(t.employees) && t.employees.length > 0)) {
            r.employees = [];
            for (var a = 0, s = t.employees; a < s.length; a++) {
              var n = s[a];
              r.employees.push(i.Employee.toObject(n));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          a.name = o.TallyUtil.getStringValue(t, "category");
          for (
            var s = [],
              n = 0,
              u = o.TallyUtil.parseArray(o.TallyUtil.getJsonValue(t, "employeeentries.list"));
            n < u.length;
            n++
          ) {
            if (null != (d = u[n])) {
              var p = i.Employee.convert(d, r);
              s.push(p);
            }
          }
          if (!1 === o.Util.isFilledArray(s)) {
            var c = o.TallyUtil.parseArray(
              o.TallyUtil.getJsonValue(t, "costcentreallocations.list"),
            );
            if (o.Util.isFilledArray(c))
              for (var m = 0, l = c; m < l.length; m++) {
                var d;
                if (null != (d = l[m]))
                  (((p = new i.Employee()).name = o.TallyUtil.getStringValue(d, "name")),
                    (p.amount =
                      -1 * o.TallyUtil.parseAmount(o.TallyUtil.getJsonValue(d, "amount"))),
                    s.push(p));
              }
          }
          return ((a.employees = s), a);
        }),
        e
      );
    })();
  t.default = s;
};
