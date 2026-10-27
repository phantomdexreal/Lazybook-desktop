// webpack module #1097 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = (function () {
      function e() {}
      return (
        (e.prototype.parse = function (e) {
          if (
            n.Util.isNull(e) ||
            n.Util.isNull(e.envelope) ||
            n.Util.isNull(e.envelope.body) ||
            n.Util.isNull(e.envelope.body.data) ||
            n.Util.isNull(e.envelope.body.data.result)
          )
            throw new Error("Could not retrieve tally license");
          return n.TallyUtil.getStringValue(e.envelope.body.data.result, "$");
        }),
        e
      );
    })();
  t.default = a;
};
