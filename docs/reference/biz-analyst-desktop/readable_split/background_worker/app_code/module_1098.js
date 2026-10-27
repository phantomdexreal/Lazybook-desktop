// webpack module #1098 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

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
            n.Util.isNull(e.envelope.body) ||
            n.Util.isNull(e.envelope.body.data) ||
            n.Util.isNull(e.envelope.body.data.result)
            ? (n.Log.info("Could not retrieve tally product info"), "")
            : n.TallyUtil.getStringValue(e.envelope.body.data.result, "$");
        }),
        e
      );
    })();
  t.default = a;
};
