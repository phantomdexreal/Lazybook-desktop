// webpack module #388 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

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
        n(e, t),
          (e.prototype = null === t ? Object.create(t) : ((r.prototype = t.prototype), new r()));
      }),
    i =
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
    o =
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
  var s = r(27),
    u = r(13),
    p = r(11),
    c = r(0),
    l = r(14),
    m = r(32),
    d = (function (e) {
      function t(t, r) {
        return e.call(this, t, r) || this;
      }
      return (
        a(t, e),
        (t.prototype.getModelName = function () {
          return "syncmetadata";
        }),
        (t.prototype.getAttributes = function (e) {
          return {
            masterType: { type: u.TEXT, primaryKey: !0, required: !0 },
            uptoDate: { type: u.BOOLEAN, required: !0 },
            firstSync: { type: u.BOOLEAN, required: !0 },
            firstSyncDate: { type: u.STRING, required: !0 },
            tallyUpdatedAt: { type: u.INTEGER, required: !1 },
            serverUpdatedAt: { type: u.INTEGER, required: !1 },
            syncType: { type: u.INTEGER, required: !0 },
            lastCompleteSyncAt: { type: u.INTEGER, required: !1 },
            lastDeleteSyncAt: { type: u.INTEGER, required: !1 },
            lastDeletedAlterId: { type: u.INTEGER, required: !1 },
          };
        }),
        (t.prototype.get = function (e) {
          return i(this, void 0, void 0, function () {
            return o(this, function (t) {
              switch (t.label) {
                case 0:
                  return [4, this.findOne({ where: { masterType: e } })];
                case 1:
                  return [2, t.sent()];
              }
            });
          });
        }),
        (t.prototype.set = function (e, t) {
          return i(this, void 0, void 0, function () {
            return o(this, function (r) {
              switch (r.label) {
                case 0:
                  return [4, this.update(t, { where: { masterType: e } })];
                case 1:
                  return r.sent(), [2];
              }
            });
          });
        }),
        (t.prototype.runMigration = function () {
          var e = c.PathUtil.getDbPath(this.userId, this.company),
            t = new m.SQLConfig();
          s.open(e, "r", function (r, n) {
            if (r && "ENOENT" == r.code);
            else {
              var a = t.connect(e);
              a.serialize(function () {
                a.all(
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='syncmetadata'",
                  function (e, t) {
                    e
                      ? c.Log.error(e)
                      : p.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(syncmetadata)", function (e, t) {
                          if (e) c.Log.error(e);
                          else {
                            for (var r = !1, n = 0, i = t; n < i.length; n++) {
                              "lastDeletedAlterId" === i[n].name && (r = !0);
                            }
                            !1 === r &&
                              a.run("ALTER TABLE syncmetadata ADD lastDeletedAlterId NUMERIC");
                          }
                        });
                  }
                );
              });
            }
          });
        }),
        t
      );
    })(l.ModelBase);
  t.default = d;
};
