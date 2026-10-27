// webpack module #2558 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var o = r(43),
    s = r(49),
    n = r(119),
    u = r(2),
    p = r(122),
    c = r(213),
    m = (function () {
      function e() {}
      return (
        (e.prototype.getName = function () {
          return e.modelName;
        }),
        (e.prototype.getBestSyncTime = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i, s, n, p;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (a.trys.push([0, 7, , 8]), [4, this.getSyncTime(e, t)]);
                case 1:
                  return (
                    (r = a.sent()),
                    (i = u.TallyUtil.removeNoiseChars(t.tallyCompanyName)),
                    [4, (s = o.default.getV1(this, e)).findOne({ where: { companyName: i } })]
                  );
                case 2:
                  return (
                    (n = a.sent()),
                    u.Util.isNotNull(n)
                      ? [4, s.destroy({ where: { companyName: n.companyName } })]
                      : [3, 4]
                  );
                case 3:
                  (a.sent(), (a.label = 4));
                case 4:
                  return [4, s.create({ companyName: i, recommendedSyncTime: r })];
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
          return i(this, void 0, void 0, function () {
            var r;
            return a(this, function (i) {
              switch (i.label) {
                case 0:
                  return (
                    (r = u.TallyUtil.removeNoiseChars(t.tallyCompanyName)),
                    [4, o.default.getV1(this, e).destroy({ where: { companyName: r } })]
                  );
                case 1:
                  return (i.sent(), [2]);
              }
            });
          });
        }),
        (e.prototype.getOptimalSyncTime = function (e) {
          return i(this, void 0, void 0, function () {
            var t, r;
            return a(this, function (i) {
              switch (i.label) {
                case 0:
                  return [
                    4,
                    o.default.getV1(this, e).max("recommendedSyncTime", "recommendedSyncTime"),
                  ];
                case 1:
                  return (
                    (t = i.sent()),
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
          return i(this, void 0, void 0, function () {
            var t, r, i, o, p, c, m;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  ((t = { startDate: e.getStartDate(), endDate: u.DateUtil.now() }),
                    (r = 0),
                    (i = s.default.getInstance()),
                    (o = new Set(n.default.TALLY_ALL_MASTER_NAMES)),
                    (p = []),
                    (a.label = 1));
                case 1:
                  return (a.trys.push([1, 3, , 4]), [4, i.getVoucherStatistics([t], e, [])]);
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
                      ((m = p[0]),
                      u.Util.isNotNull(m) &&
                        u.Util.isNotNull(m.stats) &&
                        Object.keys(m.stats).forEach(function (e) {
                          o.has(e) || (r += m.stats[e]);
                        })),
                    [2, r]
                  );
              }
            });
          });
        }),
        (e.prototype.getHardwareInfo = function () {
          return i(this, void 0, void 0, function () {
            var e, t, r;
            return a(this, function (i) {
              switch (i.label) {
                case 0:
                  return (i.trys.push([0, 2, , 3]), [4, p.getSystemHardware()]);
                case 1:
                  return (
                    (e = i.sent()),
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
                  throw i.sent();
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
            i = e.cores,
            a = e.osArch,
            o = e.goldLicense,
            s =
              this.getVoucherCountRating(t) *
              this.getSysetmRamRating(r) *
              this.getCpuCoreRating(i) *
              this.getSystemArchRating(a) *
              this.getSystemRatingForGoldlicence(o);
          return this.round5(s);
        }),
        (e.prototype.round5 = function (e) {
          var t = e % 5;
          return 0 === t ? e : t <= 2 ? e - t : 5 * Math.ceil(e / 5);
        }),
        (e.prototype.getSyncTime = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i, o, n, p, m, l, d, y, b;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.getHardwareInfo()];
                case 1:
                  return ((r = a.sent()), [4, (i = s.default.getInstance()).isTallyGoldLicense()]);
                case 2:
                  return ((o = a.sent()), [4, i.getCompanies([t.tallyCompanyName])]);
                case 3:
                  if (((n = a.sent()), !u.Util.isFilledArray(n)))
                    return (u.Log.warn("No company found for optimal sync timing"), [2]);
                  (((p = n[0]).syncFrom = t.syncFrom),
                    (m = r.ram),
                    (l = r.cores),
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
                      totalRam: m,
                      cores: l,
                      osArch: d,
                      goldLicense: o,
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
  t.default = m;
};
