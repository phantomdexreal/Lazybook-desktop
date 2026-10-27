// webpack module #1218 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = (function () {
      function e() {}
      return (
        (e.prototype.parseCompanyNames = function (e) {
          if (i.Util.isNotNull(e) && i.Util.isNotNull(e.envelope)) {
            var t = [];
            if (i.Util.isNotNull(e.envelope["companyname.list"]))
              for (
                var r = 0, a = i.TallyUtil.parseArray(e.envelope["companyname.list"].companyname);
                r < a.length;
                r++
              ) {
                var o = a[r];
                if (i.Util.isNotNull(o)) {
                  var s = i.TallyUtil.getStringValue(o, "$");
                  i.Util.isNotNull(s) && t.push(s);
                }
              }
            return Promise.resolve(t);
          }
          return Promise.reject(
            new Error("Couldnt parse the response for get companies: " + JSON.stringify(e)),
          );
        }),
        e
      );
    })();
  t.default = a;
};
