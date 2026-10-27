// webpack module #5 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var i,
    a =
      (this && this.__extends) ||
      ((i = function (e, t) {
        return (i =
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
        (i(e, t),
          (e.prototype = null === t ? Object.create(t) : ((r.prototype = t.prototype), new r())));
      });
  Object.defineProperty(t, "__esModule", { value: !0 });
  var o = r(64),
    s = r(2),
    n = function () {};
  t.Base = n;
  var u = (function (e) {
    function t() {
      var t = (null !== e && e.apply(this, arguments)) || this;
      return ((t.isDeleted = !1), t);
    }
    return (
      a(t, e),
      (t.prototype.updateOldName = function (e) {}),
      (t.compareFields = function (e, r) {
        for (var i = [], a = 2; a < arguments.length; a++) i[a - 2] = arguments[a];
        for (var o = 0, s = i; o < s.length; o++) {
          var n = s[o];
          if (!t.compare(e[n], r[n])) return !1;
        }
        return !0;
      }),
      (t.compare = function (e, r) {
        if (s.Util.isNull(e) && s.Util.isNull(r)) return !0;
        if (s.Util.isNotNull(e) && s.Util.isNotNull(r))
          if ("string" == typeof e || "boolean" == typeof e || "number" == typeof e) {
            if (e === r) return !0;
          } else {
            if (Array.isArray(e) && Array.isArray(r)) return t.compareArrayObjects(e, r);
            if ("object" == typeof e) return t.compareObjects(e, r);
          }
        return !1;
      }),
      (t.compareDebug = function (e, r) {
        o.forOwn(e, function (e, i) {
          "updatedAt" !== i &&
            "createdAt" !== i &&
            "tallyUpdatedAt" !== i &&
            "uptoDate" !== i &&
            !1 === t.compare(e, r[i]) &&
            (s.Log.debug("Key is false: " + i),
            s.Log.debug("Old Value: " + e),
            s.Log.debug("New Value: " + r[i]));
        });
      }),
      (t.compareArrayObjects = function (e, t, r) {
        if (void 0 === e && void 0 === t) return !0;
        if (void 0 === e && void 0 !== t) return !1;
        if (void 0 !== e && void 0 === t) return !1;
        if (e.length !== t.length) return !1;
        if (e.length === t.length)
          for (var i = 0; i < e.length; ++i) {
            if ("function" != typeof e[i].equals) return !1;
            if (!1 === e[i].equals(t[i])) return !1;
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
  })(n);
  t.Master = u;
};
