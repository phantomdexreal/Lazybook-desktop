// webpack module #1133 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = (function () {
      function e() {}
      return (
        (e.prototype.parse = function (e) {
          var t = { created: !1, lineerror: null };
          if (i.Util.isNotNull(e) && i.Util.isNotNull(e.response)) {
            var r = e.response,
              a = i.TallyUtil.getStringValue(r.lineerror, "$"),
              o = "0" !== i.TallyUtil.getStringValue(r.errors, "$");
            return (
              i.Util.isNotNull(a)
                ? (t.lineerror = a)
                : !0 === o && (t.lineerror = "Error while creating ledger"),
              "1" === i.TallyUtil.getStringValue(r.created, "$") && (t.created = !0),
              {
                tallyErrorMessage: t.lineerror,
                tallyInsertSuccess: t.created,
                tallyUpdatedAt: i.DateUtil.now(),
              }
            );
          }
          throw (
            i.Log.error("LedgerEntryResponse error" + JSON.stringify(e)),
            new Error(
              "Could not parse the response for tally for ledger creation: " + JSON.stringify(e),
            )
          );
        }),
        e
      );
    })();
  t.default = a;
};
