// webpack module #48 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var n =
      (this && this.__assign) ||
      function () {
        return (n =
          Object.assign ||
          function (e) {
            for (var t, r = 1, n = arguments.length; r < n; r++)
              for (var a in (t = arguments[r]))
                Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
            return e;
          }).apply(this, arguments);
      },
    a =
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
    i =
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
  var o = r(10),
    s = r(7),
    u = r(475),
    p = r(11),
    c = r(85),
    l = r(26),
    m = r(1023),
    d = r(59),
    y = r(8),
    b = r(506),
    h = r(541),
    f = r(542),
    g = r(83),
    M = r(1565),
    S = r(35),
    A = r(151),
    O = r(15),
    N = r(28),
    v = r(29),
    T = r(0),
    z = r(150),
    I = r(1589),
    q = r(146),
    k = p.getServerCredentials().API_BASE_URL;
  function R(e, t, r, n, o, s, u) {
    return a(this, void 0, void 0, function () {
      var a, c, l, m, d, b, h, g, M, S, A;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            if (p.isNull(e) || p.isNull(e.id)) throw new Error("User is not defined");
            if (p.isNull(t) || p.isNull(t.companyId)) throw new Error("Company is not defined");
            if (p.isNull(t.dataVersion)) throw new Error("Company data version is not defined");
            return [4, U()];
          case 1:
            if (!0 === i.sent()) throw new Error("System time and server time is different");
            ((c = new f.default()), (i.label = 2));
          case 2:
            return (i.trys.push([2, 6, , 7]), [4, c.zip(JSON.stringify(r))]);
          case 3:
            return (
              (l = i.sent()),
              (a = c.encrypt(l)).byteLength > 6e6
                ? ((m =
                    "Unable to upload data on server data size exceed 6 mb limit please report to developer"),
                  T.Log.error(m),
                  [4, E(e.id, m)])
                : [3, 5]
            );
          case 4:
            throw (i.sent(), new Error(m));
          case 5:
            return [3, 7];
          case 6:
            throw (
              (d = i.sent()),
              T.Log.info("Crypto Error(Add data function): " + JSON.stringify(d)),
              d
            );
          case 7:
            ((b = k + "/data/add"),
              (h = { userId: e.id, companyId: t.companyId, dataVersion: t.dataVersion }),
              (g = {
                data: a.toString("base64"),
                digest: c.createMd5Digest(a),
                desktopVersion: y.default.APP_VERSION,
                dataType: n,
                lastFileUploadedAtDesktop: s,
                time: o,
                isFirstSync: u,
                startValidatingLastSync: !0,
              }),
              (M = q.getRequestOptions(b, h, g, e)),
              (i.label = 8));
          case 8:
            return (i.trys.push([8, 11, , 12]), [4, q.postRequest(M)]);
          case 9:
            return ((S = i.sent()), [4, C(e, t, S.time, o)]);
          case 10:
            return (i.sent(), [3, 12]);
          case 11:
            throw ((A = i.sent()), T.Log.info("Add data API Error : " + JSON.stringify(A)), A);
          case 12:
            return [2, !0];
        }
      });
    });
  }
  function C(e, t, r, n) {
    return a(this, void 0, void 0, function () {
      var a;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            return (
              i.trys.push([0, 2, , 3]),
              (a = {
                lastFileUploadedAtServer: r,
                lastFileUploadedAtLocal: n,
                lastFileUploadedDeviceId: p.getDeviceId(),
              }),
              [4, v.DataUploadLog.updateRecord(e, t, a)]
            );
          case 1:
            return (i.sent(), [3, 3]);
          case 2:
            return (i.sent(), T.Log.error("Failed to Update Local DB"), [3, 3]);
          case 3:
            return [2];
        }
      });
    });
  }
  function E(e, t) {
    return a(this, void 0, void 0, function () {
      var r, n, a, o;
      return i(this, function (i) {
        return (
          (r = { userId: e }),
          (n = k + "/contact/issuefeature"),
          (a = { message: t, type: "issue" }),
          (o = q.getRequestOptions(n, r, a)),
          [2, q.postRequest(o)]
        );
      });
    });
  }
  function _(e, t) {
    return a(this, void 0, void 0, function () {
      var r, n, a;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            if (p.isNull(e)) throw new Error("Company is not defined");
            return (
              (e.dataVersion = l.default.dataVersion),
              (e.timezone = T.DateUtil.getTimezone(e.timezone)),
              (r = k + "/company"),
              (n = {}),
              (a = q.getRequestOptions(r, n, e, t)),
              [4, q.postRequest(a)]
            );
          case 1:
            return [2, i.sent()];
        }
      });
    });
  }
  function D(e) {
    if (p.isNotEmptyString(e.destination)) {
      if (o.existsSync(e.destination)) {
        var t = o.readdirSync(e.destination);
        if (p.isFilledArray(t))
          for (var r = 0, n = t; r < n.length; r++) {
            var a = n[r];
            a && a.includes("_bizanalyst") && o.unlinkSync(s.join(e.destination, a));
          }
        e.metaData = { tallyRefFileName: T.DateUtil.now().toString() + "_bizanalyst" };
        var i = s.join(e.destination, e.metaData.tallyRefFileName);
        o.writeFileSync(i, "", "utf8");
      } else
        p.isNotNull(e.metaData) &&
          e.metaData.tallyRefFileName &&
          delete e.metaData.tallyRefFileName;
      delete e.destination;
    } else
      p.isNotNull(e.metaData) && e.metaData.tallyRefFileName && delete e.metaData.tallyRefFileName;
  }
  function L(e, t) {
    return a(this, void 0, void 0, function () {
      var r, n, a, o;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            if (p.isNull(e) || p.isNull(e.id))
              throw (
                T.Log.error(y.default.USER_NOT_DEFINED_ERROR),
                new Error(y.default.USER_NOT_DEFINED_ERROR)
              );
            if (p.isNull(t))
              throw (
                T.Log.error(y.default.COMPANY_NOT_DEFINED_ERROR),
                new Error(y.default.COMPANY_NOT_DEFINED_ERROR)
              );
            return (
              (r = []),
              Array.isArray(t) ? (r = t) : r.push(t),
              (n = k + "/company"),
              (a = { userId: e.id }),
              (o = A.ApiUtil.getRequestOptions(n, a, r, e)),
              [4, A.ApiUtil.deleteRequest(o)]
            );
          case 1:
            return [2, i.sent()];
        }
      });
    });
  }
  function x(e) {
    return a(this, void 0, void 0, function () {
      var t, r, n, a, o, s;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            return [4, S.default.getInstance().getCompanies([e.tallyCompanyName.trim()])];
          case 1:
            for (t = i.sent(), r = new Map(), n = 0, a = t; n < a.length; n++)
              ((o = a[n]), r.set(o.tallyCompanyName.trim(), o));
            return (
              (s = new d.default()).update(e),
              r.has(s.tallyCompanyName.trim()) &&
                s.updateFromTally(r.get(s.tallyCompanyName.trim())),
              [2, s]
            );
        }
      });
    });
  }
  function w(e, t, r, o, s) {
    return a(this, void 0, void 0, function () {
      var a, u, c, l;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            if (p.isNull(e) || p.isNull(e.id)) throw new Error(y.default.USER_NOT_DEFINED_ERROR);
            if (p.isNull(t.companyId))
              throw (
                T.Log.error(y.default.COMPANY_NOT_DEFINED_ERROR),
                new Error(y.default.COMPANY_NOT_DEFINED_ERROR)
              );
            return (
              (a = k + "/data"),
              (u = {
                userId: e.id,
                companyId: t.companyId,
                desktopVersion: r,
                deleteReason: o,
                resyncReason: s,
              }),
              (c = n({}, u, { metaData: t.metaData, startValidatingLastSync: !0 })),
              (l = A.ApiUtil.getRequestOptions(a, u, c, e)),
              [4, A.ApiUtil.deleteRequest(l)]
            );
          case 1:
            return [2, i.sent()];
        }
      });
    });
  }
  function P(e, t, r, n) {
    return a(this, void 0, void 0, function () {
      var a;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            return (m.default.getInstance().stopSync(), D(t), [4, p.sleep(2e3)]);
          case 1:
            return (
              i.sent(),
              T.Log.info("deleteDataAndDirectoryWithoutRestart for : " + t.name),
              p.isNotEmpty(r) && T.Log.info("deleteReason : " + r),
              p.isNotEmpty(n) && T.Log.info("resyncReason : " + n),
              I.deleteDataFiles(t, e),
              [4, z.deleteCompanyFromLocal(t, e)]
            );
          case 2:
            return (i.sent(), [4, w(e, t, y.default.APP_VERSION, r, n)]);
          case 3:
            return ((a = i.sent()), [4, W(t, e)]);
          case 4:
            return (i.sent(), [2, a]);
        }
      });
    });
  }
  function W(e, t) {
    return a(this, void 0, void 0, function () {
      var r, n, a;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            return (
              i.trys.push([0, 2, , 3]),
              (r = new g.default(t.id)),
              (n = N.AppSettingMetadata.LEDGER_CLOSING_SYNC + "_" + e.companyId),
              [4, r.delete(n)]
            );
          case 1:
            return (i.sent(), [3, 3]);
          case 2:
            return (
              (a = i.sent()),
              T.Log.error("failed setting metadata in resetLedgerClosingSyncTime: " + a.message),
              [3, 3]
            );
          case 3:
            return [2];
        }
      });
    });
  }
  function B() {
    return a(this, void 0, void 0, function () {
      var e, t;
      return i(this, function (r) {
        switch (r.label) {
          case 0:
            return (
              (e = k + "/miscellaneous/time"),
              (t = A.ApiUtil.getUnauthorizedRequestOptions(e)),
              [4, A.ApiUtil.getRequest(t)]
            );
          case 1:
            return [2, r.sent()];
        }
      });
    });
  }
  function U(e) {
    return a(this, void 0, void 0, function () {
      var t, r, n;
      return i(this, function (a) {
        switch (a.label) {
          case 0:
            return ((t = e), p.isNull(t) ? [4, B()] : [3, 2]);
          case 1:
            ((t = a.sent()), (a.label = 2));
          case 2:
            return p.isNotNull(t) && !p.isEmpty(t) && p.isNotNull(t.time)
              ? ((r = T.DateUtil.now()),
                (n = T.DateUtil.getTimeDifferenceInSec(t.time, r)),
                Math.abs(n) > y.default.TIME_DIFF_ALLOWED ? [2, !0] : [2, !1])
              : [2, !1];
        }
      });
    });
  }
  function F() {
    return a(this, void 0, void 0, function () {
      var e;
      return i(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, S.default.getTallyLicense()];
          case 1:
            return ((e = t.sent()), [2, l.default.get(l.default.SUBSCRIPTION + "_" + e)]);
        }
      });
    });
  }
  function G(e) {
    return l.default.get(l.default.SUBSCRIPTION + "_" + e);
  }
  ((t.addData = function (e, t, r, n) {
    return a(this, void 0, void 0, function () {
      var a, o, s, u, c, l, m, d;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            if (p.isNull(e) || p.isNull(e.id)) throw new Error("User is not defined");
            if (p.isNull(t) || p.isNull(t.companyId)) throw new Error("Company is not defined");
            if (p.isNull(t.dataVersion)) throw new Error("Company data version is not defined");
            i.label = 1;
          case 1:
            return (i.trys.push([1, 3, , 4]), [4, B()]);
          case 2:
            return ((o = i.sent()), (a = o.time), [3, 4]);
          case 3:
            throw i.sent();
          case 4:
            return (
              (s = new f.default()),
              (u = "data/" + t.companyId + "/" + a),
              [4, s.put(null, u, r)]
            );
          case 5:
            (i.sent(),
              (c = k + "/data"),
              (l = { userId: e.id, companyId: t.companyId, dataVersion: t.dataVersion }),
              (m = { time: a, desktopVersion: y.default.APP_VERSION, dataType: n }),
              (d = q.getRequestOptions(c, l, m, e)),
              (i.label = 6));
          case 6:
            return (i.trys.push([6, 8, , 9]), [4, q.postRequest(d)]);
          case 7:
            return (i.sent(), [3, 9]);
          case 8:
            throw i.sent();
          case 9:
            return [2, !0];
        }
      });
    });
  }),
    (t.addDataV1 = R),
    (t.addDataV2 = function (e, t, r, n, o) {
      return a(this, void 0, void 0, function () {
        var a, s, u, c, l, m, d, b, h, g, M, S, A, O, N, z, I, E;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              if (p.isNull(e) || p.isNull(e.id)) throw new Error("User is not defined");
              if (p.isNull(t) || p.isNull(t.companyId)) throw new Error("Company is not defined");
              if (p.isNull(t.dataVersion)) throw new Error("Company data version is not defined");
              return [
                4,
                v.DataUploadLog.fetchRecord(e, t).catch(function (e) {
                  throw (T.Log.error(e), new Error("Local DB query failed. Unable to proceed"));
                }),
              ];
            case 1:
              return (
                (a = i.sent()),
                (s = a.lastFileUploadedAtLocal),
                [
                  4,
                  B().catch(function (e) {
                    throw (T.Log.error("Time api fail V2 " + JSON.stringify(e)), e);
                  }),
                ]
              );
            case 2:
              return [4, U((u = i.sent()))];
            case 3:
              if (!0 === i.sent()) throw new Error("System time and server time is different");
              ((c = u.time), (i.label = 4));
            case 4:
              return (
                i.trys.push([4, 10, , 12]),
                (l = k + "/data/gets3presignedurl"),
                (m = q.getRequestOptions(l, null, { companyId: t.companyId, time: c }, e)),
                [
                  4,
                  q.postRequest(m).catch(function (e) {
                    throw (T.Log.error("Upload url fail V2 " + JSON.stringify(e)), e);
                  }),
                ]
              );
            case 5:
              return (
                (d = i.sent()),
                (b = void 0),
                [4, (h = new f.default()).zip(JSON.stringify(r))]
              );
            case 6:
              return (
                (g = i.sent()),
                (b = h.encrypt(g)),
                (M = { url: d.s3PutObjectUrl, body: b, encoding: null, timeout: 3e5 }),
                [
                  4,
                  q.putRequest(M).catch(function (e) {
                    throw (T.Log.error("Upload data fail V2" + JSON.stringify(e)), e);
                  }),
                ]
              );
            case 7:
              return (
                i.sent(),
                (S = k + "/data"),
                (A = { userId: e.id, companyId: t.companyId, dataVersion: t.dataVersion }),
                (O = {
                  time: c,
                  desktopVersion: y.default.APP_VERSION,
                  dataType: n,
                  lastFileUploadedAtDesktop: s,
                  isFirstSync: o,
                  startValidatingLastSync: !0,
                }),
                (N = q.getRequestOptions(S, A, O, e)),
                [
                  4,
                  q.postRequest(N).catch(function (e) {
                    throw (T.Log.error("Data link to DB fail V2" + JSON.stringify(e)), e);
                  }),
                ]
              );
            case 8:
              return ((z = i.sent()), [4, C(e, t, z.time, c)]);
            case 9:
              return (i.sent(), [3, 12]);
            case 10:
              if (
                ((I = i.sent()),
                p.isNotNull(I) &&
                  p.isNotNull(I.message) &&
                  I.message.includes(y.default.SERVER_SYNC_ERROR))
              )
                throw I;
              return [4, R(e, t, r, n, c, s, o)];
            case 11:
              return ((E = i.sent()), T.Log.info("On fail upload retry attempted success"), [2, E]);
            case 12:
              return [2, !0];
          }
        });
      });
    }),
    (t.raiseAnIssue = E),
    (t.getAllCompanies = function (e) {
      return a(this, void 0, void 0, function () {
        var t, r, n, a;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              if (p.isNull(e)) throw new Error("User is not defined");
              return (
                (t = k + "/company/uploading"),
                (r = { userId: e.id }),
                (n = q.getRequestOptions(t, r)),
                [4, q.getRequest(n)]
              );
            case 1:
              return (
                (a = i.sent()),
                p.isNotNull(a) &&
                  "[object Array]" === Object.prototype.toString.call(a) &&
                  a.sort(function (e, t) {
                    return e.name.toLowerCase() < t.name.toLowerCase()
                      ? -1
                      : e.name.toLowerCase() > t.name.toLowerCase()
                        ? 1
                        : 0;
                  }),
                [2, a]
              );
          }
        });
      });
    }),
    (t.getCompaniesByTallyLicense = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, n, a, o, s;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              if (p.isNull(e)) throw new Error("User is not defined");
              return (
                (r = k + "/company/subscription/tallylicense"),
                (n = {}),
                (a = { userId: e.id, tallyLicense: t }),
                (o = q.getRequestOptions(r, n, a)),
                [4, q.postRequest(o)]
              );
            case 1:
              return (
                (s = i.sent()),
                p.isArray(s.companies) &&
                  s.companies.sort(function (e, t) {
                    return e.name.toLowerCase() < t.name.toLowerCase()
                      ? -1
                      : e.name.toLowerCase() > t.name.toLowerCase()
                        ? 1
                        : 0;
                  }),
                [2, s]
              );
          }
        });
      });
    }),
    (t.getCompaniesByPostgres = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, n, a;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              if (p.isNull(e) || p.isNull(t)) throw new Error("User/tallyLicense is not defined");
              return (
                (r = k + "/company/tallycompanies"),
                (n = { userId: e.id, tallyLicense: t }),
                (a = q.getRequestOptions(r, n, null, e)),
                [4, q.getRequest(a)]
              );
            case 1:
              return [2, i.sent()];
          }
        });
      });
    }),
    (t.addCompany = _),
    (t.addMultipleCompanies = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, n, o, s, u, l, m, d, b, f, M, A, O, z, I, k, R, C;
        return i(this, function (E) {
          switch (E.label) {
            case 0:
              if (p.isNull(e) || 0 === e.length) throw new Error("Company is not defined");
              E.label = 1;
            case 1:
              return (
                E.trys.push([1, 6, , 7]),
                [4, (u = S.default.getInstance()).getTallyLicenseNumber()]
              );
            case 2:
              return ((r = E.sent()), [4, u.getTallyLicenseEmailId()]);
            case 3:
              return ((n = E.sent()), [4, u.getTallyLicenseIsInternational()]);
            case 4:
              return ((o = E.sent()), [4, u.getTypeOfLicence()]);
            case 5:
              return ((s = E.sent()), [3, 7]);
            case 6:
              return (E.sent(), T.Log.error("Error getting tally license"), [3, 7]);
            case 7:
              ((l = 0), (m = e), (E.label = 8));
            case 8:
              if (!(l < m.length)) return [3, 13];
              ((A = m[l]), (d = void 0), (E.label = 9));
            case 9:
              return (
                E.trys.push([9, 11, , 12]),
                p.isNotNull(r) && (A.tallyLicense = r),
                p.isNotNull(n) && (A.tallyLicenseEmail = n),
                p.isNotNull(o) && (A.tallyLicenseIsInternational = o),
                p.isNotEmptyString(s) && (A.tallyLicenseType = s),
                D(A),
                [4, _(A, t)]
              );
            case 10:
              return (
                (function (e) {
                  a(this, void 0, void 0, function () {
                    var t, r, n, a, o;
                    return i(this, function (i) {
                      switch (i.label) {
                        case 0:
                          return [4, F()];
                        case 1:
                          return (
                            (t = i.sent()),
                            (r = p.isNull(t) ? null : t.companyIds),
                            p.isFilledArray(r) && (r.includes(e._id) || r.length >= 5)
                              ? [2]
                              : ((n = p.isFilledArray(r) ? r.length + 1 : 1),
                                (a = y.default.ANALYTICS_ACTION.FIRST_FIVE_COMPANY_ADDED),
                                (o = { company: e, index: n }),
                                c.default.invokeAnalyticsEventFromMain(a, o),
                                [2])
                          );
                      }
                    });
                  });
                })(E.sent()),
                [3, 12]
              );
            case 11:
              return (
                (b = E.sent()),
                (d = q.formatError(b)),
                T.Log.error("Error in adding company " + JSON.stringify(b)),
                (A.err = y.default.FAILED_TO_ADD_COMPANY),
                p.isNotNull(d) &&
                  p.isNotNull(d.statusCode) &&
                  401 === d.statusCode &&
                  (A.err = d.message),
                [3, 12]
              );
            case 12:
              return (l++, [3, 8]);
            case 13:
              for (f = 0, M = e; f < M.length; f++)
                if (((A = M[f]), p.isNotNull(A.err)))
                  throw A.err === y.default.FAILED_TO_ADD_COMPANY
                    ? new Error(y.default.FAILED_TO_ADD_ONE_OR_MORE_COMPANIES)
                    : new Error(A.err);
              return (
                (O = {
                  title: "Biz Analyst - Companies added!",
                  body: "Syncing data for new companies should start shortly and it may take upto 30 mins for the sync to complete. Please do not close tally or shutdown your computer during the sync process.",
                }),
                h.default.sendNotification(O),
                ((z = new v.CommonResponse()).message = y.default.SUCCESS_ADD_COMPANY),
                (I = G(r)),
                p.isNull(I)
                  ? ((k = N.AppSettingMetadata.IS_FIRST_COMPANY_ADDED),
                    (R = new g.default(t.id)),
                    (C = new N.AppSettingMetadata(k, y.default.YES)),
                    [4, R.set(C)])
                  : [3, 15]
              );
            case 14:
              (E.sent(), (E.label = 15));
            case 15:
              return [2, z];
          }
        });
      });
    }),
    (t.updateCompany = function (e, t, r) {
      return (
        void 0 === r && (r = !1),
        a(this, void 0, void 0, function () {
          var n, a, o, s, u;
          return i(this, function (i) {
            switch (i.label) {
              case 0:
                if (p.isNull(e) || p.isNull(e.id)) throw new Error("User is not defined");
                if (p.isNull(t)) throw new Error("Company is not defined");
                (t instanceof d.default &&
                  p.isNotNull(this) &&
                  p.isNotNull(this.company) &&
                  p.isNotNull(this.company.lastSync) &&
                  delete this.company.lastSync,
                  (n = k + "/company"),
                  (a = { userId: e.id }),
                  (i.label = 1));
              case 1:
                return (
                  i.trys.push([1, 5, , 6]),
                  r
                    ? (T.Log.info("Update Company: Resync required for company: " + t.name),
                      [4, P(e, t)])
                    : [3, 3]
                );
              case 2:
                (i.sent(), (i.label = 3));
              case 3:
                return ((o = q.getRequestOptions(n, a, t, e)), [4, q.putRequest(o)]);
              case 4:
                return ((s = i.sent()), r && p.restartApp(O.app), [2, s]);
              case 5:
                throw (
                  (u = i.sent()),
                  T.Log.error("updateCompany Failed to Delete data for company: " + t.name),
                  T.Log.error(u),
                  u
                );
              case 6:
                return [2];
            }
          });
        })
      );
    }),
    (t.updateCompaniesAPI = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, n, a, o, s, u;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              if (p.isNull(e) || p.isNull(e.id)) throw new Error("User is not defined");
              if (!p.isFilledArray(t)) throw new Error("Company is not defined");
              for (r = 0, n = t; r < n.length; r++)
                ((a = n[r]), p.isNotNull(a) && p.isNotNull(a.lastSync) && delete a.lastSync);
              ((o = k + "/company"),
                (s = { userId: e.id }),
                (u = q.getRequestOptions(o, s, t, e)),
                (i.label = 1));
            case 1:
              return (i.trys.push([1, 3, , 4]), [4, q.putRequest(u)]);
            case 2:
              return [2, i.sent()];
            case 3:
              throw i.sent();
            case 4:
              return [2];
          }
        });
      });
    }),
    (t.deleteCompany = L),
    (t.getLastActiveSubscription = function (e) {
      return a(this, void 0, void 0, function () {
        var t, r, n, a, o, s;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              if (p.isNull(e) || p.isNull(e.id)) throw new Error("User is not defined");
              i.label = 1;
            case 1:
              return (
                i.trys.push([1, 6, , 7]),
                (t = S.default.getInstance()),
                [4, S.default.getTallyLicense()]
              );
            case 2:
              return (
                (r = i.sent()),
                t.isValidTallyLicense(r)
                  ? ((n = k + "/subscription/tallylicense"),
                    (a = { userId: e.id, tallyLicense: r }),
                    (o = q.getRequestOptions(n, null, a, e)),
                    [4, q.postRequest(o)])
                  : [3, 4]
              );
            case 3:
              if (((s = i.sent()), p.isNotNull(s) && p.isNotEmpty(s.subscriptionId))) return [2, s];
              throw new Error("Error fetching subscription");
            case 4:
              throw new Error("Invalid TallyLicnese");
            case 5:
              return [3, 7];
            case 6:
              throw i.sent();
            case 7:
              return [2];
          }
        });
      });
    }),
    (t.transferUserSubscription = function (e, t, r) {
      return a(this, void 0, void 0, function () {
        var n, a, o;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              ((n = k + "/subscription/transfer"),
                (a = { oldUserEmail: e, newUserEmail: t, subscriptionId: r }),
                (o = q.getRequestOptions(n, null, a)),
                (i.label = 1));
            case 1:
              return (i.trys.push([1, 3, , 4]), [4, q.postRequest(o)]);
            case 2:
              return [2, i.sent()];
            case 3:
              throw i.sent();
            case 4:
              return [2];
          }
        });
      });
    }),
    (t.updateTallyLicenseIfNotPresent = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, n, a, o, s, u, c, l, m;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              if (
                ((r = S.default.getInstance()),
                (n = !1),
                !0 !== p.isEmptyString(t.tallyLicenseEmail))
              )
                return [3, 5];
              ((a = void 0), (o = void 0), (i.label = 1));
            case 1:
              return (i.trys.push([1, 4, , 5]), [4, r.getTallyLicenseEmailId()]);
            case 2:
              return ((a = i.sent()), [4, r.getTallyLicenseIsInternational()]);
            case 3:
              return (
                (o = i.sent()),
                p.isNotNull(a) && ((t.tallyLicenseEmail = a), (n = !0)),
                p.isNotNull(o) && ((t.tallyLicenseIsInternational = o), (n = !0)),
                [3, 5]
              );
            case 4:
              return (i.sent(), T.Log.error("Error getting tally license email"), [3, 5]);
            case 5:
              if (!1 !== r.isValidTallyLicense(t.tallyLicense)) return [3, 9];
              ((s = void 0), (i.label = 6));
            case 6:
              return (i.trys.push([6, 8, , 9]), [4, r.getTallyLicenseNumber()]);
            case 7:
              return (
                (s = i.sent()),
                r.isValidTallyLicense(s) && ((t.tallyLicense = s), (n = !0)),
                [3, 9]
              );
            case 8:
              return (i.sent(), T.Log.error("Error getting tally license"), [3, 9]);
            case 9:
              if (!0 !== n) return [3, 13];
              (((u = new d.default()).companyId = t.companyId),
                (u.tallyLicense = t.tallyLicense),
                (u.tallyLicenseEmail = t.tallyLicenseEmail),
                (u.tallyLicenseIsInternational = t.tallyLicenseIsInternational),
                (c = k + "/company"),
                (l = { userId: e.id }),
                (m = q.getRequestOptions(c, l, u, e)),
                (i.label = 10));
            case 10:
              return (i.trys.push([10, 12, , 13]), [4, q.putRequest(m)]);
            case 11:
              return (i.sent(), T.Log.info(u.name + " Tally License updated"), [3, 13]);
            case 12:
              return (i.sent(), T.Log.error("Failed to update tally license details"), [3, 13]);
            case 13:
              return [2, n];
          }
        });
      });
    }),
    (t.checkIfTallyPathHasChange = function (e) {
      return a(this, void 0, void 0, function () {
        var t, r, n, a, o, s;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              return [4, x(e)];
            case 1:
              return (
                (t = i.sent()),
                (r = !1),
                p.isNotEmpty(t.destination) &&
                  p.isNotNull(t.dataSyncDetails) &&
                  t.dataSyncDetails.length > 0 &&
                  ((n = t.dataSyncDetails),
                  (a = n[t.dataSyncDetails.length - 1]),
                  p.isNotNull(a) &&
                    ((o = p.removeSlashFromPath(a.path)),
                    (s = p.removeSlashFromPath(t.destination)),
                    o !== s && (r = !0))),
                [2, r]
              );
          }
        });
      });
    }),
    (t.getUpdatedCompanyDetailsFromTallyByCompanyName = x),
    (t.updateDataSyncDetails = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, n, a, o, s, u, c, l, m, y;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              return (
                (r = !1),
                p.isNotEmpty(t.destination) &&
                  (p.isNotNull(t.dataSyncDetails) && t.dataSyncDetails.length > 0
                    ? ((s = t.dataSyncDetails),
                      (n = s[t.dataSyncDetails.length - 1]),
                      p.isNotNull(n) &&
                        ((a = p.removeSlashFromPath(n.path)),
                        (o = p.removeSlashFromPath(t.destination)),
                        a !== o &&
                          (((u = new b.default()).path = t.destination),
                          (u.time = T.DateUtil.now()),
                          s.push(u),
                          (t.dataSyncDetails = s),
                          (r = !0))))
                    : ((s = []),
                      ((u = new b.default()).path = t.destination),
                      (u.time = T.DateUtil.now()),
                      s.push(u),
                      (t.dataSyncDetails = s),
                      (r = !0))),
                r
                  ? (((c = new d.default()).companyId = t.companyId),
                    (c.dataSyncDetails = t.dataSyncDetails),
                    (l = k + "/company"),
                    (m = { userId: e.id }),
                    (y = q.getRequestOptions(l, m, c, e)),
                    [4, q.putRequest(y)])
                  : [3, 2]
              );
            case 1:
              (i.sent(), T.Log.info(t.name + " data sync details updated"), (i.label = 2));
            case 2:
              return [2, r];
          }
        });
      });
    }),
    (t.deleteCompanyAndDirectory = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r;
        return i(this, function (n) {
          switch (n.label) {
            case 0:
              return (m.default.getInstance().stopSync(), [4, p.sleep(2e3)]);
            case 1:
              return (
                n.sent(),
                T.Log.info("Deleting company and data files for : " + t.name),
                I.deleteDataFiles(t, e),
                [4, L(e, t)]
              );
            case 2:
              return (
                (r = n.sent()),
                [
                  4,
                  new M.default().deleteSyncTimeForCompany(e.id, t).catch(function (e) {
                    return T.Log.info("deleteCompanyAndDirectory err" + JSON.stringify(e));
                  }),
                ]
              );
            case 3:
              return (n.sent(), [2, r]);
          }
        });
      });
    }),
    (t.deleteData = w),
    (t.deleteDataAndDirectory = function (e, t, r, n) {
      return a(this, void 0, void 0, function () {
        var a, o;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              return (i.trys.push([0, 2, , 3]), [4, P(e, t, r, n)]);
            case 1:
              return ((a = i.sent()), p.restartApp(O.app), [2, a]);
            case 2:
              throw (
                (o = i.sent()),
                T.Log.error("Failed to Delete data for company: " + t.name),
                T.Log.error(o),
                o
              );
            case 3:
              return [2];
          }
        });
      });
    }),
    (t.deleteDataAndDirectoryWithoutRestart = P),
    (t.deleteDataAndDirectoryForCompanies = function (e, t, r) {
      return a(this, void 0, void 0, function () {
        var n, a, o, s, u;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              if ((m.default.getInstance().stopSync(), !p.isFilledArray(t))) return [3, 6];
              ((a = 0), (o = t), (i.label = 1));
            case 1:
              if (!(a < o.length)) return [3, 6];
              ((s = o[a]), (i.label = 2));
            case 2:
              return (i.trys.push([2, 4, , 5]), [4, w(e, s, r)]);
            case 3:
              if (((n = i.sent()), p.isNotNull(n))) {
                if ("failure" === n.message)
                  return (T.Log.info("Failed to Delete data for company: " + s.name), [3, 5]);
                "success" === n.message && I.deleteDataFiles(s, e);
              }
              return [3, 5];
            case 4:
              return (
                (u = i.sent()),
                T.Log.error("Failed to Delete data for company: " + s.name),
                T.Log.error(u),
                [3, 5]
              );
            case 5:
              return (a++, [3, 1]);
            case 6:
              return [2, n];
          }
        });
      });
    }),
    (t.startSync = function () {
      return a(this, void 0, void 0, function () {
        return i(this, function (e) {
          return (O.ipcRenderer.send("re-start-background-sync"), [2]);
        });
      });
    }),
    (t.notifyFirstSync = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, n, a;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              return (
                (r = k + "/miscellaneous/sync/first"),
                (n = { companyId: e }),
                (a = A.ApiUtil.getRequestOptions(r, n, null, t)),
                [4, A.ApiUtil.getRequest(a)]
              );
            case 1:
              return [2, i.sent()];
          }
        });
      });
    }),
    (t.getTime = B),
    (t.isTimeSkewed = U),
    (t.getStoredSubscription = F),
    (t.updateLabel = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, n, a;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              return (
                (r = k + "/subscription/label"),
                (n = { userId: e.id }),
                (a = q.getRequestOptions(r, n, t, e)),
                [4, q.putRequest(a)]
              );
            case 1:
              return [2, i.sent()];
          }
        });
      });
    }),
    (t.isCompanyOpenFromDifferentPath = function (e) {
      var t = !1;
      if (
        p.isNotEmpty(e.destination) &&
        p.isNotNull(e.dataSyncDetails) &&
        e.dataSyncDetails.length > 0
      ) {
        var r = e.dataSyncDetails[e.dataSyncDetails.length - 1];
        if (p.isNotNull(r))
          p.removeSlashFromPath(r.path) !== p.removeSlashFromPath(e.destination) && (t = !0);
      }
      if (
        t &&
        p.isNotEmptyString(e.destination) &&
        /^[A-Za-z]/.test(p.removeSlashFromPath(e.destination))
      )
        return t;
      if (
        t &&
        p.isNotNull(e.metaData) &&
        p.isNotEmptyString(e.metaData.tallyRefFileName) &&
        p.isNotEmptyString(e.destination)
      ) {
        var n = s.join(e.destination, e.metaData.tallyRefFileName);
        return (
          T.Log.info(
            "Path is change but we found file " +
              e.metaData.tallyRefFileName +
              ". and data is copy and past.",
          ),
          !o.existsSync(n)
        );
      }
      return t;
    }),
    (t.isServerDataUploadTimeConsistent = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, n, a, o, s, u, c, l, m, d;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              return (i.trys.push([0, 2, , 3]), [4, v.DataUploadLog.fetchRecord(t, e)]);
            case 1:
              return (
                (r = i.sent()),
                (n = p.getDeviceId()),
                (a = Math.max(
                  e.lastSyncMetaData.lastFileUploadedAtServer,
                  r.lastFileUploadedAtServer,
                )),
                (o = e.lastSyncMetaData.lastFileUploadedDeviceId || r.lastFileUploadedDeviceId),
                (s = e.lastSyncMetaData.startValidatingLastSyncDate),
                (u = r.lastFileUploadedAtLocal),
                (c = !1),
                (l = !1),
                p.isNotNull(o) && p.isNotNull(n) && ((c = !0), o === n && (l = !0)),
                (m = p.isNotNull(u) && p.isNotNull(a) && u === a),
                !0 === s || (p.isPositiveNumber(a) && p.isPositiveNumber(u))
                  ? [2, m || (c && l)]
                  : [2, !c || l]
              );
            case 2:
              throw (
                (d = i.sent()),
                T.Log.exception(d),
                new Error("Error occured while check company sync state")
              );
            case 3:
              return [2];
          }
        });
      });
    }),
    (t.getTallyPathChangeMessage = function (e) {
      var t = void 0;
      return (
        p.isNotNull(e.dataSyncDetails) &&
          p.isFilledArray(e.dataSyncDetails) &&
          p.isNotNull(e.dataSyncDetails[e.dataSyncDetails.length - 1]) &&
          (t = e.dataSyncDetails[e.dataSyncDetails.length - 1].path),
        p.isNull(t)
          ? "Something went wrong. Unable to find last company sync folder for " + e.name
          : "You have opened your company " +
            e.name +
            " from a different folder (" +
            e.destination +
            "), because of which we are not syncing it. If this was a backup or was opened in error, then you can open the company in folder (" +
            t +
            ") and then sync again. If you want to sync from the new path, then you will need to re-sync the company in Biz Analyst."
      );
    }),
    (t.getTimeWithProxy = function (e) {
      return a(this, void 0, void 0, function () {
        var t, r;
        return i(this, function (n) {
          switch (n.label) {
            case 0:
              return (
                (t = k + "/miscellaneous/time"),
                (r = A.ApiUtil.getUnauthorizedRequestOptions(t)),
                [4, u.defaults({ proxy: e }).get(r)]
              );
            case 1:
              return [2, n.sent()];
          }
        });
      });
    }),
    (t.updateTallyLicenseTypeInSubscription = function (e, t, r) {
      return a(this, void 0, void 0, function () {
        var n, a, o;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              return (
                (n = k + "/subscription/license/type"),
                (a = { userId: e.id, subscriptionId: t, tallyLicenseType: r }),
                (o = q.getRequestOptions(n, null, a, e)),
                [4, q.putRequest(o)]
              );
            case 1:
              return [2, i.sent()];
          }
        });
      });
    }),
    (t.shouldSyncCompleteMaster = function () {
      try {
        var e = l.default.get(l.default.SYNC_COMPLETE_MASTER);
        if (p.isNotNull(e) && !0 === e.state) return !0;
      } catch (e) {
        T.Log.info("ShouldSyncCompeteMaster fail to read setting " + p.getErrorMessage(e));
      }
      return !1;
    }),
    (t.turnOffForceMasterSync = function () {
      l.default.set(l.default.SYNC_COMPLETE_MASTER, { state: !1 });
    }),
    (t.getStoreSubscription = G));
};
