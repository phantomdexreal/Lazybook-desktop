// webpack module #584 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

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
  var i = r(46),
    o = r(583),
    s = r(1627),
    u = r(59),
    p = r(8),
    c = r(1628),
    l = r(30),
    m = r(1629),
    d = r(518),
    y = r(0),
    b = r(45),
    h = r(1630),
    f = r(585),
    g = r(28),
    M = r(151),
    S = r(83),
    A = r(48),
    O = (function () {
      function e() {}
      return (
        (e.getName = function () {
          return e.masterName;
        }),
        (e.syncPendingBills = function (t, r) {
          return n(this, void 0, void 0, function () {
            var n, i, s, u, c, m;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  if (!y.Util.isFilledArray(t)) return [3, 10];
                  (n = 0), (i = t), (a.label = 1);
                case 1:
                  if (!(n < i.length)) return [3, 10];
                  if (
                    ((s = i[n]),
                    (u = s.company),
                    (c = s.autoReminderSettings),
                    !y.Util.isNotNull(c))
                  )
                    return [3, 9];
                  a.label = 2;
                case 2:
                  return a.trys.push([2, 7, , 9]), [4, e.checkRetry(u, r)];
                case 3:
                  return a.sent()
                    ? [2]
                    : (y.Log.info(
                        "Auto Reminder Execution started for company : " + u.tallyCompanyName
                      ),
                      [4, e.getPendingBillsWithOnAccountBalance(r, u, c)]);
                case 4:
                  return (
                    a.sent(),
                    (c.syncDateTime =
                      y.DateUtil.getStartOfDate(
                        y.DateUtil.addDays(y.DateUtil.now(u.timezone), 1),
                        b.Duration.DAY,
                        u.timezone
                      ) + c.time),
                    (c.status = p.default.AUTO_REMINDER_STATUS.READY),
                    (c.jobId = null),
                    (c.syncStatus = null),
                    (c.ledgerList = null),
                    (c.endDateTime = y.DateUtil.addDate(
                      c.syncDateTime,
                      p.default.HOURS_LIMIT_FOR_AUTO_REMINDER,
                      b.Duration.HOUR
                    )),
                    [4, l.default.getV1(o.default, r.id, u).update(c, { where: { _id: c._id } })]
                  );
                case 5:
                  return a.sent(), [4, e.deleteExsitingRetry(u, r)];
                case 6:
                  return a.sent(), [3, 9];
                case 7:
                  return (m = a.sent()), [4, e.addToRetry(u, r)];
                case 8:
                  return (
                    a.sent(),
                    y.Log.error(
                      "Get Pending Bills With OnAccount Balance Sync failed with error :" +
                        y.Util.getErrorMessage(m)
                    ),
                    [3, 9]
                  );
                case 9:
                  return n++, [3, 1];
                case 10:
                  return [2];
              }
            });
          });
        }),
        (e.getPendingBillsWithOnAccountBalance = function (t, r, i) {
          return n(this, void 0, void 0, function () {
            var n, u, c, m, d, b, h, g, M, S, A, O, N, v;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  if (!this.checkAutoReminderEnabled(r)) return [3, 27];
                  a.label = 1;
                case 1:
                  if (
                    (a.trys.push([1, 26, , 27]),
                    (n = l.default.getV1(o.default, t.id, r)),
                    (u = l.default.getV1(e, t.id, r)),
                    (c = l.default.getV1(s.default, t.id, r)),
                    ![p.default.AUTO_REMINDER_STATUS.DB_INSERT].includes(i.status))
                  )
                    return [3, 6];
                  y.Log.info(
                    "Processing data in chunk to send on server as it's exceeds the size of request"
                  ),
                    (a.label = 2);
                case 2:
                  return [4, u.findAll({ limit: 500 })];
                case 3:
                  return (
                    (m = a.sent()),
                    y.Util.isNull(m) || 0 === m.length
                      ? [3, 5]
                      : [4, this.dataExceedMaxLimitProcessing(t, r, i)]
                  );
                case 4:
                  return a.sent(), [3, 2];
                case 5:
                  return [3, 23];
                case 6:
                  return [4, e.clearAllLedgerOutstandingBillData(t, r)];
                case 7:
                  return a.sent(), [4, e.checkForReadyState(i, t, r, n, c)];
                case 8:
                  return (
                    (d = a.sent()),
                    y.Util.isNull(d) ||
                    y.Util.isNull(d.autoReminderSetting) ||
                    y.Util.isNull(d.company)
                      ? (y.Log.info("Invalid data received from checkForReadyState function"), [2])
                      : ((i = d.autoReminderSetting),
                        (r = d.company),
                        y.Util.isNull(i.jobId)
                          ? (y.Log.info("Job not found for the day"), [2])
                          : [4, e.getOutstandingBills(t, r, c)])
                  );
                case 9:
                  return (
                    (b = a.sent()),
                    (h = b.oldLedgerList),
                    (g = b.outstandingBills),
                    (M = b.baseAmountSettingLedgers),
                    (S = b.lastPaymentSettingLedgers),
                    y.Util.isFilledArray(g)
                      ? (y.Log.info("Outstandings found"),
                        [4, e.sendOutstandingBillsForCompany(t, r, g, i, u, n)])
                      : [3, 11]
                  );
                case 10:
                  return a.sent(), [3, 15];
                case 11:
                  y.Log.info("No Outstandings found"), (a.label = 12);
                case 12:
                  return (
                    a.trys.push([12, 14, , 15]),
                    [4, f.sendNoOutstandingsForToday(t, r.companyId, i.jobId)]
                  );
                case 13:
                  return a.sent(), [3, 15];
                case 14:
                  throw (
                    ((A = a.sent()),
                    y.Log.info("sendNoOutstandingsForToday error: " + y.Util.getErrorMessage(A)),
                    A)
                  );
                case 15:
                  if (!y.Util.isFilledArray(M) && !y.Util.isFilledArray(S)) return [3, 19];
                  y.Log.info("Ledgers not sent due to Additional settings Found"), (a.label = 16);
                case 16:
                  return (
                    a.trys.push([16, 18, , 19]),
                    [4, f.saveAdditionalSettingRejectedLedgers(t, r.companyId, i.jobId, S, M)]
                  );
                case 17:
                  return a.sent(), [3, 19];
                case 18:
                  throw (
                    ((O = a.sent()),
                    y.Log.error(
                      "saveAdditionalSettingRejectedLedgers API Call Error :" +
                        y.Util.getErrorMessage(O)
                    ),
                    O)
                  );
                case 19:
                  if ((y.Log.info("Updated to the server"), !y.Util.isFilledArray(h)))
                    return [3, 23];
                  y.Log.info("Master Name changes Found"), (a.label = 20);
                case 20:
                  return a.trys.push([20, 22, , 23]), [4, f.updateMasterName(t, r.companyId, h)];
                case 21:
                  return a.sent(), [3, 23];
                case 22:
                  return (
                    (N = a.sent()),
                    y.Log.error("updateMasterName API Call Error :" + y.Util.getErrorMessage(N)),
                    [3, 23]
                  );
                case 23:
                  return [4, s.default.clearAllLedgerJobData(t, r)];
                case 24:
                  return (
                    a.sent(),
                    (i.status = p.default.AUTO_REMINDER_STATUS.DONE),
                    [4, n.update(i, { where: { _id: i._id } })]
                  );
                case 25:
                  return (
                    a.sent(),
                    y.Log.info("Auto Reminder sent for company :" + r.tallyCompanyName),
                    [2]
                  );
                case 26:
                  throw (
                    ((v = a.sent()),
                    y.Log.error(
                      "Get PendingBills With OnAccount Balance function Error :" +
                        y.Util.getErrorMessage(v)
                    ),
                    v)
                  );
                case 27:
                  return [2];
              }
            });
          });
        }),
        (e.checkForReadyState = function (t, r, i, u, c) {
          return n(this, void 0, void 0, function () {
            var n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return t.status !== p.default.AUTO_REMINDER_STATUS.IN_PROGRESS
                    ? [3, 5]
                    : [4, s.default.clearAllLedgerJobData(r, i)];
                case 1:
                  return a.sent(), [4, e.getLedgersForScheduledJob(r, i, c, t.time)];
                case 2:
                  return (
                    (n = a.sent()),
                    y.Util.isNull(n)
                      ? [2, { company: i, autoReminderSetting: t }]
                      : ((t.jobId = n.jobScheduleForToday),
                        (t.status = p.default.AUTO_REMINDER_STATUS.LEDGER_LIST_FETCHED),
                        [4, u.update(t, { where: { _id: t._id } })])
                  );
                case 3:
                  return (
                    a.sent(),
                    y.Util.isNotNull(n) && y.Util.isNotNull(n.autoReminderSettings)
                      ? [4, new o.default(r, i).updateAutoReminderSettingsForCompany(n)]
                      : [3, 5]
                  );
                case 4:
                  if (
                    ((i = a.sent()),
                    y.Util.isNotNull(n.isBeforeScheduledCalled) && !0 === n.isBeforeScheduledCalled)
                  )
                    throw new Error("Job has been called before scheduled time");
                  a.label = 5;
                case 5:
                  return [2, { company: i, autoReminderSetting: t }];
              }
            });
          });
        }),
        (e.getOutstandingBills = function (t, r, u) {
          return n(this, void 0, void 0, function () {
            var n,
              p,
              c,
              m,
              d,
              h,
              f,
              M,
              S,
              A,
              O,
              N,
              v,
              T,
              z,
              I,
              q,
              k,
              R,
              C,
              E,
              _,
              D,
              L,
              x,
              w,
              P,
              W,
              B,
              U,
              F,
              G,
              j,
              V;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (n = l.default.get(new g.Voucher(), t.id, r)),
                    (p = r.companySettings.autoReminderSettings),
                    [4, u.findAll()]
                  );
                case 1:
                  return (c = a.sent()), [4, e.checkAllLedgersFlagForOldVersion(p, r)];
                case 2:
                  return (m = a.sent()), [4, e.getGroupsByParent(t, r)];
                case 3:
                  return (
                    (d = a.sent()),
                    y.Util.isFilledArray(c) || m
                      ? [4, e.getDataFromTallyAndLocalDB(t, r)]
                      : (y.Log.info("No ledger settings found from server"), [2])
                  );
                case 4:
                  (h = a.sent()),
                    (f = h.tallyOutstandingBills),
                    (M = h.tallyOnAcccountBalanceForLedgers),
                    (S = h.localDBLedgers),
                    (A = []),
                    (O = []),
                    (N = []),
                    (v = []),
                    (T = e.getAdditionalSettingsData(p)),
                    (z = T.baseAmountSetting),
                    (I = T.sendBillAfterlastPaymentReceivedSetting),
                    (q = i.groupBy(f, "ledgerName")),
                    (k = 0),
                    (R = Object.keys(q)),
                    (a.label = 5);
                case 5:
                  return k < R.length
                    ? ((C = R[k]),
                      (E = []),
                      m
                        ? E.push({
                            companyId: r.companyId,
                            ledgerName: C,
                            status: s.LedgerStatus.ACTIVE,
                            period: p.period,
                            modeOfReminder: o.ModeOfReminder.EMAIL,
                          })
                        : (E = e.getLedgerList(c, C)),
                      y.Util.isFilledArray(E)
                        ? ((_ = i.find(S, { name: C })),
                          y.Util.isNull(_) && (_ = i.find(S, { oldName: C })),
                          y.Util.isNull(_)
                            ? [3, 13]
                            : y.Util.isNotNull(_.isBillWiseOff) && !0 === _.isBillWiseOff
                            ? (y.Log.info(
                                "Skipping ledger because of isBillWiseOff setting is " +
                                  _.isBillWiseOff +
                                  " for " +
                                  _.name
                              ),
                              [3, 13])
                            : y.Util.isNotNull(I) && y.Util.isPositiveNumber(I)
                            ? [4, e.checkForLatestReceipt(n, C, I, r.timezone)]
                            : [3, 7])
                        : [3, 13])
                    : [3, 14];
                case 6:
                  if (a.sent()) return N.push.apply(N, E), [3, 13];
                  a.label = 7;
                case 7:
                  return (
                    (D = i.find(M, { ledgerName: C })),
                    (L = y.DateUtil.getStartOfDate(
                      y.DateUtil.now(r.timezone),
                      b.Duration.DAY,
                      r.timezone
                    )),
                    (x = q),
                    (w = C),
                    [4, e.formattingTheBills(q[C], L)]
                  );
                case 8:
                  (x[w] = a.sent()), (P = 0), (W = E), (a.label = 9);
                case 9:
                  return P < W.length
                    ? ((B = W[P]),
                      (U = !1),
                      y.Util.isNotNull(B.modeOfReminder) &&
                      B.modeOfReminder === o.ModeOfReminder.EMAIL
                        ? ((F = y.Util.isNotNull(p.emailSetting) ? p.emailSetting : p),
                          (U = y.Util.isNotNull(F.sendOnlyDueBills)
                            ? F.sendOnlyDueBills
                            : !!y.Util.isNotNull(p.sendOnlyDueBills) && p.sendOnlyDueBills))
                        : y.Util.isNotNull(B.modeOfReminder) &&
                          B.modeOfReminder === o.ModeOfReminder.SMS
                        ? ((G = y.Util.isNotNull(p.smsSetting) ? p.smsSetting : {}),
                          (U = !!y.Util.isNotNull(G.sendOnlyDueBills) && G.sendOnlyDueBills))
                        : y.Util.isNotNull(B.modeOfReminder) &&
                          B.modeOfReminder === o.ModeOfReminder.WHATS_APP &&
                          ((j = y.Util.isNotNull(p.whatsAppSetting) ? p.whatsAppSetting : {}),
                          (U = !!y.Util.isNotNull(j.sendOnlyDueBills) && j.sendOnlyDueBills)),
                      ((V = new e()).customerName = C),
                      ((V = e.addCustomerContactForLedger(V, _)).modeOfReminder = B.modeOfReminder),
                      e.checkLedgerByParentGroup(d, _)
                        ? [4, e.checkLedgerSettingsForOutstanding(r, B, q[C], L)]
                        : [3, 12])
                    : [3, 13];
                case 10:
                  return a.sent() ? [4, e.getOutstandingBillsForLedger(V, U, q[C], L, D)] : [3, 12];
                case 11:
                  if (((V = a.sent()), y.Util.isNull(V))) return [3, 12];
                  if (
                    (y.Util.isNotNull(_.oldName) &&
                      _.oldName === B.ledgerName &&
                      O.push({ oldLedgerName: _.oldName, newLedgerName: _.name }),
                    y.Util.isNotNull(V.total) && V.total > 0)
                  ) {
                    if (y.Util.isNotNull(z) && y.Util.isPositiveNumber(z) && V.total <= z)
                      return v.push(B), [3, 12];
                    A.push(V);
                  }
                  a.label = 12;
                case 12:
                  return P++, [3, 9];
                case 13:
                  return k++, [3, 5];
                case 14:
                  return [
                    2,
                    {
                      oldLedgerList: O,
                      outstandingBills: A,
                      baseAmountSettingLedgers: v,
                      lastPaymentSettingLedgers: N,
                    },
                  ];
              }
            });
          });
        }),
        (e.checkAllLedgersFlagForOldVersion = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n, i;
            return a(this, function (a) {
              return (
                (r = !1),
                y.Util.isNotNull(e.allLedgers) &&
                  !0 === e.allLedgers &&
                  y.Util.isNull(e.emailSetting) &&
                  y.Util.isNull(e.smsSetting) &&
                  y.Util.isNull(e.whatsAppSetting) &&
                  (e.period === s.LedgerPeriod.DAILY_PERIOD ||
                  e.period === s.LedgerPeriod.ON_BILL_DUE_PERIOD
                    ? (r = !0)
                    : ((n = y.DateUtil.getDayNameOfWeek(null, t.timezone)),
                      (i = y.DateUtil.getDayOfMonth(null, t.timezone).toString()),
                      (-1 === e.day.indexOf(n) && -1 === e.day.indexOf(i)) || (r = !0))),
                [2, r]
              );
            });
          });
        }),
        (e.getGroupsByParent = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (r = []), [4, l.default.get(new g.Group(), e.id, t).findAll()];
                case 1:
                  return (
                    (n = a.sent()),
                    [4, g.Group.getGroupsByParent([p.default.PARENT_GROUPS.SUNDRY_DEBTORS], n)]
                  );
                case 2:
                  return (
                    (r = a.sent()),
                    y.Util.isFilledArray(r) &&
                      (r = r.map(function (e) {
                        return (e.name = y.TallyUtil.removeNoiseChars(e.name)), e;
                      })),
                    [2, r]
                  );
              }
            });
          });
        }),
        (e.getLedgerList = function (e, t) {
          return i.filter(e, function (e) {
            return e.ledgerName === t;
          });
        }),
        (e.checkForLatestReceipt = function (e, t, r, i) {
          return n(this, void 0, void 0, function () {
            var n, o, s;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    a.trys.push([0, 2, , 3]),
                    [
                      4,
                      e.findAll({
                        where: { type: g.Voucher.TYPE_RECEIPT, partyId: t },
                        limit: 1,
                        order: [["date", "DESC"]],
                      }),
                    ]
                  );
                case 1:
                  return (
                    (n = a.sent()),
                    y.Util.isFilledArray(n) &&
                    ((o = y.DateUtil.getDaysDiff(
                      y.DateUtil.getDateFromTimestamp(n[0].date),
                      null,
                      i
                    )),
                    y.Util.isValidNaturalNumber(o) && o < r)
                      ? [2, !0]
                      : [3, 3]
                  );
                case 2:
                  throw (
                    ((s = a.sent()),
                    y.Log.info(
                      "Error while fetching the latest receipt from voucher :" +
                        y.Util.getErrorMessage(s)
                    ),
                    s)
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
            n = e.additionalSetting;
          return (
            y.Util.isNotNull(n) &&
              (y.Util.isNotNull(n.baseAmount) && (t = n.baseAmount),
              y.Util.isNotNull(n.sendBillAfterlastPaymentReceived) &&
                (r = n.sendBillAfterlastPaymentReceived),
              y.Log.info("Additional setting for auto reminder added")),
            { baseAmountSetting: t, sendBillAfterlastPaymentReceivedSetting: r }
          );
        }),
        (e.getLedgersForScheduledJob = function (e, t, r, i) {
          return n(this, void 0, void 0, function () {
            var n, o, s;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  (n = {}), (a.label = 1);
                case 1:
                  return (
                    a.trys.push([1, 3, , 4]), [4, f.getAutoReminderLedgerList(e, t.companyId, i)]
                  );
                case 2:
                  return (n = a.sent()), [3, 4];
                case 3:
                  throw (
                    ((o = a.sent()),
                    y.Log.info(
                      "Error While fetching the scheduled ledgers for auto reminder job from server :" +
                        y.Util.getErrorMessage(o)
                    ),
                    o)
                  );
                case 4:
                  return (
                    a.trys.push([4, 7, , 8]),
                    y.Util.isNotNull(n) && y.Util.isFilledArray(n.ledgerScheduledList)
                      ? [4, r.bulkCreate(n.ledgerScheduledList)]
                      : [3, 6]
                  );
                case 5:
                  a.sent(), (a.label = 6);
                case 6:
                  return [3, 8];
                case 7:
                  throw (
                    ((s = a.sent()),
                    y.Log.info(
                      "Error while bulk create on ledgerJob :" + y.Util.getErrorMessage(s)
                    ),
                    s)
                  );
                case 8:
                  return [2, n];
              }
            });
          });
        }),
        (e.getDataFromTallyAndLocalDB = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n, i, o, s, p, c;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (r = new d.default()), (n = new u.default()).update(t), [4, A.getTime()];
                case 1:
                  return (
                    (i = a.sent()),
                    ((o = {}).startDate = n.getStartDate()),
                    (o.endDate = Math.max(
                      y.DateUtil.addTimeZone(i.time, n.timezone).valueOf(),
                      n.getEndDate()
                    )),
                    y.Log.info("period " + JSON.stringify(o)),
                    [4, r.getAutoReminderPendingBills(e.id, t, o)]
                  );
                case 2:
                  return (
                    (s = a.sent()),
                    y.Log.info("Outstandings fetched from tally"),
                    [4, new m.default().getOnAccountBalances(e.id, t, o)]
                  );
                case 3:
                  return (
                    (p = a.sent()),
                    y.Log.info("OnAccountBalance fetched from tally"),
                    [4, l.default.get(new g.Ledger(), e.id, t).findAll()]
                  );
                case 4:
                  return (
                    (c = a.sent()),
                    [
                      2,
                      {
                        tallyOutstandingBills: s,
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
            t.contact.addressList.map(function (e) {
              y.Util.isNotNull(e.val) && (r += e.val + "\n");
            }),
              (e.customerContact.address = r);
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
            var n = h.getCountryCodes(),
              a = i.find(n, function (e) {
                return e.name.toLocaleLowerCase() === t.contact.country.toLocaleLowerCase();
              });
            y.Util.isNotNull(a) &&
              ((e.customerContact.countryCode = a.code), (e.customerContact.dialCode = a.dialCode));
          }
          return e;
        }),
        (e.checkLedgerSettingsForOutstanding = function (e, t, r, i) {
          return n(this, void 0, void 0, function () {
            var n, o, u;
            return a(this, function (a) {
              return (
                (n = !0),
                t.period === s.LedgerPeriod.ON_BILL_DUE_PERIOD
                  ? ((n = !1),
                    r.every(function (r) {
                      if (
                        y.DateUtil.getStartOfDate(
                          y.DateUtil.getTimestampFromDateString(r.dueDate),
                          b.Duration.DAY
                        ) === i
                      )
                        return (n = !0), !1;
                      var a = y.DateUtil.getDaysDiff(
                        y.DateUtil.getTimestampFromDateString(r.dueDate),
                        null,
                        e.timezone
                      );
                      return (
                        !(
                          y.Util.isNotNull(t.noOfDaysCycleAfterDueDate) &&
                          y.Util.isPositiveNumber(a) &&
                          y.Util.isPositiveNumber(t.noOfDaysCycleAfterDueDate) &&
                          a % t.noOfDaysCycleAfterDueDate == 0
                        ) || ((n = !0), !1)
                      );
                    }),
                    [2, n])
                  : t.period === s.LedgerPeriod.WEEKLY_PERIOD &&
                    y.Util.isNotNull(t.frequencyOfWeek) &&
                    t.frequencyOfWeek > 1
                  ? ((o = t.weekOftheYear),
                    (u = y.DateUtil.getWeekOfTheYear(e.timezone)),
                    y.Util.isPositiveNumber(o) && y.Util.isPositiveNumber(u) && o === u
                      ? [2, !0]
                      : !y.Util.isPositiveNumber(o) ||
                        !y.Util.isPositiveNumber(u) ||
                        u < o ||
                        (u - o) % t.frequencyOfWeek != 0
                      ? [2, !1]
                      : [2, n])
                  : [2, n]
              );
            });
          });
        }),
        (e.checkLedgerByParentGroup = function (e, t) {
          var r = !0;
          if (y.Util.isFilledArray(e)) {
            var n = y.TallyUtil.removeNoiseChars(t.parentGroup),
              a = i.find(e, { name: n });
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
        (e.getOutstandingBillsForLedger = function (e, t, r, n, a) {
          var i;
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
                  y.DateUtil.getTimestampFromDateString(t.dueDate) <= n &&
                    ((e.type = p.default.AUTO_REMINDER_BILLS.DUE_BILLS), e.bills.push(t));
                })
              : ((e.type = p.default.AUTO_REMINDER_BILLS.PENDING_BILLS),
                (i = e.bills).push.apply(i, r)),
            y.Util.isFilledArray(e.bills))
          ) {
            var o = 0;
            return (
              e.bills.map(function (e) {
                o += e.amount;
              }),
              (e.total = Math.round(100 * (o + Number.EPSILON)) / 100),
              e
            );
          }
        }),
        (e.sendOutstandingBillsForCompany = function (t, r, i, o, s, u) {
          return n(this, void 0, void 0, function () {
            var n, l, m;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    a.trys.push([0, 8, , 9]),
                    (n = e.createOutstandingData(i, r)),
                    [4, new M.S3Service().checkDataExceedingChunkSize(n)]
                  );
                case 1:
                  return a.sent()
                    ? (y.Log.info(
                        "Outstandings are sending in chunk as size is exceeding the request max size"
                      ),
                      i.map(function (e) {
                        (e.userId = t.id),
                          (e.companyId = r.companyId),
                          (e.createdAt = y.DateUtil.now());
                      }),
                      [4, s.bulkCreate(i)])
                    : [3, 5];
                case 2:
                  return (
                    a.sent(),
                    (o.status = p.default.AUTO_REMINDER_STATUS.DB_INSERT),
                    [4, u.update(o, { where: { _id: o._id } })]
                  );
                case 3:
                  return a.sent(), [4, this.dataExceedMaxLimitProcessing(t, r, o)];
                case 4:
                  return a.sent(), [3, 7];
                case 5:
                  return (
                    ((l = new c.default()).user = t),
                    (l.company = r),
                    (l.outstandingData = n),
                    (l.jobId = o.jobId),
                    (l.endOfData = !0),
                    [
                      4,
                      y.Util.retryFunction(
                        f.sendLedgerOutstandingBills,
                        [l],
                        p.default.MAX_AUTO_REMINDER_RETRY_COUNT,
                        1e4,
                        1,
                        "sendLedgerOutstandingBills"
                      ),
                    ]
                  );
                case 6:
                  a.sent(), (a.label = 7);
                case 7:
                  return [2];
                case 8:
                  throw (
                    ((m = a.sent()),
                    y.Log.info(
                      "sendOutstandingBillsForCompany function error  : " +
                        y.Util.getErrorMessage(m)
                    ),
                    m)
                  );
                case 9:
                  return [2];
              }
            });
          });
        }),
        (e.createOutstandingData = function (e, t) {
          var r = {};
          (r.outstandingReminders = e),
            y.Util.isNotNull(t.companyMailingName)
              ? (r.companyName = t.companyMailingName)
              : (r.companyName = t.name);
          var n = "";
          return (
            y.Util.isFilledArray(t.addressList) &&
              t.addressList.map(function (e) {
                y.Util.isNotNull(e.val) && (n += e.val + "\n");
              }),
            (r.companyContact = {
              address: n,
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
        (e.dataExceedMaxLimitProcessing = function (t, r, i) {
          return n(this, void 0, void 0, function () {
            var n, o, s;
            return a(this, function (u) {
              switch (u.label) {
                case 0:
                  (n = l.default.getV1(e, t.id, r)),
                    (o = function () {
                      var o, u, l, m, d, b, h;
                      return a(this, function (a) {
                        switch (a.label) {
                          case 0:
                            return [4, n.findAll({ limit: 500 })];
                          case 1:
                            return (o = a.sent()), [4, n.count()];
                          case 2:
                            if (((u = a.sent()), (l = void 0), y.Util.isNull(o) || 0 === o.length))
                              return [2, "break"];
                            (l = !(!y.Util.isNotNull(u) || u !== o.length)), (a.label = 3);
                          case 3:
                            return (
                              a.trys.push([3, 10, , 11]),
                              (m = e.createOutstandingData(o, r)),
                              [4, new M.S3Service().checkDataExceedingChunkSize(m)]
                            );
                          case 4:
                            return a.sent()
                              ? [
                                  4,
                                  s.checkOneByOneSize(
                                    t,
                                    r,
                                    o,
                                    i.ledgerList.jobScheduleForToday,
                                    l,
                                    4
                                  ),
                                ]
                              : [3, 6];
                          case 5:
                            return a.sent(), [3, 9];
                          case 6:
                            return (
                              ((d = new c.default()).user = t),
                              (d.company = r),
                              (d.outstandingData = m),
                              (d.jobId = i.ledgerList.jobScheduleForToday),
                              (d.endOfData = l),
                              [
                                4,
                                y.Util.retryFunction(
                                  f.sendLedgerOutstandingBills,
                                  [d],
                                  p.default.MAX_AUTO_REMINDER_RETRY_COUNT,
                                  1e4,
                                  1,
                                  "sendLedgerOutstandingBills"
                                ),
                              ]
                            );
                          case 7:
                            return (
                              a.sent(),
                              (b = []),
                              o.map(function (e) {
                                b.push(e._id);
                              }),
                              [4, s.deleteByIds(t, r, b)]
                            );
                          case 8:
                            a.sent(), (a.label = 9);
                          case 9:
                            return [3, 11];
                          case 10:
                            return (
                              (h = a.sent()),
                              y.Log.error(
                                "dataExceedMaxLimitProcessing func Error :" +
                                  y.Util.getErrorMessage(h)
                              ),
                              [2, "break"]
                            );
                          case 11:
                            return [2];
                        }
                      });
                    }),
                    (s = this),
                    (u.label = 1);
                case 1:
                  return [5, o()];
                case 2:
                  return "break" === u.sent() ? [3, 3] : [3, 1];
                case 3:
                  return [2, !0];
              }
            });
          });
        }),
        (e.checkOneByOneSize = function (t, r, i, o, s, u) {
          return n(this, void 0, void 0, function () {
            var n, l, m, d, b, h, g, M, S, A, O, N, v;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  a.trys.push([0, 13, , 14]), (a.label = 1);
                case 1:
                  if (y.Util.isNull(i) || 0 === i.length) return [3, 12];
                  (n = i.length), (l = 0), (m = []), (d = []), (b = 0), (h = i), (a.label = 2);
                case 2:
                  return b < h.length
                    ? ((g = h[b]),
                      l++,
                      m.push(g),
                      d.push(g._id),
                      (M = e.createOutstandingData(m, r)),
                      [4, this.createEncryptedBuffer(M)])
                    : [3, 11];
                case 3:
                  return (
                    (S = a.sent()),
                    ((A = S.byteLength) >= 1e6 * u && A < 5e6) || n === l
                      ? (((O = new c.default()).user = t),
                        (O.company = r),
                        (O.outstandingData = M),
                        (O.jobId = o),
                        n !== l
                          ? [3, 5]
                          : ((O.endOfData = s),
                            [
                              4,
                              y.Util.retryFunction(
                                f.sendLedgerOutstandingBills,
                                [O],
                                p.default.MAX_AUTO_REMINDER_RETRY_COUNT,
                                1e4,
                                1,
                                "sendLedgerOutstandingBills"
                              ),
                            ]))
                      : [3, 9]
                  );
                case 4:
                  return a.sent(), [3, 7];
                case 5:
                  return (
                    (O.endOfData = !1),
                    [
                      4,
                      y.Util.retryFunction(
                        f.sendLedgerOutstandingBills,
                        [O],
                        p.default.MAX_AUTO_REMINDER_RETRY_COUNT,
                        1e4,
                        1,
                        "sendLedgerOutstandingBills"
                      ),
                    ]
                  );
                case 6:
                  a.sent(), (a.label = 7);
                case 7:
                  return [4, this.deleteByIds(t, r, d)];
                case 8:
                  return a.sent(), (m = []), (d = []), [3, 10];
                case 9:
                  if (A > 5e6) {
                    if (1 === u)
                      throw (
                        ((N = "Buffer Size is too much heavy(it's about more than 5MB)"),
                        y.Log.info(N),
                        new Error(N))
                      );
                    this.checkOneByOneSize(t, r, m, o, s, u - 1);
                  }
                  a.label = 10;
                case 10:
                  return b++, [3, 2];
                case 11:
                  return [3, 1];
                case 12:
                  return [2];
                case 13:
                  throw (
                    ((v = a.sent()),
                    y.Log.error("check One By One Size Error :" + y.Util.getErrorMessage(v)),
                    v)
                  );
                case 14:
                  return [2];
              }
            });
          });
        }),
        (e.createEncryptedBuffer = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r, n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  (t = new M.S3Service()), (a.label = 1);
                case 1:
                  return a.trys.push([1, 3, , 4]), [4, t.zip(JSON.stringify(e))];
                case 2:
                  return (r = a.sent()), [2, t.encrypt(r)];
                case 3:
                  throw (
                    ((n = a.sent()), y.Log.error("Crypto Error :" + y.Util.getErrorMessage(n)), n)
                  );
                case 4:
                  return [2];
              }
            });
          });
        }),
        (e.clearAllLedgerOutstandingBillData = function (t, r) {
          return n(this, void 0, void 0, function () {
            return a(this, function (n) {
              switch (n.label) {
                case 0:
                  return [4, l.default.getV1(e, t.id, r).truncate()];
                case 1:
                  return [2, n.sent()];
              }
            });
          });
        }),
        (e.deleteByIds = function (t, r, i) {
          return n(this, void 0, void 0, function () {
            var n, o, s, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  (n = l.default.getV1(e, t.id, r)), (o = 0), (s = i), (a.label = 1);
                case 1:
                  return o < s.length
                    ? ((u = s[o]), [4, n.destroy({ where: { _id: u } })])
                    : [3, 4];
                case 2:
                  a.sent(), (a.label = 3);
                case 3:
                  return o++, [3, 1];
                case 4:
                  return [2];
              }
            });
          });
        }),
        (e.getMetaDataForRetryInfo = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (r = g.AppSettingMetadata.REMINDER_RETRY_INFO + "_" + t.companyId),
                    [4, new S.default(e.id).get(r)]
                  );
                case 1:
                  return (
                    (n = a.sent()),
                    y.Util.isNotNull(n) && y.Util.isNotNull(n.data) ? [2, JSON.parse(n.data)] : [2]
                  );
              }
            });
          });
        }),
        (e.setMetaDataForRetryInfo = function (e, t, r) {
          return n(this, void 0, void 0, function () {
            var n, i, o;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (n = g.AppSettingMetadata.REMINDER_RETRY_INFO + "_" + t.companyId),
                    (i = new S.default(e.id)),
                    (o = new g.AppSettingMetadata(n, JSON.stringify(r))),
                    [4, i.set(o)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.checkRetry = function (t, r) {
          return n(this, void 0, void 0, function () {
            var n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, e.getMetaDataForRetryInfo(r, t)];
                case 1:
                  return (
                    (n = a.sent()),
                    y.Util.isNotNull(n) &&
                    y.Util.isNotNull(n.retryCount) &&
                    y.Util.isNotNull(n.updatedAt) &&
                    n.updatedAt + 1e4 * n.retryCount > y.DateUtil.now(t.timezone)
                      ? (y.Log.info(
                          "Due to last failure we will retry after " +
                            (1e4 * n.retryCount) / 1e3 +
                            " sec. Current Retry count " +
                            n.retryCount +
                            " ."
                        ),
                        [2, !0])
                      : [2, !1]
                  );
              }
            });
          });
        }),
        (e.addToRetry = function (t, r) {
          return n(this, void 0, void 0, function () {
            var n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, e.getMetaDataForRetryInfo(r, t)];
                case 1:
                  return (
                    (n = a.sent()),
                    y.Util.isNotNull(n)
                      ? ((n.retryCount += 1), (n.updatedAt = y.DateUtil.now(t.timezone)))
                      : (n = { retryCount: 1, updatedAt: y.DateUtil.now(t.timezone) }),
                    [4, e.setMetaDataForRetryInfo(r, t, n)]
                  );
                case 2:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.deleteExsitingRetry = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r;
            return a(this, function (n) {
              switch (n.label) {
                case 0:
                  return (
                    (r = g.AppSettingMetadata.REMINDER_RETRY_INFO + "_" + e.companyId),
                    [4, new S.default(t.id).delete(r)]
                  );
                case 1:
                  return [2, n.sent()];
              }
            });
          });
        }),
        (e.masterName = "LedgerOutstandingBill"),
        e
      );
    })();
  t.default = O;
};
