// webpack module #2674 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var o = r(235),
    s = r(236),
    n = r(626),
    u = r(155),
    p = r(49),
    c = r(59),
    m = r(2),
    l = r(118),
    d = (function () {
      function e(e) {
        ((this.store = e),
          (this.tallyService = p.default.getInstance()),
          this.startInternetCheckTask(),
          this.startTallyCheckTask(),
          this.checkSystemDatetime());
      }
      return (
        (e.prototype.startInternetCheckTask = function () {
          return i(this, void 0, void 0, function () {
            var t,
              r,
              o,
              n,
              p,
              c = this;
            return a(this, function (m) {
              switch (m.label) {
                case 0:
                  return (
                    (t = !1),
                    (r = new u.default()),
                    (o = l.default.getInstance()),
                    (n = {
                      eventType: l.default.EVENT_TYPE.SCREENVIEW,
                      currentScreen: l.default.CURRENT_SCREEN.MY_COMPANY,
                      Platform: l.default.PLATFORM_DESKTOP,
                      feature: l.default.FLOW.FLOW_ONBOARDING,
                    }),
                    [4, r.isInternetAvailable()]
                  );
                case 1:
                  return (
                    (p = m.sent()),
                    (t = p),
                    !p && e.sendInternetEvent
                      ? ((e.sendInternetEvent = !1), o.internetNotConectedEvent(n))
                      : (e.sendInternetEvent = !0),
                    this.store.dispatch(s.isInternetConnectedAction(t)),
                    setInterval(function () {
                      return i(c, void 0, void 0, function () {
                        var e;
                        return a(this, function (i) {
                          switch (i.label) {
                            case 0:
                              return [4, r.isInternetAvailable()];
                            case 1:
                              return (
                                (e = i.sent()),
                                t !== e &&
                                  ((t = e), this.store.dispatch(s.isInternetConnectedAction(t))),
                                [2]
                              );
                          }
                        });
                      });
                    }, 6e4),
                    [2]
                  );
              }
            });
          });
        }),
        (e.prototype.startTallyCheckTask = function () {
          return i(this, void 0, void 0, function () {
            var e,
              t,
              r,
              o,
              s = this;
            return a(this, function (u) {
              switch (u.label) {
                case 0:
                  ((e = !1), (t = 0), (u.label = 1));
                case 1:
                  return (u.trys.push([1, 3, , 4]), [4, this.tallyService.ping()]);
                case 2:
                  return ((e = u.sent()), [3, 4]);
                case 3:
                  return ((o = u.sent()), (e = !1), (r = o), console.log("Error: ", o), [3, 4]);
                case 4:
                  return (
                    this.store.dispatch(n.isTallyConnectedAction(e, r)),
                    setInterval(function () {
                      return i(s, void 0, void 0, function () {
                        var i, o;
                        return a(this, function (a) {
                          switch (a.label) {
                            case 0:
                              ((i = !1), (a.label = 1));
                            case 1:
                              return (a.trys.push([1, 3, , 4]), [4, this.tallyService.ping()]);
                            case 2:
                              return ((i = a.sent()), [3, 4]);
                            case 3:
                              return ((o = a.sent()), (i = !1), t++, (r = o), [3, 4]);
                            case 4:
                              return (
                                ((!1 === i && 3 === t) || !0 === i) &&
                                  ((t = 0),
                                  e !== i &&
                                    ((e = i), this.store.dispatch(n.isTallyConnectedAction(e, r)))),
                                [2]
                              );
                          }
                        });
                      });
                    }, 6e4),
                    [2]
                  );
              }
            });
          });
        }),
        (e.prototype.checkSystemDatetime = function () {
          return i(this, void 0, void 0, function () {
            var e,
              t,
              r,
              s,
              n = this;
            return a(this, function (u) {
              switch (u.label) {
                case 0:
                  ((e = 144e5), (t = !1), (u.label = 1));
                case 1:
                  return (u.trys.push([1, 3, , 4]), [4, c.isTimeSkewed()]);
                case 2:
                  return ((t = u.sent()), [3, 4]);
                case 3:
                  return (
                    (r = u.sent()),
                    m.Log.error("Error calling time api"),
                    m.Log.error(r),
                    ((s = JSON.stringify(r).toUpperCase()).includes(
                      "SEC_ERROR_OCSP_FUTURE_RESPONSE",
                    ) ||
                      s.includes("ERR_CERT_DATE_INVALID") ||
                      s.includes("CERT_NOT_YET_VALID")) &&
                      (t = !0),
                    [3, 4]
                  );
                case 4:
                  return (
                    !0 === t && this.store.dispatch(o.isInvalidDateTime(t)),
                    setInterval(function () {
                      return i(n, void 0, void 0, function () {
                        var e, r, i;
                        return a(this, function (a) {
                          switch (a.label) {
                            case 0:
                              ((e = !1), (a.label = 1));
                            case 1:
                              return (a.trys.push([1, 3, , 4]), [4, c.isTimeSkewed()]);
                            case 2:
                              return ((e = a.sent()), [3, 4]);
                            case 3:
                              return (
                                (r = a.sent()),
                                m.Log.error("Error calling time api"),
                                m.Log.error(r),
                                (i = JSON.stringify(r).toUpperCase()),
                                (e = !!(
                                  i.includes("SEC_ERROR_OCSP_FUTURE_RESPONSE") ||
                                  i.includes("ERR_CERT_DATE_INVALID") ||
                                  i.includes("CERT_NOT_YET_VALID")
                                )),
                                [3, 4]
                              );
                            case 4:
                              return (
                                t !== e && ((t = e), this.store.dispatch(o.isInvalidDateTime(t))),
                                [2]
                              );
                          }
                        });
                      });
                    }, e),
                    [2]
                  );
              }
            });
          });
        }),
        (e.sendInternetEvent = !0),
        e
      );
    })();
  t.default = d;
};
