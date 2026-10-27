// webpack module #568 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = (function () {
      function e() {}
      return (
        (e.prototype.parse = function (e) {
          var t = null;
          if (
            i.Util.isNotNull(e) &&
            i.Util.isNotNull(e.envelope) &&
            i.Util.isNotNull(e.envelope.body) &&
            i.Util.isNotNull(e.envelope.body.data)
          ) {
            var r = null;
            if (i.Util.isNotNull(e.envelope.body.data.importresult))
              r = e.envelope.body.data.importresult;
            else {
              if (!i.Util.isNotNull(e.envelope.body.data))
                throw new Error(
                  "Couldnt parse the response for tally for invoice creation: " + JSON.stringify(e),
                );
              r = e.envelope.body.data;
            }
            var a = i.TallyUtil.getStringValue(r.lineerror, "$"),
              o = null;
            return (
              i.Util.isNotNull(a)
                ? (t = a)
                : "0" !== i.TallyUtil.getStringValue(r.errors, "$")
                  ? (t = "Error while creating invoice")
                  : (o = i.TallyUtil.getStringValue(r.lastvchid, "$")),
              {
                tallyErrorMessage: t,
                tallyInsertSuccess: "1" === i.TallyUtil.getStringValue(r.created, "$"),
                tallyUpdatedAt: i.DateUtil.now(),
                tallyMasterId: o,
              }
            );
          }
          throw new Error(
            "Couldnt parse the response for tally for invoice creation: " + JSON.stringify(e),
          );
        }),
        e
      );
    })();
  t.default = a;
};
