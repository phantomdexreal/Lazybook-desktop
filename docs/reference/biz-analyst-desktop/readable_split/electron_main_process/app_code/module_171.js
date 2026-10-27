// webpack module #171 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(708),
    a = ("browser" === process.type ? r(716) : r(132)).init,
    o = r(11),
    s = r(2),
    n = r(185);
  function u() {
    var e = s.Util.getServerCredentials().sentryDsn;
    a({ dsn: e, release: n.version });
  }
  ((t.default = function (e) {
    switch (e) {
      case o.default.SCOPE_MAIN:
      case o.default.SCOPE_RENDERER:
        u();
    }
  }),
    (t.updateRavenContext = function (e) {
      s.Util.isNotNull(e) &&
        i.configureScope(function (t) {
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
