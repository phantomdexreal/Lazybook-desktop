// webpack module #147 (from electron_main_process, BA Mobile Connector 8.4.41)
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
      },
    a =
      (this && this.__awaiter) ||
      function (e, t, r, i) {
        return new (r || (r = Promise))(function (a, o) {
          function s(e) {
            try {
              u(i.next(e));
            } catch (e) {
              o(e);
            }
          }
          function n(e) {
            try {
              u(i.throw(e));
            } catch (e) {
              o(e);
            }
          }
          function u(e) {
            e.done
              ? a(e.value)
              : new r(function (t) {
                  t(e.value);
                }).then(s, n);
          }
          u((i = i.apply(e, t || [])).next());
        });
      },
    o =
      (this && this.__generator) ||
      function (e, t) {
        var r,
          i,
          a,
          o,
          s = {
            label: 0,
            sent: function () {
              if (1 & a[0]) throw a[1];
              return a[1];
            },
            trys: [],
            ops: [],
          };
        return (
          (o = { next: n(0), throw: n(1), return: n(2) }),
          "function" == typeof Symbol &&
            (o[Symbol.iterator] = function () {
              return this;
            }),
          o
        );
        function n(o) {
          return function (n) {
            return (function (o) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; s;)
                try {
                  if (
                    ((r = 1),
                    i &&
                      (a =
                        2 & o[0]
                          ? i.return
                          : o[0]
                            ? i.throw || ((a = i.return) && a.call(i), 0)
                            : i.next) &&
                      !(a = a.call(i, o[1])).done)
                  )
                    return a;
                  switch (((i = 0), a && (o = [2 & o[0], a.value]), o[0])) {
                    case 0:
                    case 1:
                      a = o;
                      break;
                    case 4:
                      return (s.label++, { value: o[1], done: !1 });
                    case 5:
                      (s.label++, (i = o[1]), (o = [0]));
                      continue;
                    case 7:
                      ((o = s.ops.pop()), s.trys.pop());
                      continue;
                    default:
                      if (
                        !((a = s.trys),
                        (a = a.length > 0 && a[a.length - 1]) || (6 !== o[0] && 2 !== o[0]))
                      ) {
                        s = 0;
                        continue;
                      }
                      if (3 === o[0] && (!a || (o[1] > a[0] && o[1] < a[3]))) {
                        s.label = o[1];
                        break;
                      }
                      if (6 === o[0] && s.label < a[1]) {
                        ((s.label = a[1]), (a = o));
                        break;
                      }
                      if (a && s.label < a[2]) {
                        ((s.label = a[2]), s.ops.push(o));
                        break;
                      }
                      (a[2] && s.ops.pop(), s.trys.pop());
                      continue;
                  }
                  o = t.call(e, s);
                } catch (e) {
                  ((o = [6, e]), (i = 0));
                } finally {
                  r = a = 0;
                }
              if (5 & o[0]) throw o[1];
              return { value: o[0] ? o[1] : void 0, done: !0 };
            })([o, n]);
          };
        }
      };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var s = r(512),
    n = r(24),
    u = r(212),
    p = r(11),
    c = r(101),
    m = r(196),
    l = r(234),
    d = r(2),
    y = r(255),
    b = d.Util.getServerCredentials().API_BASE_URL,
    h = ["ENOTFOUND", "ESOCKETTIMEDOUT", "ECONNRESET", "ETIMEDOUT", "Forbidden"],
    g = m.DEFAULT_PROXY_SETTINGS,
    S = n.default.get(n.default.PROXY_SETTINGS, g),
    f = s;
  function A(e, t, r, a) {
    var o = {
      strictSSL: !1,
      url: e,
      headers: { "Content-Type": "application/json" },
      resolveWithFullResponse: !0,
    };
    return (
      d.Util.isNotNull(a) && (o.headers = i({}, o.headers, a)),
      d.Util.isNotNull(t) && (o.qs = i({}, t)),
      d.Util.isNotNull(r) && (o.body = JSON.stringify(r)),
      o
    );
  }
  function N(e, t) {
    var r = l.ErrorHandler.formatError(t);
    if (
      e.includes(p.default.APP_DOMAIN_NAME) &&
      d.Util.isNotEmptyString(r.message) &&
      ["Invalid token", "Token Expired"].includes(r.message) &&
      401 === r.statusCode
    ) {
      (process && process.type === p.default.PROCESS.RENDERER
        ? u.default.getInstance().getStore()
        : c.default.getInstance().getStore()
      ).dispatch(y.logout(!0));
    }
  }
  function I(e, t, r) {
    if (
      d.Util.isNotNull(e.url) &&
      e.url.includes(b) &&
      !0 === t &&
      d.Util.isNotNull(r) &&
      d.Util.isNotNull(r.message)
    )
      for (var i = 0, a = h; i < a.length; i++) {
        var o = a[i];
        if (r.message.includes(o)) return !0;
      }
    return !1;
  }
  (d.Util.isNotNull(S) && !0 === S.enableProxy && (f = s.defaults({ proxy: S.proxyUrl })),
    (t.getRequestOptions = function (e, t, r, a, o, s) {
      var n = A(e, t, r, s),
        u = d.Util.getAuthHeader(a);
      return (
        d.Util.isNotNull(u) && (n.headers = i({}, n.headers, u)),
        d.Util.isNotNull(o) && (n.timeout = o),
        d.Util.isNull(n.qs) && (n.qs = {}),
        (n.qs = i({}, n.qs, {
          desktopVersion: p.default.APP_VERSION,
          version: p.default.AUTH_VERSION,
        })),
        n
      );
    }),
    (t.getUnauthorizedRequestOptions = A),
    (t.post = function e(t, r) {
      return (
        void 0 === r && (r = !0),
        a(this, void 0, void 0, function () {
          var i;
          return o(this, function (a) {
            switch (a.label) {
              case 0:
                return (a.trys.push([0, 2, , 3]), [4, f.post(t)]);
              case 1:
                return [2, a.sent()];
              case 2:
                if (((i = a.sent()), I(t, r, i)))
                  return (
                    (t.url = t.url.replace(b, p.default.FALLBACK_API_BASE_URL)),
                    [2, e(t, !1)]
                  );
                throw (N(t.url, i), i);
              case 3:
                return [2];
            }
          });
        })
      );
    }),
    (t.get = function e(t, r) {
      return (
        void 0 === r && (r = !0),
        a(this, void 0, void 0, function () {
          var i;
          return o(this, function (a) {
            switch (a.label) {
              case 0:
                return (a.trys.push([0, 2, , 3]), [4, f.get(t)]);
              case 1:
                return [2, a.sent()];
              case 2:
                if (((i = a.sent()), I(t, r, i)))
                  return (
                    (t.url = t.url.replace(b, p.default.FALLBACK_API_BASE_URL)),
                    [2, e(t, !1)]
                  );
                throw (N(t.url, i), i);
              case 3:
                return [2];
            }
          });
        })
      );
    }),
    (t.put = function e(t, r) {
      return (
        void 0 === r && (r = !0),
        a(this, void 0, void 0, function () {
          var i;
          return o(this, function (a) {
            switch (a.label) {
              case 0:
                return (a.trys.push([0, 2, , 3]), [4, f.put(t)]);
              case 1:
                return [2, a.sent()];
              case 2:
                if (((i = a.sent()), I(t, r, i)))
                  return (
                    (t.url = t.url.replace(b, p.default.FALLBACK_API_BASE_URL)),
                    [2, e(t, !1)]
                  );
                throw (N(t.url, i), i);
              case 3:
                return [2];
            }
          });
        })
      );
    }),
    (t.del = function e(t, r) {
      return (
        void 0 === r && (r = !0),
        a(this, void 0, void 0, function () {
          var i;
          return o(this, function (a) {
            switch (a.label) {
              case 0:
                return (a.trys.push([0, 2, , 3]), [4, f.del(t)]);
              case 1:
                return [2, a.sent()];
              case 2:
                if (((i = a.sent()), I(t, r, i)))
                  return (
                    (t.url = t.url.replace(b, p.default.FALLBACK_API_BASE_URL)),
                    [2, e(t, !1)]
                  );
                throw (N(t.url, i), i);
              case 3:
                return [2];
            }
          });
        })
      );
    }),
    (t.rawRequest = function (e) {
      return a(this, void 0, void 0, function () {
        return o(this, function (t) {
          return [2, f(e)];
        });
      });
    }));
};
