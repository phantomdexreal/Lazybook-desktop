// webpack module #1634 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
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
  var i = r(239),
    o = r(52),
    s = r(63),
    u = r(15),
    p = r(0),
    c = r(589);
  process.env.UV_THREADPOOL_SIZE = "128";
  var l = (function () {
    function e() {}
    return (
      (e.sync = function () {
        return n(this, void 0, void 0, function () {
          var t, r, n, o, l, m, d;
          return a(this, function (a) {
            switch (a.label) {
              case 0:
                (t = e.backgroundStore.getStoreState()),
                  (r = t.user.user),
                  (n = new s.default(r.id)),
                  (a.label = 1);
              case 1:
                return (
                  a.trys.push([1, 5, 6, 8]),
                  u.ipcRenderer.on("ping-request-data-entry", function (e, t) {
                    u.ipcRenderer.send("ping-response-data-entry", t);
                  }),
                  [4, n.getAllTempData()]
                );
              case 2:
                return (o = a.sent()), [4, n.getLastRow()];
              case 3:
                return (l = a.sent()), [4, c.processLedgerEntry(o, l.company, l.user)];
              case 4:
                return (
                  (m = a.sent()),
                  e.store.dispatch(i.setLedgerEntrySyncStatus(!1, m, !0, null)),
                  [3, 8]
                );
              case 5:
                return (
                  (d = a.sent()),
                  p.Log.exception(d, "LedgerEntry Sync failed"),
                  e.store.dispatch(i.setLedgerEntrySyncStatus(!1, null, !1, d)),
                  [3, 8]
                );
              case 6:
                return [4, n.deleteAllData()];
              case 7:
                return (
                  a.sent(),
                  p.Log.info("LedgerEntry Sync Complete"),
                  u.ipcRenderer.send("sync-completed-callback-once", void 0),
                  [7]
                );
              case 8:
                return [2];
            }
          });
        });
      }),
      (e.backgroundStore = o.default.getInstance()),
      (e.store = e.backgroundStore.getStore()),
      e
    );
  })();
  t.default = l;
};
