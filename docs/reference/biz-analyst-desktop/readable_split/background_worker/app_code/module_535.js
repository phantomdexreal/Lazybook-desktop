// webpack module #535 (from background_worker, BA Mobile Connector 8.4.41)
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
  var i = r(46),
    o = r(35),
    s = r(0),
    u = r(45),
    p = (function () {
      function e() {}
      return (
        (e.getName = function () {
          return e.masterName;
        }),
        (e.prototype.getLedgerFormTallyAndUpdateLocalDb = function (t, r) {
          return n(this, void 0, void 0, function () {
            var n, s, u, p, c, l, m, d;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  ((n = []), (s = o.default.getInstance()), (u = 0), (p = t), (a.label = 1));
                case 1:
                  return u < p.length ? ((c = p[u]), [4, s.getLedgerClosing(c, r)]) : [3, 4];
                case 2:
                  ((l = a.sent()), (n = n.concat(l)), (a.label = 3));
                case 3:
                  return (u++, [3, 1]);
                case 4:
                  return (
                    (m = []),
                    (d = i.groupBy(n, "name")),
                    i.map(d, function (r, n) {
                      if (
                        ((r = r.sort(function (e, t) {
                          return e.startDate - t.startDate;
                        })),
                        t.length === r.length)
                      )
                        m = m.concat(r);
                      else {
                        for (
                          var a = function (t) {
                              if (
                                -1 ===
                                r.findIndex(function (e) {
                                  return e.startDate === t.startDate;
                                })
                              ) {
                                var a = new e();
                                ((a.name = n),
                                  (a.startDate = t.startDate),
                                  (a.endDate = t.endDate),
                                  (a.closingBalance = 0),
                                  r.push(a));
                              }
                            },
                            i = 0,
                            o = t;
                          i < o.length;
                          i++
                        ) {
                          a(o[i]);
                        }
                        m = m.concat(r);
                      }
                    }),
                    [2, m]
                  );
              }
            });
          });
        }),
        (e.prototype.getLedgerClosing = function (e, t) {
          return n(this, void 0, void 0, function () {
            var e, r;
            return a(this, function (n) {
              switch (n.label) {
                case 0:
                  return (
                    (e = this.getMonthList(t)),
                    s.Log.debug("Ledger closing sync " + JSON.stringify(e)),
                    [4, this.getLedgerFormTallyAndUpdateLocalDb(e, t)]
                  );
                case 1:
                  return ((r = n.sent()), [2, this.groupLedgerDetailByLedgerName(r)]);
              }
            });
          });
        }),
        (e.prototype.groupLedgerDetailByLedgerName = function (e) {
          var t = i.groupBy(e, "name"),
            r = {};
          return (
            i.map(t, function (e, t) {
              var n = [];
              (e.forEach(function (e) {
                var t = i.omit(e, ["name", "createdAt", "updatedAt", "_id"]);
                n.push(t);
              }),
                (r[t] = { name: t, details: n }));
            }),
            r
          );
        }),
        (e.prototype.getMonthList = function (e) {
          var t = s.DateUtil.addTimeZone(Math.min(s.DateUtil.now(), e.getEndDate()), e.timezone),
            r = {
              startDate: (t.month() <= 2
                ? t.subtract(2, u.Duration.YEAR).month(3).startOf(u.Duration.MONTH)
                : t.subtract(1, u.Duration.YEAR).month(3).startOf(u.Duration.MONTH)
              ).valueOf(),
              endDate: s.DateUtil.addDate(e.getEndDate(), 1, u.Duration.MONTH, e.timezone),
            };
          return s.DateUtil.getPeriodsBetweenDates(r, u.Duration.MONTH, e.timezone);
        }),
        (e.masterName = "LedgerClosing"),
        e
      );
    })();
  t.default = p;
};
