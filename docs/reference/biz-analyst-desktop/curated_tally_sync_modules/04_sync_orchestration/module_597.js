// webpack module #597 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
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
  var i = r(85),
    o = r(52),
    s = r(63),
    u = r(8),
    p = r(1626),
    c = r(582),
    l = r(161),
    m = r(1632),
    d = r(1633),
    y = r(1634),
    b = r(1635),
    h = r(473),
    f = r(474),
    g = r(1636),
    M = r(238),
    S = r(0),
    A = r(1637),
    O = r(1638),
    N = r(238),
    v = r(1639);
  try {
    console.log("Sync now is called"), l.default(u.default.SCOPE_RENDERER);
    var T = o.default.getInstance().getStoreState().user.user;
    if (S.Util.isNotNull(T) && S.Util.isNotNull(T.id))
      i.default.getInstance().initialize(T, !1, [h.default.SERVICE_NAME, f.default.SERVICE_NAME]),
        l.updateRavenContext(T);
    (function (e) {
      return n(this, void 0, void 0, function () {
        var t;
        return a(this, function (r) {
          switch (r.label) {
            case 0:
              return [4, new s.default(e.id).getLastRow()];
            case 1:
              return (
                (t = r.sent()),
                S.Util.isNull(t) ? [2, M.BACKGROUND_VOUCHER_SYNC_ACTION] : [2, t.actionType]
              );
          }
        });
      });
    })(T)
      .then(function (e) {
        switch ((console.log(e), e)) {
          case M.BACKGROUND_VOUCHER_SYNC_ACTION:
            c.default.sync();
            break;
          case M.ORDER_SYNC_ACTION:
            b.default.sync();
            break;
          case M.TRANSACTION_SYNC_ACTION:
            g.default.sync();
            break;
          case M.LEDGER_ENTRY_SYNC_ACTION:
            y.default.sync();
            break;
          case M.INVOICE_ENTRY_SYNC_ACTION:
            m.default.sync();
            break;
          case M.STOCK_ITEM_ENTRY_SYNC_ACTION:
            A.default.sync();
            break;
          case M.INVENTORY_VOUCHER_ENTRY_SYNC_ACTION:
            O.default.sync();
            break;
          case N.JOURNAL_VOUCHER_ENTRY_SYNC_ACTION:
            v.default.sync();
            break;
          case M.DATA_ENRTY_SYNC_ACTION:
            p.default.sync();
            break;
          case M.AUTO_REMINDER:
            d.default.sync();
            break;
          default:
            c.default.sync();
        }
      })
      .catch(function (e) {
        S.Log.error("Sync error: " + JSON.stringify(e));
      });
  } catch (e) {
    S.Log.error("Sync error: " + JSON.stringify(e));
  }
};
