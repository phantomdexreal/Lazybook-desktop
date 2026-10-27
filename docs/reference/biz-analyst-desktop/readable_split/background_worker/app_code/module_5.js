// webpack module #5 (from background_worker, BA Mobile Connector 8.4.41)
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
  var i = r(46),
    o = r(0),
    s = function () {};
  t.Base = s;
  var u = (function (e) {
    function t() {
      var t = (null !== e && e.apply(this, arguments)) || this;
      return ((t.isDeleted = !1), t);
    }
    return (
      a(t, e),
      (t.prototype.updateOldName = function (e) {}),
      (t.compareFields = function (e, r) {
        for (var n = [], a = 2; a < arguments.length; a++) n[a - 2] = arguments[a];
        for (var i = 0, o = n; i < o.length; i++) {
          var s = o[i];
          if (!t.compare(e[s], r[s])) return !1;
        }
        return !0;
      }),
      (t.compare = function (e, r) {
        if (o.Util.isNull(e) && o.Util.isNull(r)) return !0;
        if (o.Util.isNotNull(e) && o.Util.isNotNull(r))
          if ("string" == typeof e || "boolean" == typeof e || "number" == typeof e) {
            if (e === r) return !0;
          } else {
            if (Array.isArray(e) && Array.isArray(r)) return t.compareArrayObjects(e, r);
            if ("object" == typeof e) return t.compareObjects(e, r);
          }
        return !1;
      }),
      (t.compareDebug = function (e, r) {
        i.forOwn(e, function (e, n) {
          "updatedAt" !== n &&
            "createdAt" !== n &&
            "tallyUpdatedAt" !== n &&
            "uptoDate" !== n &&
            !1 === t.compare(e, r[n]) &&
            (o.Log.debug("Key is false: " + n),
            o.Log.debug("Old Value: " + e),
            o.Log.debug("New Value: " + r[n]));
        });
      }),
      (t.compareArrayObjects = function (e, t, r) {
        if (void 0 === e && void 0 === t) return !0;
        if (void 0 === e && void 0 !== t) return !1;
        if (void 0 !== e && void 0 === t) return !1;
        if (e.length !== t.length) return !1;
        if (e.length === t.length)
          for (var n = 0; n < e.length; ++n) {
            if ("function" != typeof e[n].equals) return !1;
            if (!1 === e[n].equals(t[n])) return !1;
          }
        return !0;
      }),
      (t.compareObjects = function (e, t, r) {
        return (
          (void 0 === e && void 0 === t) ||
          ((void 0 !== e || void 0 === t) &&
            (void 0 === e || void 0 !== t) &&
            "function" == typeof e.equals &&
            !1 !== e.equals(t))
        );
      }),
      (t.prototype.toObject = function (e) {
        return (0, this.constructor.toObject)(e);
      }),
      (t.keys = ["GUID", "ALTERID", "MASTERID"]),
      (t.deleteDateFields = function (e) {
        (delete e.tallyUpdatedAt,
          delete e.uptoDate,
          delete e.createdAt,
          delete e.updatedAt,
          delete e.alterId,
          delete e.lastCompleteSyncAt,
          delete e.masterType);
      }),
      t
    );
  })(s);
  t.Master = u;
};
