// webpack module #49 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var o = r(8),
    s = r(24),
    n = r(212),
    u = r(60),
    p = r(1124),
    c = r(11),
    m = r(559),
    l = r(560),
    d = r(568),
    y = r(1132),
    b = r(1133),
    h = r(1134),
    g = r(80),
    S = r(1135),
    f = r(1139),
    A = r(101),
    N = r(90),
    I = r(1140),
    T = r(1141),
    M = r(144),
    v = r(32),
    k = r(508),
    C = r(232),
    q = r(28),
    R = r(147),
    D = r(2),
    E = r(143),
    x = r(507);
  ((t.TALLY_DEFAULT_PORT = "9000"), (t.TALLY_DEFAULT_HOST = "localhost"));
  var O = new T.default(),
    z = (function () {
      function e() {}
      return (
        (e.getInstance = function () {
          return (D.Util.isNull(e.instance) && (e.instance = new e()), e.instance);
        }),
        (e.prototype.getReduxStore = function () {
          return process && process.type === c.default.PROCESS.RENDERER
            ? n.default.getInstance().getStoreState()
            : A.default.getInstance().getStoreState();
        }),
        (e.prototype.getUrl = function () {
          var e,
            r = new q.TallySettings();
          return (
            (r.host = t.TALLY_DEFAULT_HOST),
            (r.port = t.TALLY_DEFAULT_PORT),
            (e = this.getReduxStore().tally.tallyConfig),
            D.Util.isNotNull(e) &&
              (D.Util.isNotNull(e.port) && (r.port = e.port),
              D.Util.isNotNull(e.host) && (r.host = e.host)),
            "http://" + r.host + ":" + r.port
          );
        }),
        (e.prototype.validateTallyResponse = function (e) {
          if (
            D.Util.isNotNull(e) &&
            200 === e.statusCode &&
            D.Util.isNotNull(e.body) &&
            D.Util.isNotNull(e.headers) &&
            D.Util.isNotNull(e.headers.respstatus) &&
            "1" === e.headers.respstatus
          )
            return !0;
          throw (
            D.Log.info("Invalid response received from tally: " + JSON.stringify(e)),
            new Error("Request to tally failed with status code: " + e.headers.respstatus)
          );
        }),
        (e.prototype.getTallyLicenseNumber = function () {
          return i(this, void 0, void 0, function () {
            return a(this, function (e) {
              switch (e.label) {
                case 0:
                  return [
                    4,
                    this.getTallyLicenseInfo(C.GetTallyLicenseRequest.PARAM_SERIAL_NUMBER),
                  ];
                case 1:
                  return [2, e.sent()];
              }
            });
          });
        }),
        (e.prototype.isTallyGoldLicense = function () {
          return i(this, void 0, void 0, function () {
            var e;
            return a(this, function (t) {
              switch (t.label) {
                case 0:
                  return [4, this.getTallyLicenseInfo(C.GetTallyLicenseRequest.PARAM_IS_GOLD)];
                case 1:
                  return (
                    (e = t.sent()),
                    D.Util.isNotNull(e) && "yes" === e.toLowerCase() ? [2, !0] : [2, !1]
                  );
              }
            });
          });
        }),
        (e.prototype.isTallySilverLicense = function () {
          return i(this, void 0, void 0, function () {
            var e;
            return a(this, function (t) {
              switch (t.label) {
                case 0:
                  return [4, this.getTallyLicenseInfo(C.GetTallyLicenseRequest.PARAM_IS_SILVER)];
                case 1:
                  return (
                    (e = t.sent()),
                    D.Util.isNotNull(e) && "yes" === e.toLowerCase() ? [2, !0] : [2, !1]
                  );
              }
            });
          });
        }),
        (e.prototype.getTypeOfLicence = function () {
          return i(this, void 0, void 0, function () {
            var t, r;
            return a(this, function (i) {
              switch (i.label) {
                case 0:
                  return (
                    i.trys.push([0, 3, , 4]),
                    [4, (t = e.getInstance()).isTallyGoldLicense()]
                  );
                case 1:
                  return i.sent() ? [2, x.TallyLicenceType.GOLD] : [4, t.isTallySilverLicense()];
                case 2:
                  return i.sent() ? [2, x.TallyLicenceType.SILVER] : [3, 4];
                case 3:
                  return (
                    (r = i.sent()),
                    D.Log.info("Unable to get type of license " + D.Util.getErrorMessage(r)),
                    [3, 4]
                  );
                case 4:
                  return [2];
              }
            });
          });
        }),
        (e.getTallyLicense = function () {
          return i(this, void 0, void 0, function () {
            var t, r, i;
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
                  throw ((i = a.sent()), D.Log.error("Error getting tally license"), i);
                case 3:
                  return [2, null];
              }
            });
          });
        }),
        (e.prototype.getTallyLicenseEmailId = function () {
          return i(this, void 0, void 0, function () {
            return a(this, function (e) {
              switch (e.label) {
                case 0:
                  return [4, this.getTallyLicenseInfo(C.GetTallyLicenseRequest.PARAM_ACCOUNT_ID)];
                case 1:
                  return [2, e.sent()];
              }
            });
          });
        }),
        (e.prototype.getTallyLicenseIsInternational = function () {
          return i(this, void 0, void 0, function () {
            var e;
            return a(this, function (t) {
              switch (t.label) {
                case 0:
                  return [4, this.getTallyLicenseInfo(C.GetTallyLicenseRequest.PARAM_ISINDIAN)];
                case 1:
                  return (
                    (e = t.sent()),
                    D.Util.isNotNull(e) && "yes" !== e.toLowerCase() ? [2, !0] : [2, !1]
                  );
              }
            });
          });
        }),
        (e.prototype.getTallyRetryCount = function (e) {
          return i(this, void 0, void 0, function () {
            var t, r;
            return a(this, function (i) {
              switch (i.label) {
                case 0:
                  return (
                    (t = E.TALLY_QUERY_RETRY_ATTEMPTS),
                    [4, new N.default(e).get(v.AppSettingMetadata.TALLY_QUERY_RETRY)]
                  );
                case 1:
                  return (
                    (r = i.sent()),
                    D.Util.isNotNull(r) && D.Util.isNotNull(r.data) && (t = r.data),
                    [2, t]
                  );
              }
            });
          });
        }),
        (e.prototype.getTallyLicenseInfo = function (e) {
          return i(this, void 0, void 0, function () {
            var t, r, i, o, s, n, u, p, m, l, d;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (t = this.getUrl()),
                    (r = M.default.get()),
                    [4, this.getTallyRetryCount(r.id)]
                  );
                case 1:
                  ((i = a.sent()), (a.label = 2));
                case 2:
                  return (
                    a.trys.push([2, 4, , 5]),
                    [
                      4,
                      D.Util.retryFunction(
                        R.get,
                        [{ uri: t, timeout: 1e4, resolveWithFullResponse: !0 }],
                        i,
                        1e4,
                        1,
                        "tallyPingResponse",
                      ),
                    ]
                  );
                case 3:
                  return ((o = a.sent()), this.validateTallyResponse(o), [3, 5]);
                case 4:
                  throw (
                    (s = a.sent()),
                    D.Log.info("Unable to connect to tally: " + JSON.stringify(s)),
                    ((n = new q.ErrorMessage()).message = c.default.TALLY_IS_NOT_OPEN + " " + t),
                    n
                  );
                case 5:
                  return [4, this.getRequestOptions()];
                case 6:
                  return (
                    (u = a.sent()),
                    (p = new C.GetTallyLicenseRequest()),
                    (m = p.getBody(e)),
                    (u.body = new Buffer(m, "ucs2")),
                    [
                      4,
                      D.Util.retryFunction(
                        this.postRequest.bind(this),
                        [u],
                        i,
                        1e4,
                        1,
                        "getTallyLicenseInfo",
                      ),
                    ]
                  );
                case 7:
                  return ((l = a.sent()), [4, O.parse(l.body)]);
                case 8:
                  return ((d = a.sent()), [2, new C.GetTallyLicenseResponse().parse(d)]);
              }
            });
          });
        }),
        (e.prototype.ping = function (e) {
          return (
            void 0 === e && (e = {}),
            i(this, void 0, void 0, function () {
              var t, r, i, o, s, n, u;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    ((t = this.getUrl()),
                      (r = 5),
                      D.Util.isNotNull(e.customUrl) && (t = e.customUrl),
                      D.Util.isNotNull(e.retryCount) && (r = e.retryCount),
                      (i = !1),
                      (a.label = 1));
                  case 1:
                    return (
                      a.trys.push([1, 3, , 4]),
                      [
                        4,
                        D.Util.retryFunction(
                          R.get,
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
                      (o = a.sent()),
                      this.validateTallyResponse(o),
                      (i = o.body.toLowerCase().includes("tally")),
                      g.default.send("tally-open-response"),
                      [3, 4]
                    );
                  case 3:
                    throw (
                      (s = a.sent()),
                      D.Log.info("Unable to connect to tally: " + JSON.stringify(s)),
                      ((u = new q.ErrorMessage()).message = c.default.TALLY_IS_NOT_OPEN + " " + t),
                      u
                    );
                  case 4:
                    return !0 === i && D.Util.isNull(e.customUrl)
                      ? [4, this.getTallyLicenseNumber()]
                      : [3, 6];
                  case 5:
                    if (((n = a.sent()), !this.isValidTallyLicense(n)))
                      throw (
                        ((u = new q.ErrorMessage()).message = c.default.INVALID_TALLY_LICENSE),
                        u
                      );
                    return [2, !0];
                  case 6:
                    return [2, i];
                }
              });
            })
          );
        }),
        (e.prototype.isValidTallyLicense = function (e) {
          return !D.Util.isNull(e) && "0" !== e;
        }),
        (e.prototype.checkAndSaveTallySettings = function (e) {
          return i(this, void 0, void 0, function () {
            var r, i, o, n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  ((r = this.getUrl()),
                    ((i = new k.CheckAndSaveTally()).success = !1),
                    D.Util.isNotNull(e)
                      ? ((r = "http://" + e.host + ":" + e.port), (i.tallyConfig = e))
                      : (((o = new q.TallySettings()).host = t.TALLY_DEFAULT_HOST),
                        (o.port = t.TALLY_DEFAULT_PORT),
                        (i.tallyConfig = o)),
                    (a.label = 1));
                case 1:
                  return (a.trys.push([1, 3, , 4]), (n = i), [4, this.ping({ customUrl: r })]);
                case 2:
                  return (
                    (n.success = a.sent()),
                    !0 === i.success && s.default.set(s.default.TALLY_SETTINGS, e),
                    [2, i]
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
          return i(this, void 0, void 0, function () {
            return a(this, function (r) {
              return [2, e.getInstance().checkAndSaveTallySettings(t)];
            });
          });
        }),
        (e.prototype.postRequest = function (e, t) {
          return (
            void 0 === t && (t = !0),
            i(this, void 0, void 0, function () {
              var r;
              return a(this, function (i) {
                switch (i.label) {
                  case 0:
                    return [4, R.post(e)];
                  case 1:
                    return ((r = i.sent()), t ? [4, this.validateTallyResponse(r)] : [3, 3]);
                  case 2:
                    (i.sent(), (i.label = 3));
                  case 3:
                    return [2, r];
                }
              });
            })
          );
        }),
        (e.prototype.getRequestOptions = function () {
          return i(this, void 0, void 0, function () {
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
          return i(this, void 0, void 0, function () {
            var t, r, i, o, s, n, c, m, l;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (
                    a.sent(),
                    D.Util.isNull(e)
                      ? (D.Log.info("Company name is undefined"), [2, !1])
                      : ((t = new C.GetMastersOptions()),
                        ((r = new u.default()).tallyCompanyName = ""),
                        (t.company = r),
                        (t.filters = []),
                        D.Util.isNotNull(e) &&
                          ((i = []),
                          (o = new C.FilterValue(C.Operators.EQUALS, e)),
                          i.push(o),
                          (s = new C.Filter("CompanyNameFilter", "name", i, C.Operators.OR)),
                          t.filters.push(s)),
                        (n = new C.FilterValue(C.Operators.EQUALS, "No")),
                        (c = [n]),
                        (m = new C.Filter("GroupFilter", "isaggregate", c, C.Operators.OR)),
                        t.filters.push(m),
                        [4, this.getMasters(new p.default(), t)])
                  );
                case 2:
                  return (
                    (l = a.sent()),
                    D.Util.isNotNull(l) && l.length > 0
                      ? [2, !0]
                      : (D.Log.info(
                          "Company " + e + " is currently not open in tally. Skipping...",
                        ),
                        [2, !1])
                  );
              }
            });
          });
        }),
        (e.prototype.getMasters = function (e, t, r) {
          return i(this, void 0, void 0, function () {
            var i, o, s, n, p, c, m, l;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    a.trys.push([0, 9, , 10]),
                    (i = M.default.get()),
                    [4, this.getTallyRetryCount(i.id)]
                  );
                case 1:
                  return ((o = a.sent()), [4, this.ping({ retryCount: o })]);
                case 2:
                  return (
                    a.sent(),
                    e.getName() === u.default.masterName
                      ? [3, 4]
                      : D.Util.isNotNull(t) &&
                          D.Util.isNotNull(t.company) &&
                          D.Util.isNotEmpty(t.company.tallyCompanyName.trim())
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
                    (s = a.sent()),
                    (n = new C.GetMastersRequest()),
                    D.Util.isNull(t.dateRange) && (t.dateRange = new C.Range(0, 0)),
                    (p = n.getBody(e, t, e.getName() === v.Voucher.masterName)),
                    this.logTallyReqAndRes("Tally " + e.getName() + " xml request::" + p),
                    (s.body = new Buffer(p, "ucs2")),
                    r && D.Log.info(p),
                    [
                      4,
                      D.Util.retryFunction(
                        this.postRequest.bind(this),
                        [s],
                        o,
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
                    [4, O.parse(c.body)]
                  );
                case 7:
                  return ((m = a.sent()), [4, new C.GetMastersResponse().parse(e, m, t)]);
                case 8:
                  return [2, a.sent()];
                case 9:
                  throw ((l = a.sent()), D.Log.exception(l, e.getName(), t), l);
                case 10:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.getCompanyNames = function () {
          return i(this, void 0, void 0, function () {
            var e, t, r, i, o, s;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (e = a.sent()),
                    (t = new C.GetCompaniesRequest()),
                    (r = t.getBody()),
                    (e.body = new Buffer(r, "ucs2")),
                    [4, this.postRequest(e)]
                  );
                case 3:
                  return ((i = a.sent()), [4, O.parse(i.body)]);
                case 4:
                  return (
                    (o = a.sent()),
                    (s = new C.GetCompaniesResponse()),
                    [2, s.parseCompanyNames(o)]
                  );
              }
            });
          });
        }),
        (e.prototype.getGSTNumber = function (e) {
          return i(this, void 0, void 0, function () {
            var t, r, i, o, s, n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), (t = { company: e }), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (r = a.sent()),
                    (i = new C.GetGSTRequest()),
                    (o = i.getBody(t)),
                    (r.body = new Buffer(o, "ucs2")),
                    [4, this.postRequest(r)]
                  );
                case 3:
                  return ((s = a.sent()), [4, O.parse(s.body)]);
                case 4:
                  return ((n = a.sent()), [2, new C.GetGSTResponse().parse(n)]);
              }
            });
          });
        }),
        (e.prototype.getEInvoiceConfig = function (e) {
          return i(this, void 0, void 0, function () {
            var t, r, i, o;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (t = a.sent()),
                    (r = new C.GstEInvoiceConfigRequest()),
                    (i = r.getBody(e)),
                    (t.body = new Buffer(i, "ucs2")),
                    [4, this.postRequest(t)]
                  );
                case 3:
                  return ((o = a.sent()), [4, O.parse(o.body)]);
                case 4:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getTallyProdInfo = function (e) {
          return i(this, void 0, void 0, function () {
            var t, r, i, o, s;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (t = a.sent()),
                    (r = new C.GetTallyProductRequest()),
                    (i = r.getBody(e)),
                    (t.body = new Buffer(i, "ucs2")),
                    [4, this.postRequest(t)]
                  );
                case 3:
                  return ((o = a.sent()), [4, O.parse(o.body)]);
                case 4:
                  return ((s = a.sent()), [2, new C.GetTallyProductResponse().parse(s)]);
              }
            });
          });
        }),
        (e.prototype.getTallyVerisonInfo = function () {
          return i(this, void 0, void 0, function () {
            var e, t, r, i;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    a.trys.push([0, 2, , 3]),
                    [4, this.getTallyProdInfo(C.GetTallyProductRequest.PARAM_BUILD_NUMBER)]
                  );
                case 1:
                  return ((e = a.sent()), [3, 3]);
                case 2:
                  return (
                    a.sent(),
                    D.Log.info("Error getting tally build number while device update"),
                    [3, 3]
                  );
                case 3:
                  return (
                    a.trys.push([3, 5, , 6]),
                    [4, this.getTallyProdInfo(C.GetTallyProductRequest.PARAM_PRODUCT_NAME)]
                  );
                case 4:
                  return ((t = a.sent()), [3, 6]);
                case 5:
                  return (
                    a.sent(),
                    D.Log.info("Error getting tally product name while device update"),
                    [3, 6]
                  );
                case 6:
                  return (
                    a.trys.push([6, 8, , 9]),
                    [4, this.getTallyProdInfo(C.GetTallyProductRequest.PARAM_VERSION_STRING)]
                  );
                case 7:
                  return ((r = a.sent()), [3, 9]);
                case 8:
                  return (
                    a.sent(),
                    D.Log.info("Error getting tally version while device update"),
                    [3, 9]
                  );
                case 9:
                  return (
                    (i = {}),
                    D.Util.isNotEmptyString(e) &&
                      !1 === isNaN(parseInt(e)) &&
                      (i.buildNumber = parseInt(e)),
                    D.Util.isNotEmptyString(t) && (i.productName = t),
                    D.Util.isNotEmptyString(r) && (i.version = r),
                    [2, i]
                  );
              }
            });
          });
        }),
        (e.prototype.getCompaniesByCompanyObject = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r;
            return a(this, function (i) {
              switch (i.label) {
                case 0:
                  return (
                    ((r = new C.GetMastersOptions()).company = e),
                    (r.filters = []),
                    (D.Util.isNull(t) || t <= 0) && (r.updateGstIn = !0),
                    [4, this.getCompaniesFromOptions(r)]
                  );
                case 1:
                  return [2, i.sent()];
              }
            });
          });
        }),
        (e.prototype.getCompanies = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i, o, s, n, p, c, m;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  if (
                    ((r = new C.GetMastersOptions()),
                    ((i = new u.default()).tallyCompanyName = ""),
                    (r.company = i),
                    (r.filters = []),
                    D.Util.isNotNull(t) && t.length > 0 && (r.keys = t),
                    D.Util.isNotNull(e))
                  ) {
                    for (o = [], s = 0, n = e; s < n.length; s++)
                      ((p = n[s]), (c = new C.FilterValue(C.Operators.EQUALS, p)), o.push(c));
                    ((m = new C.Filter("CompanyNameFilter", "name", o, C.Operators.OR)),
                      r.filters.push(m));
                  }
                  return [4, this.getCompaniesFromOptions(r)];
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.createOrderEntry = function (e, t, r) {
          return i(this, void 0, void 0, function () {
            var i, o, s, n, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (i = a.sent()),
                    (o = new C.CreateOrderRequest()),
                    (s = o.getBody(e, t, r)),
                    this.logTallyReqAndRes("OrderEntry xml request::" + s),
                    (i.body = new Buffer(s, "ucs2")),
                    [4, this.postRequest(i, !1)]
                  );
                case 3:
                  return (
                    (n = a.sent()),
                    this.logTallyReqAndRes("OrderEntry xml response::" + n.body),
                    [4, O.parse(n.body)]
                  );
                case 4:
                  return ((u = a.sent()), [2, new C.OrderEnterResponse().parseOrderDetails(u)]);
              }
            });
          });
        }),
        (e.prototype.createTransactionEntry = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i, o, s, n;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (r = a.sent()),
                    (i = new C.CreateTransactionRequest()),
                    (o = i.getBody(e, t)),
                    this.logTallyReqAndRes("TransactionEntry xml request::" + o),
                    (r.body = new Buffer(o, "ucs2")),
                    [4, this.postRequest(r, !1)]
                  );
                case 3:
                  return (
                    (s = a.sent()),
                    this.logTallyReqAndRes("TransactionEntry xml response::" + s.body),
                    [4, O.parse(s.body)]
                  );
                case 4:
                  return ((n = a.sent()), [2, new C.OrderEnterResponse().parseOrderDetails(n)]);
              }
            });
          });
        }),
        (e.prototype.getCompaniesFromOptions = function (e) {
          return i(this, void 0, void 0, function () {
            var t, r, i;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (t = new C.FilterValue(C.Operators.EQUALS, "No")),
                    (r = [t]),
                    (i = new C.Filter("GroupFilter", "isaggregate", r, C.Operators.OR)),
                    e.filters.push(i),
                    [4, this.getMasters(new u.default(), e)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getMastersByAlterId = function (e, t, r, o, s, n) {
          return i(this, void 0, void 0, function () {
            var i, u, p;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    ((i = new C.GetMastersOptions()).userId = t),
                    (i.company = r),
                    (i.dateRange = new C.Range(r.getStartDate(), r.getEndDate())),
                    (i.keys = n),
                    D.Util.isNotNull(o) &&
                      D.Util.isNotNull(s) &&
                      ((i.filters = []),
                      (u = []).push(new C.FilterValue(C.Operators.GT, o)),
                      u.push(new C.FilterValue(C.Operators.LTE, s)),
                      (p = new C.Filter("AlterId", "alterid", u, C.Operators.AND)),
                      i.filters.push(p)),
                    [4, this.getMasters(e, i)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getMastersByMasterIds = function (e, t, r, o, s) {
          return i(this, void 0, void 0, function () {
            var i, n, u, p, c, m;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  for (
                    (i = new C.GetMastersOptions()).userId = t,
                      i.company = r,
                      i.dateRange = new C.Range(r.getStartDate(), r.getEndDate()),
                      i.filters = [],
                      i.keys = s,
                      n = [],
                      u = 0,
                      p = o;
                    u < p.length;
                    u++
                  )
                    ((c = p[u]), n.push(new C.FilterValue(C.Operators.EQUALS, c)));
                  return (
                    (m = new C.Filter("MasterId", "masterId", n, C.Operators.OR)),
                    i.filters.push(m),
                    [4, this.getMasters(e, i)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getMastersByMasterIdRange = function (e, t, r, o, s) {
          return i(this, void 0, void 0, function () {
            var i, n, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    ((i = new C.GetMastersOptions()).userId = t),
                    (i.company = r),
                    (i.dateRange = new C.Range(r.getStartDate(), r.getEndDate())),
                    (i.filters = []),
                    (n = []).push(new C.FilterValue(C.Operators.GTE, o)),
                    n.push(new C.FilterValue(C.Operators.LTE, s)),
                    (u = new C.Filter("MasterId", "masterId", n, C.Operators.AND)),
                    i.filters.push(u),
                    [4, this.getMasters(e, i)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getMastersByNames = function (e, t, r, o) {
          return i(this, void 0, void 0, function () {
            var i, s, n, u, p, c;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  for (
                    (i = new C.GetMastersOptions()).userId = t,
                      i.company = r,
                      i.dateRange = new C.Range(r.getStartDate(), r.getEndDate()),
                      i.filters = [],
                      s = [],
                      n = 0,
                      u = o;
                    n < u.length;
                    n++
                  )
                    ((p = u[n]), s.push(new C.FilterValue(C.Operators.EQUALS, p)));
                  return (
                    (c = new C.Filter("Name", "name", s, C.Operators.OR)),
                    i.filters.push(c),
                    [4, this.getMasters(e, i)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getVouchersByDay = function (e, t, r, o) {
          return i(this, void 0, void 0, function () {
            var i;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    ((i = new C.GetMastersOptions()).userId = t),
                    (i.company = r),
                    (i.dateRange = new C.Range(o, o)),
                    [4, this.getMasters(e, i)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getMastersFromFile = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return ((r = o.readFileSync(t.fileName, "ucs2")), [4, O.parse(r, !1)]);
                case 1:
                  return ((i = a.sent()), [4, new C.GetMastersResponse().parse(e, i, t)]);
                case 2:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (e.prototype.getLedgerClosing = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i, o, s, n, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (r = a.sent()),
                    (i = new C.LedgerClosingRequest()),
                    (o = i.getBody(e, t)),
                    this.logTallyReqAndRes("Ledger Closing Request:: " + o),
                    (r.body = new Buffer(o, "ucs2")),
                    [4, this.postRequest(r, !1)]
                  );
                case 3:
                  return (
                    (s = a.sent()),
                    this.logTallyReqAndRes("Ledger Closing Response:: " + s.body),
                    [4, O.parse(s.body)]
                  );
                case 4:
                  return (
                    (n = a.sent()),
                    (u = new C.LedgerClosingResponse()),
                    [2, u.parseLedgerDetails(e, n)]
                  );
              }
            });
          });
        }),
        (e.prototype.getPendingBill = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i, o, s, n, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (a.trys.push([0, 8, , 9]), [4, this.ping()]);
                case 1:
                  return (
                    a.sent(),
                    D.Util.isNotNull(t) &&
                    D.Util.isNotNull(t.company) &&
                    D.Util.isNotEmpty(t.company.tallyCompanyName.trim())
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
                    (i = new C.GetMastersRequest()),
                    (o = i.getBody(e, t)),
                    (r.body = new Buffer(o, "ucs2")),
                    [4, this.postRequest(r)]
                  );
                case 5:
                  return ((s = a.sent()), [4, O.parse(s.body)]);
                case 6:
                  return ((n = a.sent()), [4, new C.GetMastersResponse().parse(e, n, t)]);
                case 7:
                  return [2, a.sent()];
                case 8:
                  throw ((u = a.sent()), D.Log.exception(u, e.getName(), t), u);
                case 9:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.getOnAccountBalance = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i, o, s, n, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (a.trys.push([0, 8, , 9]), [4, this.ping()]);
                case 1:
                  return (
                    a.sent(),
                    D.Util.isNotNull(t) &&
                    D.Util.isNotNull(t.company) &&
                    D.Util.isNotEmpty(t.company.tallyCompanyName.trim())
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
                    (i = new f.default()),
                    (o = i.getBody(e, t)),
                    (r.body = new Buffer(o, "ucs2")),
                    [4, this.postRequest(r)]
                  );
                case 5:
                  return ((s = a.sent()), [4, O.parse(s.body)]);
                case 6:
                  return ((n = a.sent()), [4, new C.GetMastersResponse().parse(e, n, t)]);
                case 7:
                  return [2, a.sent()];
                case 8:
                  throw ((u = a.sent()), D.Log.exception(u, e.getName(), t), u);
                case 9:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.getVoucherStatistics = function (e, t, r) {
          return i(this, void 0, void 0, function () {
            var i, o, s, n, u, p;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.ping()];
                case 1:
                  return (a.sent(), [4, this.getRequestOptions()]);
                case 2:
                  return (
                    (i = a.sent()),
                    (o = new C.VoucherStatisticsRequest()),
                    (s = o.getBody(e, t)),
                    this.logTallyReqAndRes("VoucherStatistics xml request::" + s),
                    (i.body = new Buffer(s, "ucs2")),
                    [4, this.postRequest(i, !1)]
                  );
                case 3:
                  return (
                    (n = a.sent()),
                    this.logTallyReqAndRes("VoucherStatistics xml response::" + n.body),
                    [4, O.parse(n.body)]
                  );
                case 4:
                  return (
                    (u = a.sent()),
                    (p = new C.VoucherStatisticsResponse()),
                    [2, p.parseVoucher(e, u, r)]
                  );
              }
            });
          });
        }),
        (e.prototype.logTallyReqAndRes = function (e) {
          D.Log.debug(JSON.stringify(e));
        }),
        (e.prototype.createLedgerEntry = function (e, t, r) {
          return i(this, void 0, void 0, function () {
            var i, o, s, n, u;
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
                    (i = a.sent()),
                    (o = new y.default()),
                    (s = o.getBody(e, t, r)),
                    this.logTallyReqAndRes("Ledger Entry tally request::" + s),
                    (i.body = new Buffer(s, "ucs2")),
                    [4, this.postRequest(i, !1)]
                  );
                case 4:
                  return (
                    (n = a.sent()),
                    this.logTallyReqAndRes("Ledger Entry tally Response::" + n.body),
                    [4, O.parse(n.body)]
                  );
                case 5:
                  return ((u = a.sent()), [2, new b.default().parse(u)]);
              }
            });
          });
        }),
        (e.prototype.createStockItemEntry = function (e, t, r) {
          return i(this, void 0, void 0, function () {
            var i, o, s, n, u;
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
                    (i = a.sent()),
                    (o = new h.default()),
                    (s = o.getBody(e, t, r)),
                    this.logTallyReqAndRes("StockItem tally request::" + s),
                    (i.body = new Buffer(s, "ucs2")),
                    [4, this.postRequest(i, !1)]
                  );
                case 4:
                  return (
                    (n = a.sent()),
                    this.logTallyReqAndRes("StockItem tally response::" + n.body),
                    [4, O.parse(n.body)]
                  );
                case 5:
                  return ((u = a.sent()), [2, new m.default().parse(u, I.default.masterName)]);
              }
            });
          });
        }),
        (e.prototype.createInvoiceItemEntry = function (e, t, r) {
          return i(this, void 0, void 0, function () {
            var i, o, s, n;
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
                    (i = a.sent()),
                    (o = new l.default().getBody(e, t, r)),
                    this.logTallyReqAndRes("InvoiceEntry tally request::" + o),
                    (i.body = new Buffer(o, "ucs2")),
                    [4, this.postRequest(i, !1)]
                  );
                case 4:
                  return (
                    (s = a.sent()),
                    this.logTallyReqAndRes("InvoiceEntry tally response::" + s.body),
                    [4, O.parse(s.body)]
                  );
                case 5:
                  return ((n = a.sent()), [2, new d.default().parse(n)]);
              }
            });
          });
        }),
        (e.tallyConnectionDetails = function (e) {
          return i(this, void 0, void 0, function () {
            var t, r, i, o;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  ((t = { isTallyOpen: !1, isOdbcPortOpen: !1 }), (a.label = 1));
                case 1:
                  return (a.trys.push([1, 5, , 6]), [4, S.default("name", "tally.exe")]);
                case 2:
                  return (
                    (r = a.sent()),
                    D.Util.isFilledArray(r)
                      ? ((t.isTallyOpen = !0), [4, S.default("port", e)])
                      : [3, 4]
                  );
                case 3:
                  ((i = a.sent()),
                    D.Util.isFilledArray(i) && (t.isOdbcPortOpen = !0),
                    (a.label = 4));
                case 4:
                  return [3, 6];
                case 5:
                  return (
                    (o = a.sent()),
                    console.log("Process find error"),
                    D.Log.info("TallyConnectionDetails " + JSON.stringify(o)),
                    console.log(o),
                    [3, 6]
                  );
                case 6:
                  return [2, t];
              }
            });
          });
        }),
        (e.prototype.createInventoryEntry = function (e, t, r) {
          return i(this, void 0, void 0, function () {
            var i, o, s, n;
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
                    (i = a.sent()),
                    (o = new C.CreateInventoryVoucherRequest().getBody(e, t, r)),
                    this.logTallyReqAndRes("Inventory tally request::" + o),
                    (i.body = new Buffer(o, "ucs2")),
                    [4, this.postRequest(i, !1)]
                  );
                case 4:
                  return (
                    (s = a.sent()),
                    this.logTallyReqAndRes("Inventory tally response::" + s.body),
                    [4, O.parse(s.body)]
                  );
                case 5:
                  return ((n = a.sent()), [2, new C.CreateInventoryVoucherResponse().parse(n)]);
              }
            });
          });
        }),
        (e.prototype.createJournalEntry = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r, i, o, s;
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
                    (i = new C.CreateJournalEntryRequest().getBody(e, t)),
                    this.logTallyReqAndRes("Journal tally request::" + i),
                    (r.body = new Buffer(i, "ucs2")),
                    [4, this.postRequest(r, !1)]
                  );
                case 4:
                  return (
                    (o = a.sent()),
                    this.logTallyReqAndRes("Journal tally response::" + o.body),
                    [4, O.parse(o.body)]
                  );
                case 5:
                  return ((s = a.sent()), [2, new C.CreateJournalEntryResponse().parse(s)]);
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
            D.Util.isNotNull(e) &&
              (D.Util.isNotNull(e.port) && (r.port = e.port),
              D.Util.isNotNull(e.host) && (r.host = e.host)),
            r
          );
        }),
        (e.prototype.checkCompanyStatus = function (t) {
          return i(this, void 0, void 0, function () {
            var r, i, o;
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
                    D.Log.info(r),
                    D.Util.isNotNull(r)
                      ? D.Util.isNotNull(r.message) &&
                        r.message.includes(c.default.TALLY_IS_NOT_OPEN)
                        ? (i = this.getTallySetting()).host !== c.default.LOCALHOST
                          ? [3, 4]
                          : [4, e.tallyConnectionDetails(i.port)]
                        : [3, 5]
                      : [3, 5]
                  );
                case 3:
                  return (o = a.sent()).isTallyOpen && !1 === o.isOdbcPortOpen
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
  t.default = z;
};
