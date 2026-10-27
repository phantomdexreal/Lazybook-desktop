// webpack module #1101 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = (function () {
      function e() {}
      return (
        (e.prototype.parseOrderDetails = function (e) {
          var t = {
            deleted: !1,
            altered: !1,
            created: !1,
            lastvchid: null,
            error: !1,
            lineerror: null,
          };
          if (
            n.Util.isNotNull(e) &&
            n.Util.isNotNull(e.envelope) &&
            n.Util.isNotNull(e.envelope.body)
          ) {
            var r = e.envelope.body,
              a = n.TallyUtil.getStringValue(r.data.lineerror, "$");
            if (
              (n.Util.isNotNull(r.data) &&
                n.Util.isNotNull(r.data.lineerror) &&
                n.Util.isNotNull(a) &&
                ((t.lineerror = a), (t.error = !0)),
              (n.Util.isNotNull(r.data) && n.Util.isNotNull(r.data.importresult)) || !1 === t.error)
            ) {
              var i = r.data.importresult;
              "0" !== n.TallyUtil.getStringValue(i.deleted, "$") && (t.deleted = !0),
                "0" !== n.TallyUtil.getStringValue(i.altered, "$") && (t.altered = !0),
                "1" === n.TallyUtil.getStringValue(i.created, "$") && (t.created = !0);
              var o = n.TallyUtil.getStringValue(i.lastvchid, "$");
              n.Util.isNotNull(o) && (t.lastvchid = o),
                "0" !== n.TallyUtil.getStringValue(i.errors, "$") && (t.error = !0);
            }
            return {
              tallyErrorMessage: t.lineerror,
              tallyInsertSuccess: t.created,
              tallyMasterId: t.lastvchid,
              tallyUpdatedAt: n.DateUtil.now(),
            };
          }
          throw (
            (console.log(JSON.stringify(e)),
            new Error(
              "Couldnt parse the response for tally for order creation: " + JSON.stringify(e)
            ))
          );
        }),
        e
      );
    })();
  t.default = a;
};
