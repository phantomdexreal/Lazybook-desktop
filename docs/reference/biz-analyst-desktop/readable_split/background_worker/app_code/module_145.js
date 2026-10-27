// webpack module #145 (from background_worker, BA Mobile Connector 8.4.41)
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
    u = r(146),
    p = i.getServerCredentials().API_BASE_URL + "/dataentry",
    c = p + "/get_order_entries_desktop",
    l = p + "/update_order_entries",
    m = p + "/get_entries_count",
    d = p + "/delete_order_entries",
    y = p + "/failed_entries/company",
    b = p + "/get_all_entries_desktop";
  function h(e, t, r, u) {
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
  function f(e, t, r, i, u) {
    return n(this, void 0, void 0, function () {
      var n, p;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            return (
              (n = y + "/" + e),
              (p = s.getRequestOptions(
                n,
                { entryType: r, skip: i, limit: u },
                null,
                t,
                o.default.API_TIMEOUT,
              )),
              [4, s.getRequest(p)]
            );
          case 1:
            return [2, a.sent()];
        }
      });
    });
  }
  ((t.getOrderEntryList = h),
    (t.updateOrderEntryList = function (e, t) {
      return n(this, void 0, void 0, function () {
        var r, n, i;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              return (
                (r = l),
                (n = { userId: e.id, entries: t }),
                (i = s.getRequestOptions(r, null, n, e, o.default.API_TIMEOUT)),
                [4, u.putRequest(i)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }),
    (t.getOrdersCount = function (e, t) {
      return n(this, void 0, void 0, function () {
        var r, n;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (i.isNull(e) || i.isEmpty(e)) throw new Error("companyId is not defined");
              return (
                (r = m + "/" + e),
                (n = s.getRequestOptions(r, null, null, t, o.default.API_TIMEOUT)),
                [4, s.getRequest(n)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }),
    (t.deleteOrders = function (e, t) {
      return n(this, void 0, void 0, function () {
        var r, n, i;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              return (
                (r = d),
                (n = { userId: e.id, entries: t }),
                (i = s.getRequestOptions(r, null, n, e, o.default.API_TIMEOUT)),
                [4, s.deleteRequest(i)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }),
    (t.getFailEntries = f),
    (t.fetchAllOrders = function (e, t) {
      return n(this, void 0, void 0, function () {
        var r,
          o,
          s,
          u = this;
        return a(this, function (p) {
          return (
            (r = 0),
            200,
            (o = []),
            (s = !0),
            [
              2,
              new Promise(function (p, c) {
                return n(u, void 0, void 0, function () {
                  var n, u, l;
                  return a(this, function (a) {
                    switch (a.label) {
                      case 0:
                        if (!s) return [3, 5];
                        a.label = 1;
                      case 1:
                        return (a.trys.push([1, 3, , 4]), [4, h(e, t, r, 200)]);
                      case 2:
                        return (
                          (n = a.sent()),
                          (u = n.entries),
                          (o = o.concat(u)),
                          (r = o.length),
                          !1 === (200 <= u.length && u.length > 0) ? ((s = !1), [3, 5]) : [3, 4]
                        );
                      case 3:
                        return ((l = a.sent()), (s = !1), i.isNotNull(l) && c(l), [3, 5]);
                      case 4:
                        return [3, 0];
                      case 5:
                        return (p(o), [2]);
                    }
                  });
                });
              }),
            ]
          );
        });
      });
    }),
    (t.fetchFailAllEntries = function (e, t, r) {
      var o = this,
        s = 0,
        u = [],
        p = !0;
      return new Promise(function (c, l) {
        return n(o, void 0, void 0, function () {
          var n, o, m;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                if (!p) return [3, 5];
                a.label = 1;
              case 1:
                return (a.trys.push([1, 3, , 4]), [4, f(e, t, r, s, 200)]);
              case 2:
                return (
                  (n = a.sent()),
                  (o = n.entries),
                  (u = u.concat(o)),
                  (s = u.length),
                  !1 === (200 <= o.length && o.length > 0) ? ((p = !1), [3, 5]) : [3, 4]
                );
              case 3:
                return ((m = a.sent()), (p = !1), i.isNotNull(m) && l(m), [3, 5]);
              case 4:
                return [3, 0];
              case 5:
                return (c(u), [2]);
            }
          });
        });
      });
    }),
    (t.fetchAllEntries = function (e, t, r, u) {
      return n(this, void 0, void 0, function () {
        var n, p, c;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (i.isNull(e) || i.isEmpty(e)) throw new Error("companyId is not defined");
              return (
                (n = b + "/" + e),
                (p = { skip: t, limit: r }),
                (c = s.getRequestOptions(n, p, null, u, o.default.API_TIMEOUT)),
                [4, s.getRequest(c)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }));
};
