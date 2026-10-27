// webpack module #233 (from electron_main_process, BA Mobile Connector 8.4.41)
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
    s = r(11),
    n = r(29),
    u = r(154),
    p = o.getServerCredentials().API_BASE_URL + "/dataentry",
    c = p + "/get_order_entries_desktop",
    m = p + "/update_order_entries",
    l = p + "/get_entries_count",
    d = p + "/delete_order_entries",
    y = p + "/failed_entries/company",
    b = p + "/get_all_entries_desktop";
  function h(e, t, r, u) {
    return i(this, void 0, void 0, function () {
      var i, p, m;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            if (o.isNull(e) || o.isEmpty(e)) throw new Error("companyId is not defined");
            return (
              (i = c + "/" + e),
              (p = { skip: r, limit: u }),
              (m = n.getRequestOptions(i, p, null, t, s.default.API_TIMEOUT)),
              [4, n.getRequest(m)]
            );
          case 1:
            return [2, a.sent()];
        }
      });
    });
  }
  function g(e, t, r, o, u) {
    return i(this, void 0, void 0, function () {
      var i, p;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            return (
              (i = y + "/" + e),
              (p = n.getRequestOptions(
                i,
                { entryType: r, skip: o, limit: u },
                null,
                t,
                s.default.API_TIMEOUT,
              )),
              [4, n.getRequest(p)]
            );
          case 1:
            return [2, a.sent()];
        }
      });
    });
  }
  ((t.getOrderEntryList = h),
    (t.updateOrderEntryList = function (e, t) {
      return i(this, void 0, void 0, function () {
        var r, i, o;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              return (
                (r = m),
                (i = { userId: e.id, entries: t }),
                (o = n.getRequestOptions(r, null, i, e, s.default.API_TIMEOUT)),
                [4, u.putRequest(o)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }),
    (t.getOrdersCount = function (e, t) {
      return i(this, void 0, void 0, function () {
        var r, i;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (o.isNull(e) || o.isEmpty(e)) throw new Error("companyId is not defined");
              return (
                (r = l + "/" + e),
                (i = n.getRequestOptions(r, null, null, t, s.default.API_TIMEOUT)),
                [4, n.getRequest(i)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }),
    (t.deleteOrders = function (e, t) {
      return i(this, void 0, void 0, function () {
        var r, i, o;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              return (
                (r = d),
                (i = { userId: e.id, entries: t }),
                (o = n.getRequestOptions(r, null, i, e, s.default.API_TIMEOUT)),
                [4, n.deleteRequest(o)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }),
    (t.getFailEntries = g),
    (t.fetchAllOrders = function (e, t) {
      return i(this, void 0, void 0, function () {
        var r,
          s,
          n,
          u = this;
        return a(this, function (p) {
          return (
            (r = 0),
            200,
            (s = []),
            (n = !0),
            [
              2,
              new Promise(function (p, c) {
                return i(u, void 0, void 0, function () {
                  var i, u, m;
                  return a(this, function (a) {
                    switch (a.label) {
                      case 0:
                        if (!n) return [3, 5];
                        a.label = 1;
                      case 1:
                        return (a.trys.push([1, 3, , 4]), [4, h(e, t, r, 200)]);
                      case 2:
                        return (
                          (i = a.sent()),
                          (u = i.entries),
                          (s = s.concat(u)),
                          (r = s.length),
                          !1 === (200 <= u.length && u.length > 0) ? ((n = !1), [3, 5]) : [3, 4]
                        );
                      case 3:
                        return ((m = a.sent()), (n = !1), o.isNotNull(m) && c(m), [3, 5]);
                      case 4:
                        return [3, 0];
                      case 5:
                        return (p(s), [2]);
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
      var s = this,
        n = 0,
        u = [],
        p = !0;
      return new Promise(function (c, m) {
        return i(s, void 0, void 0, function () {
          var i, s, l;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                if (!p) return [3, 5];
                a.label = 1;
              case 1:
                return (a.trys.push([1, 3, , 4]), [4, g(e, t, r, n, 200)]);
              case 2:
                return (
                  (i = a.sent()),
                  (s = i.entries),
                  (u = u.concat(s)),
                  (n = u.length),
                  !1 === (200 <= s.length && s.length > 0) ? ((p = !1), [3, 5]) : [3, 4]
                );
              case 3:
                return ((l = a.sent()), (p = !1), o.isNotNull(l) && m(l), [3, 5]);
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
      return i(this, void 0, void 0, function () {
        var i, p, c;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              if (o.isNull(e) || o.isEmpty(e)) throw new Error("companyId is not defined");
              return (
                (i = b + "/" + e),
                (p = { skip: t, limit: r }),
                (c = n.getRequestOptions(i, p, null, u, s.default.API_TIMEOUT)),
                [4, n.getRequest(c)]
              );
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }));
};
