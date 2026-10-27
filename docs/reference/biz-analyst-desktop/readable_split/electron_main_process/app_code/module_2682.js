// webpack module #2682 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var o = r(2),
    s = r(10),
    n = r(100),
    u = r(144),
    p = r(43),
    c = r(60),
    m = r(24),
    l = r(29),
    d = (function () {
      function e() {
        var e = this;
        ((this.API_BASE_URL = o.Util.getServerCredentials().API_BASE_URL),
          (this.METADATA_URL = this.API_BASE_URL + "/miscellaneous/metadata"),
          (this.DESKTOP_TIMEOUT_KEY = "desktopAppPingTimeout"),
          (this.MAXIMUM_RETRY = 5),
          (this.MAXIMUM_RETRY_COUNTER = 1),
          (this.INITIAL_TIMEOUT = 1e3),
          (this.pingServer = function () {
            return i(e, void 0, void 0, function () {
              var e,
                t = this;
              return a(this, function (r) {
                switch (r.label) {
                  case 0:
                    (o.Log.info("In ping server Function"), (e = 6e4), (r.label = 1));
                  case 1:
                    return (r.trys.push([1, 3, , 4]), [4, this.getDesktopAppPingTimeout()]);
                  case 2:
                    return ((e = r.sent()), [3, 4]);
                  case 3:
                    return (
                      r.sent(),
                      o.Log.error("Fetching timeout from server for Pinging"),
                      [3, 4]
                    );
                  case 4:
                    return (
                      n.forever(
                        function (r) {
                          setTimeout(function () {
                            return i(t, void 0, void 0, function () {
                              var e, t, i, n;
                              return a(this, function (a) {
                                switch (a.label) {
                                  case 0:
                                    return (
                                      o.Log.info("Pinging to server. Saving in metadata table"),
                                      (e = u.default.get()),
                                      (o.Util.isEmpty(e) || o.Util.isEmpty(e.id)) &&
                                        o.Log.info("user not found"),
                                      [4, this.getParams(e)]
                                    );
                                  case 1:
                                    return (
                                      (t = a.sent()),
                                      (i = t[0]),
                                      (n = t[1]),
                                      i && n
                                        ? [
                                            4,
                                            s.retryFunction(
                                              this.saveDesktopAppStatus,
                                              [e, { key: i, value: n, type: "desktop-ping" }],
                                              this.MAXIMUM_RETRY,
                                              this.INITIAL_TIMEOUT,
                                              this.MAXIMUM_RETRY_COUNTER,
                                              "saveDesktopAppStatus",
                                            ),
                                          ]
                                        : (o.Log.error("No params found"), r(void 0), [2])
                                    );
                                  case 2:
                                    return (a.sent(), r(void 0), [2]);
                                }
                              });
                            });
                          }, e);
                        },
                        function (e) {
                          o.Log.info("Terminating the desktop app server ping process");
                        },
                      ),
                      [2]
                    );
                }
              });
            });
          }),
          (this.getDesktopAppPingTimeout = function () {
            return i(e, void 0, void 0, function () {
              var e, t, r, i, s, n;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    ((e = this.METADATA_URL), (t = 9e5), (a.label = 1));
                  case 1:
                    return (
                      a.trys.push([1, 3, , 4]),
                      (r = u.default.get()),
                      o.Util.isEmpty(r) || o.Util.isEmpty(r.id)
                        ? (o.Log.info("user not found"), [2, t])
                        : ((i = l.getRequestOptions(e, { key: this.DESKTOP_TIMEOUT_KEY }, null, r)),
                          [4, l.getRequest(i)])
                    );
                  case 2:
                    return ((s = a.sent()), (t = s.value), [3, 4]);
                  case 3:
                    return (
                      (n = a.sent()),
                      o.Log.error("Error while pinging to server " + JSON.stringify(n)),
                      [3, 4]
                    );
                  case 4:
                    return [2, t];
                }
              });
            });
          }),
          (this.getParams = function (t) {
            return i(e, void 0, void 0, function () {
              var e, r, i, s, n, u;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    return (
                      (o.Util.isEmpty(t) || o.Util.isEmpty(t.id)) && o.Log.info("user not found"),
                      [4, p.default.get(new c.default(), t.id).findAll()]
                    );
                  case 1:
                    return (
                      (e = a.sent()),
                      o.Util.isFilledArray(e)
                        ? ((r = m.default.get(m.default.DEVICE)),
                          o.Util.isNotNull(r) &&
                            !o.Util.isEmpty(r) &&
                            r.userId === t.id &&
                            (i = r.deviceId),
                          (s = e[0].subscriptionId),
                          (n = "subscription:" + s + ":ping"),
                          (u = { timestamp: o.DateUtil.now(), subscriptionId: s, deviceId: i }),
                          [2, [n, u]])
                        : [2, [null, null]]
                    );
                }
              });
            });
          }),
          (this.saveDesktopAppStatus = function (t, r) {
            return i(e, void 0, void 0, function () {
              var e, i, s;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    ((e = this.METADATA_URL), (a.label = 1));
                  case 1:
                    return (
                      a.trys.push([1, 3, , 4]),
                      o.Log.info("Pinging to server"),
                      (i = l.getRequestOptions(e, null, r, t)),
                      [4, l.postRequest(i)]
                    );
                  case 2:
                    return (a.sent(), [3, 4]);
                  case 3:
                    return (
                      (s = a.sent()),
                      o.Log.error("Error while pinging to server " + JSON.stringify(s)),
                      [3, 4]
                    );
                  case 4:
                    return [2];
                }
              });
            });
          }));
      }
      return (
        (e.getInstance = function () {
          return (o.Util.isNull(e.instance) && (e.instance = new e()), e.instance);
        }),
        e
      );
    })();
  t.default = d;
};
