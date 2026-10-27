// webpack module #510 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var o = r(10),
    s = r(24),
    n = r(11),
    u = r(29),
    p = r(59),
    c = r(122),
    m = r(2),
    l = r(2701),
    d = r(49),
    y = r(185),
    b = o.getServerCredentials().API_BASE_URL,
    h = b + "/miscellaneous/appversion/latest",
    g = b + "/device/new",
    S = b + "/device";
  ((t.checkUpdateAvailable = function () {
    return i(this, void 0, void 0, function () {
      var e, t, r, i, s;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            return (
              (e = h),
              (t = 0),
              o.isNotNull(y.version) && ((r = y.version), (t = parseInt(r.replace(/\./g, ""), 10))),
              (i = { type: "desktop", ver: t }),
              (s = u.getRequestOptions(e, i)),
              [4, u.getRequest(s)]
            );
          case 1:
            return [2, a.sent()];
        }
      });
    });
  }),
    (t.registerDeviceInfo = function (e) {
      return i(this, void 0, void 0, function () {
        var t, r, i, b, h, S, f, A, N;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              return (
                (t = s.default.get(s.default.DEVICE)),
                o.isNotNull(t) && t.userId === e
                  ? (m.Log.warn("Already register device try to register again"), [2])
                  : ((r = g), [4, c.getSystemHardware()])
              );
            case 1:
              return (
                ((i = a.sent()).userId = e),
                (i.deviceId = l.v1()),
                (i.instanceId = l.v1()),
                (b = { date: new Date().getTime(), version: y.version }),
                (i.versions = [b]),
                delete i.system.freemem,
                [4, d.default.getInstance().getTallyVerisonInfo()]
              );
            case 2:
              return (
                (h = a.sent()),
                o.isNotNull(h) &&
                  o.isNotNull(h.buildNumber) &&
                  ((h.date = m.DateUtil.now()), (i.tallyProductInfo = [h])),
                [
                  4,
                  o.retryFunctionUtilDataFound(
                    p.getStoredSubscription,
                    [],
                    2,
                    12e4,
                    1,
                    "getSubscription",
                  ),
                ]
              );
            case 3:
              return (
                (S = a.sent()),
                o.isNull(S)
                  ? (m.Log.error("Subscription not found from local storage"), [2])
                  : (o.isNotNull(S) &&
                      o.isNotNull(S.subscriptionId) &&
                      (i.subscriptionId = S.subscriptionId),
                    (f = { source: n.default.DESKTOP }),
                    (A = u.getRequestOptions(r, f, i)).headers &&
                      A.headers.deviceid &&
                      delete A.headers.deviceid,
                    [4, u.postRequest(A)])
              );
            case 4:
              return (
                (N = a.sent()),
                o.isNotEmpty(N) && o.isNotEmpty(N.userId) && s.default.set(s.default.DEVICE, i),
                [2, N]
              );
          }
        });
      });
    }),
    (t.updateDeviceInfo = function (e, t) {
      return i(this, void 0, void 0, function () {
        var r, i, c, l, d;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              return (
                (r = S),
                [
                  4,
                  o.retryFunctionUtilDataFound(
                    p.getStoredSubscription,
                    [],
                    2,
                    12e4,
                    1,
                    "getSubscription",
                  ),
                ]
              );
            case 1:
              return (
                (i = a.sent()),
                o.isNull(i)
                  ? (m.Log.error("Subscription not found from local storage"), [2])
                  : (o.isNotNull(i) &&
                      o.isNotNull(i.subscriptionId) &&
                      (e.subscriptionId = i.subscriptionId),
                    (c = { id: t, source: n.default.DESKTOP }),
                    (l = u.getRequestOptions(r, c, e)).headers &&
                      l.headers.deviceid &&
                      delete l.headers.deviceid,
                    [4, u.putRequest(l)])
              );
            case 2:
              return (
                (d = a.sent()),
                m.Log.info("Updated the device on server"),
                o.isNotEmpty(d) &&
                  d.message.toLocaleLowerCase() === n.default.SUCCESS &&
                  (s.default.delete(s.default.DEVICE),
                  s.default.set(s.default.DEVICE, e),
                  m.Log.info("Updated device locally")),
                [2, d]
              );
          }
        });
      });
    }));
};
