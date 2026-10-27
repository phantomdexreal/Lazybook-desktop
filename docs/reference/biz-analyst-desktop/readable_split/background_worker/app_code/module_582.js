// webpack module #582 (from background_worker, BA Mobile Connector 8.4.41)
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
      },
    i = this;
  Object.defineProperty(t, "__esModule", { value: !0 });
  var o = r(108),
    s = r(152),
    u = r(224),
    p = r(567),
    c = r(245),
    l = r(85),
    m = r(201),
    d = r(26),
    y = r(583),
    b = r(52),
    h = r(59),
    f = r(8),
    g = r(535),
    M = r(30),
    S = r(144),
    A = r(83),
    O = r(388),
    N = r(205),
    v = r(35),
    T = r(147),
    z = r(151),
    I = r(29),
    q = r(28),
    k = r(1631),
    R = r(45),
    C = r(0),
    E = r(145),
    _ = r(23),
    D = r(586),
    L = r(587),
    x = r(588),
    w = r(589),
    P = r(590),
    W = r(48),
    B = r(240),
    U = r(15),
    F = r(150),
    G = r(5);
  process.env.UV_THREADPOOL_SIZE = "128";
  var j = (function () {
    function e() {}
    return (
      (e.checkCompanySyncErrorCode = function (e, t) {
        return (
          !C.Util.isNull(e) &&
          !C.Util.isNull(e.syncDetails) &&
          !C.Util.isNull(e.syncDetails.statusCode) &&
          e.syncDetails.statusCode === t
        );
      }),
      (e.logSyncError = function (t, r, i, o) {
        return n(this, void 0, void 0, function () {
          var n, s, u, p, c, m, d, y, b, g;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  (n = null),
                  (s = null),
                  (u = l.default.getInstance()),
                  (p = {
                    eventType: l.default.EVENT_TYPE.SCREENVIEW,
                    currentScreen: l.default.CURRENT_SCREEN.MY_COMPANY,
                    Platform: l.default.PLATFORM_DESKTOP,
                    feature: l.default.FLOW.FLOW_ONBOARDING,
                  }),
                  (c = this.isMultiComputerSetup()),
                  C.Util.isNotNull(r)
                    ? C.Util.isNotNull(r.message) && r.message.includes(f.default.TALLY_IS_NOT_OPEN)
                      ? ((m = e.backgroundStore.getStoreState()),
                        (s = m.tally.tallyConfig),
                        (d = null),
                        s.host !== f.default.LOCALHOST
                          ? [3, 2]
                          : [4, v.default.tallyConnectionDetails(s.port)])
                      : [3, 3]
                    : [3, 4]
                );
              case 1:
                return (
                  (d = a.sent()).isTallyOpen && !1 === d.isOdbcPortOpen
                    ? ((n = h.SYNC_STATUS_CODE.TALLY_ODBC_PORT_NOT_OPEN), u.odbcPortNotOpenEvent(p))
                    : ((n = h.SYNC_STATUS_CODE.TALLY_NOT_OPEN_SAME_COMPUTER),
                      u.tallyNotOpenEvent(p)),
                  [3, 3]
                );
              case 2:
                ((n = h.SYNC_STATUS_CODE.TALLY_NOT_OPEN_DIFF_COMPUTER),
                  u.tallyRunningOnDifferentComputerEvent(p),
                  (a.label = 3));
              case 3:
                return [3, 5];
              case 4:
                (C.Util.isFilledArray(o)
                  ? ((n = h.SYNC_STATUS_CODE.COMPANY_NOT_OPEN), u.companyNotSelectedEvent(p))
                  : (n = h.SYNC_STATUS_CODE.SYNC_ERROR),
                  (a.label = 5));
              case 5:
                return (
                  C.Log.debug("This is syncError " + n),
                  C.Util.isNotNull(n)
                    ? [
                        h.SYNC_STATUS_CODE.TALLY_ODBC_PORT_NOT_OPEN,
                        h.SYNC_STATUS_CODE.TALLY_NOT_OPEN_SAME_COMPUTER,
                        h.SYNC_STATUS_CODE.TALLY_NOT_OPEN_DIFF_COMPUTER,
                      ].indexOf(n) > -1
                      ? C.Util.isNotNull(i)
                        ? !1 !== e.checkCompanySyncErrorCode(i, n)
                          ? [3, 7]
                          : ((i.syncDetails = {
                              lastSyncTime: C.DateUtil.now(),
                              message: null,
                              statusCode: n,
                              host: s.host,
                              port: s.port,
                            }),
                            [4, F.updateSyncDetailForCompany(t, i, c)])
                        : [3, 8]
                      : [3, 12]
                    : [3, 17]
                );
              case 6:
                (a.sent(), (a.label = 7));
              case 7:
                return [3, 11];
              case 8:
                return [4, M.default.get(new h.default(), t.id).findAll()];
              case 9:
                return (
                  (y = a.sent()),
                  (b = y.filter(function (t) {
                    return (
                      !1 === e.checkCompanySyncErrorCode(t, n) &&
                      ((t.syncDetails = {
                        lastSyncTime: C.DateUtil.now(),
                        message: null,
                        statusCode: n,
                        host: s.host,
                        port: s.port,
                      }),
                      !0)
                    );
                  })),
                  C.Util.isFilledArray(b) ? [4, F.updateSyncDetailForCompanies(t, b, c)] : [3, 11]
                );
              case 10:
                (a.sent(), (a.label = 11));
              case 11:
                return [3, 17];
              case 12:
                return n !== h.SYNC_STATUS_CODE.COMPANY_NOT_OPEN
                  ? [3, 15]
                  : ((b = o.filter(function (t) {
                      return (
                        !1 === e.checkCompanySyncErrorCode(t, n) &&
                        ((t.syncDetails = {
                          lastSyncTime: C.DateUtil.now(),
                          message: null,
                          statusCode: n,
                        }),
                        !0)
                      );
                    })),
                    C.Util.isFilledArray(b)
                      ? [4, F.updateSyncDetailForCompanies(t, b, c)]
                      : [3, 14]);
              case 13:
                (a.sent(), (a.label = 14));
              case 14:
                return [3, 17];
              case 15:
                return C.Util.isNotNull(i)
                  ? ((g =
                      C.Util.isNotNull(r) && C.Util.isNotNull(r.message)
                        ? r.message
                        : JSON.stringify(r)),
                    !1 !== e.checkCompanySyncErrorCode(i, n)
                      ? [3, 17]
                      : ((i.syncDetails = {
                          lastSyncTime: C.DateUtil.now(),
                          message: g,
                          statusCode: n,
                        }),
                        [4, F.updateSyncDetailForCompany(t, i, c)]))
                  : [3, 17];
              case 16:
                (a.sent(), (a.label = 17));
              case 17:
                return [2];
            }
          });
        });
      }),
      (e.sendPathChangeError = function (t, r) {
        var n = t;
        ((n.errorMessage = W.getTallyPathChangeMessage(t)),
          C.Log.info("Different Path Detected: " + n.errorMessage),
          !1 === r && C.Log.info("Sync failed due to mismatch in server-local last sync time"),
          e.store.dispatch(o.setCurrentlySyncingCompany(t)));
      }),
      (e.checkConditionForSplitCompany = function (t, r) {
        return n(this, void 0, void 0, function () {
          var n, i, o;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return C.Util.isNull(r.syncFrom) || C.Util.isNull(r.startingFrom)
                  ? [2]
                  : ((n = C.DateUtil.getStartOfDate(r.syncFrom, R.Duration.MONTH, r.timezone)),
                    (i = C.DateUtil.getStartOfDate(r.startingFrom, R.Duration.MONTH, r.timezone)),
                    n < i
                      ? (C.Log.info(
                          "company startingFrom: " + r.startingFrom + " syncFrom: " + r.syncFrom,
                        ),
                        ((o = new h.default()).companyId = r.companyId),
                        (o.syncFrom = r.startingFrom),
                        [4, W.updateCompany(t, o, !1)])
                      : [3, 2]);
              case 1:
                (a.sent(),
                  e.analyticManager.companyResynced(r, "SPLIT_COMPANY"),
                  C.Log.info("Resync Data from Split Company: " + r.name),
                  e.store.dispatch(
                    s.performDeleteData(
                      t,
                      r,
                      f.default.AUTO_DATA_RESYNC,
                      "Resync due to split company",
                    ),
                  ),
                  (a.label = 2));
              case 2:
                return [2];
            }
          });
        });
      }),
      (e.syncNow = function (t) {
        return n(this, void 0, void 0, function () {
          var r, n, i, u, p, c, m, b, g, M, S, A, O, N, T, q, k, R, E, D, L, x, w;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                (C.DateUtil.now(), (r = []), (a.label = 1));
              case 1:
                return (a.trys.push([1, 3, , 5]), [4, e.syncAbleCompaniesWithRetry(t)]);
              case 2:
                return ((r = a.sent()), (r = h.default.initializeLastSyncMeta(r)), [3, 5]);
              case 3:
                return (
                  (n = a.sent()),
                  C.Log.error("Error in syncing. Logging sync error"),
                  [4, e.logSyncError(t, n, null, null)]
                );
              case 4:
                throw (a.sent(), n);
              case 5:
                return ((i = this.isMultiComputerSetup()), [4, F.isAdminLoginInTally(t.id)]);
              case 6:
                return (
                  (u = a.sent()),
                  (p = !1),
                  (c = []),
                  (m = d.default.get(d.default.TALLY_VERSION_INFO_TIME)),
                  (b = C.DateUtil.now()),
                  C.Util.isNull(m) || C.DateUtil.addDays(m, 1) < b
                    ? [4, v.default.getInstance().getTallyVerisonInfo()]
                    : [3, 8]
                );
              case 7:
                ((g = a.sent()),
                  d.default.set(d.default.TALLY_VERSION_INFO, g),
                  d.default.set(d.default.TALLY_VERSION_INFO_TIME, b),
                  (a.label = 8));
              case 8:
                ((M = 0), (S = r), (a.label = 9));
              case 9:
                if (!(M < S.length)) return [3, 39];
                ((A = S[M]),
                  (O = this.needToSyncCompany(A, t)),
                  C.Log.debug("Syncing company " + JSON.stringify(A)),
                  C.Log.debug("Subscription status " + O),
                  (a.label = 10));
              case 10:
                return (
                  a.trys.push([10, 36, , 38]),
                  O
                    ? ((N = new I.CompanySyncEvent()).initCompany(A),
                      C.Log.info('Syncing: "' + A.name + '" from: ' + A.destination),
                      !0 === A.isCompanyAlterIdNegative
                        ? ((A.err =
                            "You would need to rewrite Tally Data for your company: " +
                            A.name +
                            ". Please contact us at help@siliconveins.com so that we can guide you regarding the same."),
                          C.Log.info("Data rewrite: " + A.err),
                          C.Log.info(
                            "Voucher Alter Id: " + A.altVchId + " | Master Alter Id: " + A.altMstId,
                          ),
                          e.store.dispatch(o.setCurrentlySyncingCompany(A)),
                          e.store.dispatch(o.setAlterIdNegativeError(A.err)),
                          [3, 38])
                        : [4, W.isServerDataUploadTimeConsistent(A, t)])
                    : [3, 31]
                );
              case 11:
                return (
                  (T = a.sent()),
                  !1 !== W.isCompanyOpenFromDifferentPath(A) || !0 !== T
                    ? [3, 29]
                    : (C.Log.debug("Debug: setSyncCompany"),
                      e.setSyncCompany(A.companyId),
                      [4, z.BizAnalystService.updateTallyLicenseIfNotPresent(t, A)])
                );
              case 12:
                return (
                  !0 === a.sent() && (p = !0),
                  C.Log.debug("Debug: Resync Check"),
                  C.Util.isNotNull(A.isResyncRequired) &&
                    !0 === A.isResyncRequired &&
                    (e.analyticManager.companyResynced(A, "APP_FAIL_TO_SYNC"),
                    C.Log.info(
                      "Resync required for company: " +
                        A.name +
                        ". Resyncing data because previous sync failed to parse data in app.",
                    ),
                    e.store.dispatch(
                      s.performDeleteData(
                        t,
                        A,
                        f.default.AUTO_DATA_RESYNC,
                        "Resync due to fail to parse data in app",
                      ),
                    )),
                  [4, this.checkIsFirstSync(t, A)]
                );
              case 13:
                return (
                  (q = a.sent()),
                  C.Log.debug("Is first time sync: " + q),
                  (N.isFirstSync = q),
                  [4, this.isFirstTimeSync(t)]
                );
              case 14:
                return (
                  a.sent() &&
                    ((k = l.default.getInstance()),
                    (R = {
                      eventType: l.default.EVENT_TYPE.SERVER,
                      Platform: l.default.PLATFORM_DESKTOP,
                      feature: l.default.FLOW.FLOW_ONBOARDING,
                    }),
                    k.firstCompanySyncStartEvent(R)),
                  C.Log.debug("Debug: Entering checkConditionForSplitCompany"),
                  [4, this.checkConditionForSplitCompany(t, A)]
                );
              case 15:
                return (
                  a.sent(),
                  C.Log.debug("Debug: Exiting checkConditionForSplitCompany"),
                  C.Log.debug("Debug: Entering fixLrDateSyncIssue"),
                  [4, e.fixLrDateSyncIssue(t, A)]
                );
              case 16:
                return (
                  a.sent(),
                  C.Log.debug("Debug: Exiting fixLrDateSyncIssue"),
                  C.Log.debug("Debug: Entering fixPartialResyncIssue"),
                  [4, e.fixPartialResyncIssue(t, A)]
                );
              case 17:
                return (
                  a.sent(),
                  C.Log.debug("Debug: Exiting fixPartialResyncIssue"),
                  C.Log.debug("Debug: Entering syncDataEntry"),
                  [4, e.syncDataEntry(t, A)]
                );
              case 18:
                return (
                  a.sent(),
                  C.Log.debug("Debug: Exiting syncDataEntry"),
                  C.Log.debug("Debug: Entering syncMasters"),
                  (E = N),
                  [4, e.syncMasters(t, A, q)]
                );
              case 19:
                return (
                  (E.master = a.sent()),
                  N.master.calcTime(),
                  C.Log.debug("Debug: Exiting syncMasters"),
                  C.Log.debug("Debug: Entering syncVouchers"),
                  (D = N),
                  [4, e.syncVouchers(t, A, u, q)]
                );
              case 20:
                return (
                  (D.vouchers = a.sent()),
                  N.vouchers.calcTime(),
                  C.Log.debug("Debug: Exiting syncVouchers"),
                  C.Log.debug("Debug: Entering syncLedgerClosing"),
                  [4, e.syncLedgerClosing(t, A, u, q)]
                );
              case 21:
                return (
                  a.sent(),
                  C.Log.debug("Debug: Exiting syncLedgerClosing"),
                  C.Log.debug("Debug: Entering duplicateMasterIdCheck"),
                  [4, e.duplicateMasterIdCheck(t, A)]
                );
              case 22:
                return (
                  a.sent(),
                  C.Log.debug("Debug: Exiting duplicateMasterIdCheck"),
                  C.Log.debug("Debug: Entering setCompanyLastSyncTime"),
                  e.setCompanyLastSyncTime(A.companyId),
                  C.Log.debug("Debug: Exiting setCompanyLastSyncTime"),
                  C.Log.debug("Debug: Entering checkFirstSyncAndNotify"),
                  [4, e.checkFirstSyncAndNotify(A.companyId, t)]
                );
              case 23:
                return (
                  a.sent(),
                  C.Log.debug("Debug: Exiting checkFirstSyncAndNotify"),
                  C.Log.debug("Debug: Entering isFirstCompanySynced"),
                  [4, e.isFirstCompanySynced(A, t)]
                );
              case 24:
                return (
                  a.sent(),
                  C.Log.debug("Debug: Exiting isFirstCompanySynced"),
                  C.Log.debug("Debug: Entering fetchUserDetail"),
                  [4, e.fetchUserDetail(t)]
                );
              case 25:
                return (
                  a.sent(),
                  C.Log.debug("Debug: Exiting fetchUserDetail"),
                  C.Log.debug("Debug: Done"),
                  !1 !== e.checkCompanySyncErrorCode(A, h.SYNC_STATUS_CODE.SYNC_SUCCESS)
                    ? [3, 27]
                    : ((A.syncDetails = {
                        lastSyncTime: C.DateUtil.now(),
                        message: null,
                        statusCode: h.SYNC_STATUS_CODE.SYNC_SUCCESS,
                      }),
                      [4, F.updateSyncDetailForCompany(t, A, i)])
                );
              case 26:
                (a.sent(), (a.label = 27));
              case 27:
                return [4, z.BizAnalystService.updateDataSyncDetails(t, A)];
              case 28:
                return (
                  !0 === a.sent() && (p = !0),
                  (N.endTime = C.DateUtil.now()),
                  (N.duration = N.endTime - N.startTime),
                  c.push(N),
                  [3, 30]
                );
              case 29:
                (this.sendPathChangeError(A, T), (a.label = 30));
              case 30:
                return [3, 32];
              case 31:
                ((A.err = f.default.SUBSCRIPTION_EXPIRY_MESSAGE),
                  C.Log.info("Subscription Error: " + A.err),
                  e.store.dispatch(o.setCurrentlySyncingCompany(A)),
                  e.store.dispatch(o.setSubscriptionExpiry(A.err)),
                  (a.label = 32));
              case 32:
                return (
                  a.trys.push([32, 34, , 35]),
                  [4, new y.default(t, A).setAutoReminderSettings()]
                );
              case 33:
                return (a.sent(), [3, 35]);
              case 34:
                return (
                  (L = a.sent()),
                  C.Log.info("setAutoReminderSettings Error : " + C.Util.getErrorMessage(L)),
                  [3, 35]
                );
              case 35:
                return [3, 38];
              case 36:
                return (
                  (x = a.sent()),
                  C.Log.exception(x, "Failed to sync company: " + A.name),
                  C.Util.isNotNull(x) &&
                    (JSON.stringify(x).includes("Company subscription has expired")
                      ? ((w = _.formatError(x)),
                        e.store.dispatch(o.setSubscriptionExpiry(w.message)))
                      : e.isDataMismatchIssueWithServer(x) && this.sendPathChangeError(A, !1)),
                  [4, e.logSyncError(t, x, A, null)]
                );
              case 37:
                return (a.sent(), [3, 38]);
              case 38:
                return (M++, [3, 9]);
              case 39:
                return (
                  C.Log.info("Desktop Version:: " + f.default.APP_VERSION),
                  !0 === p && e.store.dispatch(s.getAddedCompanies(t)),
                  C.Util.isFilledArray(r) ? [4, e.updateTallyLicenceOnSubscription(t)] : [3, 41]
                );
              case 40:
                (a.sent(), (a.label = 41));
              case 41:
                return [2];
            }
          });
        });
      }),
      (e.isMultiComputerSetup = function () {
        var t = !1;
        return (
          e.backgroundStore.getStoreState().tally.tallyConfig.host != f.default.LOCALHOST &&
            (t = !0),
          t
        );
      }),
      (e.checkIsFirstSync = function (e, t) {
        return n(this, void 0, void 0, function () {
          var r;
          return a(this, function (n) {
            switch (n.label) {
              case 0:
                return (null, [4, new O.default(e.id, t).get(q.Voucher.masterName)]);
              case 1:
                return ((r = n.sent()), [2, !!C.Util.isNull(r) || r.firstSync]);
            }
          });
        });
      }),
      (e.isFirstTimeSync = function (e) {
        return n(this, void 0, void 0, function () {
          var t, r;
          return a(this, function (n) {
            switch (n.label) {
              case 0:
                return (
                  (t = m.default.USER_FIRST_COMPANY_SYNC + "_" + e.id),
                  [4, new A.default(e.id).get(t)]
                );
              case 1:
                return ((r = n.sent()), C.Util.isNull(r) ? [2, !0] : [2, !1]);
            }
          });
        });
      }),
      (e.isDataMismatchIssueWithServer = function (e) {
        if (C.Util.isNotNull(e) && JSON.stringify(e).includes(f.default.SERVER_SYNC_ERROR))
          return !0;
        return !1;
      }),
      (e.syncAbleCompaniesWithRetry = function (t, r) {
        return (
          void 0 === r && (r = 0),
          n(this, void 0, void 0, function () {
            var n, i, o;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, e.getSyncCompanies(t)];
                case 1:
                  return (
                    (n = a.sent()),
                    C.Util.isFilledArray(n)
                      ? 2 === r
                        ? ((i = n.filter(function (e) {
                            return C.Util.isNull(e.altVchId);
                          })),
                          C.Util.isFilledArray(i) && C.Log.info(i.length + " Companies won't sync"),
                          [
                            2,
                            n.filter(function (e) {
                              return C.Util.isNotNull(e.altVchId);
                            }),
                          ])
                        : ((o = n.filter(function (e) {
                            return C.Util.isNull(e.altVchId);
                          })),
                          C.Util.isFilledArray(o) ? [4, C.Util.sleep(5e3 * (r + 1))] : [3, 4])
                      : [3, 5]
                  );
                case 2:
                  return (a.sent(), [4, e.syncAbleCompaniesWithRetry(t, r + 1)]);
                case 3:
                  return [2, a.sent()];
                case 4:
                case 5:
                  return [2, n];
              }
            });
          })
        );
      }),
      (e.getSyncCompanies = function (t) {
        return n(this, void 0, void 0, function () {
          var r, n, i, o, s, u, p, c, l, m, d, y;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return [4, M.default.get(new h.default(), t.id).findAll()];
              case 1:
                return (
                  (r = a.sent()),
                  h.default.setLocalCompany(r),
                  [4, v.default.getInstance().getCompanies()]
                );
              case 2:
                for (n = a.sent(), i = new Map(), o = 0, s = n; o < s.length; o++)
                  ((u = s[o]), i.set(u.tallyCompanyName.trim(), u));
                if (((p = []), (c = []), r.length > 0))
                  for (l = 0, m = r; l < m.length; l++)
                    ((d = m[l]),
                      (y = new h.default()).update(d),
                      !y.isDeleted && y.isSync && i.has(y.tallyCompanyName.trim())
                        ? (y.updateFromTally(i.get(y.tallyCompanyName.trim())), p.push(y))
                        : y.isDeleted ||
                          !y.isSync ||
                          i.has(y.tallyCompanyName.trim()) ||
                          c.push(y));
                return C.Util.isFilledArray(c) ? [4, e.logSyncError(t, null, null, c)] : [3, 4];
              case 3:
                (a.sent(), (a.label = 4));
              case 4:
                return (
                  C.Log.info(
                    "Companies: Tally: " +
                      n.length +
                      ", Local: " +
                      r.length +
                      ", Sync: " +
                      p.length,
                  ),
                  [2, p]
                );
            }
          });
        });
      }),
      (e.needToSyncCompany = function (e, t) {
        return !0;
      }),
      (e.getMasterUploadData = function (t) {
        for (var r = [], n = 0, a = t; n < a.length; n++) {
          var i = a[n];
          C.Util.getObjectSize(i) <= e.fileUploadLimit
            ? r.push(i)
            : (r = r.concat(C.Util.createObjectChunkForMaster(i, e.fileUploadLimit)));
        }
        return r;
      }),
      (e.syncMasters = function (t, r, i) {
        return n(this, void 0, void 0, function () {
          var n,
            s,
            p,
            l,
            m,
            y,
            b,
            g,
            S,
            A,
            v,
            T,
            R,
            E,
            _,
            D,
            L,
            x,
            w,
            P,
            B,
            U,
            F,
            j,
            V,
            Y,
            H,
            K,
            X,
            J,
            Q,
            $,
            Z,
            ee,
            te;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  C.Log.info("Starting syncMasters"),
                  ((n = new I.MasterStats()).startTime = C.DateUtil.now()),
                  (s = t.id),
                  [4, e.handleUpdates(t, r)]
                );
              case 1:
                (a.sent(),
                  (p = [
                    h.default,
                    q.Currency,
                    q.CostCategory,
                    q.CostCentre,
                    q.Group,
                    q.VoucherType,
                    q.Godown,
                    q.Unit,
                    q.StockGroup,
                    q.StockCategory,
                    q.StockItem,
                    q.GstClassification,
                    q.TdsRate,
                    q.Ledger,
                  ]),
                  (l = W.shouldSyncCompleteMaster()),
                  (m = 0),
                  (y = p),
                  (a.label = 2));
              case 2:
                return m < y.length
                  ? ((Q = y[m]),
                    this.setSyncCompany(r.companyId),
                    (D = new Q()).getName() !== new q.StockItem().getName()
                      ? [3, 4]
                      : [4, M.default.get(new q.Unit(), s, r).findAll()])
                  : [3, 7];
              case 3:
                ((b = a.sent()),
                  q.Voucher.setUnits(b),
                  (b = void 0),
                  C.Log.info("Units set"),
                  (a.label = 4));
              case 4:
                return [4, new N.default(s, D, r).syncMastersWithTally(l)];
              case 5:
                (a.sent(),
                  C.Log.info(D.getName() + ": Finished syncing local db with tally"),
                  (a.label = 6));
              case 6:
                return (m++, [3, 2]);
              case 7:
                return (
                  (n.tallySyncTime = C.DateUtil.now()),
                  l && W.turnOffForceMasterSync(),
                  [4, e.handleUpdates(t, r)]
                );
              case 8:
                (a.sent(),
                  C.Log.info("Done handleUpdates post master sync"),
                  (g = []),
                  (S = 0),
                  (A = {}),
                  (v = !1),
                  (T = 5e3),
                  (R = d.default.get(d.default.MASTER_CHUNK_SIZE_SETTINGS)),
                  C.Util.isNotNull(R) && f.default.YES === R && ((v = !0), (T = 1e3)),
                  (E = 0),
                  (_ = p),
                  (a.label = 9));
              case 9:
                return E < _.length
                  ? ((Q = _[E]),
                    (D = new Q()),
                    (L = M.default.get(D, s, r)),
                    C.Log.info("Getting master by alter id asc: " + D.getName()),
                    [4, L.findAll({ where: { uptoDate: !1 }, order: [["alterId", "ASC"]] })])
                  : [3, 12];
              case 10:
                for (
                  x = a.sent(),
                    C.Log.info("Got master by alter id asc: " + D.getName()),
                    n.itemCount = x.length + n.itemCount,
                    w = 0,
                    P = x;
                  w < P.length;
                  w++
                )
                  ((B = P[w]),
                    (U = c(B.tallyUpdatedAt).valueOf()),
                    G.Master.deleteDateFields(B),
                    (B.updatedAt = U),
                    C.Util.isNull(A[Q.masterName.toLowerCase()]) &&
                      (A[Q.masterName.toLowerCase()] = {}),
                    (A[Q.masterName.toLowerCase()][B._id] = B),
                    ++S >= T && (g.push(A), (S = 0), (A = {})));
                (e.setSyncCompany(r.companyId), (a.label = 11));
              case 11:
                return (E++, [3, 9]);
              case 12:
                if (
                  (C.Log.info("Done getting masters by alter id asc"),
                  C.Util.isEmpty(A) || g.push(A),
                  !0 === v &&
                    (C.Log.info("Getting chunks"),
                    (g = e.getMasterUploadData(g)),
                    C.Log.info("Got master upload data from chunk")),
                  !(g.length > 0))
                )
                  return [3, 23];
                ((j = 0), (V = g), (a.label = 13));
              case 13:
                return j < V.length
                  ? ((Y = V[j]),
                    0 !== Object.keys(Y).length
                      ? [3, 14]
                      : (C.Log.info("No data to upload"), [3, 17]))
                  : [3, 18];
              case 14:
                return (
                  a.trys.push([14, 16, , 17]),
                  [4, z.BizAnalystService.addDataV2(t, r, Y, k.DataType.MASTER, i)]
                );
              case 15:
                return (
                  (F = a.sent()),
                  C.Log.info("Data successfully uploaded to server"),
                  [3, 17]
                );
              case 16:
                return (
                  (H = a.sent()),
                  C.Log.info("Failed to upload data to server"),
                  C.Util.isNotNull(H) &&
                    ((K = JSON.stringify(H)).includes("RequestTimeTooSkewed")
                      ? e.store.dispatch(u.isInvalidDateTime(!0))
                      : K.includes("Company subscription has expired")
                        ? (C.Log.info("Company subscription has expired"),
                          e.store.dispatch(o.setSubscriptionExpiry(H.errorMessage)))
                        : C.Log.info(H)),
                  (F = !1),
                  [3, 18]
                );
              case 17:
                return (j++, [3, 13]);
              case 18:
                if (!0 !== F) return [3, 23];
                ((X = 0), (J = p), (a.label = 19));
              case 19:
                return X < J.length
                  ? ((Q = J[X]),
                    [
                      4,
                      M.default
                        .get(new Q(), s, r)
                        .update({ uptoDate: !0 }, { where: { uptoDate: !1 } }),
                    ])
                  : [3, 22];
              case 20:
                (a.sent(), (a.label = 21));
              case 21:
                return (X++, [3, 19]);
              case 22:
                (C.Log.info("Local DB marked as uptodate for masters"), (a.label = 23));
              case 23:
                if (((n.serverUploadTime = C.DateUtil.now()), !1 === F)) return [3, 28];
                (($ = 0), (Z = p), (a.label = 24));
              case 24:
                return $ < Z.length
                  ? ((ee = Z[$]),
                    (te = new O.default(s, r)),
                    { masterName: ee.masterName },
                    [4, te.update({ uptoDate: !0 }, { where: { uptoDate: !1 } })])
                  : [3, 27];
              case 25:
                (a.sent(), (a.label = 26));
              case 26:
                return ($++, [3, 24]);
              case 27:
                (C.Log.info("Sync metadata marked as upto date for masters"), (a.label = 28));
              case 28:
                return [2, n];
            }
          });
        });
      }),
      (e.handleUpdates = function (t, r) {
        return n(this, void 0, void 0, function () {
          return a(this, function (n) {
            switch (n.label) {
              case 0:
                return (C.Log.info("Starting handleUpdates"), [4, e.handleMasterUpdates(t, r)]);
              case 1:
                return (n.sent(), [4, e.handleVoucherUpdates(t, r)]);
              case 2:
                return (n.sent(), C.Log.info("Finished handling updates"), [2]);
            }
          });
        });
      }),
      (e.getUpdatedNames = function (e) {
        var t = [];
        if (C.Util.isNotNull(e))
          for (var r = 0, n = e; r < n.length; r++) {
            var a = n[r];
            C.Util.isNotNull(a.oldName) && t.push(a);
          }
        return t;
      }),
      (e.handleMasterUpdates = function (e, t) {
        return n(this, void 0, void 0, function () {
          var r,
            n,
            i,
            o,
            s,
            u,
            p,
            c,
            l,
            m,
            d,
            y,
            b,
            h,
            f,
            g,
            S,
            A,
            O,
            N,
            v,
            T,
            z,
            I,
            k,
            R,
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
            V,
            Y,
            H,
            K,
            X,
            J,
            Q,
            $,
            Z,
            ee,
            te,
            re,
            ne,
            ae,
            ie,
            oe,
            se,
            ue,
            pe,
            ce,
            le,
            me,
            de,
            ye,
            be,
            he,
            fe,
            ge,
            Me;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  C.Log.info("Starting handleMasterUpdates"),
                  (r = e.id),
                  (n = M.default.get(new q.Group(), r, t)),
                  C.Log.info("Getting updated groups"),
                  [4, n.findAll({ where: { oldName: { $ne: null } } })]
                );
              case 1:
                if (((i = a.sent()), (o = new Map()), !C.Util.isNotNull(i))) return [3, 15];
                for (s = 0, u = i; s < u.length; s++) ((A = u[s]), o.set(A.oldName, A));
                return [4, n.findAll()];
              case 2:
                if (((p = a.sent()), !C.Util.isNotNull(p))) return [3, 6];
                ((c = 0), (l = p), (a.label = 3));
              case 3:
                return c < l.length
                  ? ((A = l[c]),
                    (f = o.get(A.parentGroup)),
                    C.Util.isNotNull(f)
                      ? ((A.parentGroup = f.name),
                        (A.uptoDate = !1),
                        [4, n.update(A, { where: { _id: A._id } })])
                      : [3, 5])
                  : [3, 6];
              case 4:
                (a.sent(), (a.label = 5));
              case 5:
                return (c++, [3, 3]);
              case 6:
                return (
                  C.Log.info("Getting all ledgers"),
                  [4, (m = M.default.get(new q.Ledger(), r, t)).findAll()]
                );
              case 7:
                if (((d = a.sent()), !C.Util.isNotNull(d))) return [3, 11];
                ((y = 0), (b = d), (a.label = 8));
              case 8:
                return y < b.length
                  ? ((h = b[y]),
                    (f = o.get(h.parentGroup)),
                    C.Util.isNotNull(f)
                      ? ((h.parentGroup = f.name),
                        (h.uptoDate = !1),
                        [4, m.update(h, { where: { _id: h._id } })])
                      : [3, 10])
                  : [3, 11];
              case 9:
                (a.sent(), (a.label = 10));
              case 10:
                return (y++, [3, 8]);
              case 11:
                ((g = 0), (S = i), (a.label = 12));
              case 12:
                return g < S.length
                  ? (((A = S[g]).oldName = null), [4, n.update(A, { where: { _id: A._id } })])
                  : [3, 15];
              case 13:
                (a.sent(), (a.label = 14));
              case 14:
                return (g++, [3, 12]);
              case 15:
                ((O = M.default.get(new q.StockItem(), r, t)),
                  C.Log.info("Getting all stock items"),
                  (N = []),
                  (v = -1),
                  (a.label = 16));
              case 16:
                return [
                  4,
                  O.findAll({
                    order: [["masterId", "ASC"]],
                    limit: 1e3,
                    where: { masterId: { $gt: v } },
                  }),
                ];
              case 17:
                return (
                  (T = a.sent()),
                  C.Log.info("Stock items with last master id: " + v),
                  C.Util.isNull(T) || 0 === T.length
                    ? [3, 18]
                    : ((v = T[T.length - 1].masterId), N.push.apply(N, T), [3, 16])
                );
              case 18:
                return [
                  4,
                  (z = M.default.get(new q.StockGroup(), r, t)).findAll({
                    where: { oldName: { $ne: null } },
                  }),
                ];
              case 19:
                if (((I = a.sent()), (k = new Map()), !C.Util.isNotNull(I))) return [3, 32];
                for (R = 0, E = I; R < E.length; R++) ((x = E[R]), k.set(x.oldName, x));
                return [4, z.findAll()];
              case 20:
                if (((_ = a.sent()), !C.Util.isNotNull(_))) return [3, 24];
                ((D = 0), (L = _), (a.label = 21));
              case 21:
                return D < L.length
                  ? ((x = L[D]),
                    (W = k.get(x.parentGroup)),
                    C.Util.isNotNull(W)
                      ? ((x.parentGroup = W.name),
                        (x.uptoDate = !1),
                        [4, z.update(x, { where: { _id: x._id } })])
                      : [3, 23])
                  : [3, 24];
              case 22:
                (a.sent(), (a.label = 23));
              case 23:
                return (D++, [3, 21]);
              case 24:
                if (!C.Util.isNotNull(N)) return [3, 28];
                ((w = 0), (P = N), (a.label = 25));
              case 25:
                return w < P.length
                  ? ((ee = P[w]),
                    (W = k.get(ee.parentGroup)),
                    C.Util.isNotNull(W)
                      ? ((ee.parentGroup = W.name),
                        (ee.uptoDate = !1),
                        [4, O.update(ee, { where: { _id: ee._id } })])
                      : [3, 27])
                  : [3, 28];
              case 26:
                (a.sent(), (a.label = 27));
              case 27:
                return (w++, [3, 25]);
              case 28:
                ((B = 0), (U = I), (a.label = 29));
              case 29:
                return B < U.length
                  ? (((F = U[B]).oldName = null), [4, z.update(F, { where: { _id: F._id } })])
                  : [3, 32];
              case 30:
                (a.sent(), (a.label = 31));
              case 31:
                return (B++, [3, 29]);
              case 32:
                return [
                  4,
                  (G = M.default.get(new q.StockCategory(), r, t)).findAll({
                    where: { oldName: { $ne: null } },
                  }),
                ];
              case 33:
                if (((j = a.sent()), (V = new Map()), !C.Util.isNotNull(j))) return [3, 46];
                for (Y = 0, H = j; Y < H.length; Y++) ((Q = H[Y]), V.set(Q.oldName, Q));
                return (C.Log.info("Getting all stock categories"), [4, G.findAll()]);
              case 34:
                if (((K = a.sent()), !C.Util.isNotNull(K))) return [3, 38];
                ((X = 0), (J = K), (a.label = 35));
              case 35:
                return X < J.length
                  ? ((Q = J[X]),
                    (te = V.get(Q.parentGroup)),
                    C.Util.isNotNull(te)
                      ? ((Q.parentGroup = te.name),
                        (Q.uptoDate = !1),
                        [4, G.update(Q, { where: { _id: Q._id } })])
                      : [3, 37])
                  : [3, 38];
              case 36:
                (a.sent(), (a.label = 37));
              case 37:
                return (X++, [3, 35]);
              case 38:
                if (!C.Util.isNotNull(N)) return [3, 42];
                (($ = 0), (Z = N), (a.label = 39));
              case 39:
                return $ < Z.length
                  ? ((ee = Z[$]),
                    (te = V.get(ee.category)),
                    C.Util.isNotNull(te)
                      ? ((ee.category = te.name),
                        (ee.uptoDate = !1),
                        [4, O.update(ee, { where: { _id: ee._id } })])
                      : [3, 41])
                  : [3, 42];
              case 40:
                (a.sent(), (a.label = 41));
              case 41:
                return ($++, [3, 39]);
              case 42:
                ((re = 0), (ne = j), (a.label = 43));
              case 43:
                return re < ne.length
                  ? (((ae = ne[re]).oldName = null), [4, G.update(ae, { where: { _id: ae._id } })])
                  : [3, 46];
              case 44:
                (a.sent(), (a.label = 45));
              case 45:
                return (re++, [3, 43]);
              case 46:
                return [
                  4,
                  (ie = M.default.get(new q.CostCategory(), r, t)).findAll({
                    where: { oldName: { $ne: null } },
                  }),
                ];
              case 47:
                if (((oe = a.sent()), (se = new Map()), !C.Util.isNotNull(oe))) return [3, 56];
                for (ue = 0, pe = oe; ue < pe.length; ue++) ((ce = pe[ue]), se.set(ce.oldName, ce));
                return [4, (le = M.default.get(new q.CostCentre(), r, t)).findAll()];
              case 48:
                if (((me = a.sent()), !C.Util.isNotNull(me))) return [3, 52];
                ((de = 0), (ye = me), (a.label = 49));
              case 49:
                return de < ye.length
                  ? ((be = ye[de]),
                    (he = se.get(be.parent)),
                    C.Util.isNotNull(he)
                      ? ((be.parent = he.name),
                        (be.uptoDate = !1),
                        [4, le.update(be, { where: { _id: be._id } })])
                      : [3, 51])
                  : [3, 52];
              case 50:
                (a.sent(), (a.label = 51));
              case 51:
                return (de++, [3, 49]);
              case 52:
                ((fe = 0), (ge = oe), (a.label = 53));
              case 53:
                return fe < ge.length
                  ? (((Me = ge[fe]).oldName = null), [4, ie.update(Me, { where: { _id: Me._id } })])
                  : [3, 56];
              case 54:
                (a.sent(), (a.label = 55));
              case 55:
                return (fe++, [3, 53]);
              case 56:
                return (C.Log.info("Finished handling master updates"), [2]);
            }
          });
        });
      }),
      (e.handleVoucherUpdates = function (e, t) {
        return n(this, void 0, void 0, function () {
          var r,
            n,
            i,
            o,
            s,
            u,
            p,
            c,
            l,
            m,
            d,
            y,
            b,
            h,
            f,
            g,
            S,
            A,
            O,
            N,
            v,
            T,
            z,
            I,
            k,
            R,
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
            V,
            Y,
            H,
            K,
            X,
            J,
            Q,
            $,
            Z,
            ee,
            te,
            re,
            ne,
            ae,
            ie,
            oe,
            se,
            ue,
            pe,
            ce,
            le,
            me,
            de,
            ye,
            be,
            he,
            fe,
            ge,
            Me,
            Se,
            Ae,
            Oe,
            Ne,
            ve,
            Te,
            ze,
            Ie,
            qe,
            ke,
            Re,
            Ce,
            Ee,
            _e,
            De,
            Le,
            xe,
            we,
            Pe,
            We,
            Be,
            Ue,
            Fe,
            Ge,
            je,
            Ve,
            Ye,
            He,
            Ke,
            Xe,
            Je,
            Qe,
            $e,
            Ze,
            et,
            tt,
            rt,
            nt;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  C.Log.info("Starting handleVoucherUpdates"),
                  (r = e.id),
                  [
                    4,
                    (n = M.default.get(new q.Ledger(), r, t)).findAll({
                      where: { oldName: { $ne: null } },
                    }),
                  ]
                );
              case 1:
                if (((i = a.sent()), (o = new Map()), C.Util.isNotNull(i) && i.length > 0)) {
                  for (s = 0, u = i; s < u.length; s++)
                    ((Ve = u[s]),
                      (p = C.TallyUtil.removeNoiseChars(Ve.oldName)),
                      C.Util.isNotEmptyString(p) && o.set(p, Ve));
                  C.Log.info("Ledgers with name changes: " + o.size);
                }
                return [
                  4,
                  (c = M.default.get(new q.VoucherType(), r, t)).findAll({
                    where: { oldName: { $ne: null } },
                  }),
                ];
              case 2:
                if (((l = a.sent()), (m = new Map()), C.Util.isNotNull(l) && l.length > 0)) {
                  for (d = 0, y = l; d < y.length; d++)
                    ((H = y[d]),
                      (b = C.TallyUtil.removeNoiseChars(H.oldName)),
                      C.Util.isNotEmptyString(b) && m.set(b, H));
                  C.Log.info("Voucher types with name changes: " + m.size);
                }
                ((h = M.default.get(new q.StockItem(), r, t)), (f = []), (g = -1), (a.label = 3));
              case 3:
                return [
                  4,
                  h.findAll({
                    order: [["masterId", "ASC"]],
                    limit: 1e3,
                    where: { masterId: { $gt: g }, oldName: { $ne: null } },
                  }),
                ];
              case 4:
                return (
                  (S = a.sent()),
                  C.Log.info("Stock items with last master id: " + g),
                  C.Util.isNull(S) || 0 === S.length
                    ? [3, 5]
                    : ((g = S[S.length - 1].masterId), f.push.apply(f, S), [3, 3])
                );
              case 5:
                if (((A = new Map()), C.Util.isNotNull(f) && f.length > 0)) {
                  for (O = 0, N = f; O < N.length; O++)
                    ((ke = N[O]),
                      (v = C.TallyUtil.removeNoiseChars(ke.oldName)),
                      C.Util.isNotEmptyString(v) && A.set(v, ke));
                  C.Log.info("Stock Items with name changes: " + A.size);
                }
                return [
                  4,
                  (T = M.default.get(new q.Godown(), r, t)).findAll({
                    where: { oldName: { $ne: null } },
                  }),
                ];
              case 6:
                if (((z = a.sent()), (I = new Map()), C.Util.isNotNull(z) && z.length > 0)) {
                  for (k = 0, R = z; k < R.length; k++)
                    ((et = R[k]),
                      (E = C.TallyUtil.removeNoiseChars(et.oldName)),
                      C.Util.isNotEmptyString(E) && I.set(E, et));
                  C.Log.info("Godowns with name changes: " + I.size);
                }
                return [
                  4,
                  (_ = M.default.get(new q.CostCentre(), r, t)).findAll({
                    where: { oldName: { $ne: null } },
                  }),
                ];
              case 7:
                if (((D = a.sent()), (L = new Map()), C.Util.isNotNull(D) && D.length > 0)) {
                  for (x = 0, w = D; x < w.length; x++)
                    ((nt = w[x]),
                      (P = C.TallyUtil.removeNoiseChars(nt.oldName)),
                      C.Util.isNotEmptyString(P) && L.set(P, nt));
                  C.Log.info("Cost Centers with name changes: " + L.size);
                }
                if (!(o.size > 0 || m.size > 0 || A.size > 0 || I.size > 0 || L.size > 0))
                  return [3, 35];
                ((W = []), (B = -1), (U = M.default.get(new q.Voucher(), r, t)), (a.label = 8));
              case 8:
                return [
                  4,
                  U.findAll({
                    order: [["masterId", "ASC"]],
                    limit: 1e3,
                    where: { masterId: { $gt: B } },
                  }),
                ];
              case 9:
                if (((F = a.sent()), C.Util.isNull(F) || 0 === F.length)) return [3, 14];
                (C.Log.info("Updating vouchers because of master name changes"),
                  (G = 0),
                  (j = F),
                  (a.label = 10));
              case 10:
                if (!(G < j.length)) return [3, 13];
                if (
                  ((V = j[G]),
                  (Y = !1),
                  (B = V.masterId),
                  L.size > 0 &&
                    C.Util.isNotNull(V.costCentreName) &&
                    ((nt = L.get(C.TallyUtil.removeNoiseChars(V.costCentreName))),
                    C.Util.isNotNull(nt) &&
                      (C.Log.info(
                        "Master name change Voucher Cost Center: " +
                          V.costCentreName +
                          " -> " +
                          nt.name,
                      ),
                      (V.costCentreName = nt.name),
                      (Y = !0))),
                  m.size > 0 &&
                    C.Util.isNotNull(V.customType) &&
                    ((H = m.get(C.TallyUtil.removeNoiseChars(V.customType))),
                    C.Util.isNotNull(H) &&
                      (C.Log.info(
                        "Master name change Voucher Custom type: " + V.customType + " -> " + H.name,
                      ),
                      (V.customType = H.name),
                      (Y = !0))),
                  o.size > 0)
                ) {
                  if (
                    (C.Util.isNotNull(V.partyId) &&
                      ((Ve = o.get(C.TallyUtil.removeNoiseChars(V.partyId))),
                      C.Util.isNotNull(Ve) &&
                        (C.Log.info(
                          "Master name change Voucher Party id: " + V.partyId + " -> " + Ve.name,
                        ),
                        (V.partyId = Ve.name),
                        (Y = !0))),
                    C.Util.isNotNull(V.accountId) &&
                      ((Ve = o.get(C.TallyUtil.removeNoiseChars(V.accountId))),
                      C.Util.isNotNull(Ve) &&
                        (C.Log.info(
                          "Master name change Voucher Account id: " +
                            V.accountId +
                            " -> " +
                            Ve.name,
                        ),
                        (V.accountId = Ve.name),
                        (Y = !0))),
                    C.Util.isNotNull(V.accounts) && V.accounts.length > 0)
                  )
                    for (K = 0, X = V.accounts; K < X.length; K++)
                      ((J = X[K]),
                        C.Util.isNotNull(J) &&
                          C.Util.isNotNull(J.id) &&
                          ((Ve = o.get(C.TallyUtil.removeNoiseChars(J.id))),
                          C.Util.isNotNull(Ve) &&
                            (C.Log.info(
                              "Master name change Account id: " + J.id + " -> " + Ve.name,
                            ),
                            (J.id = Ve.name),
                            (Y = !0))));
                  if (C.Util.isNotNull(V.parties) && V.parties.length > 0)
                    for (Q = 0, $ = V.parties; Q < $.length; Q++)
                      if (
                        ((_e = $[Q]),
                        C.Util.isNotNull(_e) &&
                          (C.Util.isNotNull(_e.partyId) &&
                            ((Ve = o.get(C.TallyUtil.removeNoiseChars(_e.partyId))),
                            C.Util.isNotNull(Ve) &&
                              (C.Log.info(
                                "Master name change Party id: " + _e.partyId + " -> " + Ve.name,
                              ),
                              (_e.partyId = Ve.name),
                              (Y = !0))),
                          C.Util.isFilledArray(_e.bills)))
                      )
                        for (Z = 0, ee = _e.bills; Z < ee.length; Z++)
                          ((oe = ee[Z]),
                            C.Util.isNotNull(oe) &&
                              C.Util.isNotEmptyString(oe.partyId) &&
                              ((Ve = o.get(C.TallyUtil.removeNoiseChars(oe.partyId))),
                              C.Util.isNotNull(Ve) &&
                                (C.Log.info(
                                  "Master name change bill party id: " +
                                    oe.partyId +
                                    " -> " +
                                    Ve.name,
                                ),
                                (oe.partyId = Ve.name),
                                (Y = !0))));
                  if (C.Util.isNotNull(V.charges) && V.charges.length > 0)
                    for (te = 0, re = V.charges; te < re.length; te++)
                      ((ne = re[te]),
                        (Ve = o.get(C.TallyUtil.removeNoiseChars(ne.id))),
                        C.Util.isNotNull(Ve) &&
                          (C.Log.info("Master name change charge id: " + ne.id + " -> " + Ve.name),
                          (ne.id = Ve.name),
                          (Y = !0)));
                  if (C.Util.isFilledArray(V.bills))
                    for (ae = 0, ie = V.bills; ae < ie.length; ae++)
                      ((oe = ie[ae]),
                        C.Util.isNotNull(oe) &&
                          C.Util.isNotEmptyString(oe.partyId) &&
                          ((Ve = o.get(C.TallyUtil.removeNoiseChars(oe.partyId))),
                          C.Util.isNotNull(Ve) &&
                            (C.Log.info(
                              "Master name change bill party id: " + oe.partyId + " -> " + Ve.name,
                            ),
                            (oe.partyId = Ve.name),
                            (Y = !0))));
                  if (C.Util.isFilledArray(V.posInvoiceDetails))
                    for (se = 0, ue = V.posInvoiceDetails; se < ue.length; se++)
                      ((pe = ue[se]),
                        C.Util.isNotNull(pe) &&
                          C.Util.isNotEmptyString(pe.name) &&
                          ((Ve = o.get(C.TallyUtil.removeNoiseChars(pe.name))),
                          C.Util.isNotNull(Ve) &&
                            (C.Log.info(
                              "Master name change pos details name: " + pe.name + " -> " + Ve.name,
                            ),
                            (pe.name = Ve.name),
                            (Y = !0))));
                  if (C.Util.isFilledArray(V.payList))
                    for (ce = 0, le = V.payList; ce < le.length; ce++)
                      if (
                        ((me = le[ce]), C.Util.isNotNull(me) && C.Util.isFilledArray(me.employees))
                      )
                        for (de = 0, ye = me.employees; de < ye.length; de++)
                          if (
                            ((be = ye[de]),
                            C.Util.isNotNull(be) && C.Util.isFilledArray(be.payHeads))
                          )
                            for (he = 0, fe = be.payHeads; he < fe.length; he++)
                              ((ge = fe[he]),
                                C.Util.isNotNull(ge) &&
                                  C.Util.isNotEmptyString(ge.name) &&
                                  ((Ve = o.get(C.TallyUtil.removeNoiseChars(ge.name))),
                                  C.Util.isNotNull(Ve) &&
                                    (C.Log.info(
                                      "Master name change pay head name: " +
                                        ge.name +
                                        " -> " +
                                        Ve.name,
                                    ),
                                    (ge.name = Ve.name),
                                    (Y = !0))));
                }
                if (A.size > 0) {
                  if (((Re = [V.items, V.itemsIn, V.itemsOut]), C.Util.isFilledArray(V.parties)))
                    for (Me = 0, Se = V.parties; Me < Se.length; Me++)
                      ((_e = Se[Me]),
                        C.Util.isNotNull(_e) &&
                          C.Util.isFilledArray(_e.items) &&
                          Re.push(_e.items));
                  for (Ae = 0, Oe = Re; Ae < Oe.length; Ae++)
                    if (((xe = Oe[Ae]), C.Util.isNotNull(xe) && xe.length > 0))
                      for (Ne = 0, ve = xe; Ne < ve.length; Ne++)
                        ((Qe = ve[Ne]),
                          (ke = A.get(C.TallyUtil.removeNoiseChars(Qe.id))),
                          C.Util.isNotNull(ke) &&
                            (C.Log.info("Master name change item.id: " + Qe.id + " -> " + ke.name),
                            (Qe.id = ke.name),
                            (Y = !0)));
                  if (C.Util.isFilledArray(V.parties))
                    for (Te = 0, ze = V.parties; Te < ze.length; Te++)
                      if (((_e = ze[Te]), C.Util.isNotNull(_e) && C.Util.isFilledArray(_e.items)))
                        for (Ie = 0, qe = _e.items; Ie < qe.length; Ie++)
                          ((Qe = qe[Ie]),
                            C.Util.isNotNull(Qe) &&
                              C.Util.isNotEmptyString(Qe.id) &&
                              ((ke = A.get(C.TallyUtil.removeNoiseChars(Qe.id))),
                              C.Util.isNotNull(ke) &&
                                (C.Log.info(
                                  "Master name change item.id: " + Qe.id + " -> " + ke.name,
                                ),
                                (Qe.id = ke.name),
                                (Y = !0))));
                }
                if (I.size > 0) {
                  if (((Re = [V.items, V.itemsIn, V.itemsOut]), C.Util.isFilledArray(V.parties)))
                    for (Ce = 0, Ee = V.parties; Ce < Ee.length; Ce++)
                      ((_e = Ee[Ce]),
                        C.Util.isNotNull(_e) &&
                          C.Util.isFilledArray(_e.items) &&
                          Re.push(_e.items));
                  for (De = 0, Le = Re; De < Le.length; De++)
                    if (((xe = Le[De]), C.Util.isNotNull(xe) && xe.length > 0))
                      for (we = 0, Pe = xe; we < Pe.length; we++)
                        if (
                          ((Qe = Pe[we]),
                          C.Util.isNotNull(Qe.batchAllocations) && Qe.batchAllocations.length > 0)
                        )
                          for (We = Qe.batchAllocations, Be = 0, Ue = We; Be < Ue.length; Be++)
                            ((Fe = Ue[Be]),
                              C.Util.isNotNull(Fe.batch) &&
                                C.Util.isNotNull(Fe.batch.godownName) &&
                                ((et = I.get(C.TallyUtil.removeNoiseChars(Fe.batch.godownName))),
                                C.Util.isNotNull(et) &&
                                  (C.Log.info(
                                    "Master name change Godown name: " +
                                      Fe.batch.godownName +
                                      " -> " +
                                      et.name,
                                  ),
                                  (Fe.batch.godownName = et.name),
                                  (Y = !0))));
                }
                return Y
                  ? ((V.uptoDate = !1),
                    (V.tallyUpdatedAt = C.DateUtil.now()),
                    W.push(V),
                    [4, U.update(V, { where: { _id: V._id } })])
                  : [3, 12];
              case 11:
                (a.sent(), C.Log.info("Finished updating old master names.."), (a.label = 12));
              case 12:
                return (G++, [3, 10]);
              case 13:
                return [3, 8];
              case 14:
                ((Ge = 0), (je = i), (a.label = 15));
              case 15:
                return Ge < je.length
                  ? (((Ve = je[Ge]).oldName = null), [4, n.update(Ve, { where: { _id: Ve._id } })])
                  : [3, 18];
              case 16:
                (a.sent(), (a.label = 17));
              case 17:
                return (Ge++, [3, 15]);
              case 18:
                ((Ye = 0), (He = l), (a.label = 19));
              case 19:
                return Ye < He.length
                  ? (((Ke = He[Ye]).oldName = null), [4, c.update(Ke, { where: { _id: Ke._id } })])
                  : [3, 22];
              case 20:
                (a.sent(), (a.label = 21));
              case 21:
                return (Ye++, [3, 19]);
              case 22:
                ((Xe = 0), (Je = f), (a.label = 23));
              case 23:
                return Xe < Je.length
                  ? (((Qe = Je[Xe]).oldName = null), [4, h.update(Qe, { where: { _id: Qe._id } })])
                  : [3, 26];
              case 24:
                (a.sent(), (a.label = 25));
              case 25:
                return (Xe++, [3, 23]);
              case 26:
                (($e = 0), (Ze = z), (a.label = 27));
              case 27:
                return $e < Ze.length
                  ? (((et = Ze[$e]).oldName = null), [4, T.update(et, { where: { _id: et._id } })])
                  : [3, 30];
              case 28:
                (a.sent(), (a.label = 29));
              case 29:
                return ($e++, [3, 27]);
              case 30:
                ((tt = 0), (rt = D), (a.label = 31));
              case 31:
                return tt < rt.length
                  ? (((nt = rt[tt]).oldName = null), [4, _.update(nt, { where: { _id: nt._id } })])
                  : [3, 34];
              case 32:
                (a.sent(), (a.label = 33));
              case 33:
                return (tt++, [3, 31]);
              case 34:
                return (
                  C.Log.info(
                    "Finished Marking the oldName field as null for all the updated masters",
                  ),
                  [3, 36]
                );
              case 35:
                (C.Log.info("No master name changes to be applied"), (a.label = 36));
              case 36:
                return [2];
            }
          });
        });
      }),
      (e.setupMastersForVouchers = function (e, t) {
        return n(this, void 0, void 0, function () {
          var r, n, i, o, s, u, p, c, l;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  (r = e.id),
                  C.Log.info("Setting up masters for parsing vouchers"),
                  [4, M.default.get(new q.VoucherType(), r, t).findAll()]
                );
              case 1:
                return (
                  (n = a.sent()),
                  q.Voucher.setVoucherTypes(n),
                  C.Log.info("Voucher Types set"),
                  [4, M.default.get(new q.Group(), r, t).findAll()]
                );
              case 2:
                return (
                  (i = a.sent()),
                  q.Voucher.setGroups(i),
                  C.Log.info("Groups set"),
                  [4, M.default.get(new q.Ledger(), r, t).findAll()]
                );
              case 3:
                ((o = a.sent()),
                  q.Voucher.setLedgers(o),
                  (o = void 0),
                  C.Log.info("Ledgers set"),
                  (s = M.default.get(new q.StockItem(), r, t)),
                  (u = []),
                  (p = -1),
                  (a.label = 4));
              case 4:
                return [
                  4,
                  s.findAll({
                    order: [["masterId", "ASC"]],
                    limit: 1e3,
                    where: { masterId: { $gt: p } },
                  }),
                ];
              case 5:
                return (
                  (c = a.sent()),
                  C.Log.info("Stock items with last master id: " + p),
                  C.Util.isNull(c) || 0 === c.length
                    ? [3, 6]
                    : ((p = c[c.length - 1].masterId), u.push.apply(u, c), [3, 4])
                );
              case 6:
                return (
                  q.Voucher.setStockItems(u),
                  (u = []),
                  C.Log.info("StockItems set"),
                  [4, M.default.get(new q.Unit(), r, t).findAll()]
                );
              case 7:
                return (
                  (l = a.sent()),
                  q.Voucher.setUnits(l),
                  (l = void 0),
                  C.Log.info("Units set"),
                  [2]
                );
            }
          });
        });
      }),
      (e.syncVouchers = function (t, r, i, u) {
        return n(this, void 0, void 0, function () {
          var n,
            l,
            m,
            d,
            y,
            b,
            g,
            S,
            A,
            v,
            T,
            R,
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
            j,
            V,
            Y,
            H,
            K,
            X,
            J,
            Q,
            $,
            Z,
            ee,
            te,
            re,
            ne,
            ae,
            ie,
            oe,
            se;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  ((n = new I.VoucherStats()).startTime = C.DateUtil.now()),
                  this.logCompanyAlterId(r, "syncVouchers", !0),
                  (l = t.id),
                  r.booksFrom,
                  [4, e.setupMastersForVouchers(t, r)]
                );
              case 1:
                return (
                  a.sent(),
                  C.Log.info("Debug: Start syncing vouchers 1"),
                  (m = new q.Voucher()),
                  (d = new O.default(l, r)),
                  C.Log.info("Debug: Start syncing vouchers 2"),
                  [4, d.get(m.getName())]
                );
              case 2:
                return (
                  (y = a.sent()),
                  C.Log.info("Debug: Start syncing vouchers 3"),
                  (b = new N.default(l, m, r)),
                  C.Log.info("Debug: Start syncing vouchers 4"),
                  C.Util.isNull(y)
                    ? (C.Log.info(
                        "Voucher metadata not present, creating a new one since this is the first run",
                      ),
                      ((y = new q.SyncMetadata()).masterType = m.getName()),
                      (y.firstSync = !0),
                      (y.lastDeleteSyncAt = c().valueOf()),
                      [4, d.create(y)])
                    : [3, 4]
                );
              case 3:
                (a.sent(), (a.label = 4));
              case 4:
                return (
                  C.Log.info("Debug: Start syncing vouchers 5"),
                  !0 !== y.firstSync ? [3, 6] : [4, this.syncVouchersFirstTime(t, r, y)]
                );
              case 5:
                return (a.sent(), [3, 14]);
              case 6:
                return (
                  (g = y.tallyUpdatedAt),
                  C.Log.info("Fetching vouchers from " + g),
                  [4, this.getEndAlterId(r)]
                );
              case 7:
                return (
                  (se = a.sent()),
                  C.Log.info("Voucher End alter id: " + se),
                  C.Util.isNull(g) &&
                    (e.analyticManager.companyResynced(r, "VOUCHER_ALTER_ID_NOT_FOUND"),
                    C.Log.info(
                      "[ERROR]: Start alter id not found for company: " +
                        r.name +
                        ". Resyncing the company.",
                    ),
                    e.store.dispatch(
                      s.performDeleteData(
                        t,
                        r,
                        f.default.AUTO_DATA_RESYNC,
                        "Resync Company because alter id not found while syncing voucher",
                      ),
                    )),
                  se < g
                    ? (C.Log.info(
                        "[ERROR]: End alter id is less than start alter id for company: " +
                          r.companyId,
                      ),
                      C.Log.info(
                        "[ERROR]: Decreasing the start alter so that we can resync some of the past vouchers. This solution is not fool proof and might require resyncing the data",
                      ),
                      (g = se - 5e3) < 0 && (g = 0),
                      (y.tallyUpdatedAt = g),
                      [4, d.set(m.getName(), y)])
                    : [3, 9]
                );
              case 8:
                (a.sent(), (a.label = 9));
              case 9:
                if (!(g < se)) return [3, 12];
                ((S = 250), (A = g), (v = 0), (a.label = 10));
              case 10:
                return v < se
                  ? ((v = A + S) > se && (v = se), [4, b.syncWithTally(A, v)])
                  : [3, 12];
              case 11:
                return (a.sent(), (A = v), this.setSyncCompany(r.companyId), [3, 10]);
              case 12:
                return (
                  C.Log.info("8. Finished syncing local db with tally"),
                  [4, b.syncDeletedVoucherBaseOnCondition(r, l, se, i)]
                );
              case 13:
                (a.sent(), (a.label = 14));
              case 14:
                return (
                  (n.tallySyncTime = C.DateUtil.now()),
                  (T = 1e3),
                  (E = M.default.get(new q.Voucher(), l, r)),
                  (_ = 0),
                  !0 !== y.firstSync ? [3, 16] : [4, E.count({ where: { uptoDate: !1 } })]
                );
              case 15:
                return ((_ = a.sent()), [3, 17]);
              case 16:
                ((_ = 0), (a.label = 17));
              case 17:
                (this.logCompanyAlterId(r, "syncVouchers Before server upload", !0),
                  (D = Math.ceil(_ / T)),
                  (L = 0),
                  (e.fileUploadLimit =
                    C.Util.isNotNull(r.fileUploadLimit) && r.fileUploadLimit > 0
                      ? r.fileUploadLimit
                      : f.default.FILE_UPLOAD_LIMIT),
                  (a.label = 18));
              case 18:
                return [
                  4,
                  E.findAll({ where: { uptoDate: !1 }, limit: T, order: [["alterId", "ASC"]] }),
                ];
              case 19:
                return (
                  (x = a.sent()),
                  C.Util.isNull(x) || 0 === x.length
                    ? [3, 42]
                    : ((n.itemCount = n.itemCount + x.length),
                      !0 === y.firstSync &&
                        ((L += 1),
                        (w = 80 + Math.round((L / D) * 20)),
                        e.setSyncCompany(r.companyId, w)),
                      y.tallyUpdatedAt > 0
                        ? (C.Log.info(
                            "9. Resycing stock items closing values for updated vouchers",
                          ),
                          [4, this.resyncItems(t, r, x, !0)])
                        : [3, 21])
                );
              case 20:
                return (a.sent(), [3, 22]);
              case 21:
                (C.Log.info(
                  "Not syncing the closing value of stock items since this is first run and tallyUpdatedAt is not greater than zero",
                ),
                  (a.label = 22));
              case 22:
                if (
                  ((R = void 0),
                  (P = 0),
                  (W = { voucher: {}, vouchers: {} }),
                  (B = []),
                  C.Util.isNotNull(x))
                )
                  for (U = 0, F = x; U < F.length; U++)
                    ((j = F[U]).alterId > P && ((P = j.alterId), x.length >= T && (P -= 1)),
                      (V = c(j.tallyUpdatedAt).valueOf()),
                      G.Master.deleteDateFields(j),
                      (j.updatedAt = V),
                      (W.vouchers[j._id] = j),
                      B.push(j));
                if (
                  (C.Log.info("10. Finished fetching data to be uploaded to server"),
                  0 === Object.keys(W.vouchers).length)
                )
                  return [3, 41];
                a.label = 23;
              case 23:
                return (a.trys.push([23, 40, , 41]), [4, E.count()]);
              case 24:
                return ((Y = a.sent()), [4, E.count({ where: { uptoDate: !1 } })]);
              case 25:
                return (
                  (H = a.sent()),
                  C.Log.info("Total:" + Y + " Uploaded:" + (Y - H) + " Remaining:" + H),
                  C.Util.getObjectSize(W) <= e.fileUploadLimit
                    ? [4, z.BizAnalystService.addDataV2(t, r, W, k.DataType.VOUCHER, u)]
                    : [3, 30]
                );
              case 26:
                return (
                  (R = a.sent()),
                  (Z = c().valueOf()),
                  [
                    4,
                    M.default
                      .get(new h.default(), l)
                      .update({ lastDataUpdateAt: Z }, { where: { companyId: r.companyId } }),
                  ]
                );
              case 27:
                return (
                  a.sent(),
                  C.Log.info("11. Finished uploading to server successfully"),
                  !0 !== R
                    ? [3, 29]
                    : [
                        4,
                        E.update(
                          { uptoDate: !0 },
                          { where: { alterId: { $lte: P }, uptoDate: !1 } },
                        ),
                      ]
                );
              case 28:
                (a.sent(), C.Log.info("12. Marked vouchers upto date."), (a.label = 29));
              case 29:
                return [3, 39];
              case 30:
                ((K = C.Util.createObjectChunk(W.vouchers, e.fileUploadLimit)),
                  (X = 0),
                  (J = K),
                  (a.label = 31));
              case 31:
                return X < J.length
                  ? ((Q = J[X]),
                    ($ = { vouchers: Q }),
                    [4, z.BizAnalystService.addDataV2(t, r, $, k.DataType.VOUCHER, u)])
                  : [3, 39];
              case 32:
                return (
                  (R = a.sent()),
                  (Z = c().valueOf()),
                  [
                    4,
                    M.default
                      .get(new h.default(), l)
                      .update({ lastDataUpdateAt: Z }, { where: { companyId: r.companyId } }),
                  ]
                );
              case 33:
                if (
                  (a.sent(), C.Log.info("11. Finished uploading to server successfully"), !0 !== R)
                )
                  return [3, 38];
                ((ee = Object.keys(Q)), (te = 0), (re = ee), (a.label = 34));
              case 34:
                return te < re.length
                  ? ((ne = re[te]), [4, E.update({ uptoDate: !0 }, { where: { _id: ne } })])
                  : [3, 37];
              case 35:
                (a.sent(), (a.label = 36));
              case 36:
                return (te++, [3, 34]);
              case 37:
                (C.Log.info("12. Marked vouchers upto date."), (a.label = 38));
              case 38:
                return (X++, [3, 31]);
              case 39:
                return [3, 41];
              case 40:
                throw (
                  (ae = a.sent()),
                  JSON.stringify(ae).includes("Company subscription has expired")
                    ? (C.Log.info("Company subscription has expired"),
                      e.store.dispatch(o.setSubscriptionExpiry(ae.errorMessage)))
                    : C.Log.info("Failed to upload data to server"),
                  (R = !1),
                  ae
                );
              case 41:
                return [3, 18];
              case 42:
                return (
                  this.logCompanyAlterId(r, "syncVouchers After server upload", !0),
                  !1 !== R
                    ? [3, 43]
                    : (C.Log.info(
                        "Failed to upload file to server, skipping updating sync config for vouchers.",
                      ),
                      [3, 49])
                );
              case 43:
                return ((n.serverUploadTime = C.DateUtil.now()), [4, d.get(m.getName())]);
              case 44:
                return (
                  ((ie = a.sent()).serverUpdatedAt = ie.tallyUpdatedAt),
                  [4, d.set(m.getName(), ie)]
                );
              case 45:
                return (
                  a.sent(),
                  C.Log.info("Updated last alter id in metadata db to " + ie.tallyUpdatedAt),
                  !0 !== ie.firstSync ? [3, 49] : [4, (oe = new O.default(l, r)).get(m.getName())]
                );
              case 46:
                return (((ie = a.sent()).firstSync = !1), [4, this.getEndAlterId(r)]);
              case 47:
                return (
                  (se = a.sent()),
                  (ie.tallyUpdatedAt = se - 250),
                  [4, oe.set(m.getName(), ie)]
                );
              case 48:
                (a.sent(),
                  e.store.dispatch(p.setFirstSyncComplete(!0)),
                  C.Log.info("First sync completed successfully"),
                  (a.label = 49));
              case 49:
                return [2, n];
            }
          });
        });
      }),
      (e.logCompanyAlterId = function (e, t, r) {
        if (C.Util.isNull(e.altVchId)) {
          var n = r ? "Start" : "End";
          C.Log.info(n + " of " + t + " voucher alter id is " + e.altVchId);
        }
      }),
      (e.syncVouchersFirstTime = function (t, r, i) {
        return n(this, void 0, void 0, function () {
          var n, o, s, u, p, l, m, d;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                ((n = t.id),
                  (o = C.Util.isNotEmpty(i.firstSyncDate)
                    ? c(i.firstSyncDate)
                    : C.Util.isNotNull(r.syncFrom) && 0 !== r.syncFrom
                      ? c(r.syncFrom).tz(C.DateUtil.getTimezone(r.timezone))
                      : c(r.startingFrom).tz(C.DateUtil.getTimezone(r.timezone))),
                  (s = c(r.getEndDate()).tz(C.DateUtil.getTimezone(r.timezone))),
                  this.logCompanyAlterId(r, "syncVouchersFirstTime", !0),
                  C.Log.info("syncing for first time > " + JSON.stringify(r)),
                  (u = s.diff(o, "days")),
                  C.Util.isNotNull(u) && u >= 0 && ++u,
                  (p = 1),
                  (l = new q.Voucher()),
                  (m = new N.default(n, l, r)),
                  (a.label = 1));
              case 1:
                return o <= s
                  ? ((d = Math.round((p / u) * 80)),
                    e.setSyncCompany(r.companyId, d),
                    [4, m.syncWithTallyByDay(l, o.valueOf())])
                  : [3, 3];
              case 2:
                return (
                  a.sent(),
                  (o = o.add(1, "days")),
                  ++p <= 2 && this.logCompanyAlterId(r, "SyncVouchersFirstTime currentDay" + p, !0),
                  [3, 1]
                );
              case 3:
                return (
                  C.Log.info("Finished syncing by days for first time"),
                  [4, this.resyncItems(t, r, null, !1)]
                );
              case 4:
                return (a.sent(), [2]);
            }
          });
        });
      }),
      (e.resyncItems = function (t, r, i, s) {
        return n(this, void 0, void 0, function () {
          var n, u, p, l, m, d, y, b, h, f, g, S, A, O, T;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  this.logCompanyAlterId(r, "resyncItems", !0),
                  (n = t.id),
                  (u = new q.StockItem()),
                  (p = new N.default(n, u, r)),
                  (l = v.default.getInstance()),
                  !1 !== s
                    ? [3, 3]
                    : (C.Log.info("Resyncing closing values for all stock items"),
                      [
                        4,
                        l.getMastersByAlterId(
                          u,
                          n,
                          r,
                          -1,
                          r.altMstId,
                          q.StockItem.CLOSING_BALANCE_KEYS,
                        ),
                      ])
                );
              case 1:
                return ((m = a.sent()), [4, p.updateStockItemClosingDiff(m)]);
              case 2:
                return (a.sent(), [3, 5]);
              case 3:
                return (
                  C.Log.info("Resyncing closing values for updated/new vouchers"),
                  [4, p.syncStockItemClosing(i)]
                );
              case 4:
                (a.sent(), (a.label = 5));
              case 5:
                return [4, (d = M.default.get(u, n, r)).findAll({ where: { uptoDate: !1 } })];
              case 6:
                if (((y = a.sent()), !(C.Util.isNotNull(y) && y.length > 0))) return [3, 12];
                for (b = {}, h = 0, f = y; h < f.length; h++)
                  ((g = f[h]),
                    (S = c(g.tallyUpdatedAt).valueOf()),
                    G.Master.deleteDateFields(g),
                    (g.updatedAt = S),
                    (b[g._id] = g));
                return (
                  ((A = {})[u.getName().toLowerCase()] = b),
                  (O = void 0),
                  0 !== Object.keys(A).length
                    ? [3, 7]
                    : (C.Log.info("No resync master data to upload"), [3, 10])
                );
              case 7:
                return (
                  a.trys.push([7, 9, , 10]),
                  [4, z.BizAnalystService.addDataV2(t, r, A, k.DataType.RESYNCEDITEMS, !s)]
                );
              case 8:
                return (
                  (O = a.sent()),
                  C.Log.info("Resync Master data uploaded to server successfully"),
                  [3, 10]
                );
              case 9:
                return (
                  (T = a.sent()),
                  JSON.stringify(T).includes("Company subscription has expired")
                    ? (C.Log.info("Company subscription has expired"),
                      e.store.dispatch(o.setSubscriptionExpiry(T.errorMessage)))
                    : C.Log.info("Failed to upload resync master data to server"),
                  C.Log.info(T),
                  [3, 10]
                );
              case 10:
                return !0 !== O
                  ? [3, 12]
                  : [4, d.update({ uptoDate: !0 }, { where: { uptoDate: !1 } })];
              case 11:
                (a.sent(),
                  C.Log.info("Marked all the resynced stock items upto date"),
                  (a.label = 12));
              case 12:
                return (this.logCompanyAlterId(r, "resyncItems", !1), [2]);
            }
          });
        });
      }),
      (e.getEndAlterId = function (t) {
        return n(this, void 0, void 0, function () {
          return a(this, function (r) {
            if (
              (C.Log.info('End Alter ID for company "' + t.name + '" = ' + t.altVchId),
              C.Util.isNull(t.altVchId))
            )
              throw (
                e.analyticManager.alterIdNotFoundInCompany(t.companyId),
                new Error("No alter found Company")
              );
            return [2, t.altVchId];
          });
        });
      }),
      (e.isFirstCompanySynced = function (t, r) {
        return n(this, void 0, void 0, function () {
          var n, i, o, u, p, c;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  (n = m.default.USER_FIRST_COMPANY_SYNC + "_" + r.id),
                  [4, (i = new A.default(r.id)).get(n)]
                );
              case 1:
                return (
                  (o = a.sent()),
                  C.Util.isNull(o) ? ((u = new m.default(n, t._id)), [4, i.set(u)]) : [3, 3]
                );
              case 2:
                (a.sent(),
                  C.Log.info(
                    "First company synced Successfully " + JSON.stringify(t.tallyCompanyName),
                  ),
                  e.analyticManager.firstCompanySynced(t),
                  (a.label = 3));
              case 3:
                return ((p = m.default.IS_FIRST_COMPANY_ADDED), [4, i.get(p)]);
              case 4:
                return (
                  (c = a.sent()),
                  C.Util.isNotNull(c) && C.Util.isNotNull(c.data) && c.data === f.default.YES
                    ? (e.store.dispatch(s.trialInstallationComplete(t)), [4, i.delete(p)])
                    : [3, 6]
                );
              case 5:
                (a.sent(), (a.label = 6));
              case 6:
                return [2];
            }
          });
        });
      }),
      (e.checkFirstSyncAndNotify = function (t, r) {
        return n(this, void 0, void 0, function () {
          var n;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                if (!0 !== d.default.get(d.default.IS_FIRST_SYNC, !0)) return [3, 5];
                a.label = 1;
              case 1:
                return (a.trys.push([1, 3, , 4]), [4, z.BizAnalystService.notifyFirstSync(t, r)]);
              case 2:
                return (
                  a.sent(),
                  C.Log.info("First sync notification sent"),
                  e.store.dispatch(p.setFirstSyncComplete(!1)),
                  [3, 4]
                );
              case 3:
                return (
                  (n = a.sent()),
                  C.Log.info("Failed to send first sync notification"),
                  C.Log.info(JSON.stringify(n)),
                  [3, 4]
                );
              case 4:
                return [3, 6];
              case 5:
                return [2];
              case 6:
                return (e.store.dispatch(p.setFirstSyncComplete(!1)), [2]);
            }
          });
        });
      }),
      (e.getLedgerClosingSetting = function (e) {
        return n(this, void 0, void 0, function () {
          var t, r;
          return a(this, function (n) {
            switch (n.label) {
              case 0:
                return (
                  n.trys.push([0, 2, , 3]),
                  [4, new A.default(e).get(m.default.LEDGER_CLOSING_SETTING)]
                );
              case 1:
                return (
                  (t = n.sent()),
                  C.Util.isNotNull(t) && C.Util.isNotNull(t.data) ? [2, t.data] : [3, 3]
                );
              case 2:
                return (
                  (r = n.sent()),
                  C.Log.error("Error while getting getLedgerClosingSetting" + JSON.stringify(r)),
                  [3, 3]
                );
              case 3:
                return [2, f.default.LEDGER_CLOSING_BALANCE_FETCH_FREQUENCY];
            }
          });
        });
      }),
      (e.syncLedgerClosing = function (t, r, i, o) {
        return n(this, void 0, void 0, function () {
          var n, s, u, p, c, l, d, y, b, h;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return !1 === i
                  ? (C.Log.info(
                      "Ledger closing query is disable due to user don't have permission in tally",
                    ),
                    [2])
                  : ((n = m.default.LEDGER_CLOSING_SYNC + "_" + r.companyId),
                    (s = "Ledger closing sync "),
                    [4, (u = new A.default(t.id)).get(n)]);
              case 1:
                return ((p = a.sent()), (c = 0), [4, e.getLedgerClosingSetting(t.id)]);
              case 2:
                if (
                  ((l = a.sent()),
                  C.Util.isNotNull(p) && (c = C.DateUtil.addDate(p.data, l, R.Duration.HOUR)),
                  !(0 === c || C.DateUtil.now() > c))
                )
                  return [3, 11];
                a.label = 3;
              case 3:
                return (a.trys.push([3, 9, , 10]), [4, new g.default().getLedgerClosing(t.id, r)]);
              case 4:
                return (
                  (d = a.sent()),
                  (y = { ledgerClosing: d, ledgerClosingSyncTime: C.DateUtil.utcDate() }),
                  C.Log.debug(s + JSON.stringify(d)),
                  Object.keys(d).length > 0
                    ? (C.Log.info(s + ":total ledger found " + Object.keys(d).length),
                      [4, z.BizAnalystService.addDataV2(t, r, y, k.DataType.LEDGER_CLOSING, o)])
                    : [3, 6]
                );
              case 5:
                return (a.sent(), C.Log.info(s + ":Data push to S3"), [3, 7]);
              case 6:
                (C.Log.info(s + ":No data found"), (a.label = 7));
              case 7:
                return ((b = new m.default(n, C.DateUtil.now())), [4, u.set(b)]);
              case 8:
                return (a.sent(), [3, 10]);
              case 9:
                if (((h = a.sent()), e.isDataMismatchIssueWithServer(h))) throw h;
                return (
                  C.Log.error("Sync Ledger Closing Error " + C.Util.getErrorMessage(h)),
                  C.Log.exception(h, s),
                  [3, 10]
                );
              case 10:
                return [3, 12];
              case 11:
                return (
                  C.Log.info(
                    "Ledger closing sync : Will run at => " +
                      C.DateUtil.format(c, R.dateTimeFormat),
                  ),
                  [2, !1]
                );
              case 12:
                return [2];
            }
          });
        });
      }),
      (e.duplicateMasterIdCheck = function (t, r) {
        return n(this, void 0, void 0, function () {
          var n, i;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  (n = M.default.get(new q.Voucher(), t.id, r)),
                  "select masterId\n                                  from ( select masterId,count(masterId ) as masterCount,count(parentId ),parentId\n                                          from vouchers\n                                          where  isDeleted = '0'\n                                          group by masterId ,parentId )\n                                  group by masterId \n                                  HAVING count(masterId )>=2 or(masterCount>=2 and parentId is null)",
                  [
                    4,
                    n.executeRawQuery(
                      "select masterId\n                                  from ( select masterId,count(masterId ) as masterCount,count(parentId ),parentId\n                                          from vouchers\n                                          where  isDeleted = '0'\n                                          group by masterId ,parentId )\n                                  group by masterId \n                                  HAVING count(masterId )>=2 or(masterCount>=2 and parentId is null)",
                    ),
                  ]
                );
              case 1:
                return (
                  (i = a.sent()),
                  C.Util.isFilledArray(i)
                    ? (C.Log.info("Duplicate MasterId's Found " + JSON.stringify(i)),
                      e.analyticManager.duplicateMasterIds(i, r),
                      [2])
                    : [2, !1]
                );
            }
          });
        });
      }),
      (e.processPendingDataEntryIfExist = function (e, t) {
        return n(this, void 0, void 0, function () {
          var r, n, i, o, s, u, p, c, l;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return [4, (r = new S.default()).getOrders(e.id, t)];
              case 1:
                return (
                  (n = a.sent()),
                  C.Util.isFilledArray(n)
                    ? [
                        4,
                        r.processOrder(n, t, e).catch(function (e) {
                          C.Log.error(
                            "Order inserted into tally but fail to upload " + JSON.stringify(e),
                          );
                        }),
                      ]
                    : [3, 3]
                );
              case 2:
                (a.sent(), (a.label = 3));
              case 3:
                return [4, (i = new T.default()).getAllTransactionEntrys(e.id, t)];
              case 4:
                return (
                  (o = a.sent()),
                  C.Util.isFilledArray(o)
                    ? [
                        4,
                        i.processTransaction(o, t, e).catch(function (e) {
                          C.Log.error(
                            "Transaction inserted into tally but fail to upload " +
                              JSON.stringify(e),
                          );
                        }),
                      ]
                    : [3, 6]
                );
              case 5:
                (a.sent(), (a.label = 6));
              case 6:
                return [4, w.getLedgers(e.id, t)];
              case 7:
                return (
                  (s = a.sent()),
                  C.Util.isFilledArray(s)
                    ? [
                        4,
                        w.processLedgerEntry(s, t, e).catch(function (e) {
                          C.Log.error(
                            "Ledger inserted into tally but fail to upload " + JSON.stringify(e),
                          );
                        }),
                      ]
                    : [3, 9]
                );
              case 8:
                (a.sent(), (a.label = 9));
              case 9:
                return [4, P.getStockItem(e.id, t)];
              case 10:
                return (
                  (u = a.sent()),
                  C.Util.isFilledArray(u)
                    ? [
                        4,
                        P.processStockItem(u, t, e).catch(function (e) {
                          C.Log.error(
                            "Stock item inserted into tally but fail to upload " +
                              JSON.stringify(e),
                          );
                        }),
                      ]
                    : [3, 12]
                );
              case 11:
                (a.sent(), (a.label = 12));
              case 12:
                return [4, L.getInvoice(e.id, t)];
              case 13:
                return (
                  (p = a.sent()),
                  C.Util.isFilledArray(p)
                    ? [
                        4,
                        L.processInvoiceEntry(p, t, e).catch(function (e) {
                          C.Log.error(
                            "Invoice inserted into tally but fail to upload " + JSON.stringify(e),
                          );
                        }),
                      ]
                    : [3, 15]
                );
              case 14:
                (a.sent(), (a.label = 15));
              case 15:
                return [4, D.getInventory(e.id, t)];
              case 16:
                return (
                  (c = a.sent()),
                  C.Util.isFilledArray(c)
                    ? [
                        4,
                        D.processInventoryEntry(c, t, e).catch(function (e) {
                          C.Log.error(
                            "Inventory inserted into tally but fail to upload " + JSON.stringify(e),
                          );
                        }),
                      ]
                    : [3, 18]
                );
              case 17:
                (a.sent(), (a.label = 18));
              case 18:
                return [4, x.getJournal(e.id, t)];
              case 19:
                return (
                  (l = a.sent()),
                  C.Util.isFilledArray(l)
                    ? [
                        4,
                        x.processJournalEntry(l, t, e).catch(function (e) {
                          C.Log.error(
                            "Journal inserted into tally but fail to upload " + JSON.stringify(e),
                          );
                        }),
                      ]
                    : [3, 21]
                );
              case 20:
                (a.sent(), (a.label = 21));
              case 21:
                return [2];
            }
          });
        });
      }),
      (e.syncDataEntry = function (t, r) {
        return n(this, void 0, void 0, function () {
          var n, i, o, s, u, p, c, l, d, y, b, h, f, g, M;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (a.trys.push([0, 23, , 24]), [4, e.processPendingDataEntryIfExist(t, r)]);
              case 1:
                return (
                  a.sent(),
                  (n = r.isDataEntrySyncEnable ? "ON" : "OFF"),
                  (i = r.userId === t.id ? "have permission" : "no permission"),
                  C.Log.info("Auto DataEntry sync is: " + n + " and User also " + i),
                  r.isDataEntrySyncEnable && r.userId === t.id
                    ? [4, E.fetchAllEntries(r.companyId, 0, 100, t)]
                    : [3, 22]
                );
              case 2:
                return (
                  (o = a.sent()),
                  (s = o.orders.entries),
                  (u = o.transactions.entries),
                  (p = o.ledgers.entries),
                  (c = o.stockItems.entries),
                  (l = o.invoices.entries),
                  (d = o.inventory.entries),
                  (y = o.journal.entries),
                  C.Log.info(
                    "Orders: " +
                      s.length +
                      " Transaction: " +
                      u.length +
                      " ledgers: " +
                      p.length +
                      " stockItems: " +
                      c.length +
                      " invoiceItems: " +
                      l.length +
                      " Inventory: " +
                      d.length +
                      " Journal: " +
                      y.length,
                  ),
                  C.Util.isFilledArray(s)
                    ? [
                        4,
                        new S.default().processOrder(s, r, t).catch(function (e) {
                          C.Log.error("Order fail to upload " + JSON.stringify(e));
                        }),
                      ]
                    : [3, 4]
                );
              case 3:
                (a.sent(), (a.label = 4));
              case 4:
                return C.Util.isFilledArray(u)
                  ? [
                      4,
                      new T.default().processTransaction(u, r, t).catch(function (e) {
                        C.Log.error("Transaction fail to upload " + JSON.stringify(e));
                      }),
                    ]
                  : [3, 6];
              case 5:
                (a.sent(), (a.label = 6));
              case 6:
                return C.Util.isFilledArray(p)
                  ? [
                      4,
                      w.processLedgerEntry(p, r, t).catch(function (e) {
                        C.Log.error("Ledger fail to upload " + JSON.stringify(e));
                      }),
                    ]
                  : [3, 8];
              case 7:
                (a.sent(), (a.label = 8));
              case 8:
                return C.Util.isFilledArray(c)
                  ? [
                      4,
                      P.processStockItem(c, r, t).catch(function (e) {
                        C.Log.error("StockItem fail to upload " + JSON.stringify(e));
                      }),
                    ]
                  : [3, 10];
              case 9:
                (a.sent(), (a.label = 10));
              case 10:
                return C.Util.isFilledArray(l)
                  ? [
                      4,
                      L.processInvoiceEntry(l, r, t).catch(function (e) {
                        C.Log.error("Invoice fail to upload " + JSON.stringify(e));
                      }),
                    ]
                  : [3, 12];
              case 11:
                (a.sent(), (a.label = 12));
              case 12:
                return C.Util.isFilledArray(d)
                  ? [
                      4,
                      D.processInventoryEntry(d, r, t).catch(function (e) {
                        C.Log.error("Inventory fail to upload " + JSON.stringify(e));
                      }),
                    ]
                  : [3, 14];
              case 13:
                (a.sent(), (a.label = 14));
              case 14:
                return C.Util.isFilledArray(y)
                  ? [
                      4,
                      x.processJournalEntry(y, r, t).catch(function (e) {
                        C.Log.error("Journal fail to upload " + JSON.stringify(e));
                      }),
                    ]
                  : [3, 16];
              case 15:
                (a.sent(), (a.label = 16));
              case 16:
                return C.Util.isFilledArray(s) ||
                  C.Util.isFilledArray(u) ||
                  C.Util.isFilledArray(p) ||
                  C.Util.isFilledArray(c) ||
                  C.Util.isFilledArray(l) ||
                  C.Util.isFilledArray(d) ||
                  C.Util.isFilledArray(y)
                  ? [4, (b = new A.default(t.id)).get(m.default.WEBSOCKET_START_TIME)]
                  : [3, 22];
              case 17:
                return (
                  (h = a.sent()),
                  C.Util.isNotNull(h) && C.Util.isNotNull(h.data)
                    ? ((f = C.DateUtil.getEndOfDate(h.data, R.Duration.DAY)),
                      (g = C.DateUtil.getStartOfDate(C.DateUtil.now(), R.Duration.DAY)),
                      f < g
                        ? (U.ipcRenderer.send("web-socket-request"),
                          [
                            4,
                            b.set(new m.default(m.default.WEBSOCKET_START_TIME, C.DateUtil.now())),
                          ])
                        : [3, 19])
                    : [3, 20]
                );
              case 18:
                (a.sent(), (a.label = 19));
              case 19:
                return [3, 22];
              case 20:
                return (
                  U.ipcRenderer.send("web-socket-request"),
                  [4, b.set(new m.default(m.default.WEBSOCKET_START_TIME, C.DateUtil.now()))]
                );
              case 21:
                (a.sent(), (a.label = 22));
              case 22:
                return [3, 24];
              case 23:
                return (
                  (M = a.sent()),
                  C.Log.error("DataEntry Error: " + JSON.stringify(M)),
                  [3, 24]
                );
              case 24:
                return [2];
            }
          });
        });
      }),
      (e.fetchUserDetail = function (e) {
        return n(this, void 0, void 0, function () {
          var t, r, n, i, o;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return [4, (t = new A.default(e.id)).get(m.default.USER_DETAIL_FETCH_TIME)];
              case 1:
                ((r = a.sent()), (a.label = 2));
              case 2:
                return (
                  a.trys.push([2, 6, , 7]),
                  null === r || C.DateUtil.now() > r.data ? [4, B.getUserById(e)] : [3, 5]
                );
              case 3:
                return (
                  a.sent(),
                  (n = C.DateUtil.addDays(C.DateUtil.now(), 1)),
                  (i = new m.default(m.default.USER_DETAIL_FETCH_TIME, n)),
                  [4, t.set(i)]
                );
              case 4:
                (a.sent(), (a.label = 5));
              case 5:
                return [3, 7];
              case 6:
                return (
                  (o = a.sent()),
                  C.Log.error("Unable to fetch user on sync " + JSON.stringify(o)),
                  [3, 7]
                );
              case 7:
                return [2];
            }
          });
        });
      }),
      (e.fixLrDateSyncIssue = function (t, r) {
        return n(this, void 0, void 0, function () {
          var n, i, o, u, p, c;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  (n = m.default.VOUCHER_LR_DATE_MIGRATION + "_" + r.companyId),
                  [4, (i = new A.default(t.id)).get(n)]
                );
              case 1:
                return (
                  (o = a.sent()),
                  C.Util.isNull(o)
                    ? [
                        4,
                        (u = M.default.get(new q.Voucher(), t.id, r)).checkColumnExist(
                          q.Voucher.LR_RR_DATE,
                        ),
                      ]
                    : [3, 6]
                );
              case 2:
                return !0 !== a.sent()
                  ? [3, 6]
                  : ('select count(lrRrDate) as lrDate\n        from vouchers\n        where typeof(lrRrDate) != "integer" and lrRrDate is not null',
                    [
                      4,
                      u.executeRawQuery(
                        'select count(lrRrDate) as lrDate\n        from vouchers\n        where typeof(lrRrDate) != "integer" and lrRrDate is not null',
                      ),
                    ]);
              case 3:
                return (
                  (p = a.sent()),
                  C.Util.isFilledArray(p) && p[0].lrDate >= 1
                    ? (e.analyticManager.companyResynced(r, "LR_DATE_ISSUE"),
                      C.Log.info(
                        "Resyncing company due to lr date issue, count of lr date issue: " +
                          p[0].lrDate,
                      ),
                      e.store.dispatch(
                        s.performDeleteData(
                          t,
                          r,
                          f.default.AUTO_DATA_RESYNC,
                          "Resync due to LrDate issue",
                        ),
                      ),
                      [3, 6])
                    : [3, 4]
                );
              case 4:
                return ((c = new m.default(n, f.default.STATUS_SUCCESS)), [4, i.set(c)]);
              case 5:
                (a.sent(), (a.label = 6));
              case 6:
                return [2];
            }
          });
        });
      }),
      (e.fixPartialResyncIssue = function (t, r) {
        return n(this, void 0, void 0, function () {
          var n, i, o, u, p, c, l, d, y, b, g;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  (n = m.default.COMPANY_RESYC_CHECK + "_" + r.companyId),
                  [4, (i = new A.default(t.id)).get(n)]
                );
              case 1:
                if (
                  ((o = a.sent()),
                  (u = 0),
                  C.Util.isNotNull(o) &&
                    C.Util.isNotNull(o.data) &&
                    C.Util.isPositiveNumber(o.data) &&
                    (u = C.DateUtil.addDays(o.data, 1)),
                  !(
                    (0 === u || C.DateUtil.now() > u) &&
                    C.Util.isNotNull(r.dataDeleteTime) &&
                    r.dataDeleteTime > 15960672e5
                  ))
                )
                  return [3, 8];
                ((p = [
                  h.default,
                  q.Currency,
                  q.CostCategory,
                  q.CostCentre,
                  q.Group,
                  q.VoucherType,
                  q.Godown,
                  q.Unit,
                  q.StockGroup,
                  q.StockCategory,
                  q.StockItem,
                  q.GstClassification,
                  q.TdsRate,
                  q.Ledger,
                  q.Voucher,
                ]),
                  (c = C.DateUtil.now()),
                  (l = 0),
                  (d = p),
                  (a.label = 2));
              case 2:
                return l < d.length
                  ? ((y = d[l]), [4, M.default.get(new y(), t.id, r).min("createdAt", "createdAt")])
                  : [3, 5];
              case 3:
                ((b = a.sent()),
                  C.Util.isFilledArray(b) &&
                    C.Util.isNotNull(b[0].createdAt) &&
                    (c = Math.min(
                      C.DateUtil.getTimestampFromDateString(b[0].createdAt, r.timezone),
                      c,
                    )),
                  (a.label = 4));
              case 4:
                return (l++, [3, 2]);
              case 5:
                return (
                  (c += 1e3 * f.default.TIME_DIFF_ALLOWED),
                  r.dataDeleteTime > c
                    ? (e.analyticManager.companyResynced(r, "RESYNC_ISSUE"),
                      C.Log.info("Resyncing company due to partial sync issue, company: " + r.name),
                      e.store.dispatch(
                        s.performDeleteData(
                          t,
                          r,
                          f.default.AUTO_DATA_RESYNC,
                          "Resync due to partial sync error",
                        ),
                      ),
                      [3, 8])
                    : [3, 6]
                );
              case 6:
                return ((g = new m.default(n, C.DateUtil.now())), [4, i.set(g)]);
              case 7:
                (a.sent(), (a.label = 8));
              case 8:
                return [2];
            }
          });
        });
      }),
      (e.updateTallyLicenceOnSubscription = function (e) {
        return n(this, void 0, void 0, function () {
          var t, r, n, i, o, s;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (a.trys.push([0, 6, , 7]), [4, W.getStoredSubscription()]);
              case 1:
                return (
                  (t = a.sent()),
                  (r = v.default.getInstance()),
                  t && C.Util.isNull(t.tallyLicenseType) ? [4, r.getTypeOfLicence()] : [3, 5]
                );
              case 2:
                return (
                  (n = a.sent()),
                  C.Util.isNotEmptyString(n)
                    ? [4, W.updateTallyLicenseTypeInSubscription(e, t.subscriptionId, n)]
                    : [3, 5]
                );
              case 3:
                return ((i = a.sent()), [4, v.default.getTallyLicense()]);
              case 4:
                ((o = a.sent()) && d.default.set(d.default.SUBSCRIPTION + "_" + o, i),
                  (a.label = 5));
              case 5:
                return [3, 7];
              case 6:
                return (
                  (s = a.sent()),
                  C.Log.info("Update Licence type fail " + C.Util.getErrorMessage(s)),
                  [3, 7]
                );
              case 7:
                return [2];
            }
          });
        });
      }),
      (e.fileUploadLimit = f.default.FILE_UPLOAD_LIMIT),
      (e.backgroundStore = b.default.getInstance()),
      (e.store = e.backgroundStore.getStore()),
      (e.analyticManager = l.default.getInstance()),
      (e.sync = function () {
        return n(i, void 0, void 0, function () {
          var t, r, n;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                (U.ipcRenderer.on("ping-request", function (e, t) {
                  U.ipcRenderer.send("ping-response", t);
                }),
                  (t = e.backgroundStore.getStoreState()),
                  (r = t.user.user),
                  (a.label = 1));
              case 1:
                return (
                  a.trys.push([1, 4, 5, 6]),
                  C.Util.isNotNull(r) && C.Util.isNotNull(r.id) ? [4, e.syncNow(r)] : [3, 3]
                );
              case 2:
                (a.sent(), (a.label = 3));
              case 3:
                return [3, 6];
              case 4:
                return ((n = a.sent()), C.Log.exception(n, "Sync failed"), [3, 6]);
              case 5:
                return (
                  e.setSyncCompany(),
                  U.ipcRenderer.send("sync-completed-callback", void 0),
                  [7]
                );
              case 6:
                return [2];
            }
          });
        });
      }),
      (e.setSyncCompany = function (t, r) {
        e.currentSyncCompanyId = t;
        var n = {};
        (C.Util.isNotNull(t) && (n.companyId = t),
          C.Util.isNotNull(r) && (n.syncPercent = r),
          C.Util.isNull(n.companyId) && C.Util.isNull(n.syncPercent) && (n = null),
          e.store.dispatch(o.setCurrentlySyncingCompany(n)));
      }),
      (e.setCompanyLastSyncTime = function (t) {
        var r = new I.CompanyLastSync();
        ((r.companyId = t), (r.time = C.DateUtil.now()));
        var n = [];
        if (0 === (n = e.backgroundStore.getStoreState().background.companiesLastSync).length)
          n.push(r);
        else {
          for (var a = !1, i = 0, s = n; i < s.length; i++) {
            var u = s[i];
            u.companyId === t && ((a = !0), (u.time = r.time));
          }
          !1 === a && n.push(r);
        }
        e.store.dispatch(o.setCompaniesLastSync(n));
      }),
      e
    );
  })();
  t.default = j;
};
