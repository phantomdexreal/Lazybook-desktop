// webpack module #515 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(28),
    a = r(5),
    i = r(0),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !(
            !a.Master.compare(this.name, e.name) || !a.Master.compare(this.employees, e.employees)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((i.Util.assign(r, t), i.Util.isNotNull(t.employees) && t.employees.length > 0)) {
            r.employees = [];
            for (var a = 0, o = t.employees; a < o.length; a++) {
              var s = o[a];
              r.employees.push(n.Employee.toObject(s));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          a.name = i.TallyUtil.getStringValue(t, "category");
          for (
            var o = [],
              s = 0,
              u = i.TallyUtil.parseArray(i.TallyUtil.getJsonValue(t, "employeeentries.list"));
            s < u.length;
            s++
          ) {
            if (null != (d = u[s])) {
              var p = n.Employee.convert(d, r);
              o.push(p);
            }
          }
          if (!1 === i.Util.isFilledArray(o)) {
            var c = i.TallyUtil.parseArray(
              i.TallyUtil.getJsonValue(t, "costcentreallocations.list")
            );
            if (i.Util.isFilledArray(c))
              for (var l = 0, m = c; l < m.length; l++) {
                var d;
                if (null != (d = m[l]))
                  ((p = new n.Employee()).name = i.TallyUtil.getStringValue(d, "name")),
                    (p.amount =
                      -1 * i.TallyUtil.parseAmount(i.TallyUtil.getJsonValue(d, "amount"))),
                    o.push(p);
              }
          }
          return (a.employees = o), a;
        }),
        e
      );
    })();
  t.default = o;
};
