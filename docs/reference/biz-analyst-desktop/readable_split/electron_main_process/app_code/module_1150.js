// webpack module #1150 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = (function () {
      function e() {}
      return (
        (e.prototype.parse = function (e) {
          var t = { created: !1, lineerror: null, tallyMasterId: null, error: null };
          if (i.Util.isNotNull(e) && i.Util.isNotNull(e.response)) {
            var r = e.response,
              a = i.TallyUtil.getStringValue(r.lineerror, "$"),
              o = "0" !== i.TallyUtil.getStringValue(r.errors, "$");
            return (
              i.Util.isNotNull(a)
                ? (t.lineerror = a)
                : !0 === o
                  ? (t.lineerror = "Error while creating journal entry")
                  : (t.tallyMasterId = i.TallyUtil.getStringValue(r.lastvchid, "$")),
              "1" === i.TallyUtil.getStringValue(r.created, "$") && (t.created = !0),
              {
                tallyErrorMessage: t.lineerror,
                tallyInsertSuccess: t.created,
                tallyUpdatedAt: i.DateUtil.now(),
                tallyMasterId: t.tallyMasterId,
              }
            );
          }
          throw new Error(
            "Couldnt parse the response for tally for journal voucher creation: " +
              JSON.stringify(e),
          );
        }),
        e
      );
    })();
  t.default = a;
};
