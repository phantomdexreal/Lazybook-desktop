// webpack module #161 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(700),
    a = ("browser" === process.type ? r(708) : r(122)).init,
    i = r(8),
    o = r(0),
    s = r(437);
  function u() {
    var e = o.Util.getServerCredentials().sentryDsn;
    a({ dsn: e, release: s.version });
  }
  ((t.default = function (e) {
    switch (e) {
      case i.default.SCOPE_MAIN:
      case i.default.SCOPE_RENDERER:
        u();
    }
  }),
    (t.updateRavenContext = function (e) {
      o.Util.isNotNull(e) &&
        n.configureScope(function (t) {
          (t.setExtra("email", e.email), t.setTag("email", e.email), t.setTag("id", e.id));
        });
    }),
    (t.captureExceptionWrapper = function (e) {}),
    (t.captureException = function (e) {}));
  var p = (function () {
    function e() {}
    return ((e.prototype.handleError = function (e) {}), e);
  })();
  t.RavenErrorHandler = p;
};
