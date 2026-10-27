// webpack module #150 (from background_worker, BA Mobile Connector 8.4.41)
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
  var i = r(48),
    o = r(26),
    s = r(59),
    u = r(8),
    p = r(390),
    c = r(225),
    l = r(30),
    m = r(83),
    d = r(1588),
    y = r(35),
    b = r(110),
    h = r(28),
    f = r(0),
    g = r(237),
    M = r(11),
    S = r(48);
  function A(e, t) {
    return n(this, void 0, void 0, function () {
      var r, n, i, o, s, u, p;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            if (!1 === t) return [2];
            ((r = b.default.TALLY_ALL_MASTER_NAMES),
              (n = { startDate: e.getStartDate(), endDate: e.getEndDate() }),
              (i = y.default.getInstance()),
              (o = []),
              (a.label = 1));
          case 1:
            return (a.trys.push([1, 3, , 4]), [4, i.getVoucherStatistics([n], e, r)]);
          case 2:
            return ((o = a.sent()), [3, 4]);
          case 3:
            return (
              (s = a.sent()),
              f.Log.error("Unable to parse voucher stats on alter id - " + JSON.stringify(s)),
              [2]
            );
          case 4:
            return f.Util.isFilledArray(o)
              ? ((u = o[0].stats),
                f.Util.isNull(u)
                  ? [2]
                  : ((p = 0),
                    Object.keys(u).map(function (e) {
                      M.isNumber(u[e]) && (p += u[e]);
                    }),
                    [2, p]))
              : [2];
        }
      });
    });
  }
  function O(e) {
    return n(this, void 0, void 0, function () {
      var t, r, n;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            return (
              a.trys.push([0, 2, , 3]),
              [4, new m.default(e).get(h.AppSettingMetadata.IS_ADMIN_LOGIN_IN_TALLY)]
            );
          case 1:
            return ((t = a.sent()), [2, f.Util.isNull(t) || t.data === u.default.NO]);
          case 2:
            throw (
              (r = a.sent()),
              f.Log.info("error " + JSON.stringify(r)),
              ((n = new p.default()).message = "Unable to get admin query details"),
              n
            );
          case 3:
            return [2];
        }
      });
    });
  }
  ((t.ADDED_COMPANIES = "added-companies"),
    (t.TALLY_COMPANIES = "tally-companies"),
    (t.getCompanies = function (e, r) {
      return n(this, void 0, void 0, function () {
        var n, m, b, h, S, N, v, T, z, I, q, k, R, C, E, _, D, L, x, w, P, W, B, U;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              ((n = new d.default()), (b = []), (h = []), (S = new p.default()), (a.label = 1));
            case 1:
              if ((a.trys.push([1, 27, , 28]), M.isNull(r) || M.isNull(r.id)))
                throw ((S.message = "User is not logged in"), S);
              return [4, y.default.getTallyLicense()];
            case 2:
              return (
                (N = a.sent()),
                f.Util.isNotNull(r.subscriptionVersion) &&
                r.subscriptionVersion >= u.default.MIN_SUBSCRIPTION_VERSION
                  ? f.Util.isNotEmpty(N)
                    ? [4, i.getCompaniesByTallyLicense(r, N)]
                    : [3, 4]
                  : [3, 6]
              );
            case 3:
              return (
                (n = a.sent()),
                f.Util.isNotNull(n.subscription) &&
                  o.default.set(o.default.SUBSCRIPTION + "_" + N, n.subscription),
                (m = n.companies),
                [3, 5]
              );
            case 4:
              ((m = []), (a.label = 5));
            case 5:
              return [3, 8];
            case 6:
              return [4, i.getAllCompanies(r)];
            case 7:
              ((m = a.sent()), (a.label = 8));
            case 8:
              return [4, i.getTime()];
            case 9:
              return (
                a.sent(),
                M.isNotNull(m)
                  ? [4, (P = l.default.get(new s.default(), r.id)).truncate()]
                  : [3, 15]
              );
            case 10:
              return (a.sent(), [4, P.findAll()]);
            case 11:
              return (
                (v = a.sent()),
                f.Util.isNull(v) || 0 === v.length
                  ? ((m = (function (e) {
                      return e.map(function (e) {
                        var t = {
                          lastFileUploadedAtServer: e.lastFileUploadedAtServer,
                          startValidatingLastSyncDate: e.startValidatingLastSyncDate,
                          lastFileUploadedDeviceId: e.lastFileUploadedDeviceId,
                        };
                        return ((e.lastSyncMetaData = t), (e.serverUpdatedAt = e.updatedAt), e);
                      });
                    })(m)),
                    [4, P.bulkCreate(m)])
                  : [3, 14]
              );
            case 12:
              return (a.sent(), [4, P.findAll()]);
            case 13:
              return ((b = a.sent()), [3, 15]);
            case 14:
              ((b = v), (a.label = 15));
            case 15:
              if (M.isNotNull(b) && b.length > 0)
                for (T = 0, z = b; T < z.length; T++)
                  (((x = z[T]).isOpenInTally = !1),
                    (x.err =
                      "Company (" +
                      x.tallyCompanyName +
                      ") is not open in Tally or company name in Tally has changed."));
              return [4, y.default.getInstance().getCompanies()];
            case 16:
              return (
                (I = a.sent()),
                console.log(
                  "Companies Server: " + m.length + " Local: " + b.length + " Tally: " + I.length,
                ),
                [4, g.getSystemTimezone()]
              );
            case 17:
              return ((q = a.sent()), [4, O(r.id)]);
            case 18:
              ((k = a.sent()), (R = 0), (C = I), (a.label = 19));
            case 19:
              if (!(R < C.length)) return [3, 26];
              ((E = C[R]), (_ = !1), (D = 0), (L = b), (a.label = 20));
            case 20:
              return D < L.length
                ? ((x = L[D]),
                  E._id.trim() !== x._id.trim()
                    ? [3, 23]
                    : ((_ = !0),
                      (x.isOpenInTally = !0),
                      (x.err = null),
                      (x.startingFrom = E.startingFrom),
                      (E.companyId = x.companyId),
                      (x.destination = E.destination),
                      [4, A(E, k)]))
                : [3, 24];
            case 21:
              return (
                (w = a.sent()),
                E.altVchId <= 0 || E.altMstId < w
                  ? (console.log(
                      E.tallyCompanyName +
                        " AltVch:" +
                        E.altVchId +
                        " AltMst:" +
                        E.altMstId +
                        " VchCount:" +
                        w,
                    ),
                    (x.err =
                      "You would need to rewrite Tally Data for your company: " +
                      x.name +
                      ". Please contact us at help@siliconveins.com so that we can guide you regarding the same."),
                    (E.isCompanyAlterIdNegative = !0))
                  : (E.isCompanyAlterIdNegative = !1),
                [4, (P = l.default.get(new s.default(), r.id)).update(E, { where: { _id: E._id } })]
              );
            case 22:
              (a.sent(),
                f.Util.isNotNull(q) &&
                  f.Util.isFilledArray(q.utc) &&
                  -1 === q.utc.indexOf(x.timezone) &&
                  ((x.message = "Your system and company timezone are different."),
                  console.log("SystemTimezoe " + JSON.stringify(q)),
                  console.log("Company Timezone " + x.timezone)),
                (a.label = 23));
            case 23:
              return (D++, [3, 20]);
            case 24:
              (!1 === _ && h.push(E), (a.label = 25));
            case 25:
              return (R++, [3, 19]);
            case 26:
              return (
                (b = (function (e) {
                  for (
                    var t = o.default.get(o.default.COMPANIES_LAST_SYNC, []), r = 0, n = e;
                    r < n.length;
                    r++
                  ) {
                    var a = n[r];
                    if (((a.lastSync = 0), t.length > 0))
                      for (var i = 0, s = t; i < s.length; i++) {
                        var u = s[i];
                        a.companyId === u.companyId && (a.lastSync = u.time);
                      }
                  }
                  return e;
                })(b)),
                [3, 28]
              );
            case 27:
              if (
                ((W = a.sent()),
                f.Log.error("Company Service Error: "),
                f.Log.error(W),
                W instanceof Error &&
                  f.Util.isNotNull(W) &&
                  !1 === c.default.checkInternetisNotThere(W) &&
                  ((B = W.toString()), f.Util.isNotNull(B)))
              )
                throw (
                  (U = B.split("Error: ")).length > 1 ? (S.message = U[1]) : (S.message = B),
                  S
                );
              throw W;
            case 28:
              return e === t.ADDED_COMPANIES
                ? ((n.companies = b), [2, Promise.resolve(n)])
                : e === t.TALLY_COMPANIES
                  ? ((n.companies = h), [2, Promise.resolve(n)])
                  : [2];
          }
        });
      });
    }),
    (t.getAllCompanies = function () {
      return n(this, void 0, void 0, function () {
        var e, t, r;
        return a(this, function (n) {
          switch (n.label) {
            case 0:
              ((e = new d.default()), (t = []), (n.label = 1));
            case 1:
              return (n.trys.push([1, 3, , 4]), [4, y.default.getInstance().getCompanies()]);
            case 2:
              return ((t = n.sent()), console.log("Companies from tally: ", t.length), [3, 4]);
            case 3:
              throw ((r = n.sent()), f.Log.error(r), r);
            case 4:
              return ((e.companies = t), [2, Promise.resolve(e)]);
          }
        });
      });
    }),
    (t.deleteCompanyFromLocal = function (e, t) {
      return n(this, void 0, void 0, function () {
        return a(this, function (r) {
          switch (r.label) {
            case 0:
              return [
                4,
                l.default.get(new s.default(), t.id).destroy({ where: { companyId: e.companyId } }),
              ];
            case 1:
              return (r.sent(), [2]);
          }
        });
      });
    }),
    (t.updateSyncDetailForCompany = function (e, t, r) {
      return (
        void 0 === r && (r = !1),
        n(this, void 0, void 0, function () {
          var n, i;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  a.trys.push([0, 3, , 4]),
                  ((n = new s.default()).companyId = t.companyId),
                  (n.syncDetails = t.syncDetails),
                  (n.syncDetails.isMultiComputerSetup = r),
                  [4, S.updateCompany(e, n, !1)]
                );
              case 1:
                return (
                  a.sent(),
                  [
                    4,
                    l.default
                      .get(new s.default(), e.id)
                      .update(n, { where: { companyId: t.companyId } }),
                  ]
                );
              case 2:
                return (a.sent(), [2, t]);
              case 3:
                return (
                  (i = a.sent()),
                  f.Log.error("Error while syncing " + t.companyId),
                  f.Log.error(
                    "Error Occured while updating company on Query fail Event" + JSON.stringify(i),
                  ),
                  [3, 4]
                );
              case 4:
                return [2];
            }
          });
        })
      );
    }),
    (t.isAdminLoginInTally = O),
    (t.updateSyncDetailForCompanies = function (e, t, r) {
      return (
        void 0 === r && (r = !1),
        n(this, void 0, void 0, function () {
          var n, i, o, u, p, c;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  a.trys.push([0, 6, , 7]),
                  (n = t.map(function (e) {
                    var t = new s.default();
                    return (
                      (t.companyId = e.companyId),
                      (t.syncDetails = e.syncDetails),
                      (t.syncDetails.isMultiComputerSetup = r),
                      t
                    );
                  })),
                  [4, S.updateCompaniesAPI(e, n)]
                );
              case 1:
                (a.sent(),
                  (i = l.default.get(new s.default(), e.id)),
                  (o = 0),
                  (u = n),
                  (a.label = 2));
              case 2:
                return o < u.length
                  ? ((p = u[o]), [4, i.update(p, { where: { companyId: p.companyId } })])
                  : [3, 5];
              case 3:
                (a.sent(), (a.label = 4));
              case 4:
                return (o++, [3, 2]);
              case 5:
                return [2, t];
              case 6:
                return (
                  (c = a.sent()),
                  console.log(c),
                  f.Log.error(
                    "Error Occure while updating company on Query fail Event" + JSON.stringify(c),
                  ),
                  [3, 7]
                );
              case 7:
                return [2];
            }
          });
        })
      );
    }));
};
