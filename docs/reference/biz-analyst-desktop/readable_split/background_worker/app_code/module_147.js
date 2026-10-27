// webpack module #147 (from background_worker, BA Mobile Connector 8.4.41)
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
    f = r(534),
    g = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.getName = function () {
          return t.masterName;
        }),
        (t.prototype.createTransactionEntry = function (e, r, n) {
          return m.default.getV1(t, r, n).create(e);
        }),
        (t.prototype.getAllTransactionEntrys = function (e, r) {
          return m.default.getV1(t, e, r).findAll(void 0);
        }),
        (t.prototype.getTransactionEntryById = function (e, r, n) {
          return m.default.getV1(t, r, n).findOne({ where: { _id: e } });
        }),
        (t.prototype.deleteByIds = function (e, r, n) {
          var a = this,
            i = m.default.getV1(t, r, n);
          return new Promise(function (t, r) {
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
                          [4, i.destroy(r)]
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
                h.Util.isNotNull(e) ? r(e) : t(e);
              },
            );
          });
        }),
        (t.prototype.processTransaction = function (e, t, r) {
          return o(this, void 0, void 0, function () {
            var n, a, i, o, p, m, d, y;
            return s(this, function (s) {
              switch (s.label) {
                case 0:
                  return (
                    h.Util.isFilledArray(e) &&
                      (e = e.sort(function (e, t) {
                        return e.createdAt - t.createdAt;
                      })),
                    [4, this.insertIntoTallyAndUpdateLocalDb(e, r, t)]
                  );
                case 1:
                  return (s.sent(), [4, this.getAllTransactionEntrys(r.id, t)]);
                case 2:
                  ((n = s.sent()),
                    (a = []),
                    (i = u.chunk(n, c.default.DATA_ENTRY_CHUNK)),
                    (o = 0),
                    (p = i),
                    (s.label = 3));
                case 3:
                  return o < p.length
                    ? ((m = p[o]), [4, this.updateOnserverAndDeleteFromLocal(m, r, t)])
                    : [3, 6];
                case 4:
                  ((d = s.sent()), a.push.apply(a, d), (s.label = 5));
                case 5:
                  return (o++, [3, 3]);
                case 6:
                  return (
                    (y = {
                      company: t,
                      dataEntryOps: l.DataEntryOperation.CREATED,
                      orderList: a,
                      userId: r.id,
                      voucherName: l.DataEntryVoucherName.TRANSACTION,
                      voucherType: "type",
                    }),
                    [4, l.default.putDataEntryEvent(y)]
                  );
                case 7:
                  return (s.sent(), [2, a]);
              }
            });
          });
        }),
        (t.prototype.getTransactionHash = function (e, t) {
          return o(this, void 0, void 0, function () {
            var r, n;
            return s(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.getAllTransactionEntrys(e.id, t)];
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
        (t.prototype.insertIntoTallyAndUpdateLocalDb = function (e, t, r) {
          return o(this, void 0, void 0, function () {
            var n,
              a,
              u,
              l = this;
            return s(this, function (m) {
              switch (m.label) {
                case 0:
                  return ((n = d.default.getInstance()), [4, this.getTransactionHash(t, r)]);
                case 1:
                  return (
                    (a = m.sent()),
                    (u = 0),
                    [
                      2,
                      new Promise(function (m, d) {
                        p.eachSeries(
                          e,
                          function (e, p) {
                            return o(l, void 0, void 0, function () {
                              var o, l, m, d, f, g, M, S;
                              return s(this, function (s) {
                                switch (s.label) {
                                  case 0:
                                    return (
                                      s.trys.push([0, 16, , 17]),
                                      [4, n.isCompanyOpen(r.tallyCompanyName.trim())]
                                    );
                                  case 1:
                                    return ((o = s.sent()), [4, y.checkIfTallyPathHasChange(r)]);
                                  case 2:
                                    if (((l = s.sent()), !o)) return [3, 14];
                                    if (!1 !== l) return [3, 12];
                                    if (((m = a.get(e._id)), !h.Util.isEmpty(m))) return [3, 11];
                                    ((d = void 0), (s.label = 3));
                                  case 3:
                                    return (
                                      s.trys.push([3, 5, , 9]),
                                      [4, n.createTransactionEntry(e, r)]
                                    );
                                  case 4:
                                    return ((d = s.sent()), [3, 9]);
                                  case 5:
                                    return (
                                      (f = s.sent()),
                                      h.Util.isInvalidCharacterError(f)
                                        ? (h.Log.info(
                                            "Transaction insert failed due to invalid character, retrying after removing special characters: " +
                                              h.Util.getErrorMessage(f),
                                          ),
                                          (e = h.Util.removeInvalidXmlChars(e)),
                                          [4, n.createTransactionEntry(e, r)])
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
                                      [4, this.createTransactionEntry(g, t.id, r)]
                                    );
                                  case 10:
                                    (s.sent(),
                                      h.Log.info("Transaction process no" + ++u),
                                      (s.label = 11));
                                  case 11:
                                    return (p(), [3, 13]);
                                  case 12:
                                    (h.Log.info(
                                      "While processing company found company path is change",
                                    ),
                                      ((M = new b.ErrorMessage()).message =
                                        r.name + " " + c.default.SYNC_DATA_ISSUE),
                                      p(M),
                                      (s.label = 13));
                                  case 13:
                                    return [3, 15];
                                  case 14:
                                    (((M = new b.ErrorMessage()).message =
                                      "Company " + r.name + "  is currently not open in tally."),
                                      p(M),
                                      (s.label = 15));
                                  case 15:
                                    return [3, 17];
                                  case 16:
                                    return (
                                      (S = s.sent()),
                                      h.Log.info("Transaction process error occure" + S),
                                      h.Util.isNotNull(S) ? p(S) : p(),
                                      [3, 17]
                                    );
                                  case 17:
                                    return [2];
                                }
                              });
                            });
                          },
                          function (e) {
                            h.Util.isNotNull(e) ? d(e) : m();
                          },
                        );
                      }),
                    ]
                  );
              }
            });
          });
        }),
        (t.prototype.updateOnserverAndDeleteFromLocal = function (e, t, r) {
          return o(this, void 0, void 0, function () {
            var n, a, i, o;
            return s(this, function (s) {
              switch (s.label) {
                case 0:
                  return h.Util.isFilledArray(e) ? [4, f.updateTransactionEntryList(t, e)] : [2];
                case 1:
                  return (
                    (n = s.sent()),
                    h.Util.isNotNull(n)
                      ? ((a = e.slice()),
                        h.Util.isFilledArray(n.failedEntryIds) &&
                          (a = h.Util.arrayDiffrence(a, n.failedEntryIds, function (e, t) {
                            return e._id === t;
                          })),
                        (i = a.map(function (e) {
                          return e._id;
                        })),
                        (o = e.filter(function (e) {
                          return h.Util.isNotNull(e.tallyErrorMessage);
                        })).length > 1
                          ? h.Log.info("Fail transaction in tally " + JSON.stringify(o))
                          : h.Log.info("All transaction successfully inserted in tally"),
                        [4, this.deleteByIds(i, t.id, r)])
                      : [3, 3]
                  );
                case 2:
                  return (s.sent(), [2, e]);
                case 3:
                  return [2];
              }
            });
          });
        }),
        (t.ADD = "transaction_add"),
        (t.UPDATE = "transaction_update"),
        (t.DELETE = "transaction_delete"),
        (t.RECEIPT = "Receipt"),
        (t.PAYMENT = "Payment"),
        (t.masterName = "TransactionEntry"),
        t
      );
    })(l.default);
  t.default = g;
};
