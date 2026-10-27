// webpack module #1221 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = (function () {
      function e() {}
      return (
        (e.prototype.parse = function (e) {
          return i.Util.isNull(e) ||
            i.Util.isNull(e.envelope) ||
            i.Util.isNull(e.envelope.gstregnumber)
            ? ""
            : i.TallyUtil.getStringValue(e.envelope.gstregnumber, "$");
        }),
        e
      );
    })();
  t.default = a;
};
