// webpack module #1565 (from background_worker, BA Mobile Connector 8.4.41)
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
  var i = r(30),
    o = r(35),
    s = r(110),
    u = r(0),
    p = r(237),
    c = r(150),
    l = (function () {
      function e() {}
      return (
        (e.prototype.getName = function () {
          return e.modelName;
        }),
        (e.prototype.getBestSyncTime = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n, o, s, p;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (a.trys.push([0, 7, , 8]), [4, this.getSyncTime(e, t)]);
                case 1:
                  return (
                    (r = a.sent()),
                    (n = u.TallyUtil.removeNoiseChars(t.tallyCompanyName)),
                    [4, (o = i.default.getV1(this, e)).findOne({ where: { companyName: n } })]
                  );
                case 2:
                  return (
                    (s = a.sent()),
                    u.Util.isNotNull(s)
                      ? [4, o.destroy({ where: { companyName: s.companyName } })]
                      : [3, 4]
                  );
                case 3:
                  (a.sent(), (a.label = 4));
                case 4:
                  return [4, o.create({ companyName: n, recommendedSyncTime: r })];
                case 5:
                  return (a.sent(), [4, this.getOptimalSyncTime(e)]);
                case 6:
                  return [2, a.sent()];
                case 7:
                  return (
                    (p = a.sent()),
                    u.Log.info("getBestSyncTime error on add company " + JSON.stringify(p)),
                    [3, 8]
                  );
                case 8:
                  return [2, 10];
              }
            });
          });
        }),
        (e.prototype.deleteSyncTimeForCompany = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r;
            return a(this, function (n) {
              switch (n.label) {
                case 0:
                  return (
                    (r = u.TallyUtil.removeNoiseChars(t.tallyCompanyName)),
                    [4, i.default.getV1(this, e).destroy({ where: { companyName: r } })]
                  );
                case 1:
                  return (n.sent(), [2]);
              }
            });
          });
        }),
        (e.prototype.getOptimalSyncTime = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r;
            return a(this, function (n) {
              switch (n.label) {
                case 0:
                  return [
                    4,
                    i.default.getV1(this, e).max("recommendedSyncTime", "recommendedSyncTime"),
                  ];
                case 1:
                  return (
                    (t = n.sent()),
                    (r = null),
                    u.Util.isFilledArray(t) && (r = t[0].recommendedSyncTime),
                    (r = u.Util.isNumber(r) ? r : parseInt(r, 10)),
                    [2, Math.max(Math.min(r, 60), 5)]
                  );
              }
            });
          });
        }),
        (e.prototype.getVoucherStatus = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r, n, i, p, c, l;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  ((t = { startDate: e.getStartDate(), endDate: u.DateUtil.now() }),
                    (r = 0),
                    (n = o.default.getInstance()),
                    (i = new Set(s.default.TALLY_ALL_MASTER_NAMES)),
                    (p = []),
                    (a.label = 1));
                case 1:
                  return (a.trys.push([1, 3, , 4]), [4, n.getVoucherStatistics([t], e, [])]);
                case 2:
                  return ((p = a.sent()), [3, 4]);
                case 3:
                  return (
                    (c = a.sent()),
                    u.Log.error(
                      "Unable to parse voucher stats on sync time fn" + JSON.stringify(c),
                    ),
                    [2, r]
                  );
                case 4:
                  return (
                    u.Util.isFilledArray(p) &&
                      ((l = p[0]),
                      u.Util.isNotNull(l) &&
                        u.Util.isNotNull(l.stats) &&
                        Object.keys(l.stats).forEach(function (e) {
                          i.has(e) || (r += l.stats[e]);
                        })),
                    [2, r]
                  );
              }
            });
          });
        }),
        (e.prototype.getHardwareInfo = function () {
          return n(this, void 0, void 0, function () {
            var e, t, r;
            return a(this, function (n) {
              switch (n.label) {
                case 0:
                  return (n.trys.push([0, 2, , 3]), [4, p.getSystemHardware()]);
                case 1:
                  return (
                    (e = n.sent()),
                    (t = e.system.ram),
                    (r = void 0),
                    u.Util.isNotNull(t) &&
                      ((t = t.split("gb")[0]), u.Util.isNotNull(t) && (r = parseInt(t.trim(), 10))),
                    [
                      2,
                      {
                        ram: r,
                        cores: e.system.cpu.cores,
                        processor: e.system.cpu.processor,
                        osArch: e.system.os.arch,
                      },
                    ]
                  );
                case 2:
                  throw n.sent();
                case 3:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.getVoucherCountRating = function (e) {
          return e >= 15e4
            ? 20
            : e >= 100001 && e <= 15e4
              ? 15
              : e >= 50001 && e <= 1e5
                ? 10
                : e >= 15001 && e <= 5e4
                  ? 5
                  : 2.5;
        }),
        (e.prototype.getSysetmRamRating = function (e) {
          return e >= 1 && e < 4 ? 3 : e >= 4 && e <= 8 ? 1.2 : 1;
        }),
        (e.prototype.getCpuCoreRating = function (e) {
          return e < 2 ? 1.5 : e < 4 ? 1.2 : 1;
        }),
        (e.prototype.getSystemArchRating = function (e) {
          var t = 2;
          return ("x64" === e && (t = 1), t);
        }),
        (e.prototype.getSystemRatingForGoldlicence = function (e) {
          var t = 1;
          return (!0 === e && (t = 2), t);
        }),
        (e.prototype.getSystemRatingBaseOnDiskType = function (e) {
          var t = 1.25;
          return (e === p.DISK_TYPE.SSD && (t = 1), t);
        }),
        (e.prototype.calculateSyncFrequency = function (e) {
          var t = e.voucherCount,
            r = e.totalRam,
            n = e.cores,
            a = e.osArch,
            i = e.goldLicense,
            o =
              this.getVoucherCountRating(t) *
              this.getSysetmRamRating(r) *
              this.getCpuCoreRating(n) *
              this.getSystemArchRating(a) *
              this.getSystemRatingForGoldlicence(i);
          return this.round5(o);
        }),
        (e.prototype.round5 = function (e) {
          var t = e % 5;
          return 0 === t ? e : t <= 2 ? e - t : 5 * Math.ceil(e / 5);
        }),
        (e.prototype.getSyncTime = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n, i, s, p, l, m, d, y, b;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.getHardwareInfo()];
                case 1:
                  return ((r = a.sent()), [4, (n = o.default.getInstance()).isTallyGoldLicense()]);
                case 2:
                  return ((i = a.sent()), [4, n.getCompanies([t.tallyCompanyName])]);
                case 3:
                  if (((s = a.sent()), !u.Util.isFilledArray(s)))
                    return (u.Log.warn("No company found for optimal sync timing"), [2]);
                  (((p = s[0]).syncFrom = t.syncFrom),
                    (l = r.ram),
                    (m = r.cores),
                    (d = r.osArch),
                    (y = 0),
                    (a.label = 4));
                case 4:
                  return (a.trys.push([4, 8, , 9]), [4, c.isAdminLoginInTally(e)]);
                case 5:
                  return a.sent() ? [4, this.getVoucherStatus(p)] : [3, 7];
                case 6:
                  ((y = a.sent()), (a.label = 7));
                case 7:
                  return [3, 9];
                case 8:
                  return ((b = a.sent()), console.log(b), [3, 9]);
                case 9:
                  return [
                    2,
                    this.calculateSyncFrequency({
                      voucherCount: y,
                      totalRam: l,
                      cores: m,
                      osArch: d,
                      goldLicense: i,
                    }),
                  ];
              }
            });
          });
        }),
        (e.modelName = "SyncTime"),
        e
      );
    })();
  t.default = l;
};
