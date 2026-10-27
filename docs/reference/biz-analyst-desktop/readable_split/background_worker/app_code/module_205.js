// webpack module #205 (from background_worker, BA Mobile Connector 8.4.41)
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
    o = r(3),
    s = r(52),
    u = r(59),
    p = r(30),
    c = r(518),
    l = r(35),
    m = r(1105),
    d = r(0),
    y = r(28),
    b = r(28),
    h = r(143),
    f = r(382),
    g = (function () {
      function e(e, t, r) {
        ((this.userId = e), (this.master = t), (this.company = r), (this.masterName = t.getName()));
      }
      return (
        (e.prototype.syncCompaniesWithTally = function () {
          return n(this, void 0, void 0, function () {
            var e, t, r;
            return a(this, function (n) {
              switch (n.label) {
                case 0:
                  return [4, l.default.getInstance().getCompanies()];
                case 1:
                  return (
                    (e = n.sent()),
                    [4, (t = p.default.get(new u.default(), this.userId)).findAll()]
                  );
                case 2:
                  return ((r = n.sent()), [4, this.updateDiff(e, r, t)]);
                case 3:
                  return (n.sent(), [4, t.findAll()]);
                case 4:
                  return [2, n.sent()];
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
          return n(this, void 0, void 0, function () {
            var e;
            return a(this, function (t) {
              switch (t.label) {
                case 0:
                  return [
                    4,
                    l.default
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
            n(this, void 0, void 0, function () {
              var r, n, i, o, u, p, c, l, m, h, g, M, S, A;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    return [
                      4,
                      (r = new f.SyncMetadataModel(this.userId, this.company)).get(
                        this.master.getName(),
                      ),
                    ];
                  case 1:
                    return (
                      (n = a.sent()),
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
                    return d.Util.isNull(n)
                      ? (d.Log.info(
                          this.master.getName() +
                            " metadata not present, creating a new one since this is the first run",
                        ),
                        ((n = new b.SyncMetadata()).masterType = this.master.getName()),
                        [4, r.create(n)])
                      : [3, 5];
                  case 4:
                    (a.sent(), (a.label = 5));
                  case 5:
                    return (
                      (i = this.company.altMstId),
                      d.Util.isNull(i)
                        ? (d.Log.info(
                            "LEGACY: Master End alter id is not defined. Syncing using frequency.",
                          ),
                          (n.syncType = b.SyncMetadata.SYNC_LEGACY),
                          [4, r.set(this.masterName, n)])
                        : [3, 8]
                    );
                  case 6:
                    return (a.sent(), [4, this.syncMastersWithTallyLegacy()]);
                  case 7:
                    return (a.sent(), [3, 27]);
                  case 8:
                    return n.syncType !== b.SyncMetadata.SYNC_LEGACY
                      ? [3, 10]
                      : (d.Log.info(
                          "Converting from SYNC_LEGACY to SYNC_ALTERID since we now find altmstid for masters.",
                        ),
                        (n.tallyUpdatedAt = -1),
                        (n.syncType = b.SyncMetadata.SYNC_ALTERID),
                        [4, r.set(this.masterName, n)]);
                  case 9:
                    (a.sent(), (a.label = 10));
                  case 10:
                    return (
                      (o = s.default.getInstance()),
                      (u = o.getStoreState()),
                      (p = u.chunk.chunkSettings),
                      (c = n.tallyUpdatedAt),
                      (l = t),
                      n.lastCompleteSyncAt <= 0
                        ? (b.StockItem.masterName !== this.master.getName() &&
                            b.Ledger.masterName !== this.master.getName() &&
                            !0 !== p.enableChunk &&
                            (c = -1),
                          (l = !0))
                        : n.lastCompleteSyncAt < new Date().getTime() - 864e5
                          ? (d.Log.info(
                              "Resyncing " +
                                this.masterName +
                                " again since last complete sync at = " +
                                n.lastCompleteSyncAt,
                            ),
                            (c = -1),
                            (l = !0))
                          : l &&
                            ((c = -1),
                            d.Log.info(
                              "Resyncing " +
                                this.masterName +
                                " again due force to resync master again",
                            )),
                      d.Log.debug("Start alter id: " + c),
                      d.Log.info("Master End alter id: " + i),
                      d.Log.debug(
                        "Debug start for " +
                          this.master.getName() +
                          " startAlterId:" +
                          c +
                          " endAlterId:" +
                          i,
                      ),
                      (e.pendingBillsByLedger = null),
                      !0 !== l || this.masterName !== b.Ledger.masterName
                        ? [3, 12]
                        : (d.Log.info("Bills"),
                          (m = e),
                          [4, this.getPendingBills(this.userId, this.company)])
                    );
                  case 11:
                    ((m.pendingBillsByLedger = a.sent()), (a.label = 12));
                  case 12:
                    return (
                      (h = this.getDeletedMasterObj()),
                      l && p.enableChunk && -1 === c && d.Util.isNotNull(h)
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
                        [4, this.syncWithTally(c, i, l)]);
                  case 15:
                    return (a.sent(), [3, 22]);
                  case 16:
                    if ((d.Log.debug("Debug 2 " + this.master.getName()), !(c < i))) return [3, 22];
                    if ((d.Log.debug("Debug 3 " + this.master.getName()), !0 !== p.enableChunk))
                      return [3, 20];
                    (d.Log.debug("Debug 4 " + this.master.getName()),
                      d.Log.debug("Start alter id before chunk loop: " + c),
                      d.Log.info("Syncing " + this.masterName + " in chunks of " + p.pageSize),
                      (g = p.pageSize),
                      (M = c),
                      (S = 0),
                      (a.label = 17));
                  case 17:
                    return S < i
                      ? ((S = M + g) > i && (S = i),
                        [4, this.syncWithTally(M, S, l, p.enableChunk)])
                      : [3, 19];
                  case 18:
                    return (a.sent(), (M = S), [3, 17]);
                  case 19:
                    return [3, 22];
                  case 20:
                    return (
                      d.Log.debug("Debug 5 " + this.master.getName()),
                      d.Log.info(
                        "Syncing " +
                          this.masterName +
                          " in chunks of " +
                          (i - c) +
                          " since chunking is not enabled in settings",
                      ),
                      [4, this.syncWithTally(c, i, l)]
                    );
                  case 21:
                    (a.sent(), (a.label = 22));
                  case 22:
                    return -1 !== c && !0 !== l ? [3, 25] : [4, r.get(this.master.getName())];
                  case 23:
                    return (
                      ((A = a.sent()).lastCompleteSyncAt = new Date().getTime()),
                      [4, r.set(this.masterName, A)]
                    );
                  case 24:
                    (a.sent(), (a.label = 25));
                  case 25:
                    return !0 === l &&
                      p.enableChunk &&
                      d.Util.isNotNull(h) &&
                      n.lastCompleteSyncAt > 0
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
          return n(this, void 0, void 0, function () {
            var e, t, r, n, i, s, c, m, y, g, M, S;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [
                    4,
                    (e = new f.SyncMetadataModel(this.userId, this.company)).get(this.masterName),
                  ];
                case 1:
                  return (
                    (t = a.sent()),
                    (r = l.default.getInstance()),
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
                    (n = o(0)),
                    t && t.tallyUpdatedAt && (n = o(t.tallyUpdatedAt)),
                    o().diff(n) < this.master.getSyncConfig().frequency
                      ? (d.Log.info("Master upto date: " + this.masterName), [2])
                      : (d.Log.info("Syncing masters now: " + this.masterName),
                        ((i = new h.GetMastersOptions()).company = this.company),
                        (i.dateRange = new h.Range(
                          this.company.getStartDate(),
                          this.company.getEndDate(),
                        )),
                        (s = []),
                        this.master.getName() !== u.default.masterName
                          ? [3, 5]
                          : [4, r.getCompaniesByCompanyObject(this.company)])
                  );
                case 4:
                  for (c = a.sent(), m = 0, y = c; m < y.length; m++)
                    if ((g = y[m])._id.trim() === this.company._id.trim()) {
                      s = [g];
                      break;
                    }
                  return [3, 7];
                case 5:
                  return [4, r.getMasters(this.master, i)];
                case 6:
                  ((s = a.sent()), (a.label = 7));
                case 7:
                  return [4, (M = p.default.get(this.master, this.userId, this.company)).findAll()];
                case 8:
                  return ((S = a.sent()), [4, this.updateDiff(s, S, M)]);
                case 9:
                  return (
                    a.sent(),
                    (t.tallyUpdatedAt = o().valueOf()),
                    [4, e.set(this.masterName, t)]
                  );
                case 10:
                  return (a.sent(), d.Log.info("Marked master upto date: " + this.masterName), [2]);
              }
            });
          });
        }),
        (e.prototype.syncWithTallyByDay = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n, o, s, u, c, m, y, b, h, g, M, S, A, O, N;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (r = d.DateUtil.formatDDMMMYYYY(t, this.company.timezone)),
                    d.Log.debug("SyncWithTallyByDay " + r),
                    d.Log.info("Syncing " + this.masterName + " for day: " + r),
                    [4, l.default.getInstance().getVouchersByDay(e, this.userId, this.company, t)]
                  );
                case 1:
                  return (
                    (n = a.sent()),
                    d.Log.debug("Get Item from tally"),
                    [
                      4,
                      (o = p.default.get(this.master, this.userId, this.company)).findAll({
                        where: { date: t },
                      }),
                    ]
                  );
                case 2:
                  if (
                    ((s = a.sent()),
                    d.Log.debug("Get item from local"),
                    (u = []),
                    d.Util.isFilledArray(n))
                  )
                    for (c = 0, m = n; c < m.length; c++) ((y = m[c]), u.push(y.masterId));
                  if (((b = []), d.Util.isFilledArray(s)))
                    for (h = 0, g = s; h < g.length; h++) ((M = g[h]), b.push(M.masterId));
                  return (
                    (S = i.difference(u, b)),
                    d.Util.isFilledArray(S)
                      ? (d.Log.debug("Diff MasterIds"),
                        [4, o.findAll({ where: { masterId: { $in: S } } })])
                      : [3, 4]
                  );
                case 3:
                  ((A = a.sent()),
                    d.Log.debug("Get diff from local"),
                    (s = s.concat(A)),
                    (a.label = 4));
                case 4:
                  return [4, this.updateDiff(n, s, o)];
                case 5:
                  return (
                    a.sent(),
                    d.Log.debug("updateDiff successfully"),
                    [
                      4,
                      (O = new f.SyncMetadataModel(this.userId, this.company)).get(this.masterName),
                    ]
                  );
                case 6:
                  return (((N = a.sent()).firstSyncDate = r), [4, O.set(this.masterName, N)]);
                case 7:
                  return (a.sent(), d.Log.debug("metadatadb updated successfully"), [2]);
              }
            });
          });
        }),
        (e.prototype.syncWithTally = function (t, r, i, o) {
          return (
            void 0 === i && (i = !1),
            void 0 === o && (o = !1),
            n(this, void 0, void 0, function () {
              var n, s, c, m, y, h, g, M, S, A, O, N, v, T, z, I, q, k, R, C, E;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    return t >= r
                      ? (d.Log.info(this.master.getName() + ": No data to update"), [2])
                      : (d.Log.info(this.masterName + " range: " + t + " - " + r),
                        (n = l.default.getInstance()),
                        this.master.getName() !== u.default.masterName
                          ? [3, 2]
                          : [4, n.getCompaniesByCompanyObject(this.company, t)]);
                  case 1:
                    for (c = a.sent(), m = 0, y = c; m < y.length; m++)
                      if ((h = y[m])._id.trim() === this.company._id.trim()) {
                        s = [h];
                        break;
                      }
                    return [3, 4];
                  case 2:
                    return [4, n.getMastersByAlterId(this.master, this.userId, this.company, t, r)];
                  case 3:
                    ((s = a.sent()), (a.label = 4));
                  case 4:
                    return d.Util.isNotNull(s) && s.length > 0
                      ? ((g = []),
                        (M = p.default.get(this.master, this.userId, this.company)),
                        this.master.getName() !== u.default.masterName
                          ? [3, 6]
                          : [4, M.findAll({ where: { companyId: this.company.companyId } })])
                      : [3, 17];
                  case 5:
                    return ((g = a.sent()), [3, 15]);
                  case 6:
                    return !0 !== i || -1 !== t || !1 !== o ? [3, 8] : [4, M.findAll()];
                  case 7:
                    return ((g = a.sent()), [3, 15]);
                  case 8:
                    if (!0 !== i || !0 !== o) return [3, 13];
                    for (N = [], S = 0, A = s; S < A.length; S++) ((k = A[S]), N.push(k.masterId));
                    return N.length > 0
                      ? [4, M.findAll({ where: { masterId: { $in: N } } })]
                      : [3, 10];
                  case 9:
                    ((g = a.sent()), (a.label = 10));
                  case 10:
                    return (
                      (O = this.getDeletedMasterObj()),
                      d.Util.isNotNull(O) && d.Util.isFilledArray(N)
                        ? [4, O.bulkInsert(N)]
                        : [3, 12]
                    );
                  case 11:
                    (a.sent(), (a.label = 12));
                  case 12:
                    return [3, 15];
                  case 13:
                    for (N = [], v = 0, T = s; v < T.length; v++) ((k = T[v]), N.push(k.masterId));
                    return N.length > 0
                      ? [4, M.findAll({ where: { masterId: { $in: N } } })]
                      : [3, 15];
                  case 14:
                    ((g = a.sent()), (a.label = 15));
                  case 15:
                    if (
                      ((z = !1),
                      this.masterName === b.Ledger.masterName &&
                        !0 === i &&
                        ((z = !0), d.Util.isNotNull(e.pendingBillsByLedger)))
                    )
                      for (I = 0, q = s; I < q.length; I++)
                        ((k = q[I]),
                          (R = e.pendingBillsByLedger.get(k.name)),
                          d.Util.isNotNull(R) ? (k.pendingBills = R) : (k.pendingBills = []));
                    return [4, this.updateDiff(s, g, M, z)];
                  case 16:
                    (a.sent(), d.Log.debug(this.masterName + " updateDiff: Done "), (a.label = 17));
                  case 17:
                    return [
                      4,
                      (C = new f.SyncMetadataModel(this.userId, this.company)).get(this.masterName),
                    ];
                  case 18:
                    return (((E = a.sent()).tallyUpdatedAt = r), [4, C.set(this.masterName, E)]);
                  case 19:
                    return (a.sent(), d.Log.debug(this.masterName + " metadata updated"), [2]);
                }
              });
            })
          );
        }),
        (e.prototype.getPendingBills = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n, o;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return !0 !== t.isPendingBillSync()
                    ? [2]
                    : [4, new c.default().getPendingBills(e, t)];
                case 1:
                  return (
                    (r = a.sent()),
                    (n = new Map()),
                    (o = i.groupBy(r, "ledgerName")),
                    i.map(o, function (e, t) {
                      n.set(
                        t,
                        i.map(e, function (e) {
                          return i.pick(e, ["amount", "customId", "date", "dueDate"]);
                        }),
                      );
                    }),
                    [2, n]
                  );
              }
            });
          });
        }),
        (e.prototype.syncStockItemClosing = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r, n, o, s, u, p, c, m, y, h, f, g, M, S, A, O, N, v, T, z, I, q, k;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  if (d.Util.isNull(e) || 0 === e.length) return [2];
                  for (
                    t = new Set(),
                      r = !1,
                      d.Log.info("Resyncing items in vouchers: " + e.length),
                      n = l.default.getInstance(),
                      o = 0,
                      s = e;
                    o < s.length && ((u = s[o]), !r);
                    o++
                  ) {
                    if (d.Util.isNotNull(u.items) && u.items.length > 0)
                      for (p = 0, c = u.items; p < c.length; p++) {
                        if (((N = c[p]), d.Util.isNull(N.masterId))) {
                          (d.Log.info(
                            "[WARNING]: Master id is null for item in voucher: " +
                              JSON.stringify(u),
                          ),
                            (r = !0));
                          break;
                        }
                        t.add(N.masterId);
                      }
                    if (d.Util.isNotNull(u.itemsIn) && u.itemsIn.length > 0)
                      for (m = 0, y = u.itemsIn; m < y.length; m++) {
                        if (((N = y[m]), d.Util.isNull(N.masterId))) {
                          (d.Log.info(
                            "[WARNING]: Master id is null for item in voucher: " +
                              JSON.stringify(u),
                          ),
                            (r = !0));
                          break;
                        }
                        t.add(N.masterId);
                      }
                    if (d.Util.isNotNull(u.itemsOut) && u.itemsOut.length > 0)
                      for (h = 0, f = u.itemsOut; h < f.length; h++) {
                        if (((N = f[h]), d.Util.isNull(N.masterId))) {
                          (d.Log.info(
                            "[WARNING]: Master id is null for item in voucher: " +
                              JSON.stringify(u),
                          ),
                            (r = !0));
                          break;
                        }
                        t.add(N.masterId);
                      }
                    if (d.Util.isNotEmpty(u.parties))
                      for (g = 0, M = u.parties; g < M.length; g++)
                        if (((S = M[g]), d.Util.isNotEmpty(S.items)))
                          for (A = 0, O = S.items; A < O.length; A++) {
                            if (((N = O[A]), d.Util.isNull(N.masterId))) {
                              (d.Log.info(
                                "[WARNING]: Master id is null for item in voucher: " +
                                  JSON.stringify(u),
                              ),
                                (r = !0));
                              break;
                            }
                            t.add(N.masterId);
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
                          n.getMastersByAlterId(
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
                  return ((k = a.sent()), [4, this.updateStockItemClosingDiff(k)]);
                case 2:
                  return (a.sent(), [2]);
                case 3:
                  (d.Log.info("Resyncing items with tally: " + t.size),
                    (v = Array.from(t)),
                    (T = i.chunk(v, 50)),
                    (z = 0),
                    (I = T),
                    (a.label = 4));
                case 4:
                  return z < I.length
                    ? ((q = I[z]),
                      [
                        4,
                        n.getMastersByMasterIds(
                          new b.StockItem(),
                          this.userId,
                          this.company,
                          q,
                          b.StockItem.CLOSING_BALANCE_KEYS,
                        ),
                      ])
                    : [3, 8];
                case 5:
                  return ((k = a.sent()), [4, this.updateStockItemClosingDiff(k)]);
                case 6:
                  (a.sent(), (a.label = 7));
                case 7:
                  return (z++, [3, 4]);
                case 8:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.updateStockItemClosingDiff = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r, n, i, s, u, c, l, m, y, b, h, f;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  if (!(d.Util.isNotNull(e) && e.length > 0)) return [3, 6];
                  for (t = [], r = 0, n = e; r < n.length; r++) ((f = n[r]), t.push(f.masterId));
                  return (
                    (i = []),
                    (s = p.default.get(this.master, this.userId, this.company)),
                    t.length > 0 ? [4, s.findAll({ where: { masterId: { $in: t } } })] : [3, 2]
                  );
                case 1:
                  ((i = a.sent()), (a.label = 2));
                case 2:
                  for (u = new Map(), c = 0, l = e; c < l.length; c++)
                    ((f = l[c]), u.set(f.masterId, f));
                  ((m = o().valueOf()), (y = 0), (b = i), (a.label = 3));
                case 3:
                  return y < b.length
                    ? ((h = b[y]),
                      (f = u.get(h.masterId)).closingAmount === h.closingAmount &&
                      f.closingStock === h.closingStock &&
                      f.subClosingStock === h.subClosingStock &&
                      f.alternateClosingStock === h.alternateClosingStock
                        ? [3, 5]
                        : ((h.closingAmount = f.closingAmount),
                          (h.closingStock = f.closingStock),
                          (h.subClosingStock = f.subClosingStock),
                          (h.alternateClosingStock = f.alternateClosingStock),
                          (h.uptoDate = !1),
                          (h.tallyUpdatedAt = m),
                          [4, s.update(h, { where: { _id: h._id } })]))
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
          return n(this, void 0, void 0, function () {
            var r, n, i, o, s, u, c;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return d.Util.isNull(t) || t.length <= 0
                    ? [2]
                    : [
                        4,
                        l.default
                          .getInstance()
                          .getMastersByMasterIds(e, this.userId, this.company, t),
                      ];
                case 1:
                  if (((r = a.sent()), !(d.Util.isNotNull(r) && r.length > 0))) return [3, 5];
                  for (n = [], i = 0, o = r; i < o.length; i++) ((s = o[i]), n.push(s.masterId));
                  return (
                    (u = []),
                    (c = p.default.get(this.master, this.userId, this.company)),
                    n.length > 0 ? [4, c.findAll({ where: { masterId: { $in: n } } })] : [3, 3]
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
        (e.prototype.syncDeletedVoucherBaseOnCondition = function (e, t, r, i) {
          return n(this, void 0, void 0, function () {
            var n, o;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    a.trys.push([0, 5, , 6]),
                    !0 !== i ? [3, 2] : [4, this.syncDeletedVoucher(e, t, r)]
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
                    (n = a.sent()),
                    (o = i ? "New" : "Old"),
                    d.Log.info("Deleted voucher sync fail and running by " + o + "way"),
                    d.Log.error(n),
                    [3, 6]
                  );
                case 6:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.syncDeletedVoucher = function (e, t, r) {
          return n(this, void 0, void 0, function () {
            var n, i, u, p, c, l, y, b, h;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (n = s.default.getInstance()),
                    (i = n.getStoreState()),
                    (u = i.sync.syncSettings),
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
                          (l = new f.SyncMetadataModel(this.userId, this.company)).get(
                            this.master.getName(),
                          ),
                        ]
                  );
                case 1:
                  return (
                    (y = a.sent()),
                    (b = o(y.lastDeleteSyncAt)),
                    (h = y.lastDeletedAlterId),
                    (b = b.add(p, "m")).isAfter(o())
                      ? (d.Log.info(
                          "Skipping syncing deleted vouchers will run after " +
                            b.diff(o(), "m") +
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
                            : [4, new m.default().deletedVoucherSync(e, t)])
                  );
                case 2:
                  return (
                    a.sent(),
                    (y.lastDeleteSyncAt = o().valueOf()),
                    (y.lastDeletedAlterId = r),
                    [4, l.set(this.master.getName(), y)]
                  );
                case 3:
                  return (a.sent(), [2]);
              }
            });
          });
        }),
        (e.prototype.syncDeletedWithTallyByMasterId = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n, u, c, m, y, h, g, M, S, A, O, N, v, T, z, I, q, k, R, C, E, _, D, L, x;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (r = s.default.getInstance()),
                    (n = r.getStoreState()),
                    (u = n.sync.syncSettings),
                    (c = u.deletedVouchersIntervalHours),
                    (m = u.deletedVoucherSyncEnable),
                    d.Util.isNull(m) && (m = !0),
                    !1 === m
                      ? (d.Log.info(
                          "Skipping syncing deleted vouchers as its disabled from settings",
                        ),
                        [2])
                      : [
                          4,
                          (y = new f.SyncMetadataModel(this.userId, this.company)).get(
                            this.master.getName(),
                          ),
                        ]
                  );
                case 1:
                  return (
                    (h = a.sent()),
                    (g = o(h.lastDeleteSyncAt)),
                    (M = h.lastDeletedAlterId),
                    (g = g.add(c, "hours")).isAfter(o())
                      ? (d.Log.info("Skipping syncing deleted vouchers: " + g.diff(o(), "days")),
                        [2])
                      : (d.Log.info("Current Alter Id: " + e + " & Last Alter Id: " + M),
                        M === e
                          ? (d.Log.info(
                              "Skipping syncing deleted vouchers: AlterId is not changed",
                            ),
                            [2])
                          : d.Util.isNotNull(e) && d.Util.isNotNull(M) && e < M
                            ? (d.Log.warn(
                                "[WARNING]: Skipping syncing deleted vouchers: Unexpected condition: Current Alter Id is less then Last Sync Alter Id.",
                              ),
                              [2])
                            : ((S = l.default.getInstance()),
                              d.Util.isNull(t) && (t = u.deletedVouchersDays),
                              (A = o().subtract(t, "days").valueOf()),
                              d.Log.info(
                                "Syncing deleted vouchers from startDate: " + o(A).toString(),
                              ),
                              [
                                4,
                                (O = p.default.get(this.master, this.userId, this.company)).findAll(
                                  {
                                    attributes: ["masterId", "date"],
                                    order: [["masterId", "ASC"]],
                                    where: { date: { $gte: A }, isDeleted: !1 },
                                  },
                                ),
                              ]))
                  );
                case 2:
                  if (((N = a.sent()), !(d.Util.isNotNull(N) && N.length > 0))) return [3, 11];
                  (d.Log.info("Checking vouchers for deletion count: " + N.length),
                    (v = i.chunk(N, 200)),
                    (this.company.startingFrom = o()
                      .subtract(t + 5, "days")
                      .valueOf()),
                    (T = 0),
                    (z = v),
                    (a.label = 3));
                case 3:
                  return T < z.length
                    ? ((I = z[T]),
                      (q = I[0].masterId),
                      (k = I[I.length - 1].masterId),
                      d.Log.info("Syncing deleted vouchers from " + q + " - " + k),
                      [
                        4,
                        S.getMastersByMasterIdRange(
                          new b.DeletedVoucher(),
                          this.userId,
                          this.company,
                          q,
                          k,
                        ),
                      ])
                    : [3, 9];
                case 4:
                  ((R = a.sent()),
                    (C = i.map(R, "masterId")),
                    (E = new Set(C)),
                    (_ = i.map(I, "masterId")),
                    (D = 0),
                    (L = _),
                    (a.label = 5));
                case 5:
                  return D < L.length
                    ? ((x = L[D]),
                      E.has(x)
                        ? [3, 7]
                        : (d.Log.info("Deleting voucher with masterId: " + x),
                          [
                            4,
                            O.update(
                              { isDeleted: !0, uptoDate: !1, tallyUpdatedAt: d.DateUtil.now() },
                              { where: { masterId: x } },
                            ),
                          ]))
                    : [3, 8];
                case 6:
                  (a.sent(), (a.label = 7));
                case 7:
                  return (D++, [3, 5]);
                case 8:
                  return (T++, [3, 3]);
                case 9:
                  return (
                    d.Log.info(
                      "Successfully synced deleted vouchers. Setting the last delete sync time to current time.",
                    ),
                    (h.lastDeleteSyncAt = o().valueOf()),
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
        (e.prototype.updateDiff = function (e, t, r, i) {
          return n(this, void 0, void 0, function () {
            var n, s, p, c, l, m, y, h, f, g, M, S, A, O, N, v, T, z, I, q, k, R;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  for (
                    a.trys.push([0, 3, , 4]),
                      n = {},
                      s = "_id",
                      this.masterName === u.default.masterName && (s = "companyId"),
                      p = 0,
                      c = e;
                    p < c.length;
                    p++
                  )
                    ((M = c[p]), (n[M[s]] = M));
                  for (l = [], m = [], y = [], h = 0, f = t; h < f.length; h++) {
                    if (((g = f[h]), (M = n[g[s]]), d.Util.isNull(M)))
                      !0 !== g.isDeleted && ((g.isDeleted = !0), y.push(g));
                    else if (
                      (!0 !== i &&
                        this.masterName === b.Ledger.masterName &&
                        (M.pendingBills = g.pendingBills),
                      ("function" == typeof g.equals && "function" == typeof g.updateFromTally) ||
                        (g = this.master.toObject(g)),
                      "function" != typeof g.equals || "function" != typeof g.updateFromTally)
                    )
                      (d.Log.info("[WARNING]: Unexpected condition, object is not created."),
                        d.Log.info(g),
                        d.Log.info(M));
                    else if (g.equals(M))
                      try {
                        (S = d.Util.checkObjectDiff(g, M)) &&
                          d.Log.info(
                            "Tally Item same as LocalDbItem hence printing the difference if any: " +
                              JSON.stringify(S),
                          );
                      } catch (e) {
                        d.Log.info(
                          "Caught error in finding differnce between tallyItem and localDbItem: " +
                            JSON.stringify(e),
                        );
                      }
                    else
                      (g.alterId !== M.alterId && g.updateOldName(M),
                        g.updateFromTally(M),
                        m.push(g));
                    delete n[g[s]];
                  }
                  for (A in n) l.push(n[A]);
                  for (O = o().valueOf(), v = 0, T = N = [l, m, y]; v < T.length; v++)
                    for (z = 0, I = T[v]; z < I.length; z++)
                      (((q = I[z]).tallyUpdatedAt = O), (q.uptoDate = !1));
                  return [4, r.bulkCreate(N[0])];
                case 1:
                  return (a.sent(), (k = N[1].concat(N[2])), [4, r.updateTransaction(k, s)]);
                case 2:
                  return (
                    a.sent(),
                    d.Log.info(
                      this.masterName +
                        ": insert " +
                        N[0].length +
                        ", update " +
                        N[1].length +
                        ", delete " +
                        N[2].length,
                    ),
                    [3, 4]
                  );
                case 3:
                  throw (
                    (R = a.sent()),
                    d.Log.debug("UpdateDiff something went wrong here data for debug: "),
                    d.Log.debug("TallyItems " + JSON.stringify(e)),
                    d.Log.debug("LocaldbItems " + JSON.stringify(t)),
                    d.Log.debug("Error updatediff " + JSON.stringify(R)),
                    R
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
  t.default = g;
};
