// webpack module #136 (from background_worker, BA Mobile Connector 8.4.41)
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
      },
    a =
      (this && this.__awaiter) ||
      function (e, t, r, n) {
        return new (r || (r = Promise))(function (a, i) {
          function o(e) {
            try {
              u(n.next(e));
            } catch (e) {
              i(e);
            }
          }
          function s(e) {
            try {
              u(n.throw(e));
            } catch (e) {
              i(e);
            }
          }
          function u(e) {
            e.done
              ? a(e.value)
              : new r(function (t) {
                  t(e.value);
                }).then(o, s);
          }
          u((n = n.apply(e, t || [])).next());
        });
      },
    i =
      (this && this.__generator) ||
      function (e, t) {
        var r,
          n,
          a,
          i,
          o = {
            label: 0,
            sent: function () {
              if (1 & a[0]) throw a[1];
              return a[1];
            },
            trys: [],
            ops: [],
          };
        return (
          (i = { next: s(0), throw: s(1), return: s(2) }),
          "function" == typeof Symbol &&
            (i[Symbol.iterator] = function () {
              return this;
            }),
          i
        );
        function s(i) {
          return function (s) {
            return (function (i) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; o;)
                try {
                  if (
                    ((r = 1),
                    n &&
                      (a =
                        2 & i[0]
                          ? n.return
                          : i[0]
                            ? n.throw || ((a = n.return) && a.call(n), 0)
                            : n.next) &&
                      !(a = a.call(n, i[1])).done)
                  )
                    return a;
                  switch (((n = 0), a && (i = [2 & i[0], a.value]), i[0])) {
                    case 0:
                    case 1:
                      a = i;
                      break;
                    case 4:
                      return (o.label++, { value: i[1], done: !1 });
                    case 5:
                      (o.label++, (n = i[1]), (i = [0]));
                      continue;
                    case 7:
                      ((i = o.ops.pop()), o.trys.pop());
                      continue;
                    default:
                      if (
                        !((a = o.trys),
                        (a = a.length > 0 && a[a.length - 1]) || (6 !== i[0] && 2 !== i[0]))
                      ) {
                        o = 0;
                        continue;
                      }
                      if (3 === i[0] && (!a || (i[1] > a[0] && i[1] < a[3]))) {
                        o.label = i[1];
                        break;
                      }
                      if (6 === i[0] && o.label < a[1]) {
                        ((o.label = a[1]), (a = i));
                        break;
                      }
                      if (a && o.label < a[2]) {
                        ((o.label = a[2]), o.ops.push(i));
                        break;
                      }
                      (a[2] && o.ops.pop(), o.trys.pop());
                      continue;
                  }
                  i = t.call(e, o);
                } catch (e) {
                  ((i = [6, e]), (n = 0));
                } finally {
                  r = a = 0;
                }
              if (5 & i[0]) throw i[1];
              return { value: i[0] ? i[1] : void 0, done: !0 };
            })([i, s]);
          };
        }
      };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var o = r(475),
    s = r(26),
    u = r(52),
    p = r(8),
    c = r(109),
    l = r(159),
    m = r(223),
    d = r(0),
    y = r(576),
    b = d.Util.getServerCredentials().API_BASE_URL,
    h = ["ENOTFOUND", "ESOCKETTIMEDOUT", "ECONNRESET", "ETIMEDOUT", "Forbidden"],
    f = l.DEFAULT_PROXY_SETTINGS,
    g = s.default.get(s.default.PROXY_SETTINGS, f),
    M = o;
  function S(e, t, r, a) {
    var i = {
      strictSSL: !1,
      url: e,
      headers: { "Content-Type": "application/json" },
      resolveWithFullResponse: !0,
    };
    return (
      d.Util.isNotNull(a) && (i.headers = n({}, i.headers, a)),
      d.Util.isNotNull(t) && (i.qs = n({}, t)),
      d.Util.isNotNull(r) && (i.body = JSON.stringify(r)),
      i
    );
  }
  function A(e, t) {
    var r = m.ErrorHandler.formatError(t);
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
  function O(e, t, r) {
    if (
      d.Util.isNotNull(e.url) &&
      e.url.includes(b) &&
      !0 === t &&
      d.Util.isNotNull(r) &&
      d.Util.isNotNull(r.message)
    )
      for (var n = 0, a = h; n < a.length; n++) {
        var i = a[n];
        if (r.message.includes(i)) return !0;
      }
    return !1;
  }
  (d.Util.isNotNull(g) && !0 === g.enableProxy && (M = o.defaults({ proxy: g.proxyUrl })),
    (t.getRequestOptions = function (e, t, r, a, i, o) {
      var s = S(e, t, r, o),
        u = d.Util.getAuthHeader(a);
      return (
        d.Util.isNotNull(u) && (s.headers = n({}, s.headers, u)),
        d.Util.isNotNull(i) && (s.timeout = i),
        d.Util.isNull(s.qs) && (s.qs = {}),
        (s.qs = n({}, s.qs, {
          desktopVersion: p.default.APP_VERSION,
          version: p.default.AUTH_VERSION,
        })),
        s
      );
    }),
    (t.getUnauthorizedRequestOptions = S),
    (t.post = function e(t, r) {
      return (
        void 0 === r && (r = !0),
        a(this, void 0, void 0, function () {
          var n;
          return i(this, function (a) {
            switch (a.label) {
              case 0:
                return (a.trys.push([0, 2, , 3]), [4, M.post(t)]);
              case 1:
                return [2, a.sent()];
              case 2:
                if (((n = a.sent()), O(t, r, n)))
                  return (
                    (t.url = t.url.replace(b, p.default.FALLBACK_API_BASE_URL)),
                    [2, e(t, !1)]
                  );
                throw (A(t.url, n), n);
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
          var n;
          return i(this, function (a) {
            switch (a.label) {
              case 0:
                return (a.trys.push([0, 2, , 3]), [4, M.get(t)]);
              case 1:
                return [2, a.sent()];
              case 2:
                if (((n = a.sent()), O(t, r, n)))
                  return (
                    (t.url = t.url.replace(b, p.default.FALLBACK_API_BASE_URL)),
                    [2, e(t, !1)]
                  );
                throw (A(t.url, n), n);
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
          var n;
          return i(this, function (a) {
            switch (a.label) {
              case 0:
                return (a.trys.push([0, 2, , 3]), [4, M.put(t)]);
              case 1:
                return [2, a.sent()];
              case 2:
                if (((n = a.sent()), O(t, r, n)))
                  return (
                    (t.url = t.url.replace(b, p.default.FALLBACK_API_BASE_URL)),
                    [2, e(t, !1)]
                  );
                throw (A(t.url, n), n);
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
          var n;
          return i(this, function (a) {
            switch (a.label) {
              case 0:
                return (a.trys.push([0, 2, , 3]), [4, M.del(t)]);
              case 1:
                return [2, a.sent()];
              case 2:
                if (((n = a.sent()), O(t, r, n)))
                  return (
                    (t.url = t.url.replace(b, p.default.FALLBACK_API_BASE_URL)),
                    [2, e(t, !1)]
                  );
                throw (A(t.url, n), n);
              case 3:
                return [2];
            }
          });
        })
      );
    }),
    (t.rawRequest = function (e) {
      return a(this, void 0, void 0, function () {
        return i(this, function (t) {
          return [2, M(e)];
        });
      });
    }));
};
