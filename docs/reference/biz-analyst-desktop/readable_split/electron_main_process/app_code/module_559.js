// webpack module #559 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = (function () {
      function e() {}
      return (
        (e.prototype.parse = function (e, t) {
          var r = { created: !1, lineerror: null };
          if (i.Util.isNotNull(e) && i.Util.isNotNull(e.response)) {
            var a = e.response,
              o = i.TallyUtil.getStringValue(a.lineerror, "$"),
              s = "0" !== i.TallyUtil.getStringValue(a.errors, "$");
            return (
              i.Util.isNotNull(o)
                ? (r.lineerror = o)
                : !0 === s && (r.lineerror = "Error while creating " + t),
              "1" === i.TallyUtil.getStringValue(a.created, "$") && (r.created = !0),
              {
                tallyErrorMessage: r.lineerror,
                tallyInsertSuccess: r.created,
                tallyUpdatedAt: i.DateUtil.now(),
              }
            );
          }
          var n =
            "Could not parse the response for tally for " +
            t +
            " creation: ' + " +
            JSON.stringify(e);
          throw (i.Log.error(n), new Error(n));
        }),
        e
      );
    })();
  t.default = a;
};
