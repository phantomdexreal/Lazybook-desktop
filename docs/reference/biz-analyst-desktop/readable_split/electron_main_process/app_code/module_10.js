// webpack module #10 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var o = r(64),
    s = r(24),
    n = r(11),
    u = r(28),
    p = r(2);
  function c(e) {
    return null == e;
  }
  function m(e) {
    return !c(e);
  }
  function l(e) {
    return (m(e) && (e = g(e) ? e.trim() : e), o.isEmpty(e));
  }
  function d(e) {
    return !l(e);
  }
  function y(e) {
    for (var t in e) if (e.hasOwnProperty(t)) return !1;
    return !0;
  }
  function b(e) {
    return o.isArray(e);
  }
  function h(e) {
    return o.isNumber(e);
  }
  function g(e) {
    return o.isString(e);
  }
  function S(e) {
    return o.isNaN(e);
  }
  function f(e) {
    return i(this, void 0, void 0, function () {
      return a(this, function (t) {
        return [
          2,
          new Promise(function (t, r) {
            setTimeout(function () {
              t();
            }, e);
          }),
        ];
      });
    });
  }
  function A(e) {
    var t;
    if (m(e)) {
      var r = parseInt(e);
      S(r) || (t = r);
    }
    return t;
  }
  function N(e) {
    return JSON.stringify(e).length;
  }
  function I(e, t) {
    var r,
      i = {},
      a = [];
    if (0 === Object.keys(e).length) return a;
    for (var o in e) N(i) < t ? (i[o] = e[o]) : (a.push(i), ((r = {})[o] = e[o]), (i = r));
    return (Object.keys(i).length > 0 && a.unshift(i), a);
  }
  ((t.isNull = c),
    (t.isNotNull = m),
    (t.isEmptyString = l),
    (t.isNotEmptyString = d),
    (t.isEmpty = y),
    (t.isEmptyObject = function (e) {
      return o.isEmpty(e);
    }),
    (t.isNotEmpty = function (e) {
      return !y(e);
    }),
    (t.isObject = function (e) {
      return o.isObject(e);
    }),
    (t.isArray = b),
    (t.isNumber = h),
    (t.isString = g),
    (t.isBoolean = function (e) {
      return o.isBoolean(e);
    }),
    (t.isNaN = S),
    (t.sleep = f),
    (t.assign = function (e, t) {
      o.assign(e, t);
    }),
    (t.getMonth = function (e) {
      switch (e) {
        case 1:
          return n.default.JAN_MONTH;
        case 2:
          return n.default.FEB_MONTH;
        case 3:
          return n.default.MAR_MONTH;
        case 4:
          return n.default.APR_MONTH;
        case 5:
          return n.default.MAY_MONTH;
        case 6:
          return n.default.JUN_MONTH;
        case 7:
          return n.default.JUL_MONTH;
        case 8:
          return n.default.AUG_MONTH;
        case 9:
          return n.default.SEP_MONTH;
        case 10:
          return n.default.OCT_MONTH;
        case 11:
          return n.default.NOV_MONTH;
        case 12:
          return n.default.DEC_MONTH;
      }
    }),
    (t.currencyFormat = function (e, t) {
      if (c(e)) return "0";
      var r = e.toString(),
        i = "";
      r.indexOf(".") > 0 && (i = r.substring(r.indexOf("."), r.length));
      var a = (r = Math.floor(parseFloat(r)).toString()).substring(r.length - 3),
        o = r.substring(0, r.length - 3);
      return ("" !== o && (a = "," + a), o.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + a + i);
    }),
    (t.isFilledArray = function (e) {
      return !!(m(e) && b(e) && e.length > 0);
    }),
    (t.getServerCredentials = function () {
      switch (n.default.STAGE) {
        case n.default.STAGE_ALPHA:
          return n.default.SERVER_CREDENTIALS.ALPHA;
        case n.default.STAGE_DEV:
          return n.default.SERVER_CREDENTIALS.DEV;
        case n.default.STAGE_PRODUCTION:
          return n.default.SERVER_CREDENTIALS.PRODUCTION;
        case n.default.STAGE_DEVSTACK:
          return n.default.SERVER_CREDENTIALS.DEV_STACK;
      }
    }),
    (t.arrayDiffrence = function (e, t, r) {
      var i = o.isEqual;
      return (o.isFunction(r) && (i = r), o.differenceWith(e, t, i));
    }),
    (t.wrapperPromiseAll = function (e) {
      return i(this, void 0, void 0, function () {
        var t, r, i, o, s, n, u;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              ((t = []), (r = 0), (a.label = 1));
            case 1:
              return r < e.length
                ? ((i = e.slice(r, Math.min(e.length, r + 10))), [4, Promise.all(i)])
                : [3, 4];
            case 2:
              for (o = a.sent(), s = 0, n = o; s < n.length; s++) ((u = n[s]), t.push(u));
              a.label = 3;
            case 3:
              return ((r += 10), [3, 1]);
            case 4:
              return [2, t];
          }
        });
      });
    }),
    (t.getAuthHeader = function (e) {
      var t;
      t = m(e) && !y(e) ? e : u.User.get();
      var r,
        i = u.User.getToken(),
        a = null;
      if (m(t) && !y(t) && m(i)) {
        r = t;
        var o = new u.AuthObject();
        ((o.Authorization = i.token), (o.userid = r.id), (o.source = n.default.APP_TYPE.DESKTOP));
        var p = s.default.get(s.default.DEVICE);
        (m(p) && !y(p) && p.userId === r.id && (o.deviceid = p.deviceId), (a = o));
      }
      return a;
    }),
    (t.deepClone = function (e) {
      return JSON.parse(JSON.stringify(e));
    }),
    (t.isEqual = function (e, t) {
      return o.isEqual(e, t);
    }),
    (t.restartApp = function (e) {
      (e.relaunch({ args: process.argv.slice(1).concat(["--relaunch"]) }), e.exit(0));
    }),
    (t.parseNumber = A),
    (t.parseVersion = function (e) {
      var t = 0;
      return (m(e) && (t = A((e = e.replace(/\D/g, "")))), t);
    }),
    (t.retryFunction = function e(t, r, o, s, n, u) {
      return (
        void 0 === o && (o = 2),
        void 0 === s && (s = 1e4),
        void 0 === n && (n = 1),
        i(this, void 0, void 0, function () {
          var i;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (a.trys.push([0, 2, , 6]), [4, t.apply(void 0, r)]);
              case 1:
                return [2, a.sent()];
              case 2:
                return (
                  (i = a.sent()),
                  ++n <= o
                    ? (p.Log.info(
                        "Failed to execute " +
                          u +
                          " function. Will retry after " +
                          (s * n) / 1e3 +
                          "sec . Try " +
                          n +
                          "s of " +
                          o,
                      ),
                      [4, f(s * n)])
                    : [3, 4]
                );
              case 3:
                return (a.sent(), [2, e(t, r, o, s, n, u)]);
              case 4:
                throw i;
              case 5:
                return [3, 6];
              case 6:
                return [2];
            }
          });
        })
      );
    }),
    (t.retryFunctionUtilDataFound = function e(t, r, o, s, n, u) {
      return (
        void 0 === o && (o = 2),
        void 0 === s && (s = 1e4),
        void 0 === n && (n = 1),
        i(this, void 0, void 0, function () {
          var i;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return (a.trys.push([0, 4, , 8]), [4, t.apply(void 0, r)]);
              case 1:
                return c((i = a.sent())) && ++n <= o
                  ? (p.Log.info(
                      "Failed to execute " +
                        u +
                        " function. Will retry after " +
                        (s * n) / 1e3 +
                        "sec . Try " +
                        n +
                        "s of " +
                        o,
                    ),
                    [4, f(s * n)])
                  : [3, 3];
              case 2:
                return (a.sent(), [2, e(t, r, o, s, n, u)]);
              case 3:
                return [2, i];
              case 4:
                return (
                  a.sent(),
                  ++n <= o
                    ? (p.Log.info(
                        "Failed to execute " +
                          u +
                          " function. Will retry after " +
                          (s * n) / 1e3 +
                          "sec . Try " +
                          n +
                          "s of " +
                          o,
                      ),
                      [4, f(s * n)])
                    : [3, 6]
                );
              case 5:
                return (a.sent(), [2, e(t, r, o, s, n, u)]);
              case 6:
                return [2, null];
              case 7:
                return [3, 8];
              case 8:
                return [2];
            }
          });
        })
      );
    }),
    (t.promisifyFunction = function (e) {
      for (var t = [], r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
      return i(this, void 0, void 0, function () {
        return a(this, function (r) {
          return [
            2,
            new Promise(function (r, i) {
              e.apply(
                void 0,
                t.concat([
                  function (e, t) {
                    m(e) ? i(e) : r(t);
                  },
                ]),
              );
            }),
          ];
        });
      });
    }),
    (t.getObjectSize = N),
    (t.createObjectChunk = I),
    (t.createObjectChunkForMaster = function (e, t) {
      var r;
      if (0 === Object.keys(e).length) return [];
      for (var i = [], a = 0, o = Object.keys(e); a < o.length; a++)
        for (var s = o[a], n = 0, u = I(e[s], t); n < u.length; n++) {
          var p = u[n];
          i.push((((r = {})[s] = p), r));
        }
      return i;
    }),
    (t.removeSlashFromPath = function (e) {
      if (l(e)) return e;
      var t = e.replace(/\\/g, "");
      return (t = t.replace(/\//g, "")).toLowerCase();
    }),
    (t.breakStringToArr = function (e) {
      return d(e) ? e.match(/.{1,50}/g) : [];
    }),
    (t.isPositiveNumber = function (e) {
      return h(e) && e > 0;
    }),
    (t.isValidNaturalNumber = function (e) {
      return h(e) && e >= 0;
    }),
    (t.getErrorMessage = function (e) {
      return m(e) && e instanceof Error
        ? "Name " + e.name + " | Message " + e.message + " | Stack " + e.stack
        : JSON.stringify(e);
    }),
    (t.removeSpecialChar = function (e) {
      if (l(e)) return e;
      for (var t = 0, r = n.default.DATA_ENTRY_SPECIAL_CHAR_LIST; t < r.length; t++) {
        var i = r[t];
        e = e.replace(i, "");
      }
      return e;
    }),
    (t.isInvalidCharacterError = function (e) {
      if (c(e)) return !1;
      var t = e instanceof Error ? e.message : "string" == typeof e ? e : e.message;
      return d(t) && -1 !== t.indexOf("Invalid character in string");
    }),
    (t.removeInvalidXmlChars = function e(t) {
      if ("string" == typeof t) {
        for (
          var r = t, i = 0, a = n.default.DATA_ENTRY_SPECIAL_CHAR_LIST_RETRY;
          i < a.length;
          i++
        ) {
          var o = a[i];
          r = r.replace(o, " ");
        }
        return r;
      }
      if (Array.isArray(t)) {
        for (var s = 0; s < t.length; s++) t[s] = e(t[s]);
        return t;
      }
      if (m(t) && "object" == typeof t) {
        for (var u = 0, p = Object.keys(t); u < p.length; u++) {
          var c = p[u];
          t[c] = e(t[c]);
        }
        return t;
      }
      return t;
    }),
    (t.getDeviceId = function () {
      var e = s.default.get(s.default.DEVICE);
      return m(e) && !y(e) ? e.deviceId : null;
    }),
    (t.checkObjectDiff = function e(t, r) {
      var i = {};
      if (!Object.is(t, r))
        return r && "object" == typeof r
          ? (Object.keys(t || {})
              .concat(Object.keys(r || {}))
              .forEach(function (a) {
                if (
                  (r[a] === t[a] || Object.is(t[a], r[a]) || (i[a] = r[a]),
                  "object" == typeof r[a] && "object" == typeof t[a])
                ) {
                  var o = e(t[a], r[a]);
                  void 0 !== o && (i[a] = o);
                }
              }),
            i)
          : r;
    }),
    (t.getTallyTransportMode = function (e) {
      if (l(e)) return e;
      switch (e.trim()) {
        case "1":
          return "1 - Road";
        case "2":
          return "2 - Rail";
        case "3":
          return "3 - Air";
        case "4":
          return "4 - Ship";
        default:
          return "";
      }
    }),
    (t.getTallyVehicleType = function (e) {
      if (l(e)) return e;
      switch (e.trim().toUpperCase()) {
        case "R":
          return "R - Regular";
        case "O":
          return "O - Over Dimensional Cargo";
        default:
          return "";
      }
    }));
};
