// webpack module #155 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var i =
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
    a =
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
  var o = r(1152),
    s = r(1159),
    n = r(147),
    u = r(2),
    p = (function () {
      function e() {}
      return (
        (e.prototype.isInternetAvailable = function () {
          return i(this, void 0, void 0, function () {
            return a(this, function (e) {
              switch (e.label) {
                case 0:
                  return (e.trys.push([0, 3, , 4]), [4, s("google.com:443")]);
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
          return i(this, void 0, void 0, function () {
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
                  return (r.trys.push([1, 3, , 4]), [4, n.get(t)]);
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
          return i(this, void 0, void 0, function () {
            return a(this, function (e) {
              return [
                2,
                o({ timeout: 100, retries: 2 })
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
          return i(this, void 0, void 0, function () {
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
