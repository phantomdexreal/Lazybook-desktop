// webpack module #650 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var o = r(64),
    s = r(100),
    n = r(24),
    u = r(542),
    p = r(2676),
    c = r(60),
    m = r(11),
    l = r(43),
    d = r(506),
    y = r(502),
    b = r(90),
    h = r(49),
    g = r(144),
    S = r(13),
    f = r(32),
    A = r(28),
    N = r(161),
    I = r(539),
    T = r(2),
    M = r(59),
    v = r(143),
    k = r(651),
    C = r(2682),
    q = (function () {
      function e() {
        var t = this;
        ((this.schedule = function (r) {
          return i(t, void 0, void 0, function () {
            var t,
              o,
              c,
              l,
              d = this;
            return a(this, function (y) {
              if (
                (T.Log.info("Starting the scheduler"),
                (t = v.SYNC_DEFAULT_VALUE),
                (o = n.default.get(n.default.SYNC_SETTINGS, t)),
                T.Util.isEmpty(o) && n.default.set(n.default.SYNC_SETTINGS, t),
                (o = n.default.get(n.default.SYNC_SETTINGS, t)),
                (T.Util.isNull(o) || T.Util.isEmpty(o)) && (o = v.SYNC_DEFAULT_VALUE),
                (c = o.intervalMins),
                !0 === r)
              )
                try {
                  return (
                    console.log("One time sync started"),
                    p.default.getInstance().startSync(),
                    [2]
                  );
                } catch (e) {
                  T.Log.error(e);
                }
              return (
                setInterval(function () {
                  return i(d, void 0, void 0, function () {
                    var t, r, i, o, s, n, u, c;
                    return a(this, function (a) {
                      switch (a.label) {
                        case 0:
                          if (!T.Util.isFilledArray(e.socketEvent)) return [3, 6];
                          if (
                            !(this && this.backgroundWindow && this.backgroundOrderWindow) ||
                            this.backgroundWindow.isSyncing() ||
                            this.backgroundOrderWindow.isSyncing()
                          )
                            return [3, 6];
                          a.label = 1;
                        case 1:
                          return (
                            a.trys.push([1, 5, , 6]),
                            (s = g.default.get()),
                            [4, (n = new A.BackgroundSync(s.id)).deleteAllData()]
                          );
                        case 2:
                          return (
                            a.sent(),
                            (t = new b.default(s.id)),
                            (r = new f.AppSettingMetadata(
                              f.AppSettingMetadata.DATA_ENTRY_SYNC_FROM_WEBSOCKET,
                              m.default.YES,
                            )),
                            [4, t.set(r)]
                          );
                        case 3:
                          return (
                            a.sent(),
                            [
                              4,
                              n.createTempData(
                                I.DATA_ENRTY_SYNC_ACTION,
                                [e.socketEvent.splice(0, e.socketEvent.length)],
                                null,
                                null,
                              ),
                            ]
                          );
                        case 4:
                          return (a.sent(), (u = p.default.getInstance()).startSync(), [3, 6]);
                        case 5:
                          return (
                            (i = a.sent()),
                            T.Log.error("Data entry socket scheduler error"),
                            T.Log.error(i),
                            [3, 6]
                          );
                        case 6:
                          if (
                            !(this && this.backgroundWindow && this.backgroundOrderWindow) ||
                            this.backgroundWindow.isSyncing() ||
                            this.backgroundOrderWindow.isSyncing()
                          )
                            return [3, 13];
                          a.label = 7;
                        case 7:
                          return (
                            a.trys.push([7, 12, , 13]),
                            [4, new k.default().checkAutoReminder()]
                          );
                        case 8:
                          return (
                            (o = a.sent()),
                            T.Util.isFilledArray(o)
                              ? ((s = g.default.get()),
                                [4, (n = new A.BackgroundSync(s.id)).deleteAllData()])
                              : [3, 11]
                          );
                        case 9:
                          return (a.sent(), [4, n.createTempData(I.AUTO_REMINDER, o, s, null)]);
                        case 10:
                          (a.sent(),
                            (u = p.default.getInstance()),
                            T.Log.info("Auto Reminder bgWindow started"),
                            u.startSync(),
                            (a.label = 11));
                        case 11:
                          return [3, 13];
                        case 12:
                          return (
                            (c = a.sent()),
                            T.Log.error("Auto Reminder Sync scheduler error"),
                            T.Log.info(c),
                            [3, 13]
                          );
                        case 13:
                          return [2];
                      }
                    });
                  });
                }, 6e4),
                (l = 1e3),
                s.forever(
                  function (e) {
                    setTimeout(function () {
                      return i(d, void 0, void 0, function () {
                        var t;
                        return a(this, function (r) {
                          if (
                            ((t = g.default.get()),
                            T.Util.isNull(t) || T.Util.isNull(t.id) || T.Util.isNull(t.userToken))
                          )
                            e(void 0);
                          else {
                            (T.Log.info("Local session init done"), (l = 60 * c * 1e3));
                            try {
                              ((this.backgroundOrderWindow = p.default.getInstance()),
                                (this.backgroundWindow = u.default.getInstance()),
                                this.backgroundOrderWindow.isSyncing()
                                  ? e(void 0)
                                  : this.backgroundWindow.startSync(e));
                            } catch (e) {
                              T.Log.error(e);
                            }
                          }
                          return [2];
                        });
                      });
                    }, l);
                  },
                  function (e) {
                    T.Log.info("Terminating the sync process");
                  },
                ),
                [2]
              );
            });
          });
        }),
          (this.schedulerHealthCheck = function () {
            return i(t, void 0, void 0, function () {
              var e = this;
              return a(this, function (t) {
                return (
                  T.Log.info("Starting the restart app scheduler"),
                  36e5,
                  setInterval(function () {
                    return i(e, void 0, void 0, function () {
                      var e, t, r, i, o;
                      return a(this, function (a) {
                        switch (a.label) {
                          case 0:
                            return (
                              a.trys.push([0, 7, , 8]),
                              [4, (e = new y.default("restart-2c9d92d2-2c40-4dd7")).get()]
                            );
                          case 1:
                            return (
                              (t = a.sent()),
                              T.Util.isNotNull(t)
                                ? (T.Log.info("Last restart date " + t.date),
                                  (r = t.date),
                                  T.DateUtil.addDays(r, 1) < T.DateUtil.now() ||
                                  this.canRestartInMorningSlot(r)
                                    ? ((i = new d.default(T.DateUtil.now())), [4, e.set(i)])
                                    : [3, 3])
                                : [3, 4]
                            );
                          case 2:
                            (a.sent(), T.Util.restartApp(S.app), (a.label = 3));
                          case 3:
                            return [3, 6];
                          case 4:
                            return ((i = new d.default(T.DateUtil.now())), [4, e.set(i)]);
                          case 5:
                            (a.sent(), (a.label = 6));
                          case 6:
                            return [3, 8];
                          case 7:
                            return (
                              (o = a.sent()),
                              T.Log.info("schedulerHealthCheck Err" + JSON.stringify(o)),
                              [3, 8]
                            );
                          case 8:
                            return [2];
                        }
                      });
                    });
                  }, 36e5),
                  [2]
                );
              });
            });
          }));
      }
      return (
        (e.getInstance = function () {
          return (T.Util.isNull(e.instance) && (e.instance = new e()), e.instance);
        }),
        (e.prototype.canRestartInMorningSlot = function (e) {
          var t = T.DateUtil.diff(T.DateUtil.Duration.HOUR, e),
            r = T.DateUtil.getHours(),
            i = T.DateUtil.getHours(e);
          return !(i >= 7 && i < 9) && t >= 4 && r >= 7 && r < 9;
        }),
        (e.prototype.stopSync = function () {
          T.Util.isNotNull(this.backgroundWindow) && this.backgroundWindow.stopSync();
        }),
        (e.prototype.getCompanyAndUpdate = function () {
          return i(this, void 0, void 0, function () {
            var e, t, r, i, s, n, u, p, d, y, b;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    a.trys.push([0, 11, , 12]),
                    (e = g.default.get()),
                    [4, h.default.getTallyLicense()]
                  );
                case 1:
                  return (
                    (t = a.sent()),
                    (r = h.default.getInstance()),
                    [4, N.BizAnalystService.getCompaniesByPostgres(e, t)]
                  );
                case 2:
                  return (
                    (i = a.sent()),
                    T.Util.isFilledArray(i.companies)
                      ? [4, (s = l.default.get(new c.default(), e.id)).findAll()]
                      : [3, 10]
                  );
                case 3:
                  ((n = a.sent()), (u = 0), (p = i.companies), (a.label = 4));
                case 4:
                  return u < p.length
                    ? ((d = p[u]),
                      T.Util.isNotNull(d.isResyncRequired) && !0 === d.isResyncRequired
                        ? [4, r.isCompanyOpen(d.tallyCompanyName.trim())]
                        : [3, 7])
                    : [3, 10];
                case 5:
                  return a.sent()
                    ? (T.Log.info(
                        "Scheduler: Resync required for company: " +
                          d.name +
                          ". But company is open in tally. Hence skipping resync.",
                      ),
                      [4, M.deleteDataAndDirectory(e, d, m.default.AUTO_DATA_RESYNC)])
                    : [3, 7];
                case 6:
                  (a.sent(), (a.label = 7));
                case 7:
                  return (
                    (y = o.find(n, { companyId: d.companyId })),
                    T.Util.isNotNull(y) &&
                    T.DateUtil.getTimestampFromDateString(y.serverUpdatedAt, y.timezone) <
                      T.DateUtil.getTimestampFromDateString(d.updatedAt, d.timezone)
                      ? ((d.serverUpdatedAt = d.updatedAt),
                        [4, s.update(d, { where: { companyId: y.companyId } })])
                      : [3, 9]
                  );
                case 8:
                  (a.sent(), (a.label = 9));
                case 9:
                  return (u++, [3, 4]);
                case 10:
                  return [2];
                case 11:
                  return (
                    (b = a.sent()),
                    T.Log.error("Postgres Company get fail"),
                    T.Log.error(b),
                    [3, 12]
                  );
                case 12:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.pingServer = function () {
          return i(this, void 0, void 0, function () {
            return a(this, function (e) {
              switch (e.label) {
                case 0:
                  return [4, C.default.getInstance().pingServer()];
                case 1:
                  return (e.sent(), [2]);
              }
            });
          });
        }),
        (e.socketEvent = []),
        e
      );
    })();
  t.default = q;
};
