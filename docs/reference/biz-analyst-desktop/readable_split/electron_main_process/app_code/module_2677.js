// webpack module #2677 (from electron_main_process, BA Mobile Connector 8.4.41)
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
    s = r(651),
    n = r(2678),
    u = r(60),
    p = r(11),
    c = r(2679),
    m = r(43),
    l = r(2680),
    d = r(558),
    y = r(2),
    b = r(52),
    h = r(2681),
    g = r(652),
    S = r(32),
    f = r(161),
    A = r(90),
    N = r(59),
    I = (function () {
      function e() {}
      return (
        (e.getName = function () {
          return e.masterName;
        }),
        (e.syncPendingBills = function (t, r) {
          return i(this, void 0, void 0, function () {
            var i, o, n, u, c, l;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  if (!y.Util.isFilledArray(t)) return [3, 10];
                  ((i = 0), (o = t), (a.label = 1));
                case 1:
                  if (!(i < o.length)) return [3, 10];
                  if (
                    ((n = o[i]),
                    (u = n.company),
                    (c = n.autoReminderSettings),
                    !y.Util.isNotNull(c))
                  )
                    return [3, 9];
                  a.label = 2;
                case 2:
                  return (a.trys.push([2, 7, , 9]), [4, e.checkRetry(u, r)]);
                case 3:
                  return a.sent()
                    ? [2]
                    : (y.Log.info(
                        "Auto Reminder Execution started for company : " + u.tallyCompanyName,
                      ),
                      [4, e.getPendingBillsWithOnAccountBalance(r, u, c)]);
                case 4:
                  return (
                    a.sent(),
                    (c.syncDateTime =
                      y.DateUtil.getStartOfDate(
                        y.DateUtil.addDays(y.DateUtil.now(u.timezone), 1),
                        b.Duration.DAY,
                        u.timezone,
                      ) + c.time),
                    (c.status = p.default.AUTO_REMINDER_STATUS.READY),
                    (c.jobId = null),
                    (c.syncStatus = null),
                    (c.ledgerList = null),
                    (c.endDateTime = y.DateUtil.addDate(
                      c.syncDateTime,
                      p.default.HOURS_LIMIT_FOR_AUTO_REMINDER,
                      b.Duration.HOUR,
                    )),
                    [4, m.default.getV1(s.default, r.id, u).update(c, { where: { _id: c._id } })]
                  );
                case 5:
                  return (a.sent(), [4, e.deleteExsitingRetry(u, r)]);
                case 6:
                  return (a.sent(), [3, 9]);
                case 7:
                  return ((l = a.sent()), [4, e.addToRetry(u, r)]);
                case 8:
                  return (
                    a.sent(),
                    y.Log.error(
                      "Get Pending Bills With OnAccount Balance Sync failed with error :" +
                        y.Util.getErrorMessage(l),
                    ),
                    [3, 9]
                  );
                case 9:
                  return (i++, [3, 1]);
                case 10:
                  return [2];
              }
            });
          });
        }),
        (e.getPendingBillsWithOnAccountBalance = function (t, r, o) {
          return i(this, void 0, void 0, function () {
            var i, u, c, l, d, b, h, S, f, A, N, I, T, M;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  if (!this.checkAutoReminderEnabled(r)) return [3, 27];
                  a.label = 1;
                case 1:
                  if (
                    (a.trys.push([1, 26, , 27]),
                    (i = m.default.getV1(s.default, t.id, r)),
                    (u = m.default.getV1(e, t.id, r)),
                    (c = m.default.getV1(n.default, t.id, r)),
                    ![p.default.AUTO_REMINDER_STATUS.DB_INSERT].includes(o.status))
                  )
                    return [3, 6];
                  (y.Log.info(
                    "Processing data in chunk to send on server as it's exceeds the size of request",
                  ),
                    (a.label = 2));
                case 2:
                  return [4, u.findAll({ limit: 500 })];
                case 3:
                  return (
                    (l = a.sent()),
                    y.Util.isNull(l) || 0 === l.length
                      ? [3, 5]
                      : [4, this.dataExceedMaxLimitProcessing(t, r, o)]
                  );
                case 4:
                  return (a.sent(), [3, 2]);
                case 5:
                  return [3, 23];
                case 6:
                  return [4, e.clearAllLedgerOutstandingBillData(t, r)];
                case 7:
                  return (a.sent(), [4, e.checkForReadyState(o, t, r, i, c)]);
                case 8:
                  return (
                    (d = a.sent()),
                    y.Util.isNull(d) ||
                    y.Util.isNull(d.autoReminderSetting) ||
                    y.Util.isNull(d.company)
                      ? (y.Log.info("Invalid data received from checkForReadyState function"), [2])
                      : ((o = d.autoReminderSetting),
                        (r = d.company),
                        y.Util.isNull(o.jobId)
                          ? (y.Log.info("Job not found for the day"), [2])
                          : [4, e.getOutstandingBills(t, r, c)])
                  );
                case 9:
                  return (
                    (b = a.sent()),
                    (h = b.oldLedgerList),
                    (S = b.outstandingBills),
                    (f = b.baseAmountSettingLedgers),
                    (A = b.lastPaymentSettingLedgers),
                    y.Util.isFilledArray(S)
                      ? (y.Log.info("Outstandings found"),
                        [4, e.sendOutstandingBillsForCompany(t, r, S, o, u, i)])
                      : [3, 11]
                  );
                case 10:
                  return (a.sent(), [3, 15]);
                case 11:
                  (y.Log.info("No Outstandings found"), (a.label = 12));
                case 12:
                  return (
                    a.trys.push([12, 14, , 15]),
                    [4, g.sendNoOutstandingsForToday(t, r.companyId, o.jobId)]
                  );
                case 13:
                  return (a.sent(), [3, 15]);
                case 14:
                  throw (
                    (N = a.sent()),
                    y.Log.info("sendNoOutstandingsForToday error: " + y.Util.getErrorMessage(N)),
                    N
                  );
                case 15:
                  if (!y.Util.isFilledArray(f) && !y.Util.isFilledArray(A)) return [3, 19];
                  (y.Log.info("Ledgers not sent due to Additional settings Found"), (a.label = 16));
                case 16:
                  return (
                    a.trys.push([16, 18, , 19]),
                    [4, g.saveAdditionalSettingRejectedLedgers(t, r.companyId, o.jobId, A, f)]
                  );
                case 17:
                  return (a.sent(), [3, 19]);
                case 18:
                  throw (
                    (I = a.sent()),
                    y.Log.error(
                      "saveAdditionalSettingRejectedLedgers API Call Error :" +
                        y.Util.getErrorMessage(I),
                    ),
                    I
                  );
                case 19:
                  if ((y.Log.info("Updated to the server"), !y.Util.isFilledArray(h)))
                    return [3, 23];
                  (y.Log.info("Master Name changes Found"), (a.label = 20));
                case 20:
                  return (a.trys.push([20, 22, , 23]), [4, g.updateMasterName(t, r.companyId, h)]);
                case 21:
                  return (a.sent(), [3, 23]);
                case 22:
                  return (
                    (T = a.sent()),
                    y.Log.error("updateMasterName API Call Error :" + y.Util.getErrorMessage(T)),
                    [3, 23]
                  );
                case 23:
                  return [4, n.default.clearAllLedgerJobData(t, r)];
                case 24:
                  return (
                    a.sent(),
                    (o.status = p.default.AUTO_REMINDER_STATUS.DONE),
                    [4, i.update(o, { where: { _id: o._id } })]
                  );
                case 25:
                  return (
                    a.sent(),
                    y.Log.info("Auto Reminder sent for company :" + r.tallyCompanyName),
                    [2]
                  );
                case 26:
                  throw (
                    (M = a.sent()),
                    y.Log.error(
                      "Get PendingBills With OnAccount Balance function Error :" +
                        y.Util.getErrorMessage(M),
                    ),
                    M
                  );
                case 27:
                  return [2];
              }
            });
          });
        }),
        (e.checkForReadyState = function (t, r, o, u, c) {
          return i(this, void 0, void 0, function () {
            var i;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return t.status !== p.default.AUTO_REMINDER_STATUS.IN_PROGRESS
                    ? [3, 5]
                    : [4, n.default.clearAllLedgerJobData(r, o)];
                case 1:
                  return (a.sent(), [4, e.getLedgersForScheduledJob(r, o, c, t.time)]);
                case 2:
                  return (
                    (i = a.sent()),
                    y.Util.isNull(i)
                      ? [2, { company: o, autoReminderSetting: t }]
                      : ((t.jobId = i.jobScheduleForToday),
                        (t.status = p.default.AUTO_REMINDER_STATUS.LEDGER_LIST_FETCHED),
                        [4, u.update(t, { where: { _id: t._id } })])
                  );
                case 3:
                  return (
                    a.sent(),
                    y.Util.isNotNull(i) && y.Util.isNotNull(i.autoReminderSettings)
                      ? [4, new s.default(r, o).updateAutoReminderSettingsForCompany(i)]
                      : [3, 5]
                  );
                case 4:
                  if (
                    ((o = a.sent()),
                    y.Util.isNotNull(i.isBeforeScheduledCalled) && !0 === i.isBeforeScheduledCalled)
                  )
                    throw new Error("Job has been called before scheduled time");
                  a.label = 5;
                case 5:
                  return [2, { company: o, autoReminderSetting: t }];
              }
            });
          });
        }),
        (e.getOutstandingBills = function (t, r, u) {
          return i(this, void 0, void 0, function () {
            var i,
              p,
              c,
              l,
              d,
              h,
              g,
              f,
              A,
              N,
              I,
              T,
              M,
              v,
              k,
              C,
              q,
              R,
              D,
              E,
              x,
              O,
              z,
              P,
              L,
              w,
              _,
              U,
              B,
              F,
              G,
              V,
              W,
              j;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (i = m.default.get(new S.Voucher(), t.id, r)),
                    (p = r.companySettings.autoReminderSettings),
                    [4, u.findAll()]
                  );
                case 1:
                  return ((c = a.sent()), [4, e.checkAllLedgersFlagForOldVersion(p, r)]);
                case 2:
                  return ((l = a.sent()), [4, e.getGroupsByParent(t, r)]);
                case 3:
                  return (
                    (d = a.sent()),
                    y.Util.isFilledArray(c) || l
                      ? [4, e.getDataFromTallyAndLocalDB(t, r)]
                      : (y.Log.info("No ledger settings found from server"), [2])
                  );
                case 4:
                  ((h = a.sent()),
                    (g = h.tallyOutstandingBills),
                    (f = h.tallyOnAcccountBalanceForLedgers),
                    (A = h.localDBLedgers),
                    (N = []),
                    (I = []),
                    (T = []),
                    (M = []),
                    (v = e.getAdditionalSettingsData(p)),
                    (k = v.baseAmountSetting),
                    (C = v.sendBillAfterlastPaymentReceivedSetting),
                    (q = o.groupBy(g, "ledgerName")),
                    (R = 0),
                    (D = Object.keys(q)),
                    (a.label = 5));
                case 5:
                  return R < D.length
                    ? ((E = D[R]),
                      (x = []),
                      l
                        ? x.push({
                            companyId: r.companyId,
                            ledgerName: E,
                            status: n.LedgerStatus.ACTIVE,
                            period: p.period,
                            modeOfReminder: s.ModeOfReminder.EMAIL,
                          })
                        : (x = e.getLedgerList(c, E)),
                      y.Util.isFilledArray(x)
                        ? ((O = o.find(A, { name: E })),
                          y.Util.isNull(O) && (O = o.find(A, { oldName: E })),
                          y.Util.isNull(O)
                            ? [3, 13]
                            : y.Util.isNotNull(O.isBillWiseOff) && !0 === O.isBillWiseOff
                              ? (y.Log.info(
                                  "Skipping ledger because of isBillWiseOff setting is " +
                                    O.isBillWiseOff +
                                    " for " +
                                    O.name,
                                ),
                                [3, 13])
                              : y.Util.isNotNull(C) && y.Util.isPositiveNumber(C)
                                ? [4, e.checkForLatestReceipt(i, E, C, r.timezone)]
                                : [3, 7])
                        : [3, 13])
                    : [3, 14];
                case 6:
                  if (a.sent()) return (T.push.apply(T, x), [3, 13]);
                  a.label = 7;
                case 7:
                  return (
                    (z = o.find(f, { ledgerName: E })),
                    (P = y.DateUtil.getStartOfDate(
                      y.DateUtil.now(r.timezone),
                      b.Duration.DAY,
                      r.timezone,
                    )),
                    (L = q),
                    (w = E),
                    [4, e.formattingTheBills(q[E], P)]
                  );
                case 8:
                  ((L[w] = a.sent()), (_ = 0), (U = x), (a.label = 9));
                case 9:
                  return _ < U.length
                    ? ((B = U[_]),
                      (F = !1),
                      y.Util.isNotNull(B.modeOfReminder) &&
                      B.modeOfReminder === s.ModeOfReminder.EMAIL
                        ? ((G = y.Util.isNotNull(p.emailSetting) ? p.emailSetting : p),
                          (F = y.Util.isNotNull(G.sendOnlyDueBills)
                            ? G.sendOnlyDueBills
                            : !!y.Util.isNotNull(p.sendOnlyDueBills) && p.sendOnlyDueBills))
                        : y.Util.isNotNull(B.modeOfReminder) &&
                            B.modeOfReminder === s.ModeOfReminder.SMS
                          ? ((V = y.Util.isNotNull(p.smsSetting) ? p.smsSetting : {}),
                            (F = !!y.Util.isNotNull(V.sendOnlyDueBills) && V.sendOnlyDueBills))
                          : y.Util.isNotNull(B.modeOfReminder) &&
                            B.modeOfReminder === s.ModeOfReminder.WHATS_APP &&
                            ((W = y.Util.isNotNull(p.whatsAppSetting) ? p.whatsAppSetting : {}),
                            (F = !!y.Util.isNotNull(W.sendOnlyDueBills) && W.sendOnlyDueBills)),
                      ((j = new e()).customerName = E),
                      ((j = e.addCustomerContactForLedger(j, O)).modeOfReminder = B.modeOfReminder),
                      e.checkLedgerByParentGroup(d, O)
                        ? [4, e.checkLedgerSettingsForOutstanding(r, B, q[E], P)]
                        : [3, 12])
                    : [3, 13];
                case 10:
                  return a.sent() ? [4, e.getOutstandingBillsForLedger(j, F, q[E], P, z)] : [3, 12];
                case 11:
                  if (((j = a.sent()), y.Util.isNull(j))) return [3, 12];
                  if (
                    (y.Util.isNotNull(O.oldName) &&
                      O.oldName === B.ledgerName &&
                      I.push({ oldLedgerName: O.oldName, newLedgerName: O.name }),
                    y.Util.isNotNull(j.total) && j.total > 0)
                  ) {
                    if (y.Util.isNotNull(k) && y.Util.isPositiveNumber(k) && j.total <= k)
                      return (M.push(B), [3, 12]);
                    N.push(j);
                  }
                  a.label = 12;
                case 12:
                  return (_++, [3, 9]);
                case 13:
                  return (R++, [3, 5]);
                case 14:
                  return [
                    2,
                    {
                      oldLedgerList: I,
                      outstandingBills: N,
                      baseAmountSettingLedgers: M,
                      lastPaymentSettingLedgers: T,
                    },
                  ];
              }
            });
          });
        }),
        (e.checkAllLedgersFlagForOldVersion = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i, o;
            return a(this, function (a) {
              return (
                (r = !1),
                y.Util.isNotNull(e.allLedgers) &&
                  !0 === e.allLedgers &&
                  y.Util.isNull(e.emailSetting) &&
                  y.Util.isNull(e.smsSetting) &&
                  y.Util.isNull(e.whatsAppSetting) &&
                  (e.period === n.LedgerPeriod.DAILY_PERIOD ||
                  e.period === n.LedgerPeriod.ON_BILL_DUE_PERIOD
                    ? (r = !0)
                    : ((i = y.DateUtil.getDayNameOfWeek(null, t.timezone)),
                      (o = y.DateUtil.getDayOfMonth(null, t.timezone).toString()),
                      (-1 === e.day.indexOf(i) && -1 === e.day.indexOf(o)) || (r = !0))),
                [2, r]
              );
            });
          });
        }),
        (e.getGroupsByParent = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return ((r = []), [4, m.default.get(new S.Group(), e.id, t).findAll()]);
                case 1:
                  return (
                    (i = a.sent()),
                    [4, S.Group.getGroupsByParent([p.default.PARENT_GROUPS.SUNDRY_DEBTORS], i)]
                  );
                case 2:
                  return (
                    (r = a.sent()),
                    y.Util.isFilledArray(r) &&
                      (r = r.map(function (e) {
                        return ((e.name = y.TallyUtil.removeNoiseChars(e.name)), e);
                      })),
                    [2, r]
                  );
              }
            });
          });
        }),
        (e.getLedgerList = function (e, t) {
          return o.filter(e, function (e) {
            return e.ledgerName === t;
          });
        }),
        (e.checkForLatestReceipt = function (e, t, r, o) {
          return i(this, void 0, void 0, function () {
            var i, s, n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    a.trys.push([0, 2, , 3]),
                    [
                      4,
                      e.findAll({
                        where: { type: S.Voucher.TYPE_RECEIPT, partyId: t },
                        limit: 1,
                        order: [["date", "DESC"]],
                      }),
                    ]
                  );
                case 1:
                  return (
                    (i = a.sent()),
                    y.Util.isFilledArray(i) &&
                    ((s = y.DateUtil.getDaysDiff(
                      y.DateUtil.getDateFromTimestamp(i[0].date),
                      null,
                      o,
                    )),
                    y.Util.isValidNaturalNumber(s) && s < r)
                      ? [2, !0]
                      : [3, 3]
                  );
                case 2:
                  throw (
                    (n = a.sent()),
                    y.Log.info(
                      "Error while fetching the latest receipt from voucher :" +
                        y.Util.getErrorMessage(n),
                    ),
                    n
                  );
                case 3:
                  return [2, !1];
              }
            });
          });
        }),
        (e.getAdditionalSettingsData = function (e) {
          var t,
            r,
            i = e.additionalSetting;
          return (
            y.Util.isNotNull(i) &&
              (y.Util.isNotNull(i.baseAmount) && (t = i.baseAmount),
              y.Util.isNotNull(i.sendBillAfterlastPaymentReceived) &&
                (r = i.sendBillAfterlastPaymentReceived),
              y.Log.info("Additional setting for auto reminder added")),
            { baseAmountSetting: t, sendBillAfterlastPaymentReceivedSetting: r }
          );
        }),
        (e.getLedgersForScheduledJob = function (e, t, r, o) {
          return i(this, void 0, void 0, function () {
            var i, s, n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  ((i = {}), (a.label = 1));
                case 1:
                  return (
                    a.trys.push([1, 3, , 4]),
                    [4, g.getAutoReminderLedgerList(e, t.companyId, o)]
                  );
                case 2:
                  return ((i = a.sent()), [3, 4]);
                case 3:
                  throw (
                    (s = a.sent()),
                    y.Log.info(
                      "Error While fetching the scheduled ledgers for auto reminder job from server :" +
                        y.Util.getErrorMessage(s),
                    ),
                    s
                  );
                case 4:
                  return (
                    a.trys.push([4, 7, , 8]),
                    y.Util.isNotNull(i) && y.Util.isFilledArray(i.ledgerScheduledList)
                      ? [4, r.bulkCreate(i.ledgerScheduledList)]
                      : [3, 6]
                  );
                case 5:
                  (a.sent(), (a.label = 6));
                case 6:
                  return [3, 8];
                case 7:
                  throw (
                    (n = a.sent()),
                    y.Log.info(
                      "Error while bulk create on ledgerJob :" + y.Util.getErrorMessage(n),
                    ),
                    n
                  );
                case 8:
                  return [2, i];
              }
            });
          });
        }),
        (e.getDataFromTallyAndLocalDB = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i, o, s, n, p, c;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return ((r = new d.default()), (i = new u.default()).update(t), [4, N.getTime()]);
                case 1:
                  return (
                    (o = a.sent()),
                    ((s = {}).startDate = i.getStartDate()),
                    (s.endDate = Math.max(
                      y.DateUtil.addTimeZone(o.time, i.timezone).valueOf(),
                      i.getEndDate(),
                    )),
                    y.Log.info("period " + JSON.stringify(s)),
                    [4, r.getAutoReminderPendingBills(e.id, t, s)]
                  );
                case 2:
                  return (
                    (n = a.sent()),
                    y.Log.info("Outstandings fetched from tally"),
                    [4, new l.default().getOnAccountBalances(e.id, t, s)]
                  );
                case 3:
                  return (
                    (p = a.sent()),
                    y.Log.info("OnAccountBalance fetched from tally"),
                    [4, m.default.get(new S.Ledger(), e.id, t).findAll()]
                  );
                case 4:
                  return (
                    (c = a.sent()),
                    [
                      2,
                      {
                        tallyOutstandingBills: n,
                        tallyOnAcccountBalanceForLedgers: p,
                        localDBLedgers: c,
                      },
                    ]
                  );
              }
            });
          });
        }),
        (e.addCustomerContactForLedger = function (e, t) {
          if (
            ((e.customerContact = {}),
            (e.customerContact.gstIn = t.partyGstIn),
            y.Util.isFilledArray(t.contact.addressList))
          ) {
            var r = "";
            (t.contact.addressList.map(function (e) {
              y.Util.isNotNull(e.val) && (r += e.val + "\n");
            }),
              (e.customerContact.address = r));
          }
          if (
            y.Util.isNotNull(t.contact) &&
            ((e.customerContact.email = t.contact.email),
            (e.customerContact.country = t.contact.country),
            (e.customerContact.phoneNumber = t.contact.phone),
            (e.customerContact.mobile = t.contact.mobile),
            (e.customerContact.pincode = t.contact.pincode),
            (e.customerContact.emailCc = t.contact.emailCC),
            (e.email = t.contact.email),
            y.Util.isNotNull(t.contact.country))
          ) {
            var i = h.getCountryCodes(),
              a = o.find(i, function (e) {
                return e.name.toLocaleLowerCase() === t.contact.country.toLocaleLowerCase();
              });
            y.Util.isNotNull(a) &&
              ((e.customerContact.countryCode = a.code), (e.customerContact.dialCode = a.dialCode));
          }
          return e;
        }),
        (e.checkLedgerSettingsForOutstanding = function (e, t, r, o) {
          return i(this, void 0, void 0, function () {
            var i, s, u;
            return a(this, function (a) {
              return (
                (i = !0),
                t.period === n.LedgerPeriod.ON_BILL_DUE_PERIOD
                  ? ((i = !1),
                    r.every(function (r) {
                      if (
                        y.DateUtil.getStartOfDate(
                          y.DateUtil.getTimestampFromDateString(r.dueDate),
                          b.Duration.DAY,
                        ) === o
                      )
                        return ((i = !0), !1);
                      var a = y.DateUtil.getDaysDiff(
                        y.DateUtil.getTimestampFromDateString(r.dueDate),
                        null,
                        e.timezone,
                      );
                      return (
                        !(
                          y.Util.isNotNull(t.noOfDaysCycleAfterDueDate) &&
                          y.Util.isPositiveNumber(a) &&
                          y.Util.isPositiveNumber(t.noOfDaysCycleAfterDueDate) &&
                          a % t.noOfDaysCycleAfterDueDate == 0
                        ) || ((i = !0), !1)
                      );
                    }),
                    [2, i])
                  : t.period === n.LedgerPeriod.WEEKLY_PERIOD &&
                      y.Util.isNotNull(t.frequencyOfWeek) &&
                      t.frequencyOfWeek > 1
                    ? ((s = t.weekOftheYear),
                      (u = y.DateUtil.getWeekOfTheYear(e.timezone)),
                      y.Util.isPositiveNumber(s) && y.Util.isPositiveNumber(u) && s === u
                        ? [2, !0]
                        : !y.Util.isPositiveNumber(s) ||
                            !y.Util.isPositiveNumber(u) ||
                            u < s ||
                            (u - s) % t.frequencyOfWeek != 0
                          ? [2, !1]
                          : [2, i])
                    : [2, i]
              );
            });
          });
        }),
        (e.checkLedgerByParentGroup = function (e, t) {
          var r = !0;
          if (y.Util.isFilledArray(e)) {
            var i = y.TallyUtil.removeNoiseChars(t.parentGroup),
              a = o.find(e, { name: i });
            r = !!y.Util.isNotNull(a);
          }
          return r;
        }),
        (e.formattingTheBills = function (e, t) {
          return (
            e.forEach(function (e) {
              return (
                delete e.isDeleted,
                (e.date = y.DateUtil.getFormattedDate(y.DateUtil.FORMAT_DD_MMM_YY, e.date)),
                y.Util.isNotNull(e.dueDate)
                  ? (e.dueDays = y.DateUtil.getDaysFromMillis(t - e.dueDate))
                  : (e.dueDays = y.DateUtil.getDaysFromMillis(t - e.date)),
                (e.dueDate = y.DateUtil.getFormattedDate(y.DateUtil.FORMAT_DD_MMM_YY, e.dueDate)),
                e
              );
            }),
            e
          );
        }),
        (e.getOutstandingBillsForLedger = function (e, t, r, i, a) {
          var o;
          if (
            ((e.bills = []),
            y.Util.isNotNull(a) &&
              y.Util.isNotNull(a.onAccountBalance) &&
              y.Util.isNumber(a.onAccountBalance) &&
              0 !== a.onAccountBalance &&
              e.bills.push({
                amount: -a.onAccountBalance,
                customId: "On Account",
                date: "",
                dueDate: "",
                dueDays: "",
              }),
            t
              ? r.forEach(function (t) {
                  y.DateUtil.getTimestampFromDateString(t.dueDate) <= i &&
                    ((e.type = p.default.AUTO_REMINDER_BILLS.DUE_BILLS), e.bills.push(t));
                })
              : ((e.type = p.default.AUTO_REMINDER_BILLS.PENDING_BILLS),
                (o = e.bills).push.apply(o, r)),
            y.Util.isFilledArray(e.bills))
          ) {
            var s = 0;
            return (
              e.bills.map(function (e) {
                s += e.amount;
              }),
              (e.total = Math.round(100 * (s + Number.EPSILON)) / 100),
              e
            );
          }
        }),
        (e.sendOutstandingBillsForCompany = function (t, r, o, s, n, u) {
          return i(this, void 0, void 0, function () {
            var i, m, l;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    a.trys.push([0, 8, , 9]),
                    (i = e.createOutstandingData(o, r)),
                    [4, new f.S3Service().checkDataExceedingChunkSize(i)]
                  );
                case 1:
                  return a.sent()
                    ? (y.Log.info(
                        "Outstandings are sending in chunk as size is exceeding the request max size",
                      ),
                      o.map(function (e) {
                        ((e.userId = t.id),
                          (e.companyId = r.companyId),
                          (e.createdAt = y.DateUtil.now()));
                      }),
                      [4, n.bulkCreate(o)])
                    : [3, 5];
                case 2:
                  return (
                    a.sent(),
                    (s.status = p.default.AUTO_REMINDER_STATUS.DB_INSERT),
                    [4, u.update(s, { where: { _id: s._id } })]
                  );
                case 3:
                  return (a.sent(), [4, this.dataExceedMaxLimitProcessing(t, r, s)]);
                case 4:
                  return (a.sent(), [3, 7]);
                case 5:
                  return (
                    ((m = new c.default()).user = t),
                    (m.company = r),
                    (m.outstandingData = i),
                    (m.jobId = s.jobId),
                    (m.endOfData = !0),
                    [
                      4,
                      y.Util.retryFunction(
                        g.sendLedgerOutstandingBills,
                        [m],
                        p.default.MAX_AUTO_REMINDER_RETRY_COUNT,
                        1e4,
                        1,
                        "sendLedgerOutstandingBills",
                      ),
                    ]
                  );
                case 6:
                  (a.sent(), (a.label = 7));
                case 7:
                  return [2];
                case 8:
                  throw (
                    (l = a.sent()),
                    y.Log.info(
                      "sendOutstandingBillsForCompany function error  : " +
                        y.Util.getErrorMessage(l),
                    ),
                    l
                  );
                case 9:
                  return [2];
              }
            });
          });
        }),
        (e.createOutstandingData = function (e, t) {
          var r = {};
          ((r.outstandingReminders = e),
            y.Util.isNotNull(t.companyMailingName)
              ? (r.companyName = t.companyMailingName)
              : (r.companyName = t.name));
          var i = "";
          return (
            y.Util.isFilledArray(t.addressList) &&
              t.addressList.map(function (e) {
                y.Util.isNotNull(e.val) && (i += e.val + "\n");
              }),
            (r.companyContact = {
              address: i,
              email: t.email,
              gstIn: t.gstin,
              phoneNumber: t.phoneNumber,
              pincode: t.pincode,
            }),
            r
          );
        }),
        (e.checkAutoReminderEnabled = function (e) {
          return !!(
            y.Util.isNotNull(e.companySettings) &&
            y.Util.isNotNull(e.companySettings.autoReminderSettings) &&
            y.Util.isNotNull(e.companySettings.autoReminderSettings.enabled) &&
            !0 === e.companySettings.autoReminderSettings.enabled
          );
        }),
        (e.dataExceedMaxLimitProcessing = function (t, r, o) {
          return i(this, void 0, void 0, function () {
            var i, s, n;
            return a(this, function (u) {
              switch (u.label) {
                case 0:
                  ((i = m.default.getV1(e, t.id, r)),
                    (s = function () {
                      var s, u, m, l, d, b, h;
                      return a(this, function (a) {
                        switch (a.label) {
                          case 0:
                            return [4, i.findAll({ limit: 500 })];
                          case 1:
                            return ((s = a.sent()), [4, i.count()]);
                          case 2:
                            if (((u = a.sent()), (m = void 0), y.Util.isNull(s) || 0 === s.length))
                              return [2, "break"];
                            ((m = !(!y.Util.isNotNull(u) || u !== s.length)), (a.label = 3));
                          case 3:
                            return (
                              a.trys.push([3, 10, , 11]),
                              (l = e.createOutstandingData(s, r)),
                              [4, new f.S3Service().checkDataExceedingChunkSize(l)]
                            );
                          case 4:
                            return a.sent()
                              ? [
                                  4,
                                  n.checkOneByOneSize(
                                    t,
                                    r,
                                    s,
                                    o.ledgerList.jobScheduleForToday,
                                    m,
                                    4,
                                  ),
                                ]
                              : [3, 6];
                          case 5:
                            return (a.sent(), [3, 9]);
                          case 6:
                            return (
                              ((d = new c.default()).user = t),
                              (d.company = r),
                              (d.outstandingData = l),
                              (d.jobId = o.ledgerList.jobScheduleForToday),
                              (d.endOfData = m),
                              [
                                4,
                                y.Util.retryFunction(
                                  g.sendLedgerOutstandingBills,
                                  [d],
                                  p.default.MAX_AUTO_REMINDER_RETRY_COUNT,
                                  1e4,
                                  1,
                                  "sendLedgerOutstandingBills",
                                ),
                              ]
                            );
                          case 7:
                            return (
                              a.sent(),
                              (b = []),
                              s.map(function (e) {
                                b.push(e._id);
                              }),
                              [4, n.deleteByIds(t, r, b)]
                            );
                          case 8:
                            (a.sent(), (a.label = 9));
                          case 9:
                            return [3, 11];
                          case 10:
                            return (
                              (h = a.sent()),
                              y.Log.error(
                                "dataExceedMaxLimitProcessing func Error :" +
                                  y.Util.getErrorMessage(h),
                              ),
                              [2, "break"]
                            );
                          case 11:
                            return [2];
                        }
                      });
                    }),
                    (n = this),
                    (u.label = 1));
                case 1:
                  return [5, s()];
                case 2:
                  return "break" === u.sent() ? [3, 3] : [3, 1];
                case 3:
                  return [2, !0];
              }
            });
          });
        }),
        (e.checkOneByOneSize = function (t, r, o, s, n, u) {
          return i(this, void 0, void 0, function () {
            var i, m, l, d, b, h, S, f, A, N, I, T, M;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  (a.trys.push([0, 13, , 14]), (a.label = 1));
                case 1:
                  if (y.Util.isNull(o) || 0 === o.length) return [3, 12];
                  ((i = o.length), (m = 0), (l = []), (d = []), (b = 0), (h = o), (a.label = 2));
                case 2:
                  return b < h.length
                    ? ((S = h[b]),
                      m++,
                      l.push(S),
                      d.push(S._id),
                      (f = e.createOutstandingData(l, r)),
                      [4, this.createEncryptedBuffer(f)])
                    : [3, 11];
                case 3:
                  return (
                    (A = a.sent()),
                    ((N = A.byteLength) >= 1e6 * u && N < 5e6) || i === m
                      ? (((I = new c.default()).user = t),
                        (I.company = r),
                        (I.outstandingData = f),
                        (I.jobId = s),
                        i !== m
                          ? [3, 5]
                          : ((I.endOfData = n),
                            [
                              4,
                              y.Util.retryFunction(
                                g.sendLedgerOutstandingBills,
                                [I],
                                p.default.MAX_AUTO_REMINDER_RETRY_COUNT,
                                1e4,
                                1,
                                "sendLedgerOutstandingBills",
                              ),
                            ]))
                      : [3, 9]
                  );
                case 4:
                  return (a.sent(), [3, 7]);
                case 5:
                  return (
                    (I.endOfData = !1),
                    [
                      4,
                      y.Util.retryFunction(
                        g.sendLedgerOutstandingBills,
                        [I],
                        p.default.MAX_AUTO_REMINDER_RETRY_COUNT,
                        1e4,
                        1,
                        "sendLedgerOutstandingBills",
                      ),
                    ]
                  );
                case 6:
                  (a.sent(), (a.label = 7));
                case 7:
                  return [4, this.deleteByIds(t, r, d)];
                case 8:
                  return (a.sent(), (l = []), (d = []), [3, 10]);
                case 9:
                  if (N > 5e6) {
                    if (1 === u)
                      throw (
                        (T = "Buffer Size is too much heavy(it's about more than 5MB)"),
                        y.Log.info(T),
                        new Error(T)
                      );
                    this.checkOneByOneSize(t, r, l, s, n, u - 1);
                  }
                  a.label = 10;
                case 10:
                  return (b++, [3, 2]);
                case 11:
                  return [3, 1];
                case 12:
                  return [2];
                case 13:
                  throw (
                    (M = a.sent()),
                    y.Log.error("check One By One Size Error :" + y.Util.getErrorMessage(M)),
                    M
                  );
                case 14:
                  return [2];
              }
            });
          });
        }),
        (e.createEncryptedBuffer = function (e) {
          return i(this, void 0, void 0, function () {
            var t, r, i;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  ((t = new f.S3Service()), (a.label = 1));
                case 1:
                  return (a.trys.push([1, 3, , 4]), [4, t.zip(JSON.stringify(e))]);
                case 2:
                  return ((r = a.sent()), [2, t.encrypt(r)]);
                case 3:
                  throw (
                    (i = a.sent()),
                    y.Log.error("Crypto Error :" + y.Util.getErrorMessage(i)),
                    i
                  );
                case 4:
                  return [2];
              }
            });
          });
        }),
        (e.clearAllLedgerOutstandingBillData = function (t, r) {
          return i(this, void 0, void 0, function () {
            return a(this, function (i) {
              switch (i.label) {
                case 0:
                  return [4, m.default.getV1(e, t.id, r).truncate()];
                case 1:
                  return [2, i.sent()];
              }
            });
          });
        }),
        (e.deleteByIds = function (t, r, o) {
          return i(this, void 0, void 0, function () {
            var i, s, n, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  ((i = m.default.getV1(e, t.id, r)), (s = 0), (n = o), (a.label = 1));
                case 1:
                  return s < n.length
                    ? ((u = n[s]), [4, i.destroy({ where: { _id: u } })])
                    : [3, 4];
                case 2:
                  (a.sent(), (a.label = 3));
                case 3:
                  return (s++, [3, 1]);
                case 4:
                  return [2];
              }
            });
          });
        }),
        (e.getMetaDataForRetryInfo = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (r = S.AppSettingMetadata.REMINDER_RETRY_INFO + "_" + t.companyId),
                    [4, new A.default(e.id).get(r)]
                  );
                case 1:
                  return (
                    (i = a.sent()),
                    y.Util.isNotNull(i) && y.Util.isNotNull(i.data) ? [2, JSON.parse(i.data)] : [2]
                  );
              }
            });
          });
        }),
        (e.setMetaDataForRetryInfo = function (e, t, r) {
          return i(this, void 0, void 0, function () {
            var i, o, s;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (i = S.AppSettingMetadata.REMINDER_RETRY_INFO + "_" + t.companyId),
                    (o = new A.default(e.id)),
                    (s = new S.AppSettingMetadata(i, JSON.stringify(r))),
                    [4, o.set(s)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.checkRetry = function (t, r) {
          return i(this, void 0, void 0, function () {
            var i;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, e.getMetaDataForRetryInfo(r, t)];
                case 1:
                  return (
                    (i = a.sent()),
                    y.Util.isNotNull(i) &&
                    y.Util.isNotNull(i.retryCount) &&
                    y.Util.isNotNull(i.updatedAt) &&
                    i.updatedAt + 1e4 * i.retryCount > y.DateUtil.now(t.timezone)
                      ? (y.Log.info(
                          "Due to last failure we will retry after " +
                            (1e4 * i.retryCount) / 1e3 +
                            " sec. Current Retry count " +
                            i.retryCount +
                            " .",
                        ),
                        [2, !0])
                      : [2, !1]
                  );
              }
            });
          });
        }),
        (e.addToRetry = function (t, r) {
          return i(this, void 0, void 0, function () {
            var i;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, e.getMetaDataForRetryInfo(r, t)];
                case 1:
                  return (
                    (i = a.sent()),
                    y.Util.isNotNull(i)
                      ? ((i.retryCount += 1), (i.updatedAt = y.DateUtil.now(t.timezone)))
                      : (i = { retryCount: 1, updatedAt: y.DateUtil.now(t.timezone) }),
                    [4, e.setMetaDataForRetryInfo(r, t, i)]
                  );
                case 2:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.deleteExsitingRetry = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r;
            return a(this, function (i) {
              switch (i.label) {
                case 0:
                  return (
                    (r = S.AppSettingMetadata.REMINDER_RETRY_INFO + "_" + e.companyId),
                    [4, new A.default(t.id).delete(r)]
                  );
                case 1:
                  return [2, i.sent()];
              }
            });
          });
        }),
        (e.masterName = "LedgerOutstandingBill"),
        e
      );
    })();
  t.default = I;
};
