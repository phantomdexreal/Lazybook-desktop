// webpack module #660 (from background_worker, BA Mobile Connector 8.4.41)
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
      });
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(13),
    o = r(14),
    s = r(0),
    u = r(32),
    p = r(27),
    c = r(11),
    l = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.prototype.getModelName = function () {
          return "stockGroup";
        }),
        (t.prototype.getAttributes = function () {
          return {
            name: { type: i.STRING, required: !1 },
            parentGroup: { type: i.STRING, required: !1 },
            unit: { type: i.STRING, required: !1 },
            _id: { type: i.UUID, primaryKey: !0, defaultValue: i.UUIDV4 },
            tallyUpdatedAt: { type: i.INTEGER, required: !0 },
            uptoDate: { type: i.BOOLEAN, required: !0 },
            masterId: { type: i.INTEGER, required: !0 },
            alterId: { type: i.INTEGER, required: !0 },
            oldName: { type: i.STRING, required: !0 },
            isDeleted: { type: i.BOOLEAN, required: !0 },
            gstDetails: { type: i.ABSTRACT, required: !1 },
            vatDetails: { type: i.ABSTRACT, required: !1 },
            hsnDetails: { type: i.ABSTRACT, required: !1 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = s.PathUtil.getDbPath(this.userId, this.company),
            t = new u.SQLConfig();
          p.open(e, "r", function (r, n) {
            if (r && "ENOENT" == r.code);
            else {
              var a = t.connect(e);
              a.serialize(function () {
                a.all(
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='stockGroups'",
                  function (e, t) {
                    e
                      ? s.Log.error(e)
                      : c.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(stockGroups)", function (e, t) {
                          if (e) s.Log.error(e);
                          else {
                            for (var r = !1, n = !1, i = 0, o = t; i < o.length; i++) {
                              var u = o[i];
                              ("vatDetails" === u.name && (r = !0),
                                "hsnDetails" === u.name && (n = !0));
                            }
                            (!1 === r && a.run("ALTER TABLE stockGroups ADD vatDetails ABSTRACT"),
                              !1 === n && a.run("ALTER TABLE stockGroups ADD hsnDetails ABSTRACT"));
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
    })(o.ModelBase);
  t.default = l;
};
