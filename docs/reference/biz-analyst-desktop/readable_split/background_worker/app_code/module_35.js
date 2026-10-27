// webpack module #35 (from background_worker, BA Mobile Connector 8.4.41)
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
  var i = r(10),
    o = r(26),
    s = r(52),
    u = r(59),
    p = r(1041),
    c = r(8),
    l = r(519),
    m = r(520),
    d = r(527),
    y = r(1049),
    b = r(1050),
    h = r(1051),
    f = r(101),
    g = r(1052),
    M = r(1056),
    S = r(109),
    A = r(83),
    O = r(529),
    N = r(1057),
    v = r(394),
    T = r(28),
    z = r(393),
    I = r(143),
    q = r(29),
    k = r(136),
    R = r(0),
    C = r(160),
    E = r(392);
  ((t.TALLY_DEFAULT_PORT = "9000"), (t.TALLY_DEFAULT_HOST = "localhost"));
  var _ = new N.default(),
    D = (function () {
      function e() {}
      return (
        (e.getInstance = function () {
          return (R.Util.isNull(e.instance) && (e.instance = new e()), e.instance);
        }),
        (e.prototype.getReduxStore = function () {
          return process && process.type === c.default.PROCESS.RENDERER
            ? s.default.getInstance().getStoreState()
            : S.default.getInstance().getStoreState();
        }),
        (e.prototype.getUrl = function () {
          var e,
            r = new q.TallySettings();
          return (
            (r.host = t.TALLY_DEFAULT_HOST),
            (r.port = t.TALLY_DEFAULT_PORT),
            (e = this.getReduxStore().tally.tallyConfig),
            R.Util.isNotNull(e) &&
              (R.Util.isNotNull(e.port) && (r.port = e.port),
              R.Util.isNotNull(e.host) && (r.host = e.host)),
            "http://" + r.host + ":" + r.port
          );
        }),
        (e.prototype.validateTallyResponse = function (e) {
          if (
            R.Util.isNotNull(e) &&
            200 === e.statusCode &&
            R.Util.isNotNull(e.body) &&
            R.Util.isNotNull(e.headers) &&
            R.Util.isNotNull(e.headers.respstatus) &&
            "1" === e.headers.respstatus
          )
            return !0;
          throw (
            R.Log.info("Invalid response received from tally: " + JSON.stringify(e)),
            new Error("Request to tally failed with status code: " + e.headers.respstatus)
          );
        }),
        (e.prototype.getTallyLicenseNumber = function () {
          return n(this, void 0, void 0, function () {
            return a(this, function (e) {
              switch (e.label) {
                case 0:
                  return [
                    4,
                    this.getTallyLicenseInfo(I.GetTallyLicenseRequest.PARAM_SERIAL_NUMBER),
                  ];
                case 1:
                  return [2, e.sent()];
              }
            });
          });
        }),
        (e.prototype.isTallyGoldLicense = function () {
          return n(this, void 0, void 0, function () {
            var e;
            return a(this, function (t) {
              switch (t.label) {
                case 0:
                  return [4, this.getTallyLicenseInfo(I.GetTallyLicenseRequest.PARAM_IS_GOLD)];
                case 1:
                  return (
                    (e = t.sent()),
                    R.Util.isNotNull(e) && "yes" === e.toLowerCase() ? [2, !0] : [2, !1]
                  );
              }
            });
          });
        }),
        (e.prototype.isTallySilverLicense = function () {
          return n(this, void 0, void 0, function () {
            var e;
            return a(this, function (t) {
              switch (t.label) {
                case 0:
                  return [4, this.getTallyLicenseInfo(I.GetTallyLicenseRequest.PARAM_IS_SILVER)];
                case 1:
                  return (
                    (e = t.sent()),
                    R.Util.isNotNull(e) && "yes" === e.toLowerCase() ? [2, !0] : [2, !1]
                  );
              }
            });
          });
        }),
        (e.prototype.getTypeOfLicence = function () {
          return n(this, void 0, void 0, function () {
            var t, r;
            return a(this, function (n) {
              switch (n.label) {
                case 0:
                  return (
                    n.trys.push([0, 3, , 4]),
                    [4, (t = e.getInstance()).isTallyGoldLicense()]
                  );
                case 1:
                  return n.sent() ? [2, E.TallyLicenceType.GOLD] : [4, t.isTallySilverLicense()];
                case 2:
                  return n.sent() ? [2, E.TallyLicenceType.SILVER] : [3, 4];
                case 3:
                  return (
                    (r = n.sent()),
                    R.Log.info("Unable to get type of license " + R.Util.getErrorMessage(r)),
                    [3, 4]
                  );
                case 4:
                  return [2];
              }
            });
          });
        }),
        (e.getTallyLicense = function () {
          return n(this, void 0, void 0, function () {
            var t, r, n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    a.trys.push([0, 2, , 3]),
                    [4, (t = e.getInstance()).getTallyLicenseNumber()]
                  );
                case 1:
                  return ((r = a.sent()), t.isValidTallyLicense(r) ? [2, r] : [3, 3]);
                case 2:
                  throw ((n = a.sent()), R.Log.error("Error getting tally license"), n);
                case 3:
                  return [2, null];
              }
            });
          });
        }),
        (e.prototype.getTallyLicenseEmailId = function () {
          return n(this, void 0, void 0, function () {
            return a(this, function (e) {
              switch (e.label) {
                case 0:
                  return [4, this.getTallyLicenseInfo(I.GetTallyLicenseRequest.PARAM_ACCOUNT_ID)];
                case 1:
                  return [2, e.sent()];
              }
            });
          });
        }),
        (e.prototype.getTallyLicenseIsInternational = function () {
          return n(this, void 0, void 0, function () {
            var e;
            return a(this, function (t) {
              switch (t.label) {
                case 0:
                  return [4, this.getTallyLicenseInfo(I.GetTallyLicenseRequest.PARAM_ISINDIAN)];
                case 1:
                  return (
                    (e = t.sent()),
                    R.Util.isNotNull(e) && "yes" !== e.toLowerCase() ? [2, !0] : [2, !1]
                  );
              }
            });
          });
        }),
        (e.prototype.getTallyRetryCount = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r;
            return a(this, function (n) {
              switch (n.label) {
                case 0:
                  return (
                    (t = C.TALLY_QUERY_RETRY_ATTEMPTS),
                    [4, new A.default(e).get(T.AppSettingMetadata.TALLY_QUERY_RETRY)]
                  );
                case 1:
                  return (
                    (r = n.sent()),
                    R.Util.isNotNull(r) && R.Util.isNotNull(r.data) && (t = r.data),
                    [2, t]
                  );
              }
            });
          });
        }),
        (e.prototype.getTallyLicenseInfo = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r, n, i, o, s, u, p, l, m, d;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (t = this.getUrl()),
                    (r = v.default.get()),
                    [4, this.getTallyRetryCount(r.id)]
                  );
                case 1:
                  ((n = a.sent()), (a.label = 2));
                case 2:
                  return (
                    a.trys.push([2, 4, , 5]),
                    [
                      4,
                      R.Util.retryFunction(
                        k.get,
                        [{ uri: t, timeout: 1e4, resolveWithFullResponse: !0 }],
                        n,
                        1e4,
                        1,
                        "tallyPingResponse",
                      ),
                    ]
                  );
                case 3:
                  return ((i = a.sent()), this.validateTallyResponse(i), [3, 5]);
                case 4:
                  throw (
                    (o = a.sent()),
                    R.Log.info("Unable to connect to tally: " + JSON.stringify(o)),
                    ((s = new q.ErrorMessage()).message = c.default.TALLY_IS_NOT_OPEN + " " + t),
                    s
                  );
                case 5:
                  return [4, this.getRequestOptions()];
                case 6:
                  return (
                    (u = a.sent()),
                    (p = new I.GetTallyLicenseRequest()),
                    (l = p.getBody(e)),
                    (u.body = new Buffer(l, "ucs2")),
                    [
                      4,
                      R.Util.retryFunction(
                        this.postRequest.bind(this),
                        [u],
                        n,
                        1e4,
                        1,
                        "getTallyLicenseInfo",
                      ),
                    ]
                  );
                case 7:
                  return ((m = a.sent()), [4, _.parse(m.body)]);
                case 8:
                  return ((d = a.sent()), [2, new I.GetTallyLicenseResponse().parse(d)]);
              }
            });
          });
        }),
        (e.prototype.ping = function (e) {
          return (
            void 0 === e && (e = {}),
            n(this, void 0, void 0, function () {
              var t, r, n, i, o, s, u;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    ((t = this.getUrl()),
                      (r = 5),
                      R.Util.isNotNull(e.customUrl) && (t = e.customUrl),
                      R.Util.isNotNull(e.retryCount) && (r = e.retryCount),
                      (n = !1),
                      (a.label = 1));
                  case 1:
                    return (
                      a.trys.push([1, 3, , 4]),
                      [
                        4,
                        R.Util.retryFunction(
                          k.get,
                          [{ uri: t, timeout: 1e4, resolveWithFullResponse: !0 }],
                          r,
                          1e4,
                          1,
                          "ping",
                        ),
                      ]
                    );
                  case 2:
                    return (
                      (i = a.sent()),
                      this.validateTallyResponse(i),
                      (n = i.body.toLowerCase().includes("tally")),
                      f.default.send("tally-open-response"),
                      [3, 4]
                    );
                  case 3:
                    throw (
                      (o = a.sent()),
                      R.Log.info("Unable to connect to tally: " + JSON.stringify(o)),
                      ((u = new q.ErrorMessage()).message = c.default.TALLY_IS_NOT_OPEN + " " + t),
                      u
                    );
                  case 4:
                    return !0 === n && R.Util.isNull(e.customUrl)
                      ? [4, this.getTallyLicenseNumber()]
                      : [3, 6];
                  case 5:
                    if (((s = a.sent()), !this.isValidTallyLicense(s)))
                      throw (
                        ((u = new q.ErrorMessage()).message = c.default.INVALID_TALLY_LICENSE),
                        u
                      );
                    return [2, !0];
                  case 6:
                    return [2, n];
                }
              });
            })
          );
        }),
        (e.prototype.isValidTallyLicense = function (e) {
          return !R.Util.isNull(e) && "0" !== e;
        }),
        (e.prototype.checkAndSaveTallySettings = function (e) {
          return n(this, void 0, void 0, function () {
            var r, n, i, s;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  ((r = this.getUrl()),
                    ((n = new z.CheckAndSaveTally()).success = !1),
                    R.Util.isNotNull(e)
                      ? ((r = "http://" + e.host + ":" + e.port), (n.tallyConfig = e))
                      : (((i = new q.TallySettings()).host = t.TALLY_DEFAULT_HOST),
                        (i.port = t.TALLY_DEFAULT_PORT),
                        (n.tallyConfig = i)),
                    (a.label = 1));
                case 1:
                  return (a.trys.push([1, 3, , 4]), (s = n), [4, this.ping({ customUrl: r })]);
                case 2:
                  return (
                    (s.success = a.sent()),
                    !0 === n.success && o.default.set(o.default.TALLY_SETTINGS, e),
                    [2, n]
                  );
                case 3:
                  throw a.sent();
                case 4:
                  return [2];
              }
            });
          });
        }),
        (e.checkSaveTallySettings = function (t) {
          return n(this, void 0, void 0, function () {
            return a(this, function (r) {
              return [2, e.getInstance().checkAndSaveTallySettings(t)];
            });
          });
        }),
        (e.prototype.postRequest = function (e, t) {
          return (
            void 0 === t && (t = !0),
            n(this, void 0, void 0, function () {
              var r;
              return a(this, function (n) {
                switch (n.label) {
                  case 0:
                    return [4, k.post(e)];
                  case 1:
                    return ((r = n.sent()), t ? [4, this.validateTallyResponse(r)] : [3, 3]);
                  case 2:
                    (n.sent(), (n.label = 3));
                  case 3:
                    return [2, r];
                }
              });
            })
          );
        }),
        (e.prototype.getRequestOptions = function () {
          return n(this, void 0, void 0, function () {
            var e;
            return a(this, function (t) {
              switch (t.label) {
                case 0:
                  return [4, this.getUrl()];
                case 1:
                  return (
                    (e = t.sent()),
                    [
                      2,
                      {
                        url: e,
                        headers: { "Content-Type": "text/xml;charset=utf-16" },
                        resolveWithFullResponse: !0,
                        encoding: "ucs2",
                      },
                    ]
                  );
              }
            });
          });
        }),
        (e.prototype.isCompanyOpen = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r, n, i, o, s, c, l, m;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (
                    a.sent(),
                    R.Util.isNull(e)
                      ? (R.Log.info("Company name is undefined"), [2, !1])
                      : ((t = new I.GetMastersOptions()),
                        ((r = new u.default()).tallyCompanyName = ""),
                        (t.company = r),
                        (t.filters = []),
                        R.Util.isNotNull(e) &&
                          ((n = []),
                          (i = new I.FilterValue(I.Operators.EQUALS, e)),
                          n.push(i),
                          (o = new I.Filter("CompanyNameFilter", "name", n, I.Operators.OR)),
                          t.filters.push(o)),
                        (s = new I.FilterValue(I.Operators.EQUALS, "No")),
                        (c = [s]),
                        (l = new I.Filter("GroupFilter", "isaggregate", c, I.Operators.OR)),
                        t.filters.push(l),
                        [4, this.getMasters(new p.default(), t)])
                  );
                case 2:
                  return (
                    (m = a.sent()),
                    R.Util.isNotNull(m) && m.length > 0
                      ? [2, !0]
                      : (R.Log.info(
                          "Company " + e + " is currently not open in tally. Skipping...",
                        ),
                        [2, !1])
                  );
              }
            });
          });
        }),
        (e.prototype.getMasters = function (e, t, r) {
          return n(this, void 0, void 0, function () {
            var n, i, o, s, p, c, l, m;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    a.trys.push([0, 9, , 10]),
                    (n = v.default.get()),
                    [4, this.getTallyRetryCount(n.id)]
                  );
                case 1:
                  return ((i = a.sent()), [4, this.ping({ retryCount: i })]);
                case 2:
                  return (
                    a.sent(),
                    e.getName() === u.default.masterName
                      ? [3, 4]
                      : R.Util.isNotNull(t) &&
                          R.Util.isNotNull(t.company) &&
                          R.Util.isNotEmpty(t.company.tallyCompanyName.trim())
                        ? [4, this.isCompanyOpen(t.company.tallyCompanyName.trim())]
                        : [3, 4]
                  );
                case 3:
                  if (!a.sent())
                    throw new Error(
                      "Company " + t.company.tallyCompanyName + " is not open in tally",
                    );
                  a.label = 4;
                case 4:
                  return [4, this.getRequestOptions()];
                case 5:
                  return (
                    (o = a.sent()),
                    (s = new I.GetMastersRequest()),
                    R.Util.isNull(t.dateRange) && (t.dateRange = new I.Range(0, 0)),
                    (p = s.getBody(e, t, e.getName() === T.Voucher.masterName)),
                    this.logTallyReqAndRes("Tally " + e.getName() + " xml request::" + p),
                    (o.body = new Buffer(p, "ucs2")),
                    r && R.Log.info(p),
                    [
                      4,
                      R.Util.retryFunction(
                        this.postRequest.bind(this),
                        [o],
                        i,
                        1e4,
                        1,
                        "getMasters",
                      ),
                    ]
                  );
                case 6:
                  return (
                    (c = a.sent()),
                    this.logTallyReqAndRes("Tally " + e.getName() + " xml response::" + c.body),
                    [4, _.parse(c.body)]
                  );
                case 7:
                  return ((l = a.sent()), [4, new I.GetMastersResponse().parse(e, l, t)]);
                case 8:
                  return [2, a.sent()];
                case 9:
                  throw ((m = a.sent()), R.Log.exception(m, e.getName(), t), m);
                case 10:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.getCompanyNames = function () {
          return n(this, void 0, void 0, function () {
            var e, t, r, n, i, o;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (e = a.sent()),
                    (t = new I.GetCompaniesRequest()),
                    (r = t.getBody()),
                    (e.body = new Buffer(r, "ucs2")),
                    [4, this.postRequest(e)]
                  );
                case 3:
                  return ((n = a.sent()), [4, _.parse(n.body)]);
                case 4:
                  return (
                    (i = a.sent()),
                    (o = new I.GetCompaniesResponse()),
                    [2, o.parseCompanyNames(i)]
                  );
              }
            });
          });
        }),
        (e.prototype.getGSTNumber = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r, n, i, o, s;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), (t = { company: e }), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (r = a.sent()),
                    (n = new I.GetGSTRequest()),
                    (i = n.getBody(t)),
                    (r.body = new Buffer(i, "ucs2")),
                    [4, this.postRequest(r)]
                  );
                case 3:
                  return ((o = a.sent()), [4, _.parse(o.body)]);
                case 4:
                  return ((s = a.sent()), [2, new I.GetGSTResponse().parse(s)]);
              }
            });
          });
        }),
        (e.prototype.getEInvoiceConfig = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r, n, i;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (t = a.sent()),
                    (r = new I.GstEInvoiceConfigRequest()),
                    (n = r.getBody(e)),
                    (t.body = new Buffer(n, "ucs2")),
                    [4, this.postRequest(t)]
                  );
                case 3:
                  return ((i = a.sent()), [4, _.parse(i.body)]);
                case 4:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getTallyProdInfo = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r, n, i, o;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (t = a.sent()),
                    (r = new I.GetTallyProductRequest()),
                    (n = r.getBody(e)),
                    (t.body = new Buffer(n, "ucs2")),
                    [4, this.postRequest(t)]
                  );
                case 3:
                  return ((i = a.sent()), [4, _.parse(i.body)]);
                case 4:
                  return ((o = a.sent()), [2, new I.GetTallyProductResponse().parse(o)]);
              }
            });
          });
        }),
        (e.prototype.getTallyVerisonInfo = function () {
          return n(this, void 0, void 0, function () {
            var e, t, r, n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    a.trys.push([0, 2, , 3]),
                    [4, this.getTallyProdInfo(I.GetTallyProductRequest.PARAM_BUILD_NUMBER)]
                  );
                case 1:
                  return ((e = a.sent()), [3, 3]);
                case 2:
                  return (
                    a.sent(),
                    R.Log.info("Error getting tally build number while device update"),
                    [3, 3]
                  );
                case 3:
                  return (
                    a.trys.push([3, 5, , 6]),
                    [4, this.getTallyProdInfo(I.GetTallyProductRequest.PARAM_PRODUCT_NAME)]
                  );
                case 4:
                  return ((t = a.sent()), [3, 6]);
                case 5:
                  return (
                    a.sent(),
                    R.Log.info("Error getting tally product name while device update"),
                    [3, 6]
                  );
                case 6:
                  return (
                    a.trys.push([6, 8, , 9]),
                    [4, this.getTallyProdInfo(I.GetTallyProductRequest.PARAM_VERSION_STRING)]
                  );
                case 7:
                  return ((r = a.sent()), [3, 9]);
                case 8:
                  return (
                    a.sent(),
                    R.Log.info("Error getting tally version while device update"),
                    [3, 9]
                  );
                case 9:
                  return (
                    (n = {}),
                    R.Util.isNotEmptyString(e) &&
                      !1 === isNaN(parseInt(e)) &&
                      (n.buildNumber = parseInt(e)),
                    R.Util.isNotEmptyString(t) && (n.productName = t),
                    R.Util.isNotEmptyString(r) && (n.version = r),
                    [2, n]
                  );
              }
            });
          });
        }),
        (e.prototype.getCompaniesByCompanyObject = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r;
            return a(this, function (n) {
              switch (n.label) {
                case 0:
                  return (
                    ((r = new I.GetMastersOptions()).company = e),
                    (r.filters = []),
                    (R.Util.isNull(t) || t <= 0) && (r.updateGstIn = !0),
                    [4, this.getCompaniesFromOptions(r)]
                  );
                case 1:
                  return [2, n.sent()];
              }
            });
          });
        }),
        (e.prototype.getCompanies = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n, i, o, s, p, c, l;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  if (
                    ((r = new I.GetMastersOptions()),
                    ((n = new u.default()).tallyCompanyName = ""),
                    (r.company = n),
                    (r.filters = []),
                    R.Util.isNotNull(t) && t.length > 0 && (r.keys = t),
                    R.Util.isNotNull(e))
                  ) {
                    for (i = [], o = 0, s = e; o < s.length; o++)
                      ((p = s[o]), (c = new I.FilterValue(I.Operators.EQUALS, p)), i.push(c));
                    ((l = new I.Filter("CompanyNameFilter", "name", i, I.Operators.OR)),
                      r.filters.push(l));
                  }
                  return [4, this.getCompaniesFromOptions(r)];
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.createOrderEntry = function (e, t, r) {
          return n(this, void 0, void 0, function () {
            var n, i, o, s, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (n = a.sent()),
                    (i = new I.CreateOrderRequest()),
                    (o = i.getBody(e, t, r)),
                    this.logTallyReqAndRes("OrderEntry xml request::" + o),
                    (n.body = new Buffer(o, "ucs2")),
                    [4, this.postRequest(n, !1)]
                  );
                case 3:
                  return (
                    (s = a.sent()),
                    this.logTallyReqAndRes("OrderEntry xml response::" + s.body),
                    [4, _.parse(s.body)]
                  );
                case 4:
                  return ((u = a.sent()), [2, new I.OrderEnterResponse().parseOrderDetails(u)]);
              }
            });
          });
        }),
        (e.prototype.createTransactionEntry = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n, i, o, s;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (r = a.sent()),
                    (n = new I.CreateTransactionRequest()),
                    (i = n.getBody(e, t)),
                    this.logTallyReqAndRes("TransactionEntry xml request::" + i),
                    (r.body = new Buffer(i, "ucs2")),
                    [4, this.postRequest(r, !1)]
                  );
                case 3:
                  return (
                    (o = a.sent()),
                    this.logTallyReqAndRes("TransactionEntry xml response::" + o.body),
                    [4, _.parse(o.body)]
                  );
                case 4:
                  return ((s = a.sent()), [2, new I.OrderEnterResponse().parseOrderDetails(s)]);
              }
            });
          });
        }),
        (e.prototype.getCompaniesFromOptions = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r, n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (t = new I.FilterValue(I.Operators.EQUALS, "No")),
                    (r = [t]),
                    (n = new I.Filter("GroupFilter", "isaggregate", r, I.Operators.OR)),
                    e.filters.push(n),
                    [4, this.getMasters(new u.default(), e)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getMastersByAlterId = function (e, t, r, i, o, s) {
          return n(this, void 0, void 0, function () {
            var n, u, p;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    ((n = new I.GetMastersOptions()).userId = t),
                    (n.company = r),
                    (n.dateRange = new I.Range(r.getStartDate(), r.getEndDate())),
                    (n.keys = s),
                    R.Util.isNotNull(i) &&
                      R.Util.isNotNull(o) &&
                      ((n.filters = []),
                      (u = []).push(new I.FilterValue(I.Operators.GT, i)),
                      u.push(new I.FilterValue(I.Operators.LTE, o)),
                      (p = new I.Filter("AlterId", "alterid", u, I.Operators.AND)),
                      n.filters.push(p)),
                    [4, this.getMasters(e, n)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getMastersByMasterIds = function (e, t, r, i, o) {
          return n(this, void 0, void 0, function () {
            var n, s, u, p, c, l;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  for (
                    (n = new I.GetMastersOptions()).userId = t,
                      n.company = r,
                      n.dateRange = new I.Range(r.getStartDate(), r.getEndDate()),
                      n.filters = [],
                      n.keys = o,
                      s = [],
                      u = 0,
                      p = i;
                    u < p.length;
                    u++
                  )
                    ((c = p[u]), s.push(new I.FilterValue(I.Operators.EQUALS, c)));
                  return (
                    (l = new I.Filter("MasterId", "masterId", s, I.Operators.OR)),
                    n.filters.push(l),
                    [4, this.getMasters(e, n)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getMastersByMasterIdRange = function (e, t, r, i, o) {
          return n(this, void 0, void 0, function () {
            var n, s, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    ((n = new I.GetMastersOptions()).userId = t),
                    (n.company = r),
                    (n.dateRange = new I.Range(r.getStartDate(), r.getEndDate())),
                    (n.filters = []),
                    (s = []).push(new I.FilterValue(I.Operators.GTE, i)),
                    s.push(new I.FilterValue(I.Operators.LTE, o)),
                    (u = new I.Filter("MasterId", "masterId", s, I.Operators.AND)),
                    n.filters.push(u),
                    [4, this.getMasters(e, n)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getMastersByNames = function (e, t, r, i) {
          return n(this, void 0, void 0, function () {
            var n, o, s, u, p, c;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  for (
                    (n = new I.GetMastersOptions()).userId = t,
                      n.company = r,
                      n.dateRange = new I.Range(r.getStartDate(), r.getEndDate()),
                      n.filters = [],
                      o = [],
                      s = 0,
                      u = i;
                    s < u.length;
                    s++
                  )
                    ((p = u[s]), o.push(new I.FilterValue(I.Operators.EQUALS, p)));
                  return (
                    (c = new I.Filter("Name", "name", o, I.Operators.OR)),
                    n.filters.push(c),
                    [4, this.getMasters(e, n)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getVouchersByDay = function (e, t, r, i) {
          return n(this, void 0, void 0, function () {
            var n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    ((n = new I.GetMastersOptions()).userId = t),
                    (n.company = r),
                    (n.dateRange = new I.Range(i, i)),
                    [4, this.getMasters(e, n)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getMastersFromFile = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return ((r = i.readFileSync(t.fileName, "ucs2")), [4, _.parse(r, !1)]);
                case 1:
                  return ((n = a.sent()), [4, new I.GetMastersResponse().parse(e, n, t)]);
                case 2:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getLedgerClosing = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n, i, o, s, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (r = a.sent()),
                    (n = new I.LedgerClosingRequest()),
                    (i = n.getBody(e, t)),
                    this.logTallyReqAndRes("Ledger Closing Request:: " + i),
                    (r.body = new Buffer(i, "ucs2")),
                    [4, this.postRequest(r, !1)]
                  );
                case 3:
                  return (
                    (o = a.sent()),
                    this.logTallyReqAndRes("Ledger Closing Response:: " + o.body),
                    [4, _.parse(o.body)]
                  );
                case 4:
                  return (
                    (s = a.sent()),
                    (u = new I.LedgerClosingResponse()),
                    [2, u.parseLedgerDetails(e, s)]
                  );
              }
            });
          });
        }),
        (e.prototype.getPendingBill = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n, i, o, s, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (a.trys.push([0, 8, , 9]), [4, this.ping()]);
                case 1:
                  return (
                    a.sent(),
                    R.Util.isNotNull(t) &&
                    R.Util.isNotNull(t.company) &&
                    R.Util.isNotEmpty(t.company.tallyCompanyName.trim())
                      ? [4, this.isCompanyOpen(t.company.tallyCompanyName.trim())]
                      : [3, 3]
                  );
                case 2:
                  if (!a.sent())
                    throw new Error(
                      "Company " + t.company.tallyCompanyName + " is not open in tally",
                    );
                  a.label = 3;
                case 3:
                  return [4, this.getRequestOptions()];
                case 4:
                  return (
                    (r = a.sent()),
                    (n = new I.GetMastersRequest()),
                    (i = n.getBody(e, t)),
                    (r.body = new Buffer(i, "ucs2")),
                    [4, this.postRequest(r)]
                  );
                case 5:
                  return ((o = a.sent()), [4, _.parse(o.body)]);
                case 6:
                  return ((s = a.sent()), [4, new I.GetMastersResponse().parse(e, s, t)]);
                case 7:
                  return [2, a.sent()];
                case 8:
                  throw ((u = a.sent()), R.Log.exception(u, e.getName(), t), u);
                case 9:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.getOnAccountBalance = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n, i, o, s, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (a.trys.push([0, 8, , 9]), [4, this.ping()]);
                case 1:
                  return (
                    a.sent(),
                    R.Util.isNotNull(t) &&
                    R.Util.isNotNull(t.company) &&
                    R.Util.isNotEmpty(t.company.tallyCompanyName.trim())
                      ? [4, this.isCompanyOpen(t.company.tallyCompanyName.trim())]
                      : [3, 3]
                  );
                case 2:
                  if (!a.sent())
                    throw new Error(
                      "Company " + t.company.tallyCompanyName + " is not open in tally",
                    );
                  a.label = 3;
                case 3:
                  return [4, this.getRequestOptions()];
                case 4:
                  return (
                    (r = a.sent()),
                    (n = new M.default()),
                    (i = n.getBody(e, t)),
                    (r.body = new Buffer(i, "ucs2")),
                    [4, this.postRequest(r)]
                  );
                case 5:
                  return ((o = a.sent()), [4, _.parse(o.body)]);
                case 6:
                  return ((s = a.sent()), [4, new I.GetMastersResponse().parse(e, s, t)]);
                case 7:
                  return [2, a.sent()];
                case 8:
                  throw ((u = a.sent()), R.Log.exception(u, e.getName(), t), u);
                case 9:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.getVoucherStatistics = function (e, t, r) {
          return n(this, void 0, void 0, function () {
            var n, i, o, s, u, p;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (n = a.sent()),
                    (i = new I.VoucherStatisticsRequest()),
                    (o = i.getBody(e, t)),
                    this.logTallyReqAndRes("VoucherStatistics xml request::" + o),
                    (n.body = new Buffer(o, "ucs2")),
                    [4, this.postRequest(n, !1)]
                  );
                case 3:
                  return (
                    (s = a.sent()),
                    this.logTallyReqAndRes("VoucherStatistics xml response::" + s.body),
                    [4, _.parse(s.body)]
                  );
                case 4:
                  return (
                    (u = a.sent()),
                    (p = new I.VoucherStatisticsResponse()),
                    [2, p.parseVoucher(e, u, r)]
                  );
              }
            });
          });
        }),
        (e.prototype.logTallyReqAndRes = function (e) {
          R.Log.debug(JSON.stringify(e));
        }),
        (e.prototype.createLedgerEntry = function (e, t, r) {
          return n(this, void 0, void 0, function () {
            var n, i, o, s, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.isCompanyOpen(t.tallyCompanyName.trim())]);
                case 2:
                  if (!a.sent())
                    throw new Error("Company " + t.tallyCompanyName + " is not open in tally");
                  return [4, this.getRequestOptions()];
                case 3:
                  return (
                    (n = a.sent()),
                    (i = new y.default()),
                    (o = i.getBody(e, t, r)),
                    this.logTallyReqAndRes("Ledger Entry tally request::" + o),
                    (n.body = new Buffer(o, "ucs2")),
                    [4, this.postRequest(n, !1)]
                  );
                case 4:
                  return (
                    (s = a.sent()),
                    this.logTallyReqAndRes("Ledger Entry tally Response::" + s.body),
                    [4, _.parse(s.body)]
                  );
                case 5:
                  return ((u = a.sent()), [2, new b.default().parse(u)]);
              }
            });
          });
        }),
        (e.prototype.createStockItemEntry = function (e, t, r) {
          return n(this, void 0, void 0, function () {
            var n, i, o, s, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.isCompanyOpen(t.tallyCompanyName.trim())]);
                case 2:
                  if (!a.sent())
                    throw new Error("Company " + t.tallyCompanyName + " is not open in tally");
                  return [4, this.getRequestOptions()];
                case 3:
                  return (
                    (n = a.sent()),
                    (i = new h.default()),
                    (o = i.getBody(e, t, r)),
                    this.logTallyReqAndRes("StockItem tally request::" + o),
                    (n.body = new Buffer(o, "ucs2")),
                    [4, this.postRequest(n, !1)]
                  );
                case 4:
                  return (
                    (s = a.sent()),
                    this.logTallyReqAndRes("StockItem tally response::" + s.body),
                    [4, _.parse(s.body)]
                  );
                case 5:
                  return ((u = a.sent()), [2, new l.default().parse(u, O.default.masterName)]);
              }
            });
          });
        }),
        (e.prototype.createInvoiceItemEntry = function (e, t, r) {
          return n(this, void 0, void 0, function () {
            var n, i, o, s;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.isCompanyOpen(t.tallyCompanyName.trim())]);
                case 2:
                  if (!a.sent())
                    throw new Error("Company " + t.tallyCompanyName + " is not open in tally");
                  return [4, this.getRequestOptions()];
                case 3:
                  return (
                    (n = a.sent()),
                    (i = new m.default().getBody(e, t, r)),
                    this.logTallyReqAndRes("InvoiceEntry tally request::" + i),
                    (n.body = new Buffer(i, "ucs2")),
                    [4, this.postRequest(n, !1)]
                  );
                case 4:
                  return (
                    (o = a.sent()),
                    this.logTallyReqAndRes("InvoiceEntry tally response::" + o.body),
                    [4, _.parse(o.body)]
                  );
                case 5:
                  return ((s = a.sent()), [2, new d.default().parse(s)]);
              }
            });
          });
        }),
        (e.tallyConnectionDetails = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r, n, i;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  ((t = { isTallyOpen: !1, isOdbcPortOpen: !1 }), (a.label = 1));
                case 1:
                  return (a.trys.push([1, 5, , 6]), [4, g.default("name", "tally.exe")]);
                case 2:
                  return (
                    (r = a.sent()),
                    R.Util.isFilledArray(r)
                      ? ((t.isTallyOpen = !0), [4, g.default("port", e)])
                      : [3, 4]
                  );
                case 3:
                  ((n = a.sent()),
                    R.Util.isFilledArray(n) && (t.isOdbcPortOpen = !0),
                    (a.label = 4));
                case 4:
                  return [3, 6];
                case 5:
                  return (
                    (i = a.sent()),
                    console.log("Process find error"),
                    R.Log.info("TallyConnectionDetails " + JSON.stringify(i)),
                    console.log(i),
                    [3, 6]
                  );
                case 6:
                  return [2, t];
              }
            });
          });
        }),
        (e.prototype.createInventoryEntry = function (e, t, r) {
          return n(this, void 0, void 0, function () {
            var n, i, o, s;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.isCompanyOpen(t.tallyCompanyName.trim())]);
                case 2:
                  if (!a.sent())
                    throw new Error("Company " + t.tallyCompanyName + " is not open in tally");
                  return [4, this.getRequestOptions()];
                case 3:
                  return (
                    (n = a.sent()),
                    (i = new I.CreateInventoryVoucherRequest().getBody(e, t, r)),
                    this.logTallyReqAndRes("Inventory tally request::" + i),
                    (n.body = new Buffer(i, "ucs2")),
                    [4, this.postRequest(n, !1)]
                  );
                case 4:
                  return (
                    (o = a.sent()),
                    this.logTallyReqAndRes("Inventory tally response::" + o.body),
                    [4, _.parse(o.body)]
                  );
                case 5:
                  return ((s = a.sent()), [2, new I.CreateInventoryVoucherResponse().parse(s)]);
              }
            });
          });
        }),
        (e.prototype.createJournalEntry = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r, n, i, o;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.isCompanyOpen(t.tallyCompanyName.trim())]);
                case 2:
                  if (!a.sent())
                    throw new Error("Company " + t.tallyCompanyName + " is not open in tally");
                  return [4, this.getRequestOptions()];
                case 3:
                  return (
                    (r = a.sent()),
                    (n = new I.CreateJournalEntryRequest().getBody(e, t)),
                    this.logTallyReqAndRes("Journal tally request::" + n),
                    (r.body = new Buffer(n, "ucs2")),
                    [4, this.postRequest(r, !1)]
                  );
                case 4:
                  return (
                    (i = a.sent()),
                    this.logTallyReqAndRes("Journal tally response::" + i.body),
                    [4, _.parse(i.body)]
                  );
                case 5:
                  return ((o = a.sent()), [2, new I.CreateJournalEntryResponse().parse(o)]);
              }
            });
          });
        }),
        (e.prototype.getTallySetting = function () {
          var e,
            r = new q.TallySettings();
          return (
            (r.host = t.TALLY_DEFAULT_HOST),
            (r.port = t.TALLY_DEFAULT_PORT),
            (e = this.getReduxStore().tally.tallyConfig),
            R.Util.isNotNull(e) &&
              (R.Util.isNotNull(e.port) && (r.port = e.port),
              R.Util.isNotNull(e.host) && (r.host = e.host)),
            r
          );
        }),
        (e.prototype.checkCompanyStatus = function (t) {
          return n(this, void 0, void 0, function () {
            var r, n, i;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (a.trys.push([0, 2, , 6]), [4, this.isCompanyOpen(t.trim())]);
                case 1:
                  return !0 === a.sent()
                    ? [2, u.SYNC_STATUS_CODE.SYNC_SUCCESS]
                    : [2, u.SYNC_STATUS_CODE.COMPANY_NOT_OPEN];
                case 2:
                  return (
                    (r = a.sent()),
                    R.Log.info(r),
                    R.Util.isNotNull(r)
                      ? R.Util.isNotNull(r.message) &&
                        r.message.includes(c.default.TALLY_IS_NOT_OPEN)
                        ? (n = this.getTallySetting()).host !== c.default.LOCALHOST
                          ? [3, 4]
                          : [4, e.tallyConnectionDetails(n.port)]
                        : [3, 5]
                      : [3, 5]
                  );
                case 3:
                  return (i = a.sent()).isTallyOpen && !1 === i.isOdbcPortOpen
                    ? [2, u.SYNC_STATUS_CODE.TALLY_ODBC_PORT_NOT_OPEN]
                    : [2, u.SYNC_STATUS_CODE.TALLY_NOT_OPEN_SAME_COMPUTER];
                case 4:
                  return [2, u.SYNC_STATUS_CODE.TALLY_NOT_OPEN_DIFF_COMPUTER];
                case 5:
                  return [2, u.SYNC_STATUS_CODE.SYNC_ERROR];
                case 6:
                  return [2];
              }
            });
          });
        }),
        e
      );
    })();
  t.default = D;
};
