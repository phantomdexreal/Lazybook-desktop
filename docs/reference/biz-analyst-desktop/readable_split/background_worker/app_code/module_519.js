// webpack module #519 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = (function () {
      function e() {}
      return (
        (e.prototype.parse = function (e, t) {
          var r = { created: !1, lineerror: null };
          if (n.Util.isNotNull(e) && n.Util.isNotNull(e.response)) {
            var a = e.response,
              i = n.TallyUtil.getStringValue(a.lineerror, "$"),
              o = "0" !== n.TallyUtil.getStringValue(a.errors, "$");
            return (
              n.Util.isNotNull(i)
                ? (r.lineerror = i)
                : !0 === o && (r.lineerror = "Error while creating " + t),
              "1" === n.TallyUtil.getStringValue(a.created, "$") && (r.created = !0),
              {
                tallyErrorMessage: r.lineerror,
                tallyInsertSuccess: r.created,
                tallyUpdatedAt: n.DateUtil.now(),
              }
            );
          }
          var s =
            "Could not parse the response for tally for " +
            t +
            " creation: ' + " +
            JSON.stringify(e);
          throw (n.Log.error(s), new Error(s));
        }),
        e
      );
    })();
  t.default = a;
};
