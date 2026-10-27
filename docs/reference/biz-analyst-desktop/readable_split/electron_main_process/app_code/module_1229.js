// webpack module #1229 (from electron_main_process, BA Mobile Connector 8.4.41)
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
    s = r(49),
    n = r(2),
    u = r(52),
    p = (function () {
      function e() {}
      return (
        (e.getName = function () {
          return e.masterName;
        }),
        (e.prototype.getLedgerFormTallyAndUpdateLocalDb = function (t, r) {
          return i(this, void 0, void 0, function () {
            var i, n, u, p, c, m, l, d;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  ((i = []), (n = s.default.getInstance()), (u = 0), (p = t), (a.label = 1));
                case 1:
                  return u < p.length ? ((c = p[u]), [4, n.getLedgerClosing(c, r)]) : [3, 4];
                case 2:
                  ((m = a.sent()), (i = i.concat(m)), (a.label = 3));
                case 3:
                  return (u++, [3, 1]);
                case 4:
                  return (
                    (l = []),
                    (d = o.groupBy(i, "name")),
                    o.map(d, function (r, i) {
                      if (
                        ((r = r.sort(function (e, t) {
                          return e.startDate - t.startDate;
                        })),
                        t.length === r.length)
                      )
                        l = l.concat(r);
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
                                ((a.name = i),
                                  (a.startDate = t.startDate),
                                  (a.endDate = t.endDate),
                                  (a.closingBalance = 0),
                                  r.push(a));
                              }
                            },
                            o = 0,
                            s = t;
                          o < s.length;
                          o++
                        ) {
                          a(s[o]);
                        }
                        l = l.concat(r);
                      }
                    }),
                    [2, l]
                  );
              }
            });
          });
        }),
        (e.prototype.getLedgerClosing = function (e, t) {
          return i(this, void 0, void 0, function () {
            var e, r;
            return a(this, function (i) {
              switch (i.label) {
                case 0:
                  return (
                    (e = this.getMonthList(t)),
                    n.Log.debug("Ledger closing sync " + JSON.stringify(e)),
                    [4, this.getLedgerFormTallyAndUpdateLocalDb(e, t)]
                  );
                case 1:
                  return ((r = i.sent()), [2, this.groupLedgerDetailByLedgerName(r)]);
              }
            });
          });
        }),
        (e.prototype.groupLedgerDetailByLedgerName = function (e) {
          var t = o.groupBy(e, "name"),
            r = {};
          return (
            o.map(t, function (e, t) {
              var i = [];
              (e.forEach(function (e) {
                var t = o.omit(e, ["name", "createdAt", "updatedAt", "_id"]);
                i.push(t);
              }),
                (r[t] = { name: t, details: i }));
            }),
            r
          );
        }),
        (e.prototype.getMonthList = function (e) {
          var t = n.DateUtil.addTimeZone(Math.min(n.DateUtil.now(), e.getEndDate()), e.timezone),
            r = {
              startDate: (t.month() <= 2
                ? t.subtract(2, u.Duration.YEAR).month(3).startOf(u.Duration.MONTH)
                : t.subtract(1, u.Duration.YEAR).month(3).startOf(u.Duration.MONTH)
              ).valueOf(),
              endDate: n.DateUtil.addDate(e.getEndDate(), 1, u.Duration.MONTH, e.timezone),
            };
          return n.DateUtil.getPeriodsBetweenDates(r, u.Duration.MONTH, e.timezone);
        }),
        (e.masterName = "LedgerClosing"),
        e
      );
    })();
  t.default = p;
};
