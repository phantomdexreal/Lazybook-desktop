// webpack module #581 (from background_worker, BA Mobile Connector 8.4.41)
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
  var i = r(11),
    o = r(8),
    s = r(23),
    u = i.getServerCredentials().API_BASE_URL + "/dataentrytrio",
    p = u + "/journal",
    c = u + "/journal/desktop",
    l = u + "/journal/failed",
    m = u + "/journal";
  function d(e, t, r, u) {
    return n(this, void 0, void 0, function () {
      var n, p, l;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            if (i.isNull(e) || i.isEmpty(e)) throw new Error("companyId is not defined");
            return (
              (n = c + "/" + e),
              (p = { skip: r, limit: u }),
              (l = s.getRequestOptions(n, p, null, t, o.default.API_TIMEOUT)),
              [4, s.getRequest(l)]
            );
          case 1:
            return [2, a.sent()];
        }
      });
    });
  }
  function y(e, t, r, u) {
    return n(this, void 0, void 0, function () {
      var n, p, c;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            if (i.isNull(e) || i.isEmpty(e)) throw new Error("companyId is not defined");
            return (
              (n = l + "/" + e),
              (p = { skip: r, limit: u }),
              (c = s.getRequestOptions(n, p, null, t, o.default.API_TIMEOUT)),
              [4, s.getRequest(c)]
            );
          case 1:
            return [2, a.sent()];
        }
      });
    });
  }
  ((t.updateJournalAPI = function (e, t, r) {
    return n(this, void 0, void 0, function () {
      var n, i, u;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            return (
              (n = p),
              (i = { companyId: r.companyId, entries: t }),
              (u = s.getRequestOptions(n, null, i, e, o.default.API_TIMEOUT)),
              [4, s.putRequest(u)]
            );
          case 1:
            return [2, a.sent()];
        }
      });
    });
  }),
    (t.getJournalAPI = d),
    (t.fetchAllJournalAPI = function (e, t) {
      var r = this,
        o = 0,
        s = [],
        u = !0;
      return new Promise(function (p, c) {
        return n(r, void 0, void 0, function () {
          var r, n, l;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                if (!u) return [3, 5];
                a.label = 1;
              case 1:
                return (a.trys.push([1, 3, , 4]), [4, d(e, t, o, 200)]);
              case 2:
                return (
                  (r = a.sent()),
                  (n = r.entries),
                  (s = s.concat(n)),
                  (o = s.length),
                  !1 === (200 <= n.length && n.length > 0) ? ((u = !1), [3, 5]) : [3, 4]
                );
              case 3:
                return ((l = a.sent()), (u = !1), i.isNotNull(l) && c(l), [3, 5]);
              case 4:
                return [3, 0];
              case 5:
                return (p(s), [2]);
            }
          });
        });
      });
    }),
    (t.deleteJournalEntryAPI = function (e, t, r) {
      return n(this, void 0, void 0, function () {
        var n, i, u;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              return (
                (n = m),
                (i = { userId: e.id, entries: t, companyId: r.companyId }),
                (u = s.getRequestOptions(n, null, i, e, o.default.API_TIMEOUT)),
                [4, s.deleteRequest(u)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }),
    (t.getFailJournalAPI = y),
    (t.fetchAllFailJournaAPI = function (e, t) {
      var r = this,
        o = 0,
        s = [];
      return new Promise(function (u, p) {
        return n(r, void 0, void 0, function () {
          var r, n, c;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                (0, (a.label = 1));
              case 1:
                return (a.trys.push([1, 3, , 4]), [4, y(e, t, o, 200)]);
              case 2:
                return (
                  (r = a.sent()),
                  (n = r.entries),
                  (s = s.concat(n)),
                  (o = s.length),
                  !1 === (200 <= n.length && n.length > 0) ? [3, 5] : [3, 4]
                );
              case 3:
                return ((c = a.sent()), i.isNotNull(c) && p(c), [3, 5]);
              case 4:
                return [3, 0];
              case 5:
                return (u(s), [2]);
            }
          });
        });
      });
    }));
};
