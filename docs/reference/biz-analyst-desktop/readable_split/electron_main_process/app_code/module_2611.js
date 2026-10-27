// webpack module #2611 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var i =
    (this && this.__assign) ||
    function () {
      return (i =
        Object.assign ||
        function (e) {
          for (var t, r = 1, i = arguments.length; r < i; r++)
            for (var a in (t = arguments[r]))
              Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
          return e;
        }).apply(this, arguments);
    };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var a = r(10),
    o = r(24),
    s = r(626),
    n = r(10),
    u = r(49),
    p = new (r(28).TallySettings)();
  ((p.host = u.TALLY_DEFAULT_HOST), (p.port = u.TALLY_DEFAULT_PORT));
  var c = o.default.get(o.default.TALLY_SETTINGS, p),
    m = p;
  (n.isNotNull(c) && (m = c),
    (t.initialTallyState = {
      runningStatus: !0,
      tallyConfig: m,
      tallyCheckError: null,
      lastCheckTime: 0,
      tallyPingError: null,
    }),
    (t.default = function (e, r) {
      if (
        (void 0 === e && (e = t.initialTallyState),
        a.isNotNull(r) && a.isNotNull(r.payload) && a.isNotNull(r.payload.tallyCheckError))
      )
        return i({}, e, { tallyCheckError: r.payload.tallyCheckError });
      switch (r.type) {
        case s.CHECK_AND_SAVE_TALLY_CONFIG:
          return i({}, e, {
            runningStatus: r.payload.success,
            tallyConfig: r.payload.tallyConfig,
            tallyCheckError: null,
          });
        case s.TALLY_STATUS:
          return i({}, e, {
            runningStatus: r.payload.isTallyAvailable,
            tallyPingError: r.payload.tallyPingError,
          });
        default:
          return e;
      }
    }));
};
