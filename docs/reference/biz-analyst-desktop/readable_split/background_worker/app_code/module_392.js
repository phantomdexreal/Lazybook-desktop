// webpack module #392 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var n,
    a =
      (this && this.__extends) ||
      ((n = function (e, t) {
        return (n =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (e, t) {
              e.__proto__ = t;
            }) ||
          function (e, t) {
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
          })(e, t);
      }),
      function (e, t) {
        function r() {
          this.constructor = e;
        }
        (n(e, t),
          (e.prototype = null === t ? Object.create(t) : ((r.prototype = t.prototype), new r())));
      });
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = (function (e) {
    function t(t, r) {
      return e.call(this) || this;
    }
    return (a(t, e), t);
  })(r(677).default);
  ((t.default = i),
    (function (e) {
      ((e.GOLD = "gold"), (e.SILVER = "silver"));
    })(t.TallyLicenceType || (t.TallyLicenceType = {})));
};
