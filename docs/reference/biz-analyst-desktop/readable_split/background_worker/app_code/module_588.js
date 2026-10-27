// webpack module #588 (from background_worker, BA Mobile Connector 8.4.41)
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
    c = r(30),
    l = r(35),
    m = r(48),
    d = r(28),
    y = r(0),
    b = r(581);
  t.getJournal = function (e, t) {
    return c.default.getV1(d.JournalVoucherEntry, e, t).findAll(void 0);
  };
  var h = function (e, r) {
      return a(o, void 0, void 0, function () {
        var n, a;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              return [4, t.getJournal(e, r)];
            case 1:
              return (
                (n = i.sent()),
                (a = new Map()),
                y.Util.isFilledArray(n) &&
                  n.forEach(function (e) {
                    a.set(e._id, e);
                  }),
                [2, a]
              );
          }
        });
      });
    },
    f = function (e, t, r) {
      return a(o, void 0, void 0, function () {
        var a, o, s, p, b, f, g, M, S, A, O;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              return (
                y.Util.isFilledArray(e) &&
                  (e = e.sort(function (e, t) {
                    return e.createdAt - t.createdAt;
                  })),
                [4, m.checkIfTallyPathHasChange(t)]
              );
            case 1:
              if (!0 === i.sent())
                throw (
                  y.Log.info("While processing company found company path is change"),
                  (a = t.name + " " + u.default.SYNC_DATA_ISSUE),
                  new Error(a)
                );
              return [4, h(r.id, t)];
            case 2:
              ((o = i.sent()),
                (s = l.default.getInstance()),
                (p = c.default.getV1(d.JournalVoucherEntry, r.id, t)),
                (b = 0),
                (f = e),
                (i.label = 3));
            case 3:
              if (!(b < f.length)) return [3, 13];
              if (((g = f[b]), (M = o.get(g._id)), !y.Util.isEmpty(M))) return [3, 12];
              ((S = void 0), (i.label = 4));
            case 4:
              return (i.trys.push([4, 6, , 10]), [4, s.createJournalEntry(g, t)]);
            case 5:
              return ((S = i.sent()), [3, 10]);
            case 6:
              return (
                (A = i.sent()),
                y.Util.isInvalidCharacterError(A)
                  ? (y.Log.info(
                      "Journal insert failed due to invalid character, retrying after removing special characters: " +
                        y.Util.getErrorMessage(A),
                    ),
                    (g = y.Util.removeInvalidXmlChars(g)),
                    [4, s.createJournalEntry(g, t)])
                  : [3, 8]
              );
            case 7:
              return ((S = i.sent()), [3, 9]);
            case 8:
              throw A;
            case 9:
              return [3, 10];
            case 10:
              return ((O = Object.assign(g, n({}, S))), [4, p.create(O)]);
            case 11:
              (i.sent(), (i.label = 12));
            case 12:
              return (b++, [3, 3]);
            case 13:
              return [2];
          }
        });
      });
    },
    g = function (e, t, r) {
      return a(o, void 0, void 0, function () {
        var n, a, o, s;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              return y.Util.isFilledArray(e) ? [4, b.updateJournalAPI(t, e, r)] : [2];
            case 1:
              return (
                (n = i.sent()),
                y.Util.isNotNull(n)
                  ? ((a = e),
                    y.Util.isFilledArray(n.failedEntryIds) &&
                      (a = y.Util.arrayDiffrence(a, n.failedEntryIds, function (e, t) {
                        return e._id === t;
                      })),
                    (o = a.map(function (e) {
                      return e._id;
                    })),
                    [4, M(o, t.id, r)])
                  : [3, 3]
              );
            case 2:
              return (
                i.sent(),
                (s = e.filter(function (e) {
                  return y.Util.isNotNull(e.tallyErrorMessage);
                })).length > 1
                  ? y.Log.info("Fail Journal in tally " + JSON.stringify(s))
                  : y.Log.info("All Journal item successfully inserted in tally"),
                [2, e]
              );
            case 3:
              return [2];
          }
        });
      });
    },
    M = function (e, t, r) {
      return a(o, void 0, void 0, function () {
        var n, a, o, s, u;
        return i(this, function (i) {
          switch (i.label) {
            case 0:
              ((n = c.default.getV1(d.JournalVoucherEntry, t, r)), (a = 0), (o = e), (i.label = 1));
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
  t.processJournalEntry = function (e, r, n) {
    return a(o, void 0, void 0, function () {
      var a, o, c, l, m, d, b, h;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            return y.Util.isFilledArray(e) ? [4, f(e, r, n)] : [2];
          case 1:
            return (i.sent(), [4, t.getJournal(n.id, r)]);
          case 2:
            ((a = i.sent()),
              (o = []),
              (c = s.chunk(a, u.default.DATA_ENTRY_CHUNK)),
              (l = 0),
              (m = c),
              (i.label = 3));
          case 3:
            return l < m.length ? ((d = m[l]), [4, g(d, n, r)]) : [3, 6];
          case 4:
            ((b = i.sent()), o.push.apply(o, b), (i.label = 5));
          case 5:
            return (l++, [3, 3]);
          case 6:
            return (
              (h = {
                company: r,
                dataEntryOps: p.DataEntryOperation.CREATED,
                orderList: o,
                userId: n.id,
                voucherName: p.DataEntryVoucherName.JOURNAL,
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
