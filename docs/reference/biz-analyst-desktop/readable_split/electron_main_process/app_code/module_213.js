// webpack module #213 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var o = r(59),
    s = r(24),
    n = r(60),
    u = r(11),
    p = r(504),
    c = r(155),
    m = r(43),
    l = r(90),
    d = r(2582),
    y = r(49),
    b = r(119),
    h = r(32),
    g = r(2),
    S = r(122),
    f = r(10),
    A = r(59);
  function N(e, t) {
    return i(this, void 0, void 0, function () {
      var r, i, o, s, n, u, p;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            if (!1 === t) return [2];
            ((r = b.default.TALLY_ALL_MASTER_NAMES),
              (i = { startDate: e.getStartDate(), endDate: e.getEndDate() }),
              (o = y.default.getInstance()),
              (s = []),
              (a.label = 1));
          case 1:
            return (a.trys.push([1, 3, , 4]), [4, o.getVoucherStatistics([i], e, r)]);
          case 2:
            return ((s = a.sent()), [3, 4]);
          case 3:
            return (
              (n = a.sent()),
              g.Log.error("Unable to parse voucher stats on alter id - " + JSON.stringify(n)),
              [2]
            );
          case 4:
            return g.Util.isFilledArray(s)
              ? ((u = s[0].stats),
                g.Util.isNull(u)
                  ? [2]
                  : ((p = 0),
                    Object.keys(u).map(function (e) {
                      f.isNumber(u[e]) && (p += u[e]);
                    }),
                    [2, p]))
              : [2];
        }
      });
    });
  }
  function I(e) {
    return i(this, void 0, void 0, function () {
      var t, r, i;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            return (
              a.trys.push([0, 2, , 3]),
              [4, new l.default(e).get(h.AppSettingMetadata.IS_ADMIN_LOGIN_IN_TALLY)]
            );
          case 1:
            return ((t = a.sent()), [2, g.Util.isNull(t) || t.data === u.default.NO]);
          case 2:
            throw (
              (r = a.sent()),
              g.Log.info("error " + JSON.stringify(r)),
              ((i = new p.default()).message = "Unable to get admin query details"),
              i
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
      return i(this, void 0, void 0, function () {
        var i, l, b, h, A, T, M, v, k, C, q, R, D, E, x, O, z, P, L, w, _, U, B, F;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              ((i = new d.default()), (b = []), (h = []), (A = new p.default()), (a.label = 1));
            case 1:
              if ((a.trys.push([1, 27, , 28]), f.isNull(r) || f.isNull(r.id)))
                throw ((A.message = "User is not logged in"), A);
              return [4, y.default.getTallyLicense()];
            case 2:
              return (
                (T = a.sent()),
                g.Util.isNotNull(r.subscriptionVersion) &&
                r.subscriptionVersion >= u.default.MIN_SUBSCRIPTION_VERSION
                  ? g.Util.isNotEmpty(T)
                    ? [4, o.getCompaniesByTallyLicense(r, T)]
                    : [3, 4]
                  : [3, 6]
              );
            case 3:
              return (
                (i = a.sent()),
                g.Util.isNotNull(i.subscription) &&
                  s.default.set(s.default.SUBSCRIPTION + "_" + T, i.subscription),
                (l = i.companies),
                [3, 5]
              );
            case 4:
              ((l = []), (a.label = 5));
            case 5:
              return [3, 8];
            case 6:
              return [4, o.getAllCompanies(r)];
            case 7:
              ((l = a.sent()), (a.label = 8));
            case 8:
              return [4, o.getTime()];
            case 9:
              return (
                a.sent(),
                f.isNotNull(l)
                  ? [4, (_ = m.default.get(new n.default(), r.id)).truncate()]
                  : [3, 15]
              );
            case 10:
              return (a.sent(), [4, _.findAll()]);
            case 11:
              return (
                (M = a.sent()),
                g.Util.isNull(M) || 0 === M.length
                  ? ((l = (function (e) {
                      return e.map(function (e) {
                        var t = {
                          lastFileUploadedAtServer: e.lastFileUploadedAtServer,
                          startValidatingLastSyncDate: e.startValidatingLastSyncDate,
                          lastFileUploadedDeviceId: e.lastFileUploadedDeviceId,
                        };
                        return ((e.lastSyncMetaData = t), (e.serverUpdatedAt = e.updatedAt), e);
                      });
                    })(l)),
                    [4, _.bulkCreate(l)])
                  : [3, 14]
              );
            case 12:
              return (a.sent(), [4, _.findAll()]);
            case 13:
              return ((b = a.sent()), [3, 15]);
            case 14:
              ((b = M), (a.label = 15));
            case 15:
              if (f.isNotNull(b) && b.length > 0)
                for (v = 0, k = b; v < k.length; v++)
                  (((L = k[v]).isOpenInTally = !1),
                    (L.err =
                      "Company (" +
                      L.tallyCompanyName +
                      ") is not open in Tally or company name in Tally has changed."));
              return [4, y.default.getInstance().getCompanies()];
            case 16:
              return (
                (C = a.sent()),
                console.log(
                  "Companies Server: " + l.length + " Local: " + b.length + " Tally: " + C.length,
                ),
                [4, S.getSystemTimezone()]
              );
            case 17:
              return ((q = a.sent()), [4, I(r.id)]);
            case 18:
              ((R = a.sent()), (D = 0), (E = C), (a.label = 19));
            case 19:
              if (!(D < E.length)) return [3, 26];
              ((x = E[D]), (O = !1), (z = 0), (P = b), (a.label = 20));
            case 20:
              return z < P.length
                ? ((L = P[z]),
                  x._id.trim() !== L._id.trim()
                    ? [3, 23]
                    : ((O = !0),
                      (L.isOpenInTally = !0),
                      (L.err = null),
                      (L.startingFrom = x.startingFrom),
                      (x.companyId = L.companyId),
                      (L.destination = x.destination),
                      [4, N(x, R)]))
                : [3, 24];
            case 21:
              return (
                (w = a.sent()),
                x.altVchId <= 0 || x.altMstId < w
                  ? (console.log(
                      x.tallyCompanyName +
                        " AltVch:" +
                        x.altVchId +
                        " AltMst:" +
                        x.altMstId +
                        " VchCount:" +
                        w,
                    ),
                    (L.err =
                      "You would need to rewrite Tally Data for your company: " +
                      L.name +
                      ". Please contact us at help@siliconveins.com so that we can guide you regarding the same."),
                    (x.isCompanyAlterIdNegative = !0))
                  : (x.isCompanyAlterIdNegative = !1),
                [4, (_ = m.default.get(new n.default(), r.id)).update(x, { where: { _id: x._id } })]
              );
            case 22:
              (a.sent(),
                g.Util.isNotNull(q) &&
                  g.Util.isFilledArray(q.utc) &&
                  -1 === q.utc.indexOf(L.timezone) &&
                  ((L.message = "Your system and company timezone are different."),
                  console.log("SystemTimezoe " + JSON.stringify(q)),
                  console.log("Company Timezone " + L.timezone)),
                (a.label = 23));
            case 23:
              return (z++, [3, 20]);
            case 24:
              (!1 === O && h.push(x), (a.label = 25));
            case 25:
              return (D++, [3, 19]);
            case 26:
              return (
                (b = (function (e) {
                  for (
                    var t = s.default.get(s.default.COMPANIES_LAST_SYNC, []), r = 0, i = e;
                    r < i.length;
                    r++
                  ) {
                    var a = i[r];
                    if (((a.lastSync = 0), t.length > 0))
                      for (var o = 0, n = t; o < n.length; o++) {
                        var u = n[o];
                        a.companyId === u.companyId && (a.lastSync = u.time);
                      }
                  }
                  return e;
                })(b)),
                [3, 28]
              );
            case 27:
              if (
                ((U = a.sent()),
                g.Log.error("Company Service Error: "),
                g.Log.error(U),
                U instanceof Error &&
                  g.Util.isNotNull(U) &&
                  !1 === c.default.checkInternetisNotThere(U) &&
                  ((B = U.toString()), g.Util.isNotNull(B)))
              )
                throw (
                  (F = B.split("Error: ")).length > 1 ? (A.message = F[1]) : (A.message = B),
                  A
                );
              throw U;
            case 28:
              return e === t.ADDED_COMPANIES
                ? ((i.companies = b), [2, Promise.resolve(i)])
                : e === t.TALLY_COMPANIES
                  ? ((i.companies = h), [2, Promise.resolve(i)])
                  : [2];
          }
        });
      });
    }),
    (t.getAllCompanies = function () {
      return i(this, void 0, void 0, function () {
        var e, t, r;
        return a(this, function (i) {
          switch (i.label) {
            case 0:
              ((e = new d.default()), (t = []), (i.label = 1));
            case 1:
              return (i.trys.push([1, 3, , 4]), [4, y.default.getInstance().getCompanies()]);
            case 2:
              return ((t = i.sent()), console.log("Companies from tally: ", t.length), [3, 4]);
            case 3:
              throw ((r = i.sent()), g.Log.error(r), r);
            case 4:
              return ((e.companies = t), [2, Promise.resolve(e)]);
          }
        });
      });
    }),
    (t.deleteCompanyFromLocal = function (e, t) {
      return i(this, void 0, void 0, function () {
        return a(this, function (r) {
          switch (r.label) {
            case 0:
              return [
                4,
                m.default.get(new n.default(), t.id).destroy({ where: { companyId: e.companyId } }),
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
        i(this, void 0, void 0, function () {
          var i, o;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  a.trys.push([0, 3, , 4]),
                  ((i = new n.default()).companyId = t.companyId),
                  (i.syncDetails = t.syncDetails),
                  (i.syncDetails.isMultiComputerSetup = r),
                  [4, A.updateCompany(e, i, !1)]
                );
              case 1:
                return (
                  a.sent(),
                  [
                    4,
                    m.default
                      .get(new n.default(), e.id)
                      .update(i, { where: { companyId: t.companyId } }),
                  ]
                );
              case 2:
                return (a.sent(), [2, t]);
              case 3:
                return (
                  (o = a.sent()),
                  g.Log.error("Error while syncing " + t.companyId),
                  g.Log.error(
                    "Error Occured while updating company on Query fail Event" + JSON.stringify(o),
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
    (t.isAdminLoginInTally = I),
    (t.updateSyncDetailForCompanies = function (e, t, r) {
      return (
        void 0 === r && (r = !1),
        i(this, void 0, void 0, function () {
          var i, o, s, u, p, c;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  a.trys.push([0, 6, , 7]),
                  (i = t.map(function (e) {
                    var t = new n.default();
                    return (
                      (t.companyId = e.companyId),
                      (t.syncDetails = e.syncDetails),
                      (t.syncDetails.isMultiComputerSetup = r),
                      t
                    );
                  })),
                  [4, A.updateCompaniesAPI(e, i)]
                );
              case 1:
                (a.sent(),
                  (o = m.default.get(new n.default(), e.id)),
                  (s = 0),
                  (u = i),
                  (a.label = 2));
              case 2:
                return s < u.length
                  ? ((p = u[s]), [4, o.update(p, { where: { companyId: p.companyId } })])
                  : [3, 5];
              case 3:
                (a.sent(), (a.label = 4));
              case 4:
                return (s++, [3, 2]);
              case 5:
                return [2, t];
              case 6:
                return (
                  (c = a.sent()),
                  console.log(c),
                  g.Log.error(
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
