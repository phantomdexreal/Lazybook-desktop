// webpack module #940 (from electron_main_process, BA Mobile Connector 8.4.41)
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
    s =
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
  var n = r(22),
    u = r(17),
    p = r(10),
    c = r(2),
    m = r(18),
    l = r(34),
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
          return o(this, void 0, void 0, function () {
            return s(this, function (t) {
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
          return o(this, void 0, void 0, function () {
            return s(this, function (r) {
              switch (r.label) {
                case 0:
                  return [4, this.update(t, { where: { masterType: e } })];
                case 1:
                  return (r.sent(), [2]);
              }
            });
          });
        }),
        (t.prototype.runMigration = function () {
          var e = c.PathUtil.getDbPath(this.userId, this.company),
            t = new l.SQLConfig();
          n.open(e, "r", function (r, i) {
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
                            for (var r = !1, i = 0, o = t; i < o.length; i++) {
                              "lastDeletedAlterId" === o[i].name && (r = !0);
                            }
                            !1 === r &&
                              a.run("ALTER TABLE syncmetadata ADD lastDeletedAlterId NUMERIC");
                          }
                        });
                  },
                );
              });
            }
          });
        }),
        t
      );
    })(m.ModelBase);
  t.default = d;
};
