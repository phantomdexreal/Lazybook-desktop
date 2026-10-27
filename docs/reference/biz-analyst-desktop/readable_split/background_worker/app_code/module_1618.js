// webpack module #1618 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var n =
    (this && this.__assign) ||
    function () {
      return (n =
        Object.assign ||
        function (e) {
          for (var t, r = 1, n = arguments.length; r < n; r++)
            for (var a in (t = arguments[r]))
              Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
          return e;
        }).apply(this, arguments);
    };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var a = r(11),
    i = r(26),
    o = r(1619),
    s = r(11),
    u = r(35),
    p = new (r(29).TallySettings)();
  ((p.host = u.TALLY_DEFAULT_HOST), (p.port = u.TALLY_DEFAULT_PORT));
  var c = i.default.get(i.default.TALLY_SETTINGS, p),
    l = p;
  (s.isNotNull(c) && (l = c),
    (t.initialTallyState = {
      runningStatus: !0,
      tallyConfig: l,
      tallyCheckError: null,
      lastCheckTime: 0,
      tallyPingError: null,
    }),
    (t.default = function (e, r) {
      if (
        (void 0 === e && (e = t.initialTallyState),
        a.isNotNull(r) && a.isNotNull(r.payload) && a.isNotNull(r.payload.tallyCheckError))
      )
        return n({}, e, { tallyCheckError: r.payload.tallyCheckError });
      switch (r.type) {
        case o.CHECK_AND_SAVE_TALLY_CONFIG:
          return n({}, e, {
            runningStatus: r.payload.success,
            tallyConfig: r.payload.tallyConfig,
            tallyCheckError: null,
          });
        case o.TALLY_STATUS:
          return n({}, e, {
            runningStatus: r.payload.isTallyAvailable,
            tallyPingError: r.payload.tallyPingError,
          });
        default:
          return e;
      }
    }));
};
