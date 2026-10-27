// webpack module #162 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var o = r(10),
    s = r(24),
    n = r(11),
    u = r(28),
    p = r(29),
    c = r(2),
    m = r(29),
    l = o.getServerCredentials().API_BASE_URL,
    d = l + "/user",
    y = d + "/signin",
    b = d + "/reset/password",
    h = d + "/partner",
    g = d + "/id",
    S = d + "/check/email",
    f = d + "/logout/desktop",
    A = d + "/generate/otp",
    N = d + "/verify/otp",
    I = d + "/token/publish",
    T = d + "/token",
    M = d + "/session",
    v = l + "/partner" + "/account";
  function k() {
    return i(this, void 0, void 0, function () {
      var e, t, r, i;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            ("https://api.ipify.org/",
              (e = { format: "json" }),
              (t = m.getUnauthorizedRequestOptions("https://api.ipify.org/", e)),
              (a.label = 1));
          case 1:
            return (a.trys.push([1, 3, , 4]), [4, p.getRequest(t)]);
          case 2:
            return ((r = a.sent()), o.isNull(r) ? [2, null] : [2, r.ip]);
          case 3:
            return ((i = a.sent()), c.Log.error("Error fetching ip: "), c.Log.error(i), [2, null]);
          case 4:
            return [2];
        }
      });
    });
  }
  function C(e) {
    return i(this, void 0, void 0, function () {
      var t, r, i, s;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            if (o.isNull(e) || o.isNull(e.id)) throw new Error("User id not specified");
            return (
              (t = g),
              (r = { id: e.id }),
              (i = p.getRequestOptions(t, r, null, e)),
              [4, p.getRequest(i)]
            );
          case 1:
            return ((s = a.sent()), u.User.save(s), [2, s]);
        }
      });
    });
  }
  function q(e) {
    return i(this, void 0, void 0, function () {
      var t, r, i;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            if (o.isNull(e) || o.isNull(e.partnerCode))
              throw new Error("Partner code is not specified");
            return ((t = h), (r = {}), (i = p.getRequestOptions(t, r, e)), [4, p.putRequest(i)]);
          case 1:
            return [2, a.sent()];
        }
      });
    });
  }
  ((t.checkEmailExist = function (e) {
    return i(this, void 0, void 0, function () {
      var t, r, i;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            if (o.isNull(e) || o.isNull(e.email)) throw new Error("Email is not defined");
            return (
              (t = S),
              (r = { email: e.email }),
              (i = m.getUnauthorizedRequestOptions(t, r)),
              [4, p.getRequest(i)]
            );
          case 1:
            return [2, a.sent()];
        }
      });
    });
  }),
    (t.signin = function (e) {
      return i(this, void 0, void 0, function () {
        var t, r, i, s;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (o.isNull(e) || o.isNull(e.email) || o.isNull(e.password))
                throw new Error("User is not defined");
              return (
                (t = y),
                (r = { version: 1, source: n.default.DESKTOP }),
                (i = m.getUnauthorizedRequestOptions(t, r, e)),
                [4, p.postRequest(i)]
              );
            case 1:
              return ((s = a.sent()), u.User.save(s), u.User.saveToken(s.userToken.token), [2, s]);
          }
        });
      });
    }),
    (t.signup = function (e) {
      return i(this, void 0, void 0, function () {
        var t, r, i, s, c;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (o.isNull(e) || o.isNull(e.email) || o.isNull(e.password))
                throw new Error("Required fields not present");
              return [4, k()];
            case 1:
              ((t = a.sent()),
                o.isNotNull(t) && (e.ipAddress = t),
                (e.subscriptionVersion = n.default.SUBSCRIPTION_VERSION),
                (r = d),
                (i = { version: 1, source: n.default.DESKTOP }),
                (s = m.getUnauthorizedRequestOptions(r, i, e)),
                !0,
                (a.label = 2));
            case 2:
              return (a.trys.push([2, 4, , 5]), [4, p.postRequest(s)]);
            case 3:
              return ((c = a.sent()), [3, 5]);
            case 4:
              throw a.sent();
            case 5:
              return (u.User.save(c), u.User.saveToken(c.userToken.token), [2, c]);
          }
        });
      });
    }),
    (t.getIp = k),
    (t.resetPassword = function (e) {
      return i(this, void 0, void 0, function () {
        var t, r, i;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (o.isNull(e) || o.isNull(e.email)) throw new Error("Email not specified");
              return (
                (t = b),
                (r = {}),
                (i = m.getUnauthorizedRequestOptions(t, r, e)),
                [4, p.postRequest(i)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }),
    (t.getUserById = C),
    (t.addPartnerCode = q),
    (t.addPartnerCodeWrapper = function (e) {
      return i(this, void 0, void 0, function () {
        var t, r;
        return a(this, function (i) {
          switch (i.label) {
            case 0:
              if (o.isNull(e) || o.isNull(e.partnerCode))
                throw new Error("Partner code is not specified");
              return [4, q(e)];
            case 1:
              return (
                (t = i.sent()),
                o.isNotNull(t) && t.message === n.default.SUCCESS ? [4, C(e)] : [3, 3]
              );
            case 2:
              if (
                ((r = i.sent()),
                o.isNotNull(r) && (u.User.save(r), r.partnerCode !== e.partnerCode))
              )
                throw new Error("Failed to update partner code.");
              return [2, e];
            case 3:
              throw new Error(
                "Something went wrong adding the partner code, please try again. If the problem persists contact us at help@siliconveins.com",
              );
          }
        });
      });
    }),
    (t.getPartnerByCode = function (e) {
      return i(this, void 0, void 0, function () {
        var t, r, i;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (o.isNull(e)) throw new Error("Partner code not specified");
              return (
                (t = v),
                (r = { code: e, source: n.default.DESKTOP }),
                (i = m.getUnauthorizedRequestOptions(t, r)),
                [4, p.getRequest(i)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }),
    (t.logoutUser = function (e, t) {
      return i(this, void 0, void 0, function () {
        var r, i, n;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (o.isNull(e)) throw new Error("User not found");
              return !0 === t
                ? [3, 2]
                : ((r = f),
                  (i = {}),
                  (n = p.getRequestOptions(r, i, e, e)),
                  [
                    4,
                    p.postRequest(n).catch(function (e) {
                      c.Log.error("Log out api crash " + o.getErrorMessage(e));
                    }),
                  ]);
            case 1:
              (a.sent(), (a.label = 2));
            case 2:
              return (
                s.default.delete(s.default.DEVICE),
                s.default.delete(s.default.USER),
                u.User.delete(),
                u.User.deleteToken(),
                [2]
              );
          }
        });
      });
    }),
    (t.otpGenerate = function (e) {
      return i(this, void 0, void 0, function () {
        var t, r, i;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (o.isNull(e)) throw new Error("User is not defined");
              ((t = A), (r = { userId: e }), (i = p.getRequestOptions(t, null, r)), (a.label = 1));
            case 1:
              return (a.trys.push([1, 3, , 4]), [4, p.postRequest(i)]);
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
      return i(this, void 0, void 0, function () {
        var r, i, s;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (o.isNull(e)) throw new Error("User is not defined");
              ((r = N),
                (i = { userId: e, otp: t }),
                (s = p.getRequestOptions(r, null, i)),
                (a.label = 1));
            case 1:
              return (a.trys.push([1, 3, , 4]), [4, p.postRequest(s)]);
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
      return i(this, void 0, void 0, function () {
        var r, i, s;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (o.isNull(e)) throw new Error("Token is not define");
              ((r = I),
                (i = { token: e, source: n.default.DESKTOP, userId: t }),
                (s = p.getRequestOptions(r, null, i)),
                (a.label = 1));
            case 1:
              return (a.trys.push([1, 3, , 4]), [4, p.postRequest(s)]);
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
      return i(this, void 0, void 0, function () {
        var t, r;
        return a(this, function (i) {
          switch (i.label) {
            case 0:
              ((t = { userId: e, source: n.default.DESKTOP }),
                (r = p.getRequestOptions(T, t)),
                (i.label = 1));
            case 1:
              return (i.trys.push([1, 3, , 4]), [4, p.getRequest(r)]);
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
    (t.generateSessionId = function (e) {
      return i(this, void 0, void 0, function () {
        var t, r, i;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (o.isNull(e)) throw new Error("User is not defined");
              ((t = M), (r = { id: e }), (i = p.getRequestOptions(t, null, r)), (a.label = 1));
            case 1:
              return (a.trys.push([1, 3, , 4]), [4, p.putRequest(i)]);
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
      return n.default.PAYMENT_SESSION_URL + e;
    }));
};
