// webpack module #1093 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = (function () {
      function e() {}
      return (
        (e.prototype.parse = function (e) {
          return n.Util.isNull(e) ||
            n.Util.isNull(e.envelope) ||
            n.Util.isNull(e.envelope.gstregnumber)
            ? ""
            : n.TallyUtil.getStringValue(e.envelope.gstregnumber, "$");
        }),
        e
      );
    })();
  t.default = a;
};
