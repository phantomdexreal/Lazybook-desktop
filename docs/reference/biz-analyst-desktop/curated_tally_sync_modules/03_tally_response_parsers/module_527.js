// webpack module #527 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = (function () {
      function e() {}
      return (
        (e.prototype.parse = function (e) {
          var t = null;
          if (
            n.Util.isNotNull(e) &&
            n.Util.isNotNull(e.envelope) &&
            n.Util.isNotNull(e.envelope.body) &&
            n.Util.isNotNull(e.envelope.body.data)
          ) {
            var r = null;
            if (n.Util.isNotNull(e.envelope.body.data.importresult))
              r = e.envelope.body.data.importresult;
            else {
              if (!n.Util.isNotNull(e.envelope.body.data))
                throw new Error(
                  "Couldnt parse the response for tally for invoice creation: " + JSON.stringify(e)
                );
              r = e.envelope.body.data;
            }
            var a = n.TallyUtil.getStringValue(r.lineerror, "$"),
              i = null;
            return (
              n.Util.isNotNull(a)
                ? (t = a)
                : "0" !== n.TallyUtil.getStringValue(r.errors, "$")
                ? (t = "Error while creating invoice")
                : (i = n.TallyUtil.getStringValue(r.lastvchid, "$")),
              {
                tallyErrorMessage: t,
                tallyInsertSuccess: "1" === n.TallyUtil.getStringValue(r.created, "$"),
                tallyUpdatedAt: n.DateUtil.now(),
                tallyMasterId: i,
              }
            );
          }
          throw new Error(
            "Couldnt parse the response for tally for invoice creation: " + JSON.stringify(e)
          );
        }),
        e
      );
    })();
  t.default = a;
};
