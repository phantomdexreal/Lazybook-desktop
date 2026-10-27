// webpack module #225 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var n =
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
    a =
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
  var i = r(1069),
    o = r(1077),
    s = r(136),
    u = r(0),
    p = (function () {
      function e() {}
      return (
        (e.prototype.isInternetAvailable = function () {
          return n(this, void 0, void 0, function () {
            return a(this, function (e) {
              switch (e.label) {
                case 0:
                  return (e.trys.push([0, 3, , 4]), [4, o("google.com:443")]);
                case 1:
                  return e.sent() ? [2, !0] : [4, this.checkConnection()];
                case 2:
                  return e.sent() ? [2, !0] : [3, 4];
                case 3:
                  return (e.sent(), [3, 4]);
                case 4:
                  return [4, this.pingUrl("https://bizanalyst.in/desktop-ping.png")];
                case 5:
                  return e.sent() ? [2, !0] : [3, 6];
                case 6:
                  return [4, this.pingUrl("https://cdn.bizanalyst.in/desktop-ping.png")];
                case 7:
                  return [2, e.sent()];
              }
            });
          });
        }),
        (e.prototype.pingUrl = function (e) {
          return n(this, void 0, void 0, function () {
            var t;
            return a(this, function (r) {
              switch (r.label) {
                case 0:
                  ((t = {
                    strictSSL: !1,
                    url: e,
                    headers: { "Content-Type": "application/json" },
                    resolveWithFullResponse: !0,
                  }),
                    (r.label = 1));
                case 1:
                  return (r.trys.push([1, 3, , 4]), [4, s.get(t)]);
                case 2:
                  return 200 == r.sent().statusCode ? [2, !0] : [2, !1];
                case 3:
                  return (r.sent(), [2, !1]);
                case 4:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.checkConnection = function () {
          return n(this, void 0, void 0, function () {
            return a(this, function (e) {
              return [
                2,
                i({ timeout: 100, retries: 2 })
                  .then(function () {
                    return !0;
                  })
                  .catch(function () {
                    return !1;
                  }),
              ];
            });
          });
        }),
        (e.checkInternet = function () {
          return n(this, void 0, void 0, function () {
            return a(this, function (t) {
              switch (t.label) {
                case 0:
                  return (
                    u.Util.isNull(e.instance) && (e.instance = new e()),
                    [4, e.instance.isInternetAvailable()]
                  );
                case 1:
                  return [2, t.sent()];
              }
            });
          });
        }),
        (e.checkInternetisNotThere = function (e) {
          return (
            u.Util.isNotNull(e) &&
            u.Util.isNotNull(e.message) &&
            (e.message.toLowerCase().includes("getaddrinfo") || e.message.includes("EAI_AGAIN"))
          );
        }),
        e
      );
    })();
  t.default = p;
};
