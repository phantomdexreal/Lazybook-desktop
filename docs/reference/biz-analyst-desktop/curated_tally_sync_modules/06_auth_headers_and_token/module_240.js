// webpack module #240 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

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
              for (; o; )
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
                      return o.label++, { value: i[1], done: !1 };
                    case 5:
                      o.label++, (n = i[1]), (i = [0]);
                      continue;
                    case 7:
                      (i = o.ops.pop()), o.trys.pop();
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
                        (o.label = a[1]), (a = i);
                        break;
                      }
                      if (a && o.label < a[2]) {
                        (o.label = a[2]), o.ops.push(i);
                        break;
                      }
                      a[2] && o.ops.pop(), o.trys.pop();
                      continue;
                  }
                  i = t.call(e, o);
                } catch (e) {
                  (i = [6, e]), (n = 0);
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
  var i = r(11),
    o = r(26),
    s = r(8),
    u = r(29),
    p = r(23),
    c = r(0),
    l = r(23),
    m = i.getServerCredentials().API_BASE_URL,
    d = m + "/user",
    y = d + "/signin",
    b = d + "/reset/password",
    h = d + "/partner",
    f = d + "/id",
    g = d + "/check/email",
    M = d + "/logout/desktop",
    S = d + "/generate/otp",
    A = d + "/verify/otp",
    O = d + "/token/publish",
    N = d + "/token",
    v = d + "/session",
    T = m + "/partner" + "/account";
  function z() {
    return n(this, void 0, void 0, function () {
      var e, t, r, n;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            "https://api.ipify.org/",
              (e = { format: "json" }),
              (t = l.getUnauthorizedRequestOptions("https://api.ipify.org/", e)),
              (a.label = 1);
          case 1:
            return a.trys.push([1, 3, , 4]), [4, p.getRequest(t)];
          case 2:
            return (r = a.sent()), i.isNull(r) ? [2, null] : [2, r.ip];
          case 3:
            return (n = a.sent()), c.Log.error("Error fetching ip: "), c.Log.error(n), [2, null];
          case 4:
            return [2];
        }
      });
    });
  }
  function I(e) {
    return n(this, void 0, void 0, function () {
      var t, r, n, o;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            if (i.isNull(e) || i.isNull(e.id)) throw new Error("User id not specified");
            return (
              (t = f),
              (r = { id: e.id }),
              (n = p.getRequestOptions(t, r, null, e)),
              [4, p.getRequest(n)]
            );
          case 1:
            return (o = a.sent()), u.User.save(o), [2, o];
        }
      });
    });
  }
  function q(e) {
    return n(this, void 0, void 0, function () {
      var t, r, n;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            if (i.isNull(e) || i.isNull(e.partnerCode))
              throw new Error("Partner code is not specified");
            return (t = h), (r = {}), (n = p.getRequestOptions(t, r, e)), [4, p.putRequest(n)];
          case 1:
            return [2, a.sent()];
        }
      });
    });
  }
  (t.checkEmailExist = function (e) {
    return n(this, void 0, void 0, function () {
      var t, r, n;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            if (i.isNull(e) || i.isNull(e.email)) throw new Error("Email is not defined");
            return (
              (t = g),
              (r = { email: e.email }),
              (n = l.getUnauthorizedRequestOptions(t, r)),
              [4, p.getRequest(n)]
            );
          case 1:
            return [2, a.sent()];
        }
      });
    });
  }),
    (t.signin = function (e) {
      return n(this, void 0, void 0, function () {
        var t, r, n, o;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (i.isNull(e) || i.isNull(e.email) || i.isNull(e.password))
                throw new Error("User is not defined");
              return (
                (t = y),
                (r = { version: 1, source: s.default.DESKTOP }),
                (n = l.getUnauthorizedRequestOptions(t, r, e)),
                [4, p.postRequest(n)]
              );
            case 1:
              return (o = a.sent()), u.User.save(o), u.User.saveToken(o.userToken.token), [2, o];
          }
        });
      });
    }),
    (t.signup = function (e) {
      return n(this, void 0, void 0, function () {
        var t, r, n, o, c;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (i.isNull(e) || i.isNull(e.email) || i.isNull(e.password))
                throw new Error("Required fields not present");
              return [4, z()];
            case 1:
              (t = a.sent()),
                i.isNotNull(t) && (e.ipAddress = t),
                (e.subscriptionVersion = s.default.SUBSCRIPTION_VERSION),
                (r = d),
                (n = { version: 1, source: s.default.DESKTOP }),
                (o = l.getUnauthorizedRequestOptions(r, n, e)),
                !0,
                (a.label = 2);
            case 2:
              return a.trys.push([2, 4, , 5]), [4, p.postRequest(o)];
            case 3:
              return (c = a.sent()), [3, 5];
            case 4:
              throw a.sent();
            case 5:
              return u.User.save(c), u.User.saveToken(c.userToken.token), [2, c];
          }
        });
      });
    }),
    (t.getIp = z),
    (t.resetPassword = function (e) {
      return n(this, void 0, void 0, function () {
        var t, r, n;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (i.isNull(e) || i.isNull(e.email)) throw new Error("Email not specified");
              return (
                (t = b),
                (r = {}),
                (n = l.getUnauthorizedRequestOptions(t, r, e)),
                [4, p.postRequest(n)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }),
    (t.getUserById = I),
    (t.addPartnerCode = q),
    (t.addPartnerCodeWrapper = function (e) {
      return n(this, void 0, void 0, function () {
        var t, r;
        return a(this, function (n) {
          switch (n.label) {
            case 0:
              if (i.isNull(e) || i.isNull(e.partnerCode))
                throw new Error("Partner code is not specified");
              return [4, q(e)];
            case 1:
              return (
                (t = n.sent()),
                i.isNotNull(t) && t.message === s.default.SUCCESS ? [4, I(e)] : [3, 3]
              );
            case 2:
              if (
                ((r = n.sent()),
                i.isNotNull(r) && (u.User.save(r), r.partnerCode !== e.partnerCode))
              )
                throw new Error("Failed to update partner code.");
              return [2, e];
            case 3:
              throw new Error(
                "Something went wrong adding the partner code, please try again. If the problem persists contact us at help@siliconveins.com"
              );
          }
        });
      });
    }),
    (t.getPartnerByCode = function (e) {
      return n(this, void 0, void 0, function () {
        var t, r, n;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (i.isNull(e)) throw new Error("Partner code not specified");
              return (
                (t = T),
                (r = { code: e, source: s.default.DESKTOP }),
                (n = l.getUnauthorizedRequestOptions(t, r)),
                [4, p.getRequest(n)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }),
    (t.logoutUser = function (e, t) {
      return n(this, void 0, void 0, function () {
        var r, n, s;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (i.isNull(e)) throw new Error("User not found");
              return !0 === t
                ? [3, 2]
                : ((r = M),
                  (n = {}),
                  (s = p.getRequestOptions(r, n, e, e)),
                  [
                    4,
                    p.postRequest(s).catch(function (e) {
                      c.Log.error("Log out api crash " + i.getErrorMessage(e));
                    }),
                  ]);
            case 1:
              a.sent(), (a.label = 2);
            case 2:
              return (
                o.default.delete(o.default.DEVICE),
                o.default.delete(o.default.USER),
                u.User.delete(),
                u.User.deleteToken(),
                [2]
              );
          }
        });
      });
    }),
    (t.otpGenerate = function (e) {
      return n(this, void 0, void 0, function () {
        var t, r, n;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (i.isNull(e)) throw new Error("User is not defined");
              (t = S), (r = { userId: e }), (n = p.getRequestOptions(t, null, r)), (a.label = 1);
            case 1:
              return a.trys.push([1, 3, , 4]), [4, p.postRequest(n)];
            case 2:
              return [2, a.sent()];
            case 3:
              throw a.sent();
            case 4:
              return [2];
          }
        });
      });
    }),
    (t.otpVerify = function (e, t) {
      return n(this, void 0, void 0, function () {
        var r, n, o;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (i.isNull(e)) throw new Error("User is not defined");
              (r = A),
                (n = { userId: e, otp: t }),
                (o = p.getRequestOptions(r, null, n)),
                (a.label = 1);
            case 1:
              return a.trys.push([1, 3, , 4]), [4, p.postRequest(o)];
            case 2:
              return [2, a.sent()];
            case 3:
              throw a.sent();
            case 4:
              return [2];
          }
        });
      });
    }),
    (t.publishToken = function (e, t) {
      return n(this, void 0, void 0, function () {
        var r, n, o;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (i.isNull(e)) throw new Error("Token is not define");
              (r = O),
                (n = { token: e, source: s.default.DESKTOP, userId: t }),
                (o = p.getRequestOptions(r, null, n)),
                (a.label = 1);
            case 1:
              return a.trys.push([1, 3, , 4]), [4, p.postRequest(o)];
            case 2:
              return [2, a.sent()];
            case 3:
              throw a.sent();
            case 4:
              return [2];
          }
        });
      });
    }),
    (t.refreshToken = function (e) {
      return n(this, void 0, void 0, function () {
        var t, r;
        return a(this, function (n) {
          switch (n.label) {
            case 0:
              (t = { userId: e, source: s.default.DESKTOP }),
                (r = p.getRequestOptions(N, t)),
                (n.label = 1);
            case 1:
              return n.trys.push([1, 3, , 4]), [4, p.getRequest(r)];
            case 2:
              return [2, n.sent()];
            case 3:
              throw n.sent();
            case 4:
              return [2];
          }
        });
      });
    }),
    (t.generateSessionId = function (e) {
      return n(this, void 0, void 0, function () {
        var t, r, n;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (i.isNull(e)) throw new Error("User is not defined");
              (t = v), (r = { id: e }), (n = p.getRequestOptions(t, null, r)), (a.label = 1);
            case 1:
              return a.trys.push([1, 3, , 4]), [4, p.putRequest(n)];
            case 2:
              return [2, a.sent()];
            case 3:
              throw a.sent();
            case 4:
              return [2];
          }
        });
      });
    }),
    (t.getPaymentUrl = function (e) {
      return s.default.PAYMENT_SESSION_URL + e;
    });
};
