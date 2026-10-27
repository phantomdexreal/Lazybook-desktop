// webpack module #59 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var i =
      (this && this.__assign) ||
      function () {
        return (i =
          Object.assign ||
          function (e) {
            for (var t, r = 1, i = arguments.length; r < i; r++)
              for (var a in (t = arguments[r]))
                Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
            return e;
          }).apply(this, arguments);
      },
    a =
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
    o =
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
  var s = r(8),
    n = r(6),
    u = r(512),
    p = r(10),
    c = r(118),
    m = r(24),
    l = r(542),
    d = r(60),
    y = r(11),
    b = r(543),
    h = r(244),
    g = r(594),
    S = r(90),
    f = r(2558),
    A = r(49),
    N = r(161),
    I = r(13),
    T = r(32),
    M = r(28),
    v = r(2),
    k = r(213),
    C = r(2581),
    q = r(154),
    R = p.getServerCredentials().API_BASE_URL;
  function D(e, t, r, i, s, n, u) {
    return a(this, void 0, void 0, function () {
      var a, c, m, l, d, b, h, S, f, A, N;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            if (p.isNull(e) || p.isNull(e.id)) throw new Error("User is not defined");
            if (p.isNull(t) || p.isNull(t.companyId)) throw new Error("Company is not defined");
            if (p.isNull(t.dataVersion)) throw new Error("Company data version is not defined");
            return [4, F()];
          case 1:
            if (!0 === o.sent()) throw new Error("System time and server time is different");
            ((c = new g.default()), (o.label = 2));
          case 2:
            return (o.trys.push([2, 6, , 7]), [4, c.zip(JSON.stringify(r))]);
          case 3:
            return (
              (m = o.sent()),
              (a = c.encrypt(m)).byteLength > 6e6
                ? ((l =
                    "Unable to upload data on server data size exceed 6 mb limit please report to developer"),
                  v.Log.error(l),
                  [4, x(e.id, l)])
                : [3, 5]
            );
          case 4:
            throw (o.sent(), new Error(l));
          case 5:
            return [3, 7];
          case 6:
            throw (
              (d = o.sent()),
              v.Log.info("Crypto Error(Add data function): " + JSON.stringify(d)),
              d
            );
          case 7:
            ((b = R + "/data/add"),
              (h = { userId: e.id, companyId: t.companyId, dataVersion: t.dataVersion }),
              (S = {
                data: a.toString("base64"),
                digest: c.createMd5Digest(a),
                desktopVersion: y.default.APP_VERSION,
                dataType: i,
                lastFileUploadedAtDesktop: n,
                time: s,
                isFirstSync: u,
                startValidatingLastSync: !0,
              }),
              (f = q.getRequestOptions(b, h, S, e)),
              (o.label = 8));
          case 8:
            return (o.trys.push([8, 11, , 12]), [4, q.postRequest(f)]);
          case 9:
            return ((A = o.sent()), [4, E(e, t, A.time, s)]);
          case 10:
            return (o.sent(), [3, 12]);
          case 11:
            throw ((N = o.sent()), v.Log.info("Add data API Error : " + JSON.stringify(N)), N);
          case 12:
            return [2, !0];
        }
      });
    });
  }
  function E(e, t, r, i) {
    return a(this, void 0, void 0, function () {
      var a;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            return (
              o.trys.push([0, 2, , 3]),
              (a = {
                lastFileUploadedAtServer: r,
                lastFileUploadedAtLocal: i,
                lastFileUploadedDeviceId: p.getDeviceId(),
              }),
              [4, M.DataUploadLog.updateRecord(e, t, a)]
            );
          case 1:
            return (o.sent(), [3, 3]);
          case 2:
            return (o.sent(), v.Log.error("Failed to Update Local DB"), [3, 3]);
          case 3:
            return [2];
        }
      });
    });
  }
  function x(e, t) {
    return a(this, void 0, void 0, function () {
      var r, i, a, s;
      return o(this, function (o) {
        return (
          (r = { userId: e }),
          (i = R + "/contact/issuefeature"),
          (a = { message: t, type: "issue" }),
          (s = q.getRequestOptions(i, r, a)),
          [2, q.postRequest(s)]
        );
      });
    });
  }
  function O(e, t) {
    return a(this, void 0, void 0, function () {
      var r, i, a;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            if (p.isNull(e)) throw new Error("Company is not defined");
            return (
              (e.dataVersion = m.default.dataVersion),
              (e.timezone = v.DateUtil.getTimezone(e.timezone)),
              (r = R + "/company"),
              (i = {}),
              (a = q.getRequestOptions(r, i, e, t)),
              [4, q.postRequest(a)]
            );
          case 1:
            return [2, o.sent()];
        }
      });
    });
  }
  function z(e) {
    if (p.isNotEmptyString(e.destination)) {
      if (s.existsSync(e.destination)) {
        var t = s.readdirSync(e.destination);
        if (p.isFilledArray(t))
          for (var r = 0, i = t; r < i.length; r++) {
            var a = i[r];
            a && a.includes("_bizanalyst") && s.unlinkSync(n.join(e.destination, a));
          }
        e.metaData = { tallyRefFileName: v.DateUtil.now().toString() + "_bizanalyst" };
        var o = n.join(e.destination, e.metaData.tallyRefFileName);
        s.writeFileSync(o, "", "utf8");
      } else
        p.isNotNull(e.metaData) &&
          e.metaData.tallyRefFileName &&
          delete e.metaData.tallyRefFileName;
      delete e.destination;
    } else
      p.isNotNull(e.metaData) && e.metaData.tallyRefFileName && delete e.metaData.tallyRefFileName;
  }
  function P(e, t) {
    return a(this, void 0, void 0, function () {
      var r, i, a, s;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            if (p.isNull(e) || p.isNull(e.id))
              throw (
                v.Log.error(y.default.USER_NOT_DEFINED_ERROR),
                new Error(y.default.USER_NOT_DEFINED_ERROR)
              );
            if (p.isNull(t))
              throw (
                v.Log.error(y.default.COMPANY_NOT_DEFINED_ERROR),
                new Error(y.default.COMPANY_NOT_DEFINED_ERROR)
              );
            return (
              (r = []),
              Array.isArray(t) ? (r = t) : r.push(t),
              (i = R + "/company"),
              (a = { userId: e.id }),
              (s = N.ApiUtil.getRequestOptions(i, a, r, e)),
              [4, N.ApiUtil.deleteRequest(s)]
            );
          case 1:
            return [2, o.sent()];
        }
      });
    });
  }
  function L(e) {
    return a(this, void 0, void 0, function () {
      var t, r, i, a, s, n;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            return [4, A.default.getInstance().getCompanies([e.tallyCompanyName.trim()])];
          case 1:
            for (t = o.sent(), r = new Map(), i = 0, a = t; i < a.length; i++)
              ((s = a[i]), r.set(s.tallyCompanyName.trim(), s));
            return (
              (n = new d.default()).update(e),
              r.has(n.tallyCompanyName.trim()) &&
                n.updateFromTally(r.get(n.tallyCompanyName.trim())),
              [2, n]
            );
        }
      });
    });
  }
  function w(e, t, r, s, n) {
    return a(this, void 0, void 0, function () {
      var a, u, c, m;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            if (p.isNull(e) || p.isNull(e.id)) throw new Error(y.default.USER_NOT_DEFINED_ERROR);
            if (p.isNull(t.companyId))
              throw (
                v.Log.error(y.default.COMPANY_NOT_DEFINED_ERROR),
                new Error(y.default.COMPANY_NOT_DEFINED_ERROR)
              );
            return (
              (a = R + "/data"),
              (u = {
                userId: e.id,
                companyId: t.companyId,
                desktopVersion: r,
                deleteReason: s,
                resyncReason: n,
              }),
              (c = i({}, u, { metaData: t.metaData, startValidatingLastSync: !0 })),
              (m = N.ApiUtil.getRequestOptions(a, u, c, e)),
              [4, N.ApiUtil.deleteRequest(m)]
            );
          case 1:
            return [2, o.sent()];
        }
      });
    });
  }
  function _(e, t, r, i) {
    return a(this, void 0, void 0, function () {
      var a;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            return (l.default.getInstance().stopSync(), z(t), [4, p.sleep(2e3)]);
          case 1:
            return (
              o.sent(),
              v.Log.info("deleteDataAndDirectoryWithoutRestart for : " + t.name),
              p.isNotEmpty(r) && v.Log.info("deleteReason : " + r),
              p.isNotEmpty(i) && v.Log.info("resyncReason : " + i),
              C.deleteDataFiles(t, e),
              [4, k.deleteCompanyFromLocal(t, e)]
            );
          case 2:
            return (o.sent(), [4, w(e, t, y.default.APP_VERSION, r, i)]);
          case 3:
            return ((a = o.sent()), [4, U(t, e)]);
          case 4:
            return (o.sent(), [2, a]);
        }
      });
    });
  }
  function U(e, t) {
    return a(this, void 0, void 0, function () {
      var r, i, a;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            return (
              o.trys.push([0, 2, , 3]),
              (r = new S.default(t.id)),
              (i = T.AppSettingMetadata.LEDGER_CLOSING_SYNC + "_" + e.companyId),
              [4, r.delete(i)]
            );
          case 1:
            return (o.sent(), [3, 3]);
          case 2:
            return (
              (a = o.sent()),
              v.Log.error("failed setting metadata in resetLedgerClosingSyncTime: " + a.message),
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
      return o(this, function (r) {
        switch (r.label) {
          case 0:
            return (
              (e = R + "/miscellaneous/time"),
              (t = N.ApiUtil.getUnauthorizedRequestOptions(e)),
              [4, N.ApiUtil.getRequest(t)]
            );
          case 1:
            return [2, r.sent()];
        }
      });
    });
  }
  function F(e) {
    return a(this, void 0, void 0, function () {
      var t, r, i;
      return o(this, function (a) {
        switch (a.label) {
          case 0:
            return ((t = e), p.isNull(t) ? [4, B()] : [3, 2]);
          case 1:
            ((t = a.sent()), (a.label = 2));
          case 2:
            return p.isNotNull(t) && !p.isEmpty(t) && p.isNotNull(t.time)
              ? ((r = v.DateUtil.now()),
                (i = v.DateUtil.getTimeDifferenceInSec(t.time, r)),
                Math.abs(i) > y.default.TIME_DIFF_ALLOWED ? [2, !0] : [2, !1])
              : [2, !1];
        }
      });
    });
  }
  function G() {
    return a(this, void 0, void 0, function () {
      var e;
      return o(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, A.default.getTallyLicense()];
          case 1:
            return ((e = t.sent()), [2, m.default.get(m.default.SUBSCRIPTION + "_" + e)]);
        }
      });
    });
  }
  function V(e) {
    return m.default.get(m.default.SUBSCRIPTION + "_" + e);
  }
  ((t.addData = function (e, t, r, i) {
    return a(this, void 0, void 0, function () {
      var a, s, n, u, c, m, l, d;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            if (p.isNull(e) || p.isNull(e.id)) throw new Error("User is not defined");
            if (p.isNull(t) || p.isNull(t.companyId)) throw new Error("Company is not defined");
            if (p.isNull(t.dataVersion)) throw new Error("Company data version is not defined");
            o.label = 1;
          case 1:
            return (o.trys.push([1, 3, , 4]), [4, B()]);
          case 2:
            return ((s = o.sent()), (a = s.time), [3, 4]);
          case 3:
            throw o.sent();
          case 4:
            return (
              (n = new g.default()),
              (u = "data/" + t.companyId + "/" + a),
              [4, n.put(null, u, r)]
            );
          case 5:
            (o.sent(),
              (c = R + "/data"),
              (m = { userId: e.id, companyId: t.companyId, dataVersion: t.dataVersion }),
              (l = { time: a, desktopVersion: y.default.APP_VERSION, dataType: i }),
              (d = q.getRequestOptions(c, m, l, e)),
              (o.label = 6));
          case 6:
            return (o.trys.push([6, 8, , 9]), [4, q.postRequest(d)]);
          case 7:
            return (o.sent(), [3, 9]);
          case 8:
            throw o.sent();
          case 9:
            return [2, !0];
        }
      });
    });
  }),
    (t.addDataV1 = D),
    (t.addDataV2 = function (e, t, r, i, s) {
      return a(this, void 0, void 0, function () {
        var a, n, u, c, m, l, d, b, h, S, f, A, N, I, T, k, C, x;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              if (p.isNull(e) || p.isNull(e.id)) throw new Error("User is not defined");
              if (p.isNull(t) || p.isNull(t.companyId)) throw new Error("Company is not defined");
              if (p.isNull(t.dataVersion)) throw new Error("Company data version is not defined");
              return [
                4,
                M.DataUploadLog.fetchRecord(e, t).catch(function (e) {
                  throw (v.Log.error(e), new Error("Local DB query failed. Unable to proceed"));
                }),
              ];
            case 1:
              return (
                (a = o.sent()),
                (n = a.lastFileUploadedAtLocal),
                [
                  4,
                  B().catch(function (e) {
                    throw (v.Log.error("Time api fail V2 " + JSON.stringify(e)), e);
                  }),
                ]
              );
            case 2:
              return [4, F((u = o.sent()))];
            case 3:
              if (!0 === o.sent()) throw new Error("System time and server time is different");
              ((c = u.time), (o.label = 4));
            case 4:
              return (
                o.trys.push([4, 10, , 12]),
                (m = R + "/data/gets3presignedurl"),
                (l = q.getRequestOptions(m, null, { companyId: t.companyId, time: c }, e)),
                [
                  4,
                  q.postRequest(l).catch(function (e) {
                    throw (v.Log.error("Upload url fail V2 " + JSON.stringify(e)), e);
                  }),
                ]
              );
            case 5:
              return (
                (d = o.sent()),
                (b = void 0),
                [4, (h = new g.default()).zip(JSON.stringify(r))]
              );
            case 6:
              return (
                (S = o.sent()),
                (b = h.encrypt(S)),
                (f = { url: d.s3PutObjectUrl, body: b, encoding: null, timeout: 3e5 }),
                [
                  4,
                  q.putRequest(f).catch(function (e) {
                    throw (v.Log.error("Upload data fail V2" + JSON.stringify(e)), e);
                  }),
                ]
              );
            case 7:
              return (
                o.sent(),
                (A = R + "/data"),
                (N = { userId: e.id, companyId: t.companyId, dataVersion: t.dataVersion }),
                (I = {
                  time: c,
                  desktopVersion: y.default.APP_VERSION,
                  dataType: i,
                  lastFileUploadedAtDesktop: n,
                  isFirstSync: s,
                  startValidatingLastSync: !0,
                }),
                (T = q.getRequestOptions(A, N, I, e)),
                [
                  4,
                  q.postRequest(T).catch(function (e) {
                    throw (v.Log.error("Data link to DB fail V2" + JSON.stringify(e)), e);
                  }),
                ]
              );
            case 8:
              return ((k = o.sent()), [4, E(e, t, k.time, c)]);
            case 9:
              return (o.sent(), [3, 12]);
            case 10:
              if (
                ((C = o.sent()),
                p.isNotNull(C) &&
                  p.isNotNull(C.message) &&
                  C.message.includes(y.default.SERVER_SYNC_ERROR))
              )
                throw C;
              return [4, D(e, t, r, i, c, n, s)];
            case 11:
              return ((x = o.sent()), v.Log.info("On fail upload retry attempted success"), [2, x]);
            case 12:
              return [2, !0];
          }
        });
      });
    }),
    (t.raiseAnIssue = x),
    (t.getAllCompanies = function (e) {
      return a(this, void 0, void 0, function () {
        var t, r, i, a;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              if (p.isNull(e)) throw new Error("User is not defined");
              return (
                (t = R + "/company/uploading"),
                (r = { userId: e.id }),
                (i = q.getRequestOptions(t, r)),
                [4, q.getRequest(i)]
              );
            case 1:
              return (
                (a = o.sent()),
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
        var r, i, a, s, n;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              if (p.isNull(e)) throw new Error("User is not defined");
              return (
                (r = R + "/company/subscription/tallylicense"),
                (i = {}),
                (a = { userId: e.id, tallyLicense: t }),
                (s = q.getRequestOptions(r, i, a)),
                [4, q.postRequest(s)]
              );
            case 1:
              return (
                (n = o.sent()),
                p.isArray(n.companies) &&
                  n.companies.sort(function (e, t) {
                    return e.name.toLowerCase() < t.name.toLowerCase()
                      ? -1
                      : e.name.toLowerCase() > t.name.toLowerCase()
                        ? 1
                        : 0;
                  }),
                [2, n]
              );
          }
        });
      });
    }),
    (t.getCompaniesByPostgres = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, i, a;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              if (p.isNull(e) || p.isNull(t)) throw new Error("User/tallyLicense is not defined");
              return (
                (r = R + "/company/tallycompanies"),
                (i = { userId: e.id, tallyLicense: t }),
                (a = q.getRequestOptions(r, i, null, e)),
                [4, q.getRequest(a)]
              );
            case 1:
              return [2, o.sent()];
          }
        });
      });
    }),
    (t.addCompany = O),
    (t.addMultipleCompanies = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, i, s, n, u, m, l, d, b, g, f, N, I, k, C, R, D, E;
        return o(this, function (x) {
          switch (x.label) {
            case 0:
              if (p.isNull(e) || 0 === e.length) throw new Error("Company is not defined");
              x.label = 1;
            case 1:
              return (
                x.trys.push([1, 6, , 7]),
                [4, (u = A.default.getInstance()).getTallyLicenseNumber()]
              );
            case 2:
              return ((r = x.sent()), [4, u.getTallyLicenseEmailId()]);
            case 3:
              return ((i = x.sent()), [4, u.getTallyLicenseIsInternational()]);
            case 4:
              return ((s = x.sent()), [4, u.getTypeOfLicence()]);
            case 5:
              return ((n = x.sent()), [3, 7]);
            case 6:
              return (x.sent(), v.Log.error("Error getting tally license"), [3, 7]);
            case 7:
              ((m = 0), (l = e), (x.label = 8));
            case 8:
              if (!(m < l.length)) return [3, 13];
              ((N = l[m]), (d = void 0), (x.label = 9));
            case 9:
              return (
                x.trys.push([9, 11, , 12]),
                p.isNotNull(r) && (N.tallyLicense = r),
                p.isNotNull(i) && (N.tallyLicenseEmail = i),
                p.isNotNull(s) && (N.tallyLicenseIsInternational = s),
                p.isNotEmptyString(n) && (N.tallyLicenseType = n),
                z(N),
                [4, O(N, t)]
              );
            case 10:
              return (
                (function (e) {
                  a(this, void 0, void 0, function () {
                    var t, r, i, a, s;
                    return o(this, function (o) {
                      switch (o.label) {
                        case 0:
                          return [4, G()];
                        case 1:
                          return (
                            (t = o.sent()),
                            (r = p.isNull(t) ? null : t.companyIds),
                            p.isFilledArray(r) && (r.includes(e._id) || r.length >= 5)
                              ? [2]
                              : ((i = p.isFilledArray(r) ? r.length + 1 : 1),
                                (a = y.default.ANALYTICS_ACTION.FIRST_FIVE_COMPANY_ADDED),
                                (s = { company: e, index: i }),
                                c.default.invokeAnalyticsEventFromMain(a, s),
                                [2])
                          );
                      }
                    });
                  });
                })(x.sent()),
                [3, 12]
              );
            case 11:
              return (
                (b = x.sent()),
                (d = q.formatError(b)),
                v.Log.error("Error in adding company " + JSON.stringify(b)),
                (N.err = y.default.FAILED_TO_ADD_COMPANY),
                p.isNotNull(d) &&
                  p.isNotNull(d.statusCode) &&
                  401 === d.statusCode &&
                  (N.err = d.message),
                [3, 12]
              );
            case 12:
              return (m++, [3, 8]);
            case 13:
              for (g = 0, f = e; g < f.length; g++)
                if (((N = f[g]), p.isNotNull(N.err)))
                  throw N.err === y.default.FAILED_TO_ADD_COMPANY
                    ? new Error(y.default.FAILED_TO_ADD_ONE_OR_MORE_COMPANIES)
                    : new Error(N.err);
              return (
                (I = {
                  title: "Biz Analyst - Companies added!",
                  body: "Syncing data for new companies should start shortly and it may take upto 30 mins for the sync to complete. Please do not close tally or shutdown your computer during the sync process.",
                }),
                h.default.sendNotification(I),
                ((k = new M.CommonResponse()).message = y.default.SUCCESS_ADD_COMPANY),
                (C = V(r)),
                p.isNull(C)
                  ? ((R = T.AppSettingMetadata.IS_FIRST_COMPANY_ADDED),
                    (D = new S.default(t.id)),
                    (E = new T.AppSettingMetadata(R, y.default.YES)),
                    [4, D.set(E)])
                  : [3, 15]
              );
            case 14:
              (x.sent(), (x.label = 15));
            case 15:
              return [2, k];
          }
        });
      });
    }),
    (t.updateCompany = function (e, t, r) {
      return (
        void 0 === r && (r = !1),
        a(this, void 0, void 0, function () {
          var i, a, s, n, u;
          return o(this, function (o) {
            switch (o.label) {
              case 0:
                if (p.isNull(e) || p.isNull(e.id)) throw new Error("User is not defined");
                if (p.isNull(t)) throw new Error("Company is not defined");
                (t instanceof d.default &&
                  p.isNotNull(this) &&
                  p.isNotNull(this.company) &&
                  p.isNotNull(this.company.lastSync) &&
                  delete this.company.lastSync,
                  (i = R + "/company"),
                  (a = { userId: e.id }),
                  (o.label = 1));
              case 1:
                return (
                  o.trys.push([1, 5, , 6]),
                  r
                    ? (v.Log.info("Update Company: Resync required for company: " + t.name),
                      [4, _(e, t)])
                    : [3, 3]
                );
              case 2:
                (o.sent(), (o.label = 3));
              case 3:
                return ((s = q.getRequestOptions(i, a, t, e)), [4, q.putRequest(s)]);
              case 4:
                return ((n = o.sent()), r && p.restartApp(I.app), [2, n]);
              case 5:
                throw (
                  (u = o.sent()),
                  v.Log.error("updateCompany Failed to Delete data for company: " + t.name),
                  v.Log.error(u),
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
        var r, i, a, s, n, u;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              if (p.isNull(e) || p.isNull(e.id)) throw new Error("User is not defined");
              if (!p.isFilledArray(t)) throw new Error("Company is not defined");
              for (r = 0, i = t; r < i.length; r++)
                ((a = i[r]), p.isNotNull(a) && p.isNotNull(a.lastSync) && delete a.lastSync);
              ((s = R + "/company"),
                (n = { userId: e.id }),
                (u = q.getRequestOptions(s, n, t, e)),
                (o.label = 1));
            case 1:
              return (o.trys.push([1, 3, , 4]), [4, q.putRequest(u)]);
            case 2:
              return [2, o.sent()];
            case 3:
              throw o.sent();
            case 4:
              return [2];
          }
        });
      });
    }),
    (t.deleteCompany = P),
    (t.getLastActiveSubscription = function (e) {
      return a(this, void 0, void 0, function () {
        var t, r, i, a, s, n;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              if (p.isNull(e) || p.isNull(e.id)) throw new Error("User is not defined");
              o.label = 1;
            case 1:
              return (
                o.trys.push([1, 6, , 7]),
                (t = A.default.getInstance()),
                [4, A.default.getTallyLicense()]
              );
            case 2:
              return (
                (r = o.sent()),
                t.isValidTallyLicense(r)
                  ? ((i = R + "/subscription/tallylicense"),
                    (a = { userId: e.id, tallyLicense: r }),
                    (s = q.getRequestOptions(i, null, a, e)),
                    [4, q.postRequest(s)])
                  : [3, 4]
              );
            case 3:
              if (((n = o.sent()), p.isNotNull(n) && p.isNotEmpty(n.subscriptionId))) return [2, n];
              throw new Error("Error fetching subscription");
            case 4:
              throw new Error("Invalid TallyLicnese");
            case 5:
              return [3, 7];
            case 6:
              throw o.sent();
            case 7:
              return [2];
          }
        });
      });
    }),
    (t.transferUserSubscription = function (e, t, r) {
      return a(this, void 0, void 0, function () {
        var i, a, s;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              ((i = R + "/subscription/transfer"),
                (a = { oldUserEmail: e, newUserEmail: t, subscriptionId: r }),
                (s = q.getRequestOptions(i, null, a)),
                (o.label = 1));
            case 1:
              return (o.trys.push([1, 3, , 4]), [4, q.postRequest(s)]);
            case 2:
              return [2, o.sent()];
            case 3:
              throw o.sent();
            case 4:
              return [2];
          }
        });
      });
    }),
    (t.updateTallyLicenseIfNotPresent = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, i, a, s, n, u, c, m, l;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              if (
                ((r = A.default.getInstance()),
                (i = !1),
                !0 !== p.isEmptyString(t.tallyLicenseEmail))
              )
                return [3, 5];
              ((a = void 0), (s = void 0), (o.label = 1));
            case 1:
              return (o.trys.push([1, 4, , 5]), [4, r.getTallyLicenseEmailId()]);
            case 2:
              return ((a = o.sent()), [4, r.getTallyLicenseIsInternational()]);
            case 3:
              return (
                (s = o.sent()),
                p.isNotNull(a) && ((t.tallyLicenseEmail = a), (i = !0)),
                p.isNotNull(s) && ((t.tallyLicenseIsInternational = s), (i = !0)),
                [3, 5]
              );
            case 4:
              return (o.sent(), v.Log.error("Error getting tally license email"), [3, 5]);
            case 5:
              if (!1 !== r.isValidTallyLicense(t.tallyLicense)) return [3, 9];
              ((n = void 0), (o.label = 6));
            case 6:
              return (o.trys.push([6, 8, , 9]), [4, r.getTallyLicenseNumber()]);
            case 7:
              return (
                (n = o.sent()),
                r.isValidTallyLicense(n) && ((t.tallyLicense = n), (i = !0)),
                [3, 9]
              );
            case 8:
              return (o.sent(), v.Log.error("Error getting tally license"), [3, 9]);
            case 9:
              if (!0 !== i) return [3, 13];
              (((u = new d.default()).companyId = t.companyId),
                (u.tallyLicense = t.tallyLicense),
                (u.tallyLicenseEmail = t.tallyLicenseEmail),
                (u.tallyLicenseIsInternational = t.tallyLicenseIsInternational),
                (c = R + "/company"),
                (m = { userId: e.id }),
                (l = q.getRequestOptions(c, m, u, e)),
                (o.label = 10));
            case 10:
              return (o.trys.push([10, 12, , 13]), [4, q.putRequest(l)]);
            case 11:
              return (o.sent(), v.Log.info(u.name + " Tally License updated"), [3, 13]);
            case 12:
              return (o.sent(), v.Log.error("Failed to update tally license details"), [3, 13]);
            case 13:
              return [2, i];
          }
        });
      });
    }),
    (t.checkIfTallyPathHasChange = function (e) {
      return a(this, void 0, void 0, function () {
        var t, r, i, a, s, n;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              return [4, L(e)];
            case 1:
              return (
                (t = o.sent()),
                (r = !1),
                p.isNotEmpty(t.destination) &&
                  p.isNotNull(t.dataSyncDetails) &&
                  t.dataSyncDetails.length > 0 &&
                  ((i = t.dataSyncDetails),
                  (a = i[t.dataSyncDetails.length - 1]),
                  p.isNotNull(a) &&
                    ((s = p.removeSlashFromPath(a.path)),
                    (n = p.removeSlashFromPath(t.destination)),
                    s !== n && (r = !0))),
                [2, r]
              );
          }
        });
      });
    }),
    (t.getUpdatedCompanyDetailsFromTallyByCompanyName = L),
    (t.updateDataSyncDetails = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, i, a, s, n, u, c, m, l, y;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              return (
                (r = !1),
                p.isNotEmpty(t.destination) &&
                  (p.isNotNull(t.dataSyncDetails) && t.dataSyncDetails.length > 0
                    ? ((n = t.dataSyncDetails),
                      (i = n[t.dataSyncDetails.length - 1]),
                      p.isNotNull(i) &&
                        ((a = p.removeSlashFromPath(i.path)),
                        (s = p.removeSlashFromPath(t.destination)),
                        a !== s &&
                          (((u = new b.default()).path = t.destination),
                          (u.time = v.DateUtil.now()),
                          n.push(u),
                          (t.dataSyncDetails = n),
                          (r = !0))))
                    : ((n = []),
                      ((u = new b.default()).path = t.destination),
                      (u.time = v.DateUtil.now()),
                      n.push(u),
                      (t.dataSyncDetails = n),
                      (r = !0))),
                r
                  ? (((c = new d.default()).companyId = t.companyId),
                    (c.dataSyncDetails = t.dataSyncDetails),
                    (m = R + "/company"),
                    (l = { userId: e.id }),
                    (y = q.getRequestOptions(m, l, c, e)),
                    [4, q.putRequest(y)])
                  : [3, 2]
              );
            case 1:
              (o.sent(), v.Log.info(t.name + " data sync details updated"), (o.label = 2));
            case 2:
              return [2, r];
          }
        });
      });
    }),
    (t.deleteCompanyAndDirectory = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r;
        return o(this, function (i) {
          switch (i.label) {
            case 0:
              return (l.default.getInstance().stopSync(), [4, p.sleep(2e3)]);
            case 1:
              return (
                i.sent(),
                v.Log.info("Deleting company and data files for : " + t.name),
                C.deleteDataFiles(t, e),
                [4, P(e, t)]
              );
            case 2:
              return (
                (r = i.sent()),
                [
                  4,
                  new f.default().deleteSyncTimeForCompany(e.id, t).catch(function (e) {
                    return v.Log.info("deleteCompanyAndDirectory err" + JSON.stringify(e));
                  }),
                ]
              );
            case 3:
              return (i.sent(), [2, r]);
          }
        });
      });
    }),
    (t.deleteData = w),
    (t.deleteDataAndDirectory = function (e, t, r, i) {
      return a(this, void 0, void 0, function () {
        var a, s;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              return (o.trys.push([0, 2, , 3]), [4, _(e, t, r, i)]);
            case 1:
              return ((a = o.sent()), p.restartApp(I.app), [2, a]);
            case 2:
              throw (
                (s = o.sent()),
                v.Log.error("Failed to Delete data for company: " + t.name),
                v.Log.error(s),
                s
              );
            case 3:
              return [2];
          }
        });
      });
    }),
    (t.deleteDataAndDirectoryWithoutRestart = _),
    (t.deleteDataAndDirectoryForCompanies = function (e, t, r) {
      return a(this, void 0, void 0, function () {
        var i, a, s, n, u;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              if ((l.default.getInstance().stopSync(), !p.isFilledArray(t))) return [3, 6];
              ((a = 0), (s = t), (o.label = 1));
            case 1:
              if (!(a < s.length)) return [3, 6];
              ((n = s[a]), (o.label = 2));
            case 2:
              return (o.trys.push([2, 4, , 5]), [4, w(e, n, r)]);
            case 3:
              if (((i = o.sent()), p.isNotNull(i))) {
                if ("failure" === i.message)
                  return (v.Log.info("Failed to Delete data for company: " + n.name), [3, 5]);
                "success" === i.message && C.deleteDataFiles(n, e);
              }
              return [3, 5];
            case 4:
              return (
                (u = o.sent()),
                v.Log.error("Failed to Delete data for company: " + n.name),
                v.Log.error(u),
                [3, 5]
              );
            case 5:
              return (a++, [3, 1]);
            case 6:
              return [2, i];
          }
        });
      });
    }),
    (t.startSync = function () {
      return a(this, void 0, void 0, function () {
        return o(this, function (e) {
          return (I.ipcRenderer.send("re-start-background-sync"), [2]);
        });
      });
    }),
    (t.notifyFirstSync = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, i, a;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              return (
                (r = R + "/miscellaneous/sync/first"),
                (i = { companyId: e }),
                (a = N.ApiUtil.getRequestOptions(r, i, null, t)),
                [4, N.ApiUtil.getRequest(a)]
              );
            case 1:
              return [2, o.sent()];
          }
        });
      });
    }),
    (t.getTime = B),
    (t.isTimeSkewed = F),
    (t.getStoredSubscription = G),
    (t.updateLabel = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, i, a;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              return (
                (r = R + "/subscription/label"),
                (i = { userId: e.id }),
                (a = q.getRequestOptions(r, i, t, e)),
                [4, q.putRequest(a)]
              );
            case 1:
              return [2, o.sent()];
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
        var i = n.join(e.destination, e.metaData.tallyRefFileName);
        return (
          v.Log.info(
            "Path is change but we found file " +
              e.metaData.tallyRefFileName +
              ". and data is copy and past.",
          ),
          !s.existsSync(i)
        );
      }
      return t;
    }),
    (t.isServerDataUploadTimeConsistent = function (e, t) {
      return a(this, void 0, void 0, function () {
        var r, i, a, s, n, u, c, m, l, d;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              return (o.trys.push([0, 2, , 3]), [4, M.DataUploadLog.fetchRecord(t, e)]);
            case 1:
              return (
                (r = o.sent()),
                (i = p.getDeviceId()),
                (a = Math.max(
                  e.lastSyncMetaData.lastFileUploadedAtServer,
                  r.lastFileUploadedAtServer,
                )),
                (s = e.lastSyncMetaData.lastFileUploadedDeviceId || r.lastFileUploadedDeviceId),
                (n = e.lastSyncMetaData.startValidatingLastSyncDate),
                (u = r.lastFileUploadedAtLocal),
                (c = !1),
                (m = !1),
                p.isNotNull(s) && p.isNotNull(i) && ((c = !0), s === i && (m = !0)),
                (l = p.isNotNull(u) && p.isNotNull(a) && u === a),
                !0 === n || (p.isPositiveNumber(a) && p.isPositiveNumber(u))
                  ? [2, l || (c && m)]
                  : [2, !c || m]
              );
            case 2:
              throw (
                (d = o.sent()),
                v.Log.exception(d),
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
        return o(this, function (i) {
          switch (i.label) {
            case 0:
              return (
                (t = R + "/miscellaneous/time"),
                (r = N.ApiUtil.getUnauthorizedRequestOptions(t)),
                [4, u.defaults({ proxy: e }).get(r)]
              );
            case 1:
              return [2, i.sent()];
          }
        });
      });
    }),
    (t.updateTallyLicenseTypeInSubscription = function (e, t, r) {
      return a(this, void 0, void 0, function () {
        var i, a, s;
        return o(this, function (o) {
          switch (o.label) {
            case 0:
              return (
                (i = R + "/subscription/license/type"),
                (a = { userId: e.id, subscriptionId: t, tallyLicenseType: r }),
                (s = q.getRequestOptions(i, null, a, e)),
                [4, q.putRequest(s)]
              );
            case 1:
              return [2, o.sent()];
          }
        });
      });
    }),
    (t.shouldSyncCompleteMaster = function () {
      try {
        var e = m.default.get(m.default.SYNC_COMPLETE_MASTER);
        if (p.isNotNull(e) && !0 === e.state) return !0;
      } catch (e) {
        v.Log.info("ShouldSyncCompeteMaster fail to read setting " + p.getErrorMessage(e));
      }
      return !1;
    }),
    (t.turnOffForceMasterSync = function () {
      m.default.set(m.default.SYNC_COMPLETE_MASTER, { state: !1 });
    }),
    (t.getStoreSubscription = V));
};
