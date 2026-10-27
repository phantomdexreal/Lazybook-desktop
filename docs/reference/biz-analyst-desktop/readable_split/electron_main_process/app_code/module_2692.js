// webpack module #2692 (from electron_main_process, BA Mobile Connector 8.4.41)
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
      },
    o = this;
  Object.defineProperty(t, "__esModule", { value: !0 });
  var s = r(254),
    n = r(2693),
    u = r(15),
    p = r(10),
    c = r(11),
    m = r(244),
    l = r(13),
    d = r(167),
    y = r(122),
    b = r(261),
    h = r(2694),
    g = r(2),
    S = r(162),
    f = r(28);
  ((t.fetchDeviceInfo = function (e) {
    return i(o, void 0, void 0, function () {
      var t;
      return a(this, function (r) {
        switch (r.label) {
          case 0:
            return [4, y.getSystemHardware()];
          case 1:
            return ((t = r.sent()), e.dispatch(s.getDeviceInfo(t)), [2]);
        }
      });
    });
  }),
    (t.checkStateAndReact = function (e, t) {
      var r = e.getState();
      if (h.isValidAppState(r)) {
        if (p.isNotNull(r.global)) {
          if (p.isNotNull(r.global.appState) && p.isNotNull(t))
            if (r.global.appState === d.APP_STATE_CLOSE) b.hideWindow(t);
            else if (r.global.appState === d.APP_STATE_MINIMIZE) b.minimizeWindow(t);
            else if (
              r.global.appState === d.APP_STATE_OPEN &&
              (b.isWindowMinimized(t) ? b.maximizeWindow(t) : b.showWindow(t),
              u.platform() === c.default.OS_PLATFORM.windows)
            ) {
              var o = u.release().split(".")[0];
              try {
                "10" === o
                  ? l.shell.openExternal("ms-settings:dateandtime")
                  : n.run("control timedate.cpl");
              } catch (e) {
                (g.Log.error("error while opening the date time setting"),
                  g.Log.error("OS version is Windows " + o),
                  g.Log.error(e));
              }
            }
          !0 === r.global.restartApp && p.restartApp(l.app);
        }
        if (p.isNotNull(r.user) && !0 === r.user.logout) {
          var s = f.User.get();
          p.isNotNull(s) &&
            !p.isEmpty(s) &&
            (function (e, t) {
              i(this, void 0, void 0, function () {
                return a(this, function (r) {
                  switch (r.label) {
                    case 0:
                      return [4, S.logoutUser(e, t)];
                    case 1:
                      return (r.sent(), p.restartApp(l.app), [2]);
                  }
                });
              });
            })(s, r.user.isAutoLogout);
        }
        if (
          (p.isNotNull(r.internet) &&
            (!1 === r.internet.isConnected
              ? m.default.getInstance().setInternetNotConnectedInterval()
              : m.default.getInstance().clearInternetNotConnectedInterval()),
          p.isNotNull(r.dateTimeError) &&
            (!0 === r.dateTimeError.dateTimeError
              ? m.default.getInstance().setDateTimeErrorInterval()
              : m.default.getInstance().clearDateTimeErrorInterval()),
          p.isNotNull(r.tally))
        )
          if (!1 === r.tally.runningStatus) {
            s = r.user.user;
            p.isNotNull(s) &&
              p.isNotNull(s.id) &&
              m.default.getInstance().setTallyNotConnectedInterval();
          } else m.default.getInstance().clearDateTimeErrorInterval();
      }
    }));
};
