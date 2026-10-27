// webpack module #1226 (from electron_main_process, BA Mobile Connector 8.4.41)
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
            i.Util.isNull(e.envelope.body) ||
            i.Util.isNull(e.envelope.body.data) ||
            i.Util.isNull(e.envelope.body.data.result)
            ? (i.Log.info("Could not retrieve tally product info"), "")
            : i.TallyUtil.getStringValue(e.envelope.body.data.result, "$");
        }),
        e
      );
    })();
  t.default = a;
};
