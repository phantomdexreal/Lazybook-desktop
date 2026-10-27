// webpack module #573 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var i,
    a =
      (this && this.__extends) ||
      ((i = function (e, t) {
        return (i =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (e, t) {
              e.__proto__ = t;
            }) ||
          function (e, t) {
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
          })(e, t);
      }),
      function (e, t) {
        function r() {
          this.constructor = e;
        }
        (i(e, t),
          (e.prototype = null === t ? Object.create(t) : ((r.prototype = t.prototype), new r())));
      }),
    o =
      (this && this.__assign) ||
      function () {
        return (o =
          Object.assign ||
          function (e) {
            for (var t, r = 1, i = arguments.length; r < i; r++)
              for (var a in (t = arguments[r]))
                Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
            return e;
          }).apply(this, arguments);
      },
    s =
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
    n =
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
  var u = r(64),
    p = r(100),
    c = r(11),
    m = r(103),
    l = r(43),
    d = r(49),
    y = r(59),
    b = r(28),
    h = r(2),
    g = r(233),
    S = r(588),
    f = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.getName = function () {
          return t.masterName;
        }),
        (t.prototype.createOrder = function (e, r, i) {
          return l.default.getV1(t, r, i).create(e);
        }),
        (t.prototype.getOrders = function (e, r) {
          return l.default.getV1(t, e, r).findAll(void 0);
        }),
        (t.prototype.getOrderById = function (e, r, i) {
          return l.default.getV1(t, r, i).findOne({ where: { _id: e } });
        }),
        (t.prototype.deleteByIds = function (e, r, i) {
          var a = this;
          return new Promise(function (o, u) {
            var c = l.default.getV1(t, r, i);
            p.eachSeries(
              e,
              function (e, t) {
                return s(a, void 0, void 0, function () {
                  var r, i;
                  return n(this, function (a) {
                    switch (a.label) {
                      case 0:
                        return (
                          a.trys.push([0, 2, , 3]),
                          (r = { where: { _id: e } }),
                          [4, c.destroy(r)]
                        );
                      case 1:
                        return (a.sent(), t(), [3, 3]);
                      case 2:
                        return ((i = a.sent()), h.Util.isNotNull(i) && t(i), [3, 3]);
                      case 3:
                        return [2];
                    }
                  });
                });
              },
              function (e) {
                h.Util.isNotNull(e) ? u(e) : o();
              },
            );
          });
        }),
        (t.prototype.processOrder = function (e, t, r) {
          return s(this, void 0, void 0, function () {
            var i, a, o, s, p, l, d, y, b;
            return n(this, function (n) {
              switch (n.label) {
                case 0:
                  return (
                    (i = e),
                    h.Util.isFilledArray(i)
                      ? (h.Util.isFilledArray(i) &&
                          (i = i.sort(function (e, t) {
                            return e.createdAt - t.createdAt;
                          })),
                        h.Log.info("Fetching order entry into tally-------"),
                        [4, this.insertIntoTallyAndUpdateLocalDb(i, t, r)])
                      : [2]
                  );
                case 1:
                  return (n.sent(), [4, this.getOrders(r.id, t)]);
                case 2:
                  ((a = n.sent()),
                    (o = []),
                    (s = u.chunk(a, c.default.DATA_ENTRY_CHUNK)),
                    (p = 0),
                    (l = s),
                    (n.label = 3));
                case 3:
                  return p < l.length
                    ? ((d = l[p]), [4, this.updateOrderInServerAndDeleteFromLocal(d, r, t)])
                    : [3, 6];
                case 4:
                  ((y = n.sent()), o.push.apply(o, y), (n.label = 5));
                case 5:
                  return (p++, [3, 3]);
                case 6:
                  return (
                    (b = {
                      company: t,
                      dataEntryOps: m.DataEntryOperation.CREATED,
                      orderList: o,
                      userId: r.id,
                      voucherName: m.DataEntryVoucherName.ORDER,
                      voucherType: "orderType",
                    }),
                    [4, m.default.putDataEntryEvent(b)]
                  );
                case 7:
                  return (n.sent(), [2, o]);
              }
            });
          });
        }),
        (t.prototype.insertIntoTallyAndUpdateLocalDb = function (e, t, r) {
          return s(this, void 0, void 0, function () {
            var i,
              a,
              u,
              m,
              l = this;
            return n(this, function (g) {
              switch (g.label) {
                case 0:
                  return ((i = d.default.getInstance()), [4, this.getOrderHash(r.id, t)]);
                case 1:
                  return ((a = g.sent()), [4, i.getTallyProdInfo(S.default.PARAM_BUILD_NUMBER)]);
                case 2:
                  return (
                    (u = g.sent()),
                    (m = !1),
                    h.Util.isNotEmptyString(u) &&
                      !1 === isNaN(parseInt(u)) &&
                      parseInt(u) >= c.default.TALLY_PRIME_3_MIN_BUILD_NUMBER &&
                      (m = !0),
                    0,
                    [
                      2,
                      new Promise(function (u, d) {
                        return s(l, void 0, void 0, function () {
                          var l = this;
                          return n(this, function (g) {
                            return (
                              p.eachSeries(
                                e,
                                function (e, u) {
                                  return s(l, void 0, void 0, function () {
                                    var s, p, l, d, g, S, f, A;
                                    return n(this, function (n) {
                                      switch (n.label) {
                                        case 0:
                                          return (
                                            n.trys.push([0, 16, , 17]),
                                            [4, i.isCompanyOpen(t.tallyCompanyName.trim())]
                                          );
                                        case 1:
                                          return (
                                            (s = n.sent()),
                                            [4, y.checkIfTallyPathHasChange(t)]
                                          );
                                        case 2:
                                          if (((p = n.sent()), !s)) return [3, 14];
                                          if (!1 !== p) return [3, 12];
                                          if (((l = a.get(e._id)), !h.Util.isEmpty(l)))
                                            return [3, 11];
                                          (h.Log.info(
                                            "Inserting into tally------" + JSON.stringify(e),
                                          ),
                                            (d = void 0),
                                            (n.label = 3));
                                        case 3:
                                          return (
                                            n.trys.push([3, 5, , 9]),
                                            [4, i.createOrderEntry(e, t, m)]
                                          );
                                        case 4:
                                          return ((d = n.sent()), [3, 9]);
                                        case 5:
                                          return (
                                            (g = n.sent()),
                                            h.Util.isInvalidCharacterError(g)
                                              ? (h.Log.info(
                                                  "Order insert failed due to invalid character, retrying after removing special characters: " +
                                                    h.Util.getErrorMessage(g),
                                                ),
                                                (e = h.Util.removeInvalidXmlChars(e)),
                                                [4, i.createOrderEntry(e, t, m)])
                                              : [3, 7]
                                          );
                                        case 6:
                                          return ((d = n.sent()), [3, 8]);
                                        case 7:
                                          throw g;
                                        case 8:
                                          return [3, 9];
                                        case 9:
                                          return (
                                            (S = Object.assign(e, o({}, d))),
                                            [4, this.createOrder(S, r.id, t)]
                                          );
                                        case 10:
                                          (n.sent(), (n.label = 11));
                                        case 11:
                                          return (u(), [3, 13]);
                                        case 12:
                                          (h.Log.info(
                                            "While processing company found company path is change",
                                          ),
                                            ((f = new b.ErrorMessage()).message =
                                              t.name + " " + c.default.SYNC_DATA_ISSUE),
                                            u(f),
                                            (n.label = 13));
                                        case 13:
                                          return [3, 15];
                                        case 14:
                                          (h.Log.info(
                                            "While processing company found company is close",
                                          ),
                                            ((f = new b.ErrorMessage()).message =
                                              "Company " +
                                              t.name +
                                              "  is currently not open in tally."),
                                            u(f),
                                            (n.label = 15));
                                        case 15:
                                          return [3, 17];
                                        case 16:
                                          return (
                                            (A = n.sent()),
                                            h.Log.info("Order process error occure" + A),
                                            h.Util.isNotNull(A) ? u(A) : u(),
                                            [3, 17]
                                          );
                                        case 17:
                                          return [2];
                                      }
                                    });
                                  });
                                },
                                function (e) {
                                  h.Util.isNotNull(e) ? d(e) : u();
                                },
                              ),
                              [2]
                            );
                          });
                        });
                      }),
                    ]
                  );
              }
            });
          });
        }),
        (t.prototype.getOrderHash = function (e, t) {
          return s(this, void 0, void 0, function () {
            var r, i;
            return n(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.getOrders(e, t)];
                case 1:
                  return (
                    (r = a.sent()),
                    (i = new Map()),
                    h.Util.isFilledArray(r) &&
                      r.forEach(function (e) {
                        i.set(e._id, e);
                      }),
                    [2, i]
                  );
              }
            });
          });
        }),
        (t.prototype.updateOrderInServerAndDeleteFromLocal = function (e, t, r) {
          return s(this, void 0, void 0, function () {
            var i, a, o, s;
            return n(this, function (n) {
              switch (n.label) {
                case 0:
                  return h.Util.isFilledArray(e) ? [4, g.updateOrderEntryList(t, e)] : [2];
                case 1:
                  return (
                    (i = n.sent()),
                    h.Log.info("Order updated to Server " + JSON.stringify(i)),
                    h.Util.isNotNull(i)
                      ? ((a = e.slice()),
                        h.Util.isFilledArray(i.failedEntryIds) &&
                          (a = h.Util.arrayDiffrence(a, i.failedEntryIds, function (e, t) {
                            return e._id === t;
                          })),
                        (o = a.map(function (e) {
                          return e._id;
                        })),
                        h.Log.info("Order deleted process started"),
                        [4, this.deleteByIds(o, t.id, r)])
                      : [3, 3]
                  );
                case 2:
                  return (
                    n.sent(),
                    h.Log.info("Order deleted from local and count" + o.length),
                    (s = e.filter(function (e) {
                      return h.Util.isNotNull(e.tallyErrorMessage);
                    })).length > 1
                      ? h.Log.info("Fail order in tally " + JSON.stringify(s))
                      : h.Log.info("All order successfully inserted in tally"),
                    [2, e]
                  );
                case 3:
                  return [2];
              }
            });
          });
        }),
        (t.ADD = "order_add"),
        (t.UPDATE = "order_update"),
        (t.DELETE = "order_delete"),
        (t.SALES_ORDER = "Sales Order"),
        (t.PURCHASE_ORDER = "Purchase Order"),
        (t.masterName = "Order"),
        t
      );
    })(m.default);
  t.default = f;
};
