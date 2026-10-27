// webpack module #590 (from electron_main_process, BA Mobile Connector 8.4.41)
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
    s = r(29),
    n = r(11),
    u = o.getServerCredentials().API_BASE_URL + "/dataentry",
    p = u + "/get_transaction_entries_desktop",
    c = u + "/update_transaction_entries",
    m = u + "/delete_transaction_entries";
  function l(e, t, r, u) {
    return i(this, void 0, void 0, function () {
      var i, c, m;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            if (o.isNull(e) || o.isEmpty(e)) throw new Error("companyId is not defined");
            return (
              (i = p + "/" + e),
              (c = { skip: r, limit: u }),
              (m = s.getRequestOptions(i, c, null, t, n.default.API_TIMEOUT)),
              [4, s.getRequest(m)]
            );
          case 1:
            return [2, a.sent()];
        }
      });
    });
  }
  ((t.getTransactionList = l),
    (t.updateTransactionEntryList = function (e, t) {
      return i(this, void 0, void 0, function () {
        var r, i, o;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              return (
                (r = c),
                (i = { userId: e.id, entries: t }),
                (o = s.getRequestOptions(r, null, i, e, n.default.API_TIMEOUT)),
                [4, s.putRequest(o)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }),
    (t.deleteTransaction = function (e, t) {
      return i(this, void 0, void 0, function () {
        var r, i, o;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              return (
                (r = m),
                (i = { userId: e.id, entries: t }),
                (o = s.getRequestOptions(r, null, i, e, n.default.API_TIMEOUT)),
                [4, s.deleteRequest(o)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }),
    (t.fetchAllTransactions = function (e, t) {
      var r = this,
        s = 0,
        n = [],
        u = !0;
      return new Promise(function (p, c) {
        return i(r, void 0, void 0, function () {
          var r, i, m;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                if (!u) return [3, 5];
                a.label = 1;
              case 1:
                return (a.trys.push([1, 3, , 4]), [4, l(e, t, s, 200)]);
              case 2:
                return (
                  (r = a.sent()),
                  (i = r.entries),
                  (n = n.concat(i)),
                  (s = n.length),
                  !1 === (200 <= i.length && i.length > 0) ? ((u = !1), [3, 5]) : [3, 4]
                );
              case 3:
                return ((m = a.sent()), (u = !1), o.isNotNull(m) && c(m), [3, 5]);
              case 4:
                return [3, 0];
              case 5:
                return (p(n), [2]);
            }
          });
        });
      });
    }));
};
