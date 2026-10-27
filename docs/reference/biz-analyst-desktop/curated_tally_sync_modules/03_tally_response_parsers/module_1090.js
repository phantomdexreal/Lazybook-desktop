// webpack module #1090 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = (function () {
      function e() {}
      return (
        (e.prototype.parseCompanyNames = function (e) {
          if (n.Util.isNotNull(e) && n.Util.isNotNull(e.envelope)) {
            var t = [];
            if (n.Util.isNotNull(e.envelope["companyname.list"]))
              for (
                var r = 0, a = n.TallyUtil.parseArray(e.envelope["companyname.list"].companyname);
                r < a.length;
                r++
              ) {
                var i = a[r];
                if (n.Util.isNotNull(i)) {
                  var o = n.TallyUtil.getStringValue(i, "$");
                  n.Util.isNotNull(o) && t.push(o);
                }
              }
            return Promise.resolve(t);
          }
          return Promise.reject(
            new Error("Couldnt parse the response for get companies: " + JSON.stringify(e))
          );
        }),
        e
      );
    })();
  t.default = a;
};
