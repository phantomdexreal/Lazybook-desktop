// webpack module #11 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
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
  var i = r(46),
    o = r(26),
    s = r(8),
    u = r(29),
    p = r(0);
  function c(e) {
    return null == e;
  }
  function l(e) {
    return !c(e);
  }
  function m(e) {
    return l(e) && (e = f(e) ? e.trim() : e), i.isEmpty(e);
  }
  function d(e) {
    return !m(e);
  }
  function y(e) {
    for (var t in e) if (e.hasOwnProperty(t)) return !1;
    return !0;
  }
  function b(e) {
    return i.isArray(e);
  }
  function h(e) {
    return i.isNumber(e);
  }
  function f(e) {
    return i.isString(e);
  }
  function g(e) {
    return i.isNaN(e);
  }
  function M(e) {
    return n(this, void 0, void 0, function () {
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
  function S(e) {
    var t;
    if (l(e)) {
      var r = parseInt(e);
      g(r) || (t = r);
    }
    return t;
  }
  function A(e) {
    return JSON.stringify(e).length;
  }
  function O(e, t) {
    var r,
      n = {},
      a = [];
    if (0 === Object.keys(e).length) return a;
    for (var i in e) A(n) < t ? (n[i] = e[i]) : (a.push(n), ((r = {})[i] = e[i]), (n = r));
    return Object.keys(n).length > 0 && a.unshift(n), a;
  }
  (t.isNull = c),
    (t.isNotNull = l),
    (t.isEmptyString = m),
    (t.isNotEmptyString = d),
    (t.isEmpty = y),
    (t.isEmptyObject = function (e) {
      return i.isEmpty(e);
    }),
    (t.isNotEmpty = function (e) {
      return !y(e);
    }),
    (t.isObject = function (e) {
      return i.isObject(e);
    }),
    (t.isArray = b),
    (t.isNumber = h),
    (t.isString = f),
    (t.isBoolean = function (e) {
      return i.isBoolean(e);
    }),
    (t.isNaN = g),
    (t.sleep = M),
    (t.assign = function (e, t) {
      i.assign(e, t);
    }),
    (t.getMonth = function (e) {
      switch (e) {
        case 1:
          return s.default.JAN_MONTH;
        case 2:
          return s.default.FEB_MONTH;
        case 3:
          return s.default.MAR_MONTH;
        case 4:
          return s.default.APR_MONTH;
        case 5:
          return s.default.MAY_MONTH;
        case 6:
          return s.default.JUN_MONTH;
        case 7:
          return s.default.JUL_MONTH;
        case 8:
          return s.default.AUG_MONTH;
        case 9:
          return s.default.SEP_MONTH;
        case 10:
          return s.default.OCT_MONTH;
        case 11:
          return s.default.NOV_MONTH;
        case 12:
          return s.default.DEC_MONTH;
      }
    }),
    (t.currencyFormat = function (e, t) {
      if (c(e)) return "0";
      var r = e.toString(),
        n = "";
      r.indexOf(".") > 0 && (n = r.substring(r.indexOf("."), r.length));
      var a = (r = Math.floor(parseFloat(r)).toString()).substring(r.length - 3),
        i = r.substring(0, r.length - 3);
      return "" !== i && (a = "," + a), i.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + a + n;
    }),
    (t.isFilledArray = function (e) {
      return !!(l(e) && b(e) && e.length > 0);
    }),
    (t.getServerCredentials = function () {
      switch (s.default.STAGE) {
        case s.default.STAGE_ALPHA:
          return s.default.SERVER_CREDENTIALS.ALPHA;
        case s.default.STAGE_DEV:
          return s.default.SERVER_CREDENTIALS.DEV;
        case s.default.STAGE_PRODUCTION:
          return s.default.SERVER_CREDENTIALS.PRODUCTION;
        case s.default.STAGE_DEVSTACK:
          return s.default.SERVER_CREDENTIALS.DEV_STACK;
      }
    }),
    (t.arrayDiffrence = function (e, t, r) {
      var n = i.isEqual;
      return i.isFunction(r) && (n = r), i.differenceWith(e, t, n);
    }),
    (t.wrapperPromiseAll = function (e) {
      return n(this, void 0, void 0, function () {
        var t, r, n, i, o, s, u;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              (t = []), (r = 0), (a.label = 1);
            case 1:
              return r < e.length
                ? ((n = e.slice(r, Math.min(e.length, r + 10))), [4, Promise.all(n)])
                : [3, 4];
            case 2:
              for (i = a.sent(), o = 0, s = i; o < s.length; o++) (u = s[o]), t.push(u);
              a.label = 3;
            case 3:
              return (r += 10), [3, 1];
            case 4:
              return [2, t];
          }
        });
      });
    }),
    (t.getAuthHeader = function (e) {
      var t;
      t = l(e) && !y(e) ? e : u.User.get();
      var r,
        n = u.User.getToken(),
        a = null;
      if (l(t) && !y(t) && l(n)) {
        r = t;
        var i = new u.AuthObject();
        (i.Authorization = n.token), (i.userid = r.id), (i.source = s.default.APP_TYPE.DESKTOP);
        var p = o.default.get(o.default.DEVICE);
        l(p) && !y(p) && p.userId === r.id && (i.deviceid = p.deviceId), (a = i);
      }
      return a;
    }),
    (t.deepClone = function (e) {
      return JSON.parse(JSON.stringify(e));
    }),
    (t.isEqual = function (e, t) {
      return i.isEqual(e, t);
    }),
    (t.restartApp = function (e) {
      e.relaunch({ args: process.argv.slice(1).concat(["--relaunch"]) }), e.exit(0);
    }),
    (t.parseNumber = S),
    (t.parseVersion = function (e) {
      var t = 0;
      return l(e) && (t = S((e = e.replace(/\D/g, "")))), t;
    }),
    (t.retryFunction = function e(t, r, i, o, s, u) {
      return (
        void 0 === i && (i = 2),
        void 0 === o && (o = 1e4),
        void 0 === s && (s = 1),
        n(this, void 0, void 0, function () {
          var n;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return a.trys.push([0, 2, , 6]), [4, t.apply(void 0, r)];
              case 1:
                return [2, a.sent()];
              case 2:
                return (
                  (n = a.sent()),
                  ++s <= i
                    ? (p.Log.info(
                        "Failed to execute " +
                          u +
                          " function. Will retry after " +
                          (o * s) / 1e3 +
                          "sec . Try " +
                          s +
                          "s of " +
                          i
                      ),
                      [4, M(o * s)])
                    : [3, 4]
                );
              case 3:
                return a.sent(), [2, e(t, r, i, o, s, u)];
              case 4:
                throw n;
              case 5:
                return [3, 6];
              case 6:
                return [2];
            }
          });
        })
      );
    }),
    (t.retryFunctionUtilDataFound = function e(t, r, i, o, s, u) {
      return (
        void 0 === i && (i = 2),
        void 0 === o && (o = 1e4),
        void 0 === s && (s = 1),
        n(this, void 0, void 0, function () {
          var n;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                return a.trys.push([0, 4, , 8]), [4, t.apply(void 0, r)];
              case 1:
                return c((n = a.sent())) && ++s <= i
                  ? (p.Log.info(
                      "Failed to execute " +
                        u +
                        " function. Will retry after " +
                        (o * s) / 1e3 +
                        "sec . Try " +
                        s +
                        "s of " +
                        i
                    ),
                    [4, M(o * s)])
                  : [3, 3];
              case 2:
                return a.sent(), [2, e(t, r, i, o, s, u)];
              case 3:
                return [2, n];
              case 4:
                return (
                  a.sent(),
                  ++s <= i
                    ? (p.Log.info(
                        "Failed to execute " +
                          u +
                          " function. Will retry after " +
                          (o * s) / 1e3 +
                          "sec . Try " +
                          s +
                          "s of " +
                          i
                      ),
                      [4, M(o * s)])
                    : [3, 6]
                );
              case 5:
                return a.sent(), [2, e(t, r, i, o, s, u)];
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
      return n(this, void 0, void 0, function () {
        return a(this, function (r) {
          return [
            2,
            new Promise(function (r, n) {
              e.apply(
                void 0,
                t.concat([
                  function (e, t) {
                    l(e) ? n(e) : r(t);
                  },
                ])
              );
            }),
          ];
        });
      });
    }),
    (t.getObjectSize = A),
    (t.createObjectChunk = O),
    (t.createObjectChunkForMaster = function (e, t) {
      var r;
      if (0 === Object.keys(e).length) return [];
      for (var n = [], a = 0, i = Object.keys(e); a < i.length; a++)
        for (var o = i[a], s = 0, u = O(e[o], t); s < u.length; s++) {
          var p = u[s];
          n.push((((r = {})[o] = p), r));
        }
      return n;
    }),
    (t.removeSlashFromPath = function (e) {
      if (m(e)) return e;
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
      return l(e) && e instanceof Error
        ? "Name " + e.name + " | Message " + e.message + " | Stack " + e.stack
        : JSON.stringify(e);
    }),
    (t.removeSpecialChar = function (e) {
      if (m(e)) return e;
      for (var t = 0, r = s.default.DATA_ENTRY_SPECIAL_CHAR_LIST; t < r.length; t++) {
        var n = r[t];
        e = e.replace(n, "");
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
          var r = t, n = 0, a = s.default.DATA_ENTRY_SPECIAL_CHAR_LIST_RETRY;
          n < a.length;
          n++
        ) {
          var i = a[n];
          r = r.replace(i, " ");
        }
        return r;
      }
      if (Array.isArray(t)) {
        for (var o = 0; o < t.length; o++) t[o] = e(t[o]);
        return t;
      }
      if (l(t) && "object" == typeof t) {
        for (var u = 0, p = Object.keys(t); u < p.length; u++) {
          var c = p[u];
          t[c] = e(t[c]);
        }
        return t;
      }
      return t;
    }),
    (t.getDeviceId = function () {
      var e = o.default.get(o.default.DEVICE);
      return l(e) && !y(e) ? e.deviceId : null;
    }),
    (t.checkObjectDiff = function e(t, r) {
      var n = {};
      if (!Object.is(t, r))
        return r && "object" == typeof r
          ? (Object.keys(t || {})
              .concat(Object.keys(r || {}))
              .forEach(function (a) {
                if (
                  (r[a] === t[a] || Object.is(t[a], r[a]) || (n[a] = r[a]),
                  "object" == typeof r[a] && "object" == typeof t[a])
                ) {
                  var i = e(t[a], r[a]);
                  void 0 !== i && (n[a] = i);
                }
              }),
            n)
          : r;
    }),
    (t.getTallyTransportMode = function (e) {
      if (m(e)) return e;
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
      if (m(e)) return e;
      switch (e.trim().toUpperCase()) {
        case "R":
          return "R - Regular";
        case "O":
          return "O - Over Dimensional Cargo";
        default:
          return "";
      }
    });
};
