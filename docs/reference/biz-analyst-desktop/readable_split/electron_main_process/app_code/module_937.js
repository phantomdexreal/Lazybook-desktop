// webpack module #937 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var o = r(17),
    s = r(18),
    n = r(2),
    u = r(34),
    p = r(22),
    c = r(10),
    m = (function (e) {
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
            name: { type: o.STRING, required: !1 },
            parentGroup: { type: o.STRING, required: !1 },
            unit: { type: o.STRING, required: !1 },
            _id: { type: o.UUID, primaryKey: !0, defaultValue: o.UUIDV4 },
            tallyUpdatedAt: { type: o.INTEGER, required: !0 },
            uptoDate: { type: o.BOOLEAN, required: !0 },
            masterId: { type: o.INTEGER, required: !0 },
            alterId: { type: o.INTEGER, required: !0 },
            oldName: { type: o.STRING, required: !0 },
            isDeleted: { type: o.BOOLEAN, required: !0 },
            gstDetails: { type: o.ABSTRACT, required: !1 },
            vatDetails: { type: o.ABSTRACT, required: !1 },
            hsnDetails: { type: o.ABSTRACT, required: !1 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = n.PathUtil.getDbPath(this.userId, this.company),
            t = new u.SQLConfig();
          p.open(e, "r", function (r, i) {
            if (r && "ENOENT" == r.code);
            else {
              var a = t.connect(e);
              a.serialize(function () {
                a.all(
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='stockGroups'",
                  function (e, t) {
                    e
                      ? n.Log.error(e)
                      : c.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(stockGroups)", function (e, t) {
                          if (e) n.Log.error(e);
                          else {
                            for (var r = !1, i = !1, o = 0, s = t; o < s.length; o++) {
                              var u = s[o];
                              ("vatDetails" === u.name && (r = !0),
                                "hsnDetails" === u.name && (i = !0));
                            }
                            (!1 === r && a.run("ALTER TABLE stockGroups ADD vatDetails ABSTRACT"),
                              !1 === i && a.run("ALTER TABLE stockGroups ADD hsnDetails ABSTRACT"));
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
    })(s.ModelBase);
  t.default = m;
};
