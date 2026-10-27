// webpack module #924 (from electron_main_process, BA Mobile Connector 8.4.41)
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
      });
  Object.defineProperty(t, "__esModule", { value: !0 });
  var o = r(22),
    s = r(17),
    n = r(10),
    u = r(2),
    p = r(18),
    c = r(34),
    m = (function (e) {
      function t(t, r) {
        return e.call(this, t, r) || this;
      }
      return (
        a(t, e),
        (t.prototype.getModelName = function () {
          return "group";
        }),
        (t.prototype.getAttributes = function (e) {
          return {
            _id: { type: s.UUID, primaryKey: !0, defaultValue: s.UUIDV4 },
            name: { type: s.STRING, required: !1 },
            parentGroup: { type: s.STRING, required: !1 },
            reservedName: { type: s.STRING, required: !1 },
            aliases: { type: s.ABSTRACT, required: !0 },
            tags: { type: s.ABSTRACT, required: !0 },
            tallyUpdatedAt: { type: s.INTEGER, required: !0 },
            uptoDate: { type: s.BOOLEAN, required: !0 },
            masterId: { type: s.INTEGER, required: !0 },
            alterId: { type: s.INTEGER, required: !0 },
            oldName: { type: s.STRING, required: !0 },
            isDeleted: { type: s.BOOLEAN, required: !0 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = u.PathUtil.getDbPath(this.userId, this.company),
            t = new c.SQLConfig();
          o.open(e, "r", function (r, i) {
            if (r && "ENOENT" == r.code);
            else {
              var a = t.connect(e);
              a.serialize(function () {
                a.all(
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='groups'",
                  function (e, t) {
                    e
                      ? u.Log.error(e)
                      : n.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(groups)", function (e, t) {
                          if (e) u.Log.error(e);
                          else {
                            for (var r = !1, i = 0, o = t; i < o.length; i++) {
                              "aliases" === o[i].name && (r = !0);
                            }
                            !1 === r && a.run("ALTER TABLE groups ADD aliases ABSTRACT");
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
    })(p.ModelBase);
  t.default = m;
};
