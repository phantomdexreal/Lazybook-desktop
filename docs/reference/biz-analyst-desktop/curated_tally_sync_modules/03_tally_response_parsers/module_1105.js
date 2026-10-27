// webpack module #1105 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

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
              for (; o; )
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
                      return o.label++, { value: i[1], done: !1 };
                    case 5:
                      o.label++, (n = i[1]), (i = [0]);
                      continue;
                    case 7:
                      (i = o.ops.pop()), o.trys.pop();
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
                        (o.label = a[1]), (a = i);
                        break;
                      }
                      if (a && o.label < a[2]) {
                        (o.label = a[2]), o.ops.push(i);
                        break;
                      }
                      a[2] && o.ops.pop(), o.trys.pop();
                      continue;
                  }
                  i = t.call(e, o);
                } catch (e) {
                  (i = [6, e]), (n = 0);
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
  var o = r(46),
    s = r(13),
    u = r(11),
    p = r(30),
    c = r(205),
    l = r(35),
    m = r(0),
    d = r(45),
    y = r(0),
    b = r(28),
    h = (function () {
      function e() {}
      return (
        (e.prototype.createMapForVoucherStats = function (e) {
          Array.isArray(e) || (e = []);
          var t = new Map();
          return (
            e.forEach(function (e) {
              t.set(e.date.startDate, e);
            }),
            t
          );
        }),
        (e.prototype.isVoucherNull = function (e) {
          return !!u.isEmptyObject(e) || !!u.isEmptyObject(e.stats);
        }),
        (e.prototype.isEqual = function (e, t) {
          var r = null,
            n = null;
          return (
            this.isVoucherNull(e) || (r = e.stats),
            this.isVoucherNull(t) || (n = t.stats),
            (!u.isNotNull(r) && !u.isNotNull(n)) ||
              (!(!u.isNotNull(r) || !u.isNotNull(n)) && !!u.isEqual(r, n))
          );
        }),
        (e.prototype.getVouchersFromDB = function (e, t, r) {
          return a(this, void 0, void 0, function () {
            var a, o, c, l;
            return i(this, function (i) {
              switch (i.label) {
                case 0:
                  return (
                    (a = p.default.get(new b.Voucher(), t, e)),
                    u.isNull(r)
                      ? (y.Log.info("Deleted Voucher: no date found for sync "), [2])
                      : [
                          4,
                          a.findAll({
                            group: ["customType", "date"],
                            attributes: [
                              "customType",
                              [s.fn("COUNT", s.col("customType")), "total"],
                              "date",
                            ],
                            where: {
                              date: { $between: [r.startDate, r.endDate] },
                              isDeleted: !1,
                              parentId: { $eq: null },
                            },
                          }),
                        ]
                  );
                case 1:
                  return (
                    (o = i.sent()),
                    (c =
                      "select customType, count(customType) as total, date\n            from (select distinct(parentId), customType, date\n            from vouchers\n            where parentId is not null and date between " +
                      r.startDate +
                      " and " +
                      r.endDate +
                      " and isDeleted = '0')\n            group by customType, date"),
                    [4, a.executeRawQuery(c)]
                  );
                case 2:
                  return (
                    (l = i.sent()),
                    [
                      2,
                      o.concat(l).map(function (e) {
                        return e.date
                          ? n({}, e, { date: m.DateUtil.resetTimeToStartOfDay(e.date) })
                          : e;
                      }),
                    ]
                  );
              }
            });
          });
        }),
        (e.prototype.getUniqueCustomTypes = function (e, t) {
          return a(this, void 0, void 0, function () {
            return i(this, function (r) {
              switch (r.label) {
                case 0:
                  return [
                    4,
                    p.default
                      .get(new b.Voucher(), t, e)
                      .findAll({
                        group: ["customType"],
                        attributes: ["customType"],
                        where: { isDeleted: !1 },
                      }),
                  ];
                case 1:
                  return [
                    2,
                    r.sent().map(function (e) {
                      return m.TallyUtil.removeNoiseChars(e.customType);
                    }),
                  ];
              }
            });
          });
        }),
        (e.prototype.getMonthsBetweenCompanySyncPeriod = function (e, t) {
          return a(this, void 0, void 0, function () {
            var r, n, a, o, s;
            return i(this, function (i) {
              switch (i.label) {
                case 0:
                  return (
                    (r = e.getStartDate()),
                    (n = e.getEndDate()),
                    y.Log.info(
                      "Deleted Voucher:  Sync From is " +
                        m.DateUtil.formatDDMMMYYYY(r, e.timezone) +
                        " SyncTill is " +
                        m.DateUtil.formatDDMMMYYYY(n, e.timezone)
                    ),
                    [
                      4,
                      p.default
                        .get(new b.Voucher(), t, e)
                        .max("date", "maxDate", { isDeleted: !1 }),
                    ]
                  );
                case 1:
                  return (
                    (a = i.sent()),
                    (o = 0),
                    u.isFilledArray(a) && u.isNumber(a[0].maxDate) && (o = a[0].maxDate),
                    (s = { startDate: r, endDate: Math.max(n, o) }),
                    [2, m.DateUtil.getPeriodsBetweenDates(s, d.Duration.MONTH, e.timezone)]
                  );
              }
            });
          });
        }),
        (e.prototype.debugLog = function (e, t, r) {
          var n = "Function: " + e + " VariableName: " + t + " Data: " + r;
          y.Log.debug(JSON.stringify(n));
        }),
        (e.prototype.syncVoucherWithTally = function (e, t, r) {
          return a(this, void 0, void 0, function () {
            var n;
            return i(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (n = new b.Voucher()), [4, new c.default(t, n, e).syncWithTallyByDay(n, r)]
                  );
                case 1:
                  return a.sent(), [2];
              }
            });
          });
        }),
        (e.prototype.compareTallyData = function (e, t, r) {
          var o = this,
            s = [],
            u = this.createMapForVoucherStats(t),
            p = this.createMapForVoucherStats(r);
          return (
            e.forEach(function (e) {
              return a(o, void 0, void 0, function () {
                var t, r;
                return i(this, function (a) {
                  return (
                    (t = u.get(e.startDate)),
                    (r = p.get(e.startDate)),
                    this.isEqual(t, r) ||
                      (this.debugLog("compareTallyData", "selectedLocalVoucher", JSON.stringify(t)),
                      this.debugLog("compareTallyData", "selectedTallyVoucher", JSON.stringify(r)),
                      s.push(n({}, e))),
                    [2]
                  );
                });
              });
            }),
            s
          );
        }),
        (e.prototype.deletedVoucherSync = function (e, t) {
          return a(this, void 0, void 0, function () {
            var r, n, a, o, s, p, c, b, h, f, g, M, S, A, O, N, v, T;
            return i(this, function (i) {
              switch (i.label) {
                case 0:
                  return (
                    i.trys.push([0, 13, , 14]), [4, this.getMonthsBetweenCompanySyncPeriod(e, t)]
                  );
                case 1:
                  return (
                    (r = i.sent()),
                    u.isFilledArray(r)
                      ? [4, this.getUniqueCustomTypes(e, t)]
                      : (y.Log.warn("Deleted Voucher: no months found for sync."), [2])
                  );
                case 2:
                  if (((n = i.sent()), !u.isFilledArray(n)))
                    return y.Log.warn("Deleted Voucher: no voucher found in bizanalyst."), [2];
                  (a = []), (o = 0), (s = r), (i.label = 3);
                case 3:
                  return o < s.length
                    ? ((p = s[o]),
                      console.log(
                        "Checking for month: " + m.DateUtil.formatDDMMMYYYY(p.startDate, e.timezone)
                      ),
                      [4, this.getVouchersFromDB(e, t, p)])
                    : [3, 8];
                case 4:
                  return (
                    (c = i.sent()),
                    (b = this.getLocalVoucherCount(c, p)),
                    [4, (h = l.default.getInstance()).getVoucherStatistics([p], e, n)]
                  );
                case 5:
                  return (
                    (f = i.sent()),
                    this.debugLog("deletedVoucherSync", "Month", JSON.stringify(p)),
                    this.debugLog("deletedVoucherSync", "groupVoucherByType", JSON.stringify(b)),
                    this.debugLog("deletedVoucherSync", "tallyMonthlyList", JSON.stringify(f)),
                    u.isArray(f)
                      ? !0 === this.isEqual(b, f[0])
                        ? [3, 7]
                        : ((g = m.DateUtil.getPeriodsBetweenDates(p, d.Duration.DAY, e.timezone)),
                          (M = void 0),
                          [4, h.getVoucherStatistics(g, e, n)])
                      : (y.Log.info("Deleted Voucher: unable to parse respoce from tally"), [3, 8])
                  );
                case 6:
                  (S = i.sent()),
                    u.isFilledArray(c) && (M = this.getLocalVoucherGroupedByDay(c, g)),
                    (A = this.compareTallyData(g, M, S)),
                    (a = a.concat(A)),
                    (i.label = 7);
                case 7:
                  return o++, [3, 3];
                case 8:
                  (O = 0), (N = a), (i.label = 9);
                case 9:
                  return O < N.length
                    ? ((v = N[O]), [4, this.syncVoucherWithTally(e, t, v.startDate)])
                    : [3, 12];
                case 10:
                  i.sent(), (i.label = 11);
                case 11:
                  return O++, [3, 9];
                case 12:
                  return y.Log.info("Deleted Voucher: Synced successfully"), [3, 14];
                case 13:
                  throw ((T = i.sent()), y.Log.exception(T, "Deleted Voucher: "), T);
                case 14:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.getLocalVoucherCount = function (e, t) {
          if (u.isNull(t) || u.isNull(t.startDate) || u.isNull(t.endDate))
            throw new Error("Date is required for deleted voucher sync");
          if (u.isFilledArray(e)) {
            for (var r = {}, n = 0, a = e; n < a.length; n++) {
              var i = a[n],
                o = m.TallyUtil.removeNoiseChars(i.customType),
                s = r[o];
              u.isNotNull(s) ? (r[o] = s + i.total) : (r[o] = i.total);
            }
            return { date: t, stats: r };
          }
        }),
        (e.prototype.getLocalVoucherGroupedByDay = function (e, t) {
          var r = this;
          if (u.isFilledArray(e) && u.isFilledArray(t)) {
            var n = new Map();
            t.forEach(function (e) {
              n.set(e.startDate, e);
            });
            var a = [],
              i = o.groupBy(e, "date");
            return (
              o.map(i, function (e, t) {
                var i = n.get(parseInt(t, 10));
                if (!u.isNotNull(i))
                  throw (
                    (y.Log.info("selectedDay : " + JSON.stringify(i)),
                    y.Log.info("groupDate : " + JSON.stringify(t)),
                    new Error("Date not found please report to developer"))
                  );
                var o = r.getLocalVoucherCount(e, i);
                a.push(o);
              }),
              a
            );
          }
        }),
        e
      );
    })();
  t.default = h;
};
