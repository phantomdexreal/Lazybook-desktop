// webpack module #536 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = r(5),
    i = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            a.Master.compare(this.orderTerms, e.orderTerms) &&
            a.Master.compare(this.dueDate, e.dueDate) &&
            a.Master.compare(this.orderRef, e.orderRef)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (n.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e(),
            i = n.TallyUtil.parseArray(n.TallyUtil.getJsonValue(t, "basicorderterms.list"));
          if (null != i && i.length > 0) {
            var o = i[0].basicorderterms;
            if (null != o) {
              var s = "";
              if ("[object Array]" === Object.prototype.toString.call(o))
                for (var u = !0, p = 0, c = o; p < c.length; p++) {
                  var l = c[p];
                  n.Util.isNotNull(l) && (!0 === u ? (u = !1) : (s += ", "), (s += l.$));
                }
              else n.Util.isNotNull(o) && (s = o.$);
              "string" == typeof s
                ? (a.orderTerms = s)
                : n.Log.warn("[WARNING]: Order Terms is not string as expected: " + s);
            }
          }
          return (
            (a.dueDate = n.TallyUtil.getStringValue(t, "basicduedateofpymt")),
            (a.orderRef = n.TallyUtil.getStringValue(t, "basicorderref")),
            a
          );
        }),
        e
      );
    })();
  t.default = i;
};
