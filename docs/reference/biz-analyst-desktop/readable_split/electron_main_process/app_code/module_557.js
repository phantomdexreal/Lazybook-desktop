// webpack module #557 (from electron_main_process, BA Mobile Connector 8.4.41)
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
    s = r(4),
    n = r(212),
    u = r(60),
    p = r(43),
    c = r(558),
    m = r(49),
    l = r(1234),
    d = r(2),
    y = r(32),
    b = r(32),
    h = r(232),
    g = r(275),
    S = (function () {
      function e(e, t, r) {
        ((this.userId = e), (this.master = t), (this.company = r), (this.masterName = t.getName()));
      }
      return (
        (e.prototype.syncCompaniesWithTally = function () {
          return i(this, void 0, void 0, function () {
            var e, t, r;
            return a(this, function (i) {
              switch (i.label) {
                case 0:
                  return [4, m.default.getInstance().getCompanies()];
                case 1:
                  return (
                    (e = i.sent()),
                    [4, (t = p.default.get(new u.default(), this.userId)).findAll()]
                  );
                case 2:
                  return ((r = i.sent()), [4, this.updateDiff(e, r, t)]);
                case 3:
                  return (i.sent(), [4, t.findAll()]);
                case 4:
                  return [2, i.sent()];
              }
            });
          });
        }),
        (e.prototype.getDeletedMasterObj = function () {
          return b.StockItem.masterName === this.master.getName()
            ? new y.DeletedStockItem(this.userId, this.company)
            : b.Ledger.masterName === this.master.getName()
              ? new y.DeletedLedgerItem(this.userId, this.company)
              : null;
        }),
        (e.prototype.needToSyncGstClassification = function () {
          return i(this, void 0, void 0, function () {
            var e;
            return a(this, function (t) {
              switch (t.label) {
                case 0:
                  return [
                    4,
                    m.default
                      .getInstance()
                      .getTallyProdInfo(h.GetTallyProductRequest.PARAM_BUILD_NUMBER),
                  ];
                case 1:
                  e = t.sent();
                  try {
                    if (
                      d.Util.isNotEmptyString(e) &&
                      !1 === isNaN(parseInt(e)) &&
                      parseInt(e) >= 5995
                    )
                      return [2, !0];
                  } catch (e) {
                    return [2, !1];
                  }
                  return [2, !1];
              }
            });
          });
        }),
        (e.prototype.syncMastersWithTally = function (t) {
          return (
            void 0 === t && (t = !1),
            i(this, void 0, void 0, function () {
              var r, i, o, s, u, p, c, m, l, h, S, f, A, N;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    return [
                      4,
                      (r = new g.SyncMetadataModel(this.userId, this.company)).get(
                        this.master.getName(),
                      ),
                    ];
                  case 1:
                    return (
                      (i = a.sent()),
                      y.GstClassification.masterName !== this.master.getName()
                        ? [3, 3]
                        : [4, this.needToSyncGstClassification()]
                    );
                  case 2:
                    if (!1 === a.sent())
                      return (
                        d.Log.info(
                          "Skip fetching GST classification details as older tally version.",
                        ),
                        [2]
                      );
                    a.label = 3;
                  case 3:
                    return d.Util.isNull(i)
                      ? (d.Log.info(
                          this.master.getName() +
                            " metadata not present, creating a new one since this is the first run",
                        ),
                        ((i = new b.SyncMetadata()).masterType = this.master.getName()),
                        [4, r.create(i)])
                      : [3, 5];
                  case 4:
                    (a.sent(), (a.label = 5));
                  case 5:
                    return (
                      (o = this.company.altMstId),
                      d.Util.isNull(o)
                        ? (d.Log.info(
                            "LEGACY: Master End alter id is not defined. Syncing using frequency.",
                          ),
                          (i.syncType = b.SyncMetadata.SYNC_LEGACY),
                          [4, r.set(this.masterName, i)])
                        : [3, 8]
                    );
                  case 6:
                    return (a.sent(), [4, this.syncMastersWithTallyLegacy()]);
                  case 7:
                    return (a.sent(), [3, 27]);
                  case 8:
                    return i.syncType !== b.SyncMetadata.SYNC_LEGACY
                      ? [3, 10]
                      : (d.Log.info(
                          "Converting from SYNC_LEGACY to SYNC_ALTERID since we now find altmstid for masters.",
                        ),
                        (i.tallyUpdatedAt = -1),
                        (i.syncType = b.SyncMetadata.SYNC_ALTERID),
                        [4, r.set(this.masterName, i)]);
                  case 9:
                    (a.sent(), (a.label = 10));
                  case 10:
                    return (
                      (s = n.default.getInstance()),
                      (u = s.getStoreState()),
                      (p = u.chunk.chunkSettings),
                      (c = i.tallyUpdatedAt),
                      (m = t),
                      i.lastCompleteSyncAt <= 0
                        ? (b.StockItem.masterName !== this.master.getName() &&
                            b.Ledger.masterName !== this.master.getName() &&
                            !0 !== p.enableChunk &&
                            (c = -1),
                          (m = !0))
                        : i.lastCompleteSyncAt < new Date().getTime() - 864e5
                          ? (d.Log.info(
                              "Resyncing " +
                                this.masterName +
                                " again since last complete sync at = " +
                                i.lastCompleteSyncAt,
                            ),
                            (c = -1),
                            (m = !0))
                          : m &&
                            ((c = -1),
                            d.Log.info(
                              "Resyncing " +
                                this.masterName +
                                " again due force to resync master again",
                            )),
                      d.Log.debug("Start alter id: " + c),
                      d.Log.info("Master End alter id: " + o),
                      d.Log.debug(
                        "Debug start for " +
                          this.master.getName() +
                          " startAlterId:" +
                          c +
                          " endAlterId:" +
                          o,
                      ),
                      (e.pendingBillsByLedger = null),
                      !0 !== m || this.masterName !== b.Ledger.masterName
                        ? [3, 12]
                        : (d.Log.info("Bills"),
                          (l = e),
                          [4, this.getPendingBills(this.userId, this.company)])
                    );
                  case 11:
                    ((l.pendingBillsByLedger = a.sent()), (a.label = 12));
                  case 12:
                    return (
                      (h = this.getDeletedMasterObj()),
                      m && p.enableChunk && -1 === c && d.Util.isNotNull(h)
                        ? [4, h.truncateData()]
                        : [3, 14]
                    );
                  case 13:
                    (a.sent(), (a.label = 14));
                  case 14:
                    return b.StockItem.masterName === this.master.getName() ||
                      b.Ledger.masterName === this.master.getName() ||
                      b.StockGroup.masterName === this.master.getName()
                      ? [3, 16]
                      : (d.Log.debug("Debug 1 " + this.master.getName()),
                        [4, this.syncWithTally(c, o, m)]);
                  case 15:
                    return (a.sent(), [3, 22]);
                  case 16:
                    if ((d.Log.debug("Debug 2 " + this.master.getName()), !(c < o))) return [3, 22];
                    if ((d.Log.debug("Debug 3 " + this.master.getName()), !0 !== p.enableChunk))
                      return [3, 20];
                    (d.Log.debug("Debug 4 " + this.master.getName()),
                      d.Log.debug("Start alter id before chunk loop: " + c),
                      d.Log.info("Syncing " + this.masterName + " in chunks of " + p.pageSize),
                      (S = p.pageSize),
                      (f = c),
                      (A = 0),
                      (a.label = 17));
                  case 17:
                    return A < o
                      ? ((A = f + S) > o && (A = o),
                        [4, this.syncWithTally(f, A, m, p.enableChunk)])
                      : [3, 19];
                  case 18:
                    return (a.sent(), (f = A), [3, 17]);
                  case 19:
                    return [3, 22];
                  case 20:
                    return (
                      d.Log.debug("Debug 5 " + this.master.getName()),
                      d.Log.info(
                        "Syncing " +
                          this.masterName +
                          " in chunks of " +
                          (o - c) +
                          " since chunking is not enabled in settings",
                      ),
                      [4, this.syncWithTally(c, o, m)]
                    );
                  case 21:
                    (a.sent(), (a.label = 22));
                  case 22:
                    return -1 !== c && !0 !== m ? [3, 25] : [4, r.get(this.master.getName())];
                  case 23:
                    return (
                      ((N = a.sent()).lastCompleteSyncAt = new Date().getTime()),
                      [4, r.set(this.masterName, N)]
                    );
                  case 24:
                    (a.sent(), (a.label = 25));
                  case 25:
                    return !0 === m &&
                      p.enableChunk &&
                      d.Util.isNotNull(h) &&
                      i.lastCompleteSyncAt > 0
                      ? [4, h.syncDeletedMaster()]
                      : [3, 27];
                  case 26:
                    (a.sent(), (a.label = 27));
                  case 27:
                    return [2];
                }
              });
            })
          );
        }),
        (e.prototype.syncMastersWithTallyLegacy = function () {
          return i(this, void 0, void 0, function () {
            var e, t, r, i, o, n, c, l, y, S, f, A;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [
                    4,
                    (e = new g.SyncMetadataModel(this.userId, this.company)).get(this.masterName),
                  ];
                case 1:
                  return (
                    (t = a.sent()),
                    (r = m.default.getInstance()),
                    d.Util.isNull(t)
                      ? (((t = new b.SyncMetadata()).masterType = this.masterName),
                        (t.tallyUpdatedAt = 0),
                        [4, e.create(t)])
                      : [3, 3]
                  );
                case 2:
                  (a.sent(), (a.label = 3));
                case 3:
                  return (
                    (i = s(0)),
                    t && t.tallyUpdatedAt && (i = s(t.tallyUpdatedAt)),
                    s().diff(i) < this.master.getSyncConfig().frequency
                      ? (d.Log.info("Master upto date: " + this.masterName), [2])
                      : (d.Log.info("Syncing masters now: " + this.masterName),
                        ((o = new h.GetMastersOptions()).company = this.company),
                        (o.dateRange = new h.Range(
                          this.company.getStartDate(),
                          this.company.getEndDate(),
                        )),
                        (n = []),
                        this.master.getName() !== u.default.masterName
                          ? [3, 5]
                          : [4, r.getCompaniesByCompanyObject(this.company)])
                  );
                case 4:
                  for (c = a.sent(), l = 0, y = c; l < y.length; l++)
                    if ((S = y[l])._id.trim() === this.company._id.trim()) {
                      n = [S];
                      break;
                    }
                  return [3, 7];
                case 5:
                  return [4, r.getMasters(this.master, o)];
                case 6:
                  ((n = a.sent()), (a.label = 7));
                case 7:
                  return [4, (f = p.default.get(this.master, this.userId, this.company)).findAll()];
                case 8:
                  return ((A = a.sent()), [4, this.updateDiff(n, A, f)]);
                case 9:
                  return (
                    a.sent(),
                    (t.tallyUpdatedAt = s().valueOf()),
                    [4, e.set(this.masterName, t)]
                  );
                case 10:
                  return (a.sent(), d.Log.info("Marked master upto date: " + this.masterName), [2]);
              }
            });
          });
        }),
        (e.prototype.syncWithTallyByDay = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i, s, n, u, c, l, y, b, h, S, f, A, N, I, T;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (r = d.DateUtil.formatDDMMMYYYY(t, this.company.timezone)),
                    d.Log.debug("SyncWithTallyByDay " + r),
                    d.Log.info("Syncing " + this.masterName + " for day: " + r),
                    [4, m.default.getInstance().getVouchersByDay(e, this.userId, this.company, t)]
                  );
                case 1:
                  return (
                    (i = a.sent()),
                    d.Log.debug("Get Item from tally"),
                    [
                      4,
                      (s = p.default.get(this.master, this.userId, this.company)).findAll({
                        where: { date: t },
                      }),
                    ]
                  );
                case 2:
                  if (
                    ((n = a.sent()),
                    d.Log.debug("Get item from local"),
                    (u = []),
                    d.Util.isFilledArray(i))
                  )
                    for (c = 0, l = i; c < l.length; c++) ((y = l[c]), u.push(y.masterId));
                  if (((b = []), d.Util.isFilledArray(n)))
                    for (h = 0, S = n; h < S.length; h++) ((f = S[h]), b.push(f.masterId));
                  return (
                    (A = o.difference(u, b)),
                    d.Util.isFilledArray(A)
                      ? (d.Log.debug("Diff MasterIds"),
                        [4, s.findAll({ where: { masterId: { $in: A } } })])
                      : [3, 4]
                  );
                case 3:
                  ((N = a.sent()),
                    d.Log.debug("Get diff from local"),
                    (n = n.concat(N)),
                    (a.label = 4));
                case 4:
                  return [4, this.updateDiff(i, n, s)];
                case 5:
                  return (
                    a.sent(),
                    d.Log.debug("updateDiff successfully"),
                    [
                      4,
                      (I = new g.SyncMetadataModel(this.userId, this.company)).get(this.masterName),
                    ]
                  );
                case 6:
                  return (((T = a.sent()).firstSyncDate = r), [4, I.set(this.masterName, T)]);
                case 7:
                  return (a.sent(), d.Log.debug("metadatadb updated successfully"), [2]);
              }
            });
          });
        }),
        (e.prototype.syncWithTally = function (t, r, o, s) {
          return (
            void 0 === o && (o = !1),
            void 0 === s && (s = !1),
            i(this, void 0, void 0, function () {
              var i, n, c, l, y, h, S, f, A, N, I, T, M, v, k, C, q, R, D, E, x;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    return t >= r
                      ? (d.Log.info(this.master.getName() + ": No data to update"), [2])
                      : (d.Log.info(this.masterName + " range: " + t + " - " + r),
                        (i = m.default.getInstance()),
                        this.master.getName() !== u.default.masterName
                          ? [3, 2]
                          : [4, i.getCompaniesByCompanyObject(this.company, t)]);
                  case 1:
                    for (c = a.sent(), l = 0, y = c; l < y.length; l++)
                      if ((h = y[l])._id.trim() === this.company._id.trim()) {
                        n = [h];
                        break;
                      }
                    return [3, 4];
                  case 2:
                    return [4, i.getMastersByAlterId(this.master, this.userId, this.company, t, r)];
                  case 3:
                    ((n = a.sent()), (a.label = 4));
                  case 4:
                    return d.Util.isNotNull(n) && n.length > 0
                      ? ((S = []),
                        (f = p.default.get(this.master, this.userId, this.company)),
                        this.master.getName() !== u.default.masterName
                          ? [3, 6]
                          : [4, f.findAll({ where: { companyId: this.company.companyId } })])
                      : [3, 17];
                  case 5:
                    return ((S = a.sent()), [3, 15]);
                  case 6:
                    return !0 !== o || -1 !== t || !1 !== s ? [3, 8] : [4, f.findAll()];
                  case 7:
                    return ((S = a.sent()), [3, 15]);
                  case 8:
                    if (!0 !== o || !0 !== s) return [3, 13];
                    for (T = [], A = 0, N = n; A < N.length; A++) ((R = N[A]), T.push(R.masterId));
                    return T.length > 0
                      ? [4, f.findAll({ where: { masterId: { $in: T } } })]
                      : [3, 10];
                  case 9:
                    ((S = a.sent()), (a.label = 10));
                  case 10:
                    return (
                      (I = this.getDeletedMasterObj()),
                      d.Util.isNotNull(I) && d.Util.isFilledArray(T)
                        ? [4, I.bulkInsert(T)]
                        : [3, 12]
                    );
                  case 11:
                    (a.sent(), (a.label = 12));
                  case 12:
                    return [3, 15];
                  case 13:
                    for (T = [], M = 0, v = n; M < v.length; M++) ((R = v[M]), T.push(R.masterId));
                    return T.length > 0
                      ? [4, f.findAll({ where: { masterId: { $in: T } } })]
                      : [3, 15];
                  case 14:
                    ((S = a.sent()), (a.label = 15));
                  case 15:
                    if (
                      ((k = !1),
                      this.masterName === b.Ledger.masterName &&
                        !0 === o &&
                        ((k = !0), d.Util.isNotNull(e.pendingBillsByLedger)))
                    )
                      for (C = 0, q = n; C < q.length; C++)
                        ((R = q[C]),
                          (D = e.pendingBillsByLedger.get(R.name)),
                          d.Util.isNotNull(D) ? (R.pendingBills = D) : (R.pendingBills = []));
                    return [4, this.updateDiff(n, S, f, k)];
                  case 16:
                    (a.sent(), d.Log.debug(this.masterName + " updateDiff: Done "), (a.label = 17));
                  case 17:
                    return [
                      4,
                      (E = new g.SyncMetadataModel(this.userId, this.company)).get(this.masterName),
                    ];
                  case 18:
                    return (((x = a.sent()).tallyUpdatedAt = r), [4, E.set(this.masterName, x)]);
                  case 19:
                    return (a.sent(), d.Log.debug(this.masterName + " metadata updated"), [2]);
                }
              });
            })
          );
        }),
        (e.prototype.getPendingBills = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i, s;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return !0 !== t.isPendingBillSync()
                    ? [2]
                    : [4, new c.default().getPendingBills(e, t)];
                case 1:
                  return (
                    (r = a.sent()),
                    (i = new Map()),
                    (s = o.groupBy(r, "ledgerName")),
                    o.map(s, function (e, t) {
                      i.set(
                        t,
                        o.map(e, function (e) {
                          return o.pick(e, ["amount", "customId", "date", "dueDate"]);
                        }),
                      );
                    }),
                    [2, i]
                  );
              }
            });
          });
        }),
        (e.prototype.syncStockItemClosing = function (e) {
          return i(this, void 0, void 0, function () {
            var t, r, i, s, n, u, p, c, l, y, h, g, S, f, A, N, I, T, M, v, k, C, q, R;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  if (d.Util.isNull(e) || 0 === e.length) return [2];
                  for (
                    t = new Set(),
                      r = !1,
                      d.Log.info("Resyncing items in vouchers: " + e.length),
                      i = m.default.getInstance(),
                      s = 0,
                      n = e;
                    s < n.length && ((u = n[s]), !r);
                    s++
                  ) {
                    if (d.Util.isNotNull(u.items) && u.items.length > 0)
                      for (p = 0, c = u.items; p < c.length; p++) {
                        if (((T = c[p]), d.Util.isNull(T.masterId))) {
                          (d.Log.info(
                            "[WARNING]: Master id is null for item in voucher: " +
                              JSON.stringify(u),
                          ),
                            (r = !0));
                          break;
                        }
                        t.add(T.masterId);
                      }
                    if (d.Util.isNotNull(u.itemsIn) && u.itemsIn.length > 0)
                      for (l = 0, y = u.itemsIn; l < y.length; l++) {
                        if (((T = y[l]), d.Util.isNull(T.masterId))) {
                          (d.Log.info(
                            "[WARNING]: Master id is null for item in voucher: " +
                              JSON.stringify(u),
                          ),
                            (r = !0));
                          break;
                        }
                        t.add(T.masterId);
                      }
                    if (d.Util.isNotNull(u.itemsOut) && u.itemsOut.length > 0)
                      for (h = 0, g = u.itemsOut; h < g.length; h++) {
                        if (((T = g[h]), d.Util.isNull(T.masterId))) {
                          (d.Log.info(
                            "[WARNING]: Master id is null for item in voucher: " +
                              JSON.stringify(u),
                          ),
                            (r = !0));
                          break;
                        }
                        t.add(T.masterId);
                      }
                    if (d.Util.isNotEmpty(u.parties))
                      for (S = 0, f = u.parties; S < f.length; S++)
                        if (((A = f[S]), d.Util.isNotEmpty(A.items)))
                          for (N = 0, I = A.items; N < I.length; N++) {
                            if (((T = I[N]), d.Util.isNull(T.masterId))) {
                              (d.Log.info(
                                "[WARNING]: Master id is null for item in voucher: " +
                                  JSON.stringify(u),
                              ),
                                (r = !0));
                              break;
                            }
                            t.add(T.masterId);
                          }
                  }
                  return (!d.Util.isNull(t) && 0 !== t.size) || !1 !== r
                    ? !0 !== r
                      ? [3, 3]
                      : (d.Log.info(
                          "Resyncing the closing values for all stock items since master id for 1 or more items was not found.",
                        ),
                        [
                          4,
                          i.getMastersByAlterId(
                            new b.StockItem(),
                            this.userId,
                            this.company,
                            -1,
                            this.company.altMstId,
                            b.StockItem.CLOSING_BALANCE_KEYS,
                          ),
                        ])
                    : (d.Log.info("No stock items to resync"), [2]);
                case 1:
                  return ((R = a.sent()), [4, this.updateStockItemClosingDiff(R)]);
                case 2:
                  return (a.sent(), [2]);
                case 3:
                  (d.Log.info("Resyncing items with tally: " + t.size),
                    (M = Array.from(t)),
                    (v = o.chunk(M, 50)),
                    (k = 0),
                    (C = v),
                    (a.label = 4));
                case 4:
                  return k < C.length
                    ? ((q = C[k]),
                      [
                        4,
                        i.getMastersByMasterIds(
                          new b.StockItem(),
                          this.userId,
                          this.company,
                          q,
                          b.StockItem.CLOSING_BALANCE_KEYS,
                        ),
                      ])
                    : [3, 8];
                case 5:
                  return ((R = a.sent()), [4, this.updateStockItemClosingDiff(R)]);
                case 6:
                  (a.sent(), (a.label = 7));
                case 7:
                  return (k++, [3, 4]);
                case 8:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.updateStockItemClosingDiff = function (e) {
          return i(this, void 0, void 0, function () {
            var t, r, i, o, n, u, c, m, l, y, b, h, g;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  if (!(d.Util.isNotNull(e) && e.length > 0)) return [3, 6];
                  for (t = [], r = 0, i = e; r < i.length; r++) ((g = i[r]), t.push(g.masterId));
                  return (
                    (o = []),
                    (n = p.default.get(this.master, this.userId, this.company)),
                    t.length > 0 ? [4, n.findAll({ where: { masterId: { $in: t } } })] : [3, 2]
                  );
                case 1:
                  ((o = a.sent()), (a.label = 2));
                case 2:
                  for (u = new Map(), c = 0, m = e; c < m.length; c++)
                    ((g = m[c]), u.set(g.masterId, g));
                  ((l = s().valueOf()), (y = 0), (b = o), (a.label = 3));
                case 3:
                  return y < b.length
                    ? ((h = b[y]),
                      (g = u.get(h.masterId)).closingAmount === h.closingAmount &&
                      g.closingStock === h.closingStock &&
                      g.subClosingStock === h.subClosingStock &&
                      g.alternateClosingStock === h.alternateClosingStock
                        ? [3, 5]
                        : ((h.closingAmount = g.closingAmount),
                          (h.closingStock = g.closingStock),
                          (h.subClosingStock = g.subClosingStock),
                          (h.alternateClosingStock = g.alternateClosingStock),
                          (h.uptoDate = !1),
                          (h.tallyUpdatedAt = l),
                          [4, n.update(h, { where: { _id: h._id } })]))
                    : [3, 6];
                case 4:
                  (a.sent(), (a.label = 5));
                case 5:
                  return (y++, [3, 3]);
                case 6:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.syncWithTallyByMasterIds = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i, o, s, n, u, c;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return d.Util.isNull(t) || t.length <= 0
                    ? [2]
                    : [
                        4,
                        m.default
                          .getInstance()
                          .getMastersByMasterIds(e, this.userId, this.company, t),
                      ];
                case 1:
                  if (((r = a.sent()), !(d.Util.isNotNull(r) && r.length > 0))) return [3, 5];
                  for (i = [], o = 0, s = r; o < s.length; o++) ((n = s[o]), i.push(n.masterId));
                  return (
                    (u = []),
                    (c = p.default.get(this.master, this.userId, this.company)),
                    i.length > 0 ? [4, c.findAll({ where: { masterId: { $in: i } } })] : [3, 3]
                  );
                case 2:
                  ((u = a.sent()), (a.label = 3));
                case 3:
                  return [4, this.updateDiff(r, u, c)];
                case 4:
                  (a.sent(), (a.label = 5));
                case 5:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.syncDeletedVoucherBaseOnCondition = function (e, t, r, o) {
          return i(this, void 0, void 0, function () {
            var i, s;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    a.trys.push([0, 5, , 6]),
                    !0 !== o ? [3, 2] : [4, this.syncDeletedVoucher(e, t, r)]
                  );
                case 1:
                  return (a.sent(), [3, 4]);
                case 2:
                  return (
                    d.Log.info("Deleted voucher will sync in older previous version"),
                    [4, this.syncDeletedWithTallyByMasterId(r)]
                  );
                case 3:
                  (a.sent(), (a.label = 4));
                case 4:
                  return [3, 6];
                case 5:
                  return (
                    (i = a.sent()),
                    (s = o ? "New" : "Old"),
                    d.Log.info("Deleted voucher sync fail and running by " + s + "way"),
                    d.Log.error(i),
                    [3, 6]
                  );
                case 6:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.syncDeletedVoucher = function (e, t, r) {
          return i(this, void 0, void 0, function () {
            var i, o, u, p, c, m, y, b, h;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (i = n.default.getInstance()),
                    (o = i.getStoreState()),
                    (u = o.sync.syncSettings),
                    (p = u.deletedVoucherIntervalMinutes),
                    (c = u.deletedVoucherSyncEnable),
                    d.Util.isNull(c) && (c = !0),
                    !1 === c
                      ? (d.Log.info(
                          "Skipping syncing deleted vouchers as its disabled from settings",
                        ),
                        [2])
                      : [
                          4,
                          (m = new g.SyncMetadataModel(this.userId, this.company)).get(
                            this.master.getName(),
                          ),
                        ]
                  );
                case 1:
                  return (
                    (y = a.sent()),
                    (b = s(y.lastDeleteSyncAt)),
                    (h = y.lastDeletedAlterId),
                    (b = b.add(p, "m")).isAfter(s())
                      ? (d.Log.info(
                          "Skipping syncing deleted vouchers will run after " +
                            b.diff(s(), "m") +
                            " minutes",
                        ),
                        [2])
                      : (d.Log.info("Current Alter Id: " + r + " & Last Alter Id: " + h),
                        h === r
                          ? (d.Log.info(
                              "Skipping syncing deleted vouchers: AlterId is not changed",
                            ),
                            [2])
                          : d.Util.isNotNull(r) && d.Util.isNotNull(h) && r < h
                            ? (d.Log.warn(
                                "[WARNING]: Skipping syncing deleted vouchers: Unexpected condition: Current Alter Id is less then Last Sync Alter Id.",
                              ),
                              [2])
                            : [4, new l.default().deletedVoucherSync(e, t)])
                  );
                case 2:
                  return (
                    a.sent(),
                    (y.lastDeleteSyncAt = s().valueOf()),
                    (y.lastDeletedAlterId = r),
                    [4, m.set(this.master.getName(), y)]
                  );
                case 3:
                  return (a.sent(), [2]);
              }
            });
          });
        }),
        (e.prototype.syncDeletedWithTallyByMasterId = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i, u, c, l, y, h, S, f, A, N, I, T, M, v, k, C, q, R, D, E, x, O, z, P, L;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (r = n.default.getInstance()),
                    (i = r.getStoreState()),
                    (u = i.sync.syncSettings),
                    (c = u.deletedVouchersIntervalHours),
                    (l = u.deletedVoucherSyncEnable),
                    d.Util.isNull(l) && (l = !0),
                    !1 === l
                      ? (d.Log.info(
                          "Skipping syncing deleted vouchers as its disabled from settings",
                        ),
                        [2])
                      : [
                          4,
                          (y = new g.SyncMetadataModel(this.userId, this.company)).get(
                            this.master.getName(),
                          ),
                        ]
                  );
                case 1:
                  return (
                    (h = a.sent()),
                    (S = s(h.lastDeleteSyncAt)),
                    (f = h.lastDeletedAlterId),
                    (S = S.add(c, "hours")).isAfter(s())
                      ? (d.Log.info("Skipping syncing deleted vouchers: " + S.diff(s(), "days")),
                        [2])
                      : (d.Log.info("Current Alter Id: " + e + " & Last Alter Id: " + f),
                        f === e
                          ? (d.Log.info(
                              "Skipping syncing deleted vouchers: AlterId is not changed",
                            ),
                            [2])
                          : d.Util.isNotNull(e) && d.Util.isNotNull(f) && e < f
                            ? (d.Log.warn(
                                "[WARNING]: Skipping syncing deleted vouchers: Unexpected condition: Current Alter Id is less then Last Sync Alter Id.",
                              ),
                              [2])
                            : ((A = m.default.getInstance()),
                              d.Util.isNull(t) && (t = u.deletedVouchersDays),
                              (N = s().subtract(t, "days").valueOf()),
                              d.Log.info(
                                "Syncing deleted vouchers from startDate: " + s(N).toString(),
                              ),
                              [
                                4,
                                (I = p.default.get(this.master, this.userId, this.company)).findAll(
                                  {
                                    attributes: ["masterId", "date"],
                                    order: [["masterId", "ASC"]],
                                    where: { date: { $gte: N }, isDeleted: !1 },
                                  },
                                ),
                              ]))
                  );
                case 2:
                  if (((T = a.sent()), !(d.Util.isNotNull(T) && T.length > 0))) return [3, 11];
                  (d.Log.info("Checking vouchers for deletion count: " + T.length),
                    (M = o.chunk(T, 200)),
                    (this.company.startingFrom = s()
                      .subtract(t + 5, "days")
                      .valueOf()),
                    (v = 0),
                    (k = M),
                    (a.label = 3));
                case 3:
                  return v < k.length
                    ? ((C = k[v]),
                      (q = C[0].masterId),
                      (R = C[C.length - 1].masterId),
                      d.Log.info("Syncing deleted vouchers from " + q + " - " + R),
                      [
                        4,
                        A.getMastersByMasterIdRange(
                          new b.DeletedVoucher(),
                          this.userId,
                          this.company,
                          q,
                          R,
                        ),
                      ])
                    : [3, 9];
                case 4:
                  ((D = a.sent()),
                    (E = o.map(D, "masterId")),
                    (x = new Set(E)),
                    (O = o.map(C, "masterId")),
                    (z = 0),
                    (P = O),
                    (a.label = 5));
                case 5:
                  return z < P.length
                    ? ((L = P[z]),
                      x.has(L)
                        ? [3, 7]
                        : (d.Log.info("Deleting voucher with masterId: " + L),
                          [
                            4,
                            I.update(
                              { isDeleted: !0, uptoDate: !1, tallyUpdatedAt: d.DateUtil.now() },
                              { where: { masterId: L } },
                            ),
                          ]))
                    : [3, 8];
                case 6:
                  (a.sent(), (a.label = 7));
                case 7:
                  return (z++, [3, 5]);
                case 8:
                  return (v++, [3, 3]);
                case 9:
                  return (
                    d.Log.info(
                      "Successfully synced deleted vouchers. Setting the last delete sync time to current time.",
                    ),
                    (h.lastDeleteSyncAt = s().valueOf()),
                    (h.lastDeletedAlterId = e),
                    [4, y.set(this.master.getName(), h)]
                  );
                case 10:
                  (a.sent(), (a.label = 11));
                case 11:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.updateDiff = function (e, t, r, o) {
          return i(this, void 0, void 0, function () {
            var i, n, p, c, m, l, y, h, g, S, f, A, N, I, T, M, v, k, C, q, R, D;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  for (
                    a.trys.push([0, 3, , 4]),
                      i = {},
                      n = "_id",
                      this.masterName === u.default.masterName && (n = "companyId"),
                      p = 0,
                      c = e;
                    p < c.length;
                    p++
                  )
                    ((f = c[p]), (i[f[n]] = f));
                  for (m = [], l = [], y = [], h = 0, g = t; h < g.length; h++) {
                    if (((S = g[h]), (f = i[S[n]]), d.Util.isNull(f)))
                      !0 !== S.isDeleted && ((S.isDeleted = !0), y.push(S));
                    else if (
                      (!0 !== o &&
                        this.masterName === b.Ledger.masterName &&
                        (f.pendingBills = S.pendingBills),
                      ("function" == typeof S.equals && "function" == typeof S.updateFromTally) ||
                        (S = this.master.toObject(S)),
                      "function" != typeof S.equals || "function" != typeof S.updateFromTally)
                    )
                      (d.Log.info("[WARNING]: Unexpected condition, object is not created."),
                        d.Log.info(S),
                        d.Log.info(f));
                    else if (S.equals(f))
                      try {
                        (A = d.Util.checkObjectDiff(S, f)) &&
                          d.Log.info(
                            "Tally Item same as LocalDbItem hence printing the difference if any: " +
                              JSON.stringify(A),
                          );
                      } catch (e) {
                        d.Log.info(
                          "Caught error in finding differnce between tallyItem and localDbItem: " +
                            JSON.stringify(e),
                        );
                      }
                    else
                      (S.alterId !== f.alterId && S.updateOldName(f),
                        S.updateFromTally(f),
                        l.push(S));
                    delete i[S[n]];
                  }
                  for (N in i) m.push(i[N]);
                  for (I = s().valueOf(), M = 0, v = T = [m, l, y]; M < v.length; M++)
                    for (k = 0, C = v[M]; k < C.length; k++)
                      (((q = C[k]).tallyUpdatedAt = I), (q.uptoDate = !1));
                  return [4, r.bulkCreate(T[0])];
                case 1:
                  return (a.sent(), (R = T[1].concat(T[2])), [4, r.updateTransaction(R, n)]);
                case 2:
                  return (
                    a.sent(),
                    d.Log.info(
                      this.masterName +
                        ": insert " +
                        T[0].length +
                        ", update " +
                        T[1].length +
                        ", delete " +
                        T[2].length,
                    ),
                    [3, 4]
                  );
                case 3:
                  throw (
                    (D = a.sent()),
                    d.Log.debug("UpdateDiff something went wrong here data for debug: "),
                    d.Log.debug("TallyItems " + JSON.stringify(e)),
                    d.Log.debug("LocaldbItems " + JSON.stringify(t)),
                    d.Log.debug("Error updatediff " + JSON.stringify(D)),
                    D
                  );
                case 4:
                  return [2];
              }
            });
          });
        }),
        e
      );
    })();
  t.default = S;
};
