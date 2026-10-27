// webpack module #1234 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var i =
      (this && this.__assign) ||
      function () {
        return (i =
          Object.assign ||
          function (e) {
            for (var t, r = 1, i = arguments.length; r < i; r++)
              for (var a in (t = arguments[r]))
                Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
            return e;
          }).apply(this, arguments);
      },
    a =
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
    o =
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
  var s = r(64),
    n = r(17),
    u = r(10),
    p = r(43),
    c = r(557),
    m = r(49),
    l = r(2),
    d = r(52),
    y = r(2),
    b = r(32),
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
            i = null;
          return (
            this.isVoucherNull(e) || (r = e.stats),
            this.isVoucherNull(t) || (i = t.stats),
            (!u.isNotNull(r) && !u.isNotNull(i)) ||
              (!(!u.isNotNull(r) || !u.isNotNull(i)) && !!u.isEqual(r, i))
          );
        }),
        (e.prototype.getVouchersFromDB = function (e, t, r) {
          return a(this, void 0, void 0, function () {
            var a, s, c, m;
            return o(this, function (o) {
              switch (o.label) {
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
                              [n.fn("COUNT", n.col("customType")), "total"],
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
                    (s = o.sent()),
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
                    (m = o.sent()),
                    [
                      2,
                      s.concat(m).map(function (e) {
                        return e.date
                          ? i({}, e, { date: l.DateUtil.resetTimeToStartOfDay(e.date) })
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
            return o(this, function (r) {
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
                      return l.TallyUtil.removeNoiseChars(e.customType);
                    }),
                  ];
              }
            });
          });
        }),
        (e.prototype.getMonthsBetweenCompanySyncPeriod = function (e, t) {
          return a(this, void 0, void 0, function () {
            var r, i, a, s, n;
            return o(this, function (o) {
              switch (o.label) {
                case 0:
                  return (
                    (r = e.getStartDate()),
                    (i = e.getEndDate()),
                    y.Log.info(
                      "Deleted Voucher:  Sync From is " +
                        l.DateUtil.formatDDMMMYYYY(r, e.timezone) +
                        " SyncTill is " +
                        l.DateUtil.formatDDMMMYYYY(i, e.timezone),
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
                    (a = o.sent()),
                    (s = 0),
                    u.isFilledArray(a) && u.isNumber(a[0].maxDate) && (s = a[0].maxDate),
                    (n = { startDate: r, endDate: Math.max(i, s) }),
                    [2, l.DateUtil.getPeriodsBetweenDates(n, d.Duration.MONTH, e.timezone)]
                  );
              }
            });
          });
        }),
        (e.prototype.debugLog = function (e, t, r) {
          var i = "Function: " + e + " VariableName: " + t + " Data: " + r;
          y.Log.debug(JSON.stringify(i));
        }),
        (e.prototype.syncVoucherWithTally = function (e, t, r) {
          return a(this, void 0, void 0, function () {
            var i;
            return o(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (i = new b.Voucher()),
                    [4, new c.default(t, i, e).syncWithTallyByDay(i, r)]
                  );
                case 1:
                  return (a.sent(), [2]);
              }
            });
          });
        }),
        (e.prototype.compareTallyData = function (e, t, r) {
          var s = this,
            n = [],
            u = this.createMapForVoucherStats(t),
            p = this.createMapForVoucherStats(r);
          return (
            e.forEach(function (e) {
              return a(s, void 0, void 0, function () {
                var t, r;
                return o(this, function (a) {
                  return (
                    (t = u.get(e.startDate)),
                    (r = p.get(e.startDate)),
                    this.isEqual(t, r) ||
                      (this.debugLog("compareTallyData", "selectedLocalVoucher", JSON.stringify(t)),
                      this.debugLog("compareTallyData", "selectedTallyVoucher", JSON.stringify(r)),
                      n.push(i({}, e))),
                    [2]
                  );
                });
              });
            }),
            n
          );
        }),
        (e.prototype.deletedVoucherSync = function (e, t) {
          return a(this, void 0, void 0, function () {
            var r, i, a, s, n, p, c, b, h, g, S, f, A, N, I, T, M, v;
            return o(this, function (o) {
              switch (o.label) {
                case 0:
                  return (
                    o.trys.push([0, 13, , 14]),
                    [4, this.getMonthsBetweenCompanySyncPeriod(e, t)]
                  );
                case 1:
                  return (
                    (r = o.sent()),
                    u.isFilledArray(r)
                      ? [4, this.getUniqueCustomTypes(e, t)]
                      : (y.Log.warn("Deleted Voucher: no months found for sync."), [2])
                  );
                case 2:
                  if (((i = o.sent()), !u.isFilledArray(i)))
                    return (y.Log.warn("Deleted Voucher: no voucher found in bizanalyst."), [2]);
                  ((a = []), (s = 0), (n = r), (o.label = 3));
                case 3:
                  return s < n.length
                    ? ((p = n[s]),
                      console.log(
                        "Checking for month: " +
                          l.DateUtil.formatDDMMMYYYY(p.startDate, e.timezone),
                      ),
                      [4, this.getVouchersFromDB(e, t, p)])
                    : [3, 8];
                case 4:
                  return (
                    (c = o.sent()),
                    (b = this.getLocalVoucherCount(c, p)),
                    [4, (h = m.default.getInstance()).getVoucherStatistics([p], e, i)]
                  );
                case 5:
                  return (
                    (g = o.sent()),
                    this.debugLog("deletedVoucherSync", "Month", JSON.stringify(p)),
                    this.debugLog("deletedVoucherSync", "groupVoucherByType", JSON.stringify(b)),
                    this.debugLog("deletedVoucherSync", "tallyMonthlyList", JSON.stringify(g)),
                    u.isArray(g)
                      ? !0 === this.isEqual(b, g[0])
                        ? [3, 7]
                        : ((S = l.DateUtil.getPeriodsBetweenDates(p, d.Duration.DAY, e.timezone)),
                          (f = void 0),
                          [4, h.getVoucherStatistics(S, e, i)])
                      : (y.Log.info("Deleted Voucher: unable to parse respoce from tally"), [3, 8])
                  );
                case 6:
                  ((A = o.sent()),
                    u.isFilledArray(c) && (f = this.getLocalVoucherGroupedByDay(c, S)),
                    (N = this.compareTallyData(S, f, A)),
                    (a = a.concat(N)),
                    (o.label = 7));
                case 7:
                  return (s++, [3, 3]);
                case 8:
                  ((I = 0), (T = a), (o.label = 9));
                case 9:
                  return I < T.length
                    ? ((M = T[I]), [4, this.syncVoucherWithTally(e, t, M.startDate)])
                    : [3, 12];
                case 10:
                  (o.sent(), (o.label = 11));
                case 11:
                  return (I++, [3, 9]);
                case 12:
                  return (y.Log.info("Deleted Voucher: Synced successfully"), [3, 14]);
                case 13:
                  throw ((v = o.sent()), y.Log.exception(v, "Deleted Voucher: "), v);
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
            for (var r = {}, i = 0, a = e; i < a.length; i++) {
              var o = a[i],
                s = l.TallyUtil.removeNoiseChars(o.customType),
                n = r[s];
              u.isNotNull(n) ? (r[s] = n + o.total) : (r[s] = o.total);
            }
            return { date: t, stats: r };
          }
        }),
        (e.prototype.getLocalVoucherGroupedByDay = function (e, t) {
          var r = this;
          if (u.isFilledArray(e) && u.isFilledArray(t)) {
            var i = new Map();
            t.forEach(function (e) {
              i.set(e.startDate, e);
            });
            var a = [],
              o = s.groupBy(e, "date");
            return (
              s.map(o, function (e, t) {
                var o = i.get(parseInt(t, 10));
                if (!u.isNotNull(o))
                  throw (
                    y.Log.info("selectedDay : " + JSON.stringify(o)),
                    y.Log.info("groupDate : " + JSON.stringify(t)),
                    new Error("Date not found please report to developer")
                  );
                var s = r.getLocalVoucherCount(e, o);
                a.push(s);
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
