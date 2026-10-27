// webpack module #591 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = r(5),
    o = (function () {
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
          return (i.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e(),
            o = i.TallyUtil.parseArray(i.TallyUtil.getJsonValue(t, "basicorderterms.list"));
          if (null != o && o.length > 0) {
            var s = o[0].basicorderterms;
            if (null != s) {
              var n = "";
              if ("[object Array]" === Object.prototype.toString.call(s))
                for (var u = !0, p = 0, c = s; p < c.length; p++) {
                  var m = c[p];
                  i.Util.isNotNull(m) && (!0 === u ? (u = !1) : (n += ", "), (n += m.$));
                }
              else i.Util.isNotNull(s) && (n = s.$);
              "string" == typeof n
                ? (a.orderTerms = n)
                : i.Log.warn("[WARNING]: Order Terms is not string as expected: " + n);
            }
          }
          return (
            (a.dueDate = i.TallyUtil.getStringValue(t, "basicduedateofpymt")),
            (a.orderRef = i.TallyUtil.getStringValue(t, "basicorderref")),
            a
          );
        }),
        e
      );
    })();
  t.default = o;
};
