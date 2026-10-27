// webpack module #1067 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = (function () {
      function e() {}
      return (
        (e.prototype.parse = function (e) {
          var t = { created: !1, lineerror: null, tallyMasterId: null, error: null };
          if (n.Util.isNotNull(e) && n.Util.isNotNull(e.response)) {
            var r = e.response,
              a = n.TallyUtil.getStringValue(r.lineerror, "$"),
              i = "0" !== n.TallyUtil.getStringValue(r.errors, "$");
            return (
              n.Util.isNotNull(a)
                ? (t.lineerror = a)
                : !0 === i
                ? (t.lineerror = "Error while creating journal entry")
                : (t.tallyMasterId = n.TallyUtil.getStringValue(r.lastvchid, "$")),
              "1" === n.TallyUtil.getStringValue(r.created, "$") && (t.created = !0),
              {
                tallyErrorMessage: t.lineerror,
                tallyInsertSuccess: t.created,
                tallyUpdatedAt: n.DateUtil.now(),
                tallyMasterId: t.tallyMasterId,
              }
            );
          }
          throw new Error(
            "Couldnt parse the response for tally for journal voucher creation: " +
              JSON.stringify(e)
          );
        }),
        e
      );
    })();
  t.default = a;
};
