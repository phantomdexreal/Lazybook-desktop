// webpack module #1230 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
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
            i.Util.isNotNull(e) &&
            i.Util.isNotNull(e.envelope) &&
            i.Util.isNotNull(e.envelope.body)
          ) {
            var r = e.envelope.body,
              a = i.TallyUtil.getStringValue(r.data.lineerror, "$");
            if (
              (i.Util.isNotNull(r.data) &&
                i.Util.isNotNull(r.data.lineerror) &&
                i.Util.isNotNull(a) &&
                ((t.lineerror = a), (t.error = !0)),
              (i.Util.isNotNull(r.data) && i.Util.isNotNull(r.data.importresult)) || !1 === t.error)
            ) {
              var o = r.data.importresult;
              ("0" !== i.TallyUtil.getStringValue(o.deleted, "$") && (t.deleted = !0),
                "0" !== i.TallyUtil.getStringValue(o.altered, "$") && (t.altered = !0),
                "1" === i.TallyUtil.getStringValue(o.created, "$") && (t.created = !0));
              var s = i.TallyUtil.getStringValue(o.lastvchid, "$");
              (i.Util.isNotNull(s) && (t.lastvchid = s),
                "0" !== i.TallyUtil.getStringValue(o.errors, "$") && (t.error = !0));
            }
            return {
              tallyErrorMessage: t.lineerror,
              tallyInsertSuccess: t.created,
              tallyMasterId: t.lastvchid,
              tallyUpdatedAt: i.DateUtil.now(),
            };
          }
          throw (
            console.log(JSON.stringify(e)),
            new Error(
              "Couldnt parse the response for tally for order creation: " + JSON.stringify(e),
            )
          );
        }),
        e
      );
    })();
  t.default = a;
};
