// webpack module #144 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var n,
    a =
      (this && this.__extends) ||
      ((n = function (e, t) {
        return (n =
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
        (n(e, t),
          (e.prototype = null === t ? Object.create(t) : ((r.prototype = t.prototype), new r())));
      }),
    i =
      (this && this.__assign) ||
      function () {
        return (i =
          Object.assign ||
          function (e) {
            for (var t, r = 1, n = arguments.length; r < n; r++)
              for (var a in (t = arguments[r]))
                Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
            return e;
          }).apply(this, arguments);
      },
    o =
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
    s =
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
  var u = r(46),
    p = r(199),
    c = r(8),
    l = r(64),
    m = r(30),
    d = r(35),
    y = r(48),
    b = r(29),
    h = r(0),
    f = r(145),
    g = r(112),
    M = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.getName = function () {
          return t.masterName;
        }),
        (t.prototype.createOrder = function (e, r, n) {
          return m.default.getV1(t, r, n).create(e);
        }),
        (t.prototype.getOrders = function (e, r) {
          return m.default.getV1(t, e, r).findAll(void 0);
        }),
        (t.prototype.getOrderById = function (e, r, n) {
          return m.default.getV1(t, r, n).findOne({ where: { _id: e } });
        }),
        (t.prototype.deleteByIds = function (e, r, n) {
          var a = this;
          return new Promise(function (i, u) {
            var c = m.default.getV1(t, r, n);
            p.eachSeries(
              e,
              function (e, t) {
                return o(a, void 0, void 0, function () {
                  var r, n;
                  return s(this, function (a) {
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
                        return ((n = a.sent()), h.Util.isNotNull(n) && t(n), [3, 3]);
                      case 3:
                        return [2];
                    }
                  });
                });
              },
              function (e) {
                h.Util.isNotNull(e) ? u(e) : i();
              },
            );
          });
        }),
        (t.prototype.processOrder = function (e, t, r) {
          return o(this, void 0, void 0, function () {
            var n, a, i, o, p, m, d, y, b;
            return s(this, function (s) {
              switch (s.label) {
                case 0:
                  return (
                    (n = e),
                    h.Util.isFilledArray(n)
                      ? (h.Util.isFilledArray(n) &&
                          (n = n.sort(function (e, t) {
                            return e.createdAt - t.createdAt;
                          })),
                        h.Log.info("Fetching order entry into tally-------"),
                        [4, this.insertIntoTallyAndUpdateLocalDb(n, t, r)])
                      : [2]
                  );
                case 1:
                  return (s.sent(), [4, this.getOrders(r.id, t)]);
                case 2:
                  ((a = s.sent()),
                    (i = []),
                    (o = u.chunk(a, c.default.DATA_ENTRY_CHUNK)),
                    (p = 0),
                    (m = o),
                    (s.label = 3));
                case 3:
                  return p < m.length
                    ? ((d = m[p]), [4, this.updateOrderInServerAndDeleteFromLocal(d, r, t)])
                    : [3, 6];
                case 4:
                  ((y = s.sent()), i.push.apply(i, y), (s.label = 5));
                case 5:
                  return (p++, [3, 3]);
                case 6:
                  return (
                    (b = {
                      company: t,
                      dataEntryOps: l.DataEntryOperation.CREATED,
                      orderList: i,
                      userId: r.id,
                      voucherName: l.DataEntryVoucherName.ORDER,
                      voucherType: "orderType",
                    }),
                    [4, l.default.putDataEntryEvent(b)]
                  );
                case 7:
                  return (s.sent(), [2, i]);
              }
            });
          });
        }),
        (t.prototype.insertIntoTallyAndUpdateLocalDb = function (e, t, r) {
          return o(this, void 0, void 0, function () {
            var n,
              a,
              u,
              l,
              m = this;
            return s(this, function (f) {
              switch (f.label) {
                case 0:
                  return ((n = d.default.getInstance()), [4, this.getOrderHash(r.id, t)]);
                case 1:
                  return ((a = f.sent()), [4, n.getTallyProdInfo(g.default.PARAM_BUILD_NUMBER)]);
                case 2:
                  return (
                    (u = f.sent()),
                    (l = !1),
                    h.Util.isNotEmptyString(u) &&
                      !1 === isNaN(parseInt(u)) &&
                      parseInt(u) >= c.default.TALLY_PRIME_3_MIN_BUILD_NUMBER &&
                      (l = !0),
                    0,
                    [
                      2,
                      new Promise(function (u, d) {
                        return o(m, void 0, void 0, function () {
                          var m = this;
                          return s(this, function (f) {
                            return (
                              p.eachSeries(
                                e,
                                function (e, u) {
                                  return o(m, void 0, void 0, function () {
                                    var o, p, m, d, f, g, M, S;
                                    return s(this, function (s) {
                                      switch (s.label) {
                                        case 0:
                                          return (
                                            s.trys.push([0, 16, , 17]),
                                            [4, n.isCompanyOpen(t.tallyCompanyName.trim())]
                                          );
                                        case 1:
                                          return (
                                            (o = s.sent()),
                                            [4, y.checkIfTallyPathHasChange(t)]
                                          );
                                        case 2:
                                          if (((p = s.sent()), !o)) return [3, 14];
                                          if (!1 !== p) return [3, 12];
                                          if (((m = a.get(e._id)), !h.Util.isEmpty(m)))
                                            return [3, 11];
                                          (h.Log.info(
                                            "Inserting into tally------" + JSON.stringify(e),
                                          ),
                                            (d = void 0),
                                            (s.label = 3));
                                        case 3:
                                          return (
                                            s.trys.push([3, 5, , 9]),
                                            [4, n.createOrderEntry(e, t, l)]
                                          );
                                        case 4:
                                          return ((d = s.sent()), [3, 9]);
                                        case 5:
                                          return (
                                            (f = s.sent()),
                                            h.Util.isInvalidCharacterError(f)
                                              ? (h.Log.info(
                                                  "Order insert failed due to invalid character, retrying after removing special characters: " +
                                                    h.Util.getErrorMessage(f),
                                                ),
                                                (e = h.Util.removeInvalidXmlChars(e)),
                                                [4, n.createOrderEntry(e, t, l)])
                                              : [3, 7]
                                          );
                                        case 6:
                                          return ((d = s.sent()), [3, 8]);
                                        case 7:
                                          throw f;
                                        case 8:
                                          return [3, 9];
                                        case 9:
                                          return (
                                            (g = Object.assign(e, i({}, d))),
                                            [4, this.createOrder(g, r.id, t)]
                                          );
                                        case 10:
                                          (s.sent(), (s.label = 11));
                                        case 11:
                                          return (u(), [3, 13]);
                                        case 12:
                                          (h.Log.info(
                                            "While processing company found company path is change",
                                          ),
                                            ((M = new b.ErrorMessage()).message =
                                              t.name + " " + c.default.SYNC_DATA_ISSUE),
                                            u(M),
                                            (s.label = 13));
                                        case 13:
                                          return [3, 15];
                                        case 14:
                                          (h.Log.info(
                                            "While processing company found company is close",
                                          ),
                                            ((M = new b.ErrorMessage()).message =
                                              "Company " +
                                              t.name +
                                              "  is currently not open in tally."),
                                            u(M),
                                            (s.label = 15));
                                        case 15:
                                          return [3, 17];
                                        case 16:
                                          return (
                                            (S = s.sent()),
                                            h.Log.info("Order process error occure" + S),
                                            h.Util.isNotNull(S) ? u(S) : u(),
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
          return o(this, void 0, void 0, function () {
            var r, n;
            return s(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.getOrders(e, t)];
                case 1:
                  return (
                    (r = a.sent()),
                    (n = new Map()),
                    h.Util.isFilledArray(r) &&
                      r.forEach(function (e) {
                        n.set(e._id, e);
                      }),
                    [2, n]
                  );
              }
            });
          });
        }),
        (t.prototype.updateOrderInServerAndDeleteFromLocal = function (e, t, r) {
          return o(this, void 0, void 0, function () {
            var n, a, i, o;
            return s(this, function (s) {
              switch (s.label) {
                case 0:
                  return h.Util.isFilledArray(e) ? [4, f.updateOrderEntryList(t, e)] : [2];
                case 1:
                  return (
                    (n = s.sent()),
                    h.Log.info("Order updated to Server " + JSON.stringify(n)),
                    h.Util.isNotNull(n)
                      ? ((a = e.slice()),
                        h.Util.isFilledArray(n.failedEntryIds) &&
                          (a = h.Util.arrayDiffrence(a, n.failedEntryIds, function (e, t) {
                            return e._id === t;
                          })),
                        (i = a.map(function (e) {
                          return e._id;
                        })),
                        h.Log.info("Order deleted process started"),
                        [4, this.deleteByIds(i, t.id, r)])
                      : [3, 3]
                  );
                case 2:
                  return (
                    s.sent(),
                    h.Log.info("Order deleted from local and count" + i.length),
                    (o = e.filter(function (e) {
                      return h.Util.isNotNull(e.tallyErrorMessage);
                    })).length > 1
                      ? h.Log.info("Fail order in tally " + JSON.stringify(o))
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
    })(l.default);
  t.default = M;
};
