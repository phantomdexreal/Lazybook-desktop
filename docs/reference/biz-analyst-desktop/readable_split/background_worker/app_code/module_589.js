// webpack module #589 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var n =
      (this && this.__assign) ||
      function () {
        return (n =
          Object.assign ||
          function (e) {
            for (var t, r = 1, n = arguments.length; r < n; r++)
              for (var a in (t = arguments[r]))
                Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
            return e;
          }).apply(this, arguments);
      },
    a =
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
    i =
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
      },
    o = this;
  Object.defineProperty(t, "__esModule", { value: !0 });
  var s = r(46),
    u = r(8),
    p = r(64),
    c = r(204),
    l = r(538),
    m = r(30),
    d = r(35),
    y = r(48),
    b = r(0),
    h = r(570),
    f = r(143);
  t.getLedgers = function (e, t) {
    return m.default.getV1(l.default, e, t).findAll();
  };
  var g = function (e, r) {
      return a(o, void 0, void 0, function () {
        var n, a;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              return [4, t.getLedgers(e, r)];
            case 1:
              return (
                (n = i.sent()),
                (a = new Map()),
                b.Util.isFilledArray(n) &&
                  n.forEach(function (e) {
                    a.set(e._id, e);
                  }),
                [2, a]
              );
          }
        });
      });
    },
    M = function (e, t, r) {
      return a(o, void 0, void 0, function () {
        var a, o, s, p, h, M, S, A, O, N, v, T, z, I;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              return [4, y.checkIfTallyPathHasChange(t)];
            case 1:
              if (!0 === i.sent())
                throw (
                  b.Log.info("While processing company found company path is change"),
                  (a = t.name + " " + u.default.SYNC_DATA_ISSUE),
                  new Error(a)
                );
              return ((o = d.default.getInstance()), [4, g(r.id, t)]);
            case 2:
              return (
                (s = i.sent()),
                (p = m.default.getV1(l.default, r.id, t)),
                (h = m.default.get(new c.default(), r.id, t)),
                [4, o.getTallyProdInfo(f.GetTallyProductRequest.PARAM_BUILD_NUMBER)]
              );
            case 3:
              ((M = i.sent()),
                (S = !1),
                b.Util.isNotEmptyString(M) &&
                  !1 === isNaN(parseInt(M)) &&
                  parseInt(M) >= u.default.TALLY_PRIME_3_MIN_BUILD_NUMBER &&
                  (S = !0),
                (A = 0),
                (O = e),
                (i.label = 4));
            case 4:
              return A < O.length
                ? ((N = O[A]),
                  (v = s.get(N._id)),
                  b.Util.isEmpty(v) ? [4, h.findOne({ where: { name: N.name } })] : [3, 10])
                : [3, 11];
            case 5:
              return (
                (T = i.sent()),
                (z = void 0),
                b.Util.isNull(T) ? [4, o.createLedgerEntry(N, t, S)] : [3, 7]
              );
            case 6:
              return ((I = i.sent()), (z = Object.assign(N, n({}, I))), [3, 8]);
            case 7:
              ((z = Object.assign(N, {
                tallyUpdatedAt: b.DateUtil.now(),
                tallyInsertSuccess: !1,
                tallyErrorMessage: "Ledger " + N.name + " already present in tally.",
              })),
                (i.label = 8));
            case 8:
              return [4, p.create(z)];
            case 9:
              (i.sent(), (i.label = 10));
            case 10:
              return (A++, [3, 4]);
            case 11:
              return [2];
          }
        });
      });
    },
    S = function (e, t, r) {
      return a(o, void 0, void 0, function () {
        var n, a, o, s;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              return b.Util.isFilledArray(e) ? [4, h.updateLedgerAPI(t, e, r)] : [2];
            case 1:
              return (
                (n = i.sent()),
                b.Util.isNotNull(n)
                  ? ((a = e),
                    b.Util.isFilledArray(n.failedEntryIds) &&
                      (a = b.Util.arrayDiffrence(a, n.failedEntryIds, function (e, t) {
                        return e._id === t;
                      })),
                    (o = a.map(function (e) {
                      return e._id;
                    })),
                    [4, A(o, t.id, r)])
                  : [3, 3]
              );
            case 2:
              return (
                i.sent(),
                (s = e.filter(function (e) {
                  return b.Util.isNotNull(e.tallyErrorMessage);
                })).length > 1
                  ? b.Log.info("Fail ledger in tally " + JSON.stringify(s))
                  : b.Log.info("All ledger successfully inserted in tally"),
                [2, e]
              );
            case 3:
              return [2];
          }
        });
      });
    },
    A = function (e, t, r) {
      return a(o, void 0, void 0, function () {
        var n, a, o, s, u;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              ((n = m.default.getV1(l.default, t, r)), (a = 0), (o = e), (i.label = 1));
            case 1:
              return a < o.length
                ? ((s = o[a]), (u = { where: { _id: s } }), [4, n.destroy(u)])
                : [3, 4];
            case 2:
              (i.sent(), (i.label = 3));
            case 3:
              return (a++, [3, 1]);
            case 4:
              return [2];
          }
        });
      });
    };
  t.processLedgerEntry = function (e, r, n) {
    return a(o, void 0, void 0, function () {
      var a, o, c, l, m, d, y, h;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            return b.Util.isFilledArray(e)
              ? (b.Util.isFilledArray(e) &&
                  (e = e.sort(function (e, t) {
                    return e.createdAt - t.createdAt;
                  })),
                [4, M(e, r, n)])
              : [2];
          case 1:
            return (i.sent(), [4, t.getLedgers(n.id, r)]);
          case 2:
            ((a = i.sent()),
              (o = []),
              (c = s.chunk(a, u.default.DATA_ENTRY_CHUNK)),
              (l = 0),
              (m = c),
              (i.label = 3));
          case 3:
            return l < m.length ? ((d = m[l]), [4, S(d, n, r)]) : [3, 6];
          case 4:
            ((y = i.sent()), o.push.apply(o, y), (i.label = 5));
          case 5:
            return (l++, [3, 3]);
          case 6:
            return (
              (h = {
                company: r,
                dataEntryOps: p.DataEntryOperation.CREATED,
                orderList: o,
                userId: n.id,
                voucherName: p.DataEntryVoucherName.LEDGER,
              }),
              [4, p.default.putDataEntryEvent(h)]
            );
          case 7:
            return (i.sent(), [2, o]);
        }
      });
    });
  };
};
