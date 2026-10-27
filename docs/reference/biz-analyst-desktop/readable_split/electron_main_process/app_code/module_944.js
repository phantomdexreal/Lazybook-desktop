// webpack module #944 (from electron_main_process, BA Mobile Connector 8.4.41)
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
    n = r(22),
    u = r(10),
    p = r(2),
    c = r(34),
    m = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.prototype.getModelName = function () {
          return "unit";
        }),
        (t.prototype.getAttributes = function () {
          return {
            name: { type: o.STRING, required: !1 },
            isSimpleUnit: { type: o.BOOLEAN, required: !1 },
            baseUnits: { type: o.STRING, required: !1 },
            additionalUnits: { type: o.STRING, required: !1 },
            conversion: { type: o.INTEGER, required: !1 },
            unitQuantityCode: { type: o.STRING, required: !1 },
            _id: { type: o.UUID, primaryKey: !0, defaultValue: o.UUIDV4 },
            tallyUpdatedAt: { type: o.INTEGER, required: !0 },
            uptoDate: { type: o.BOOLEAN, required: !0 },
            masterId: { type: o.INTEGER, required: !0 },
            alterId: { type: o.INTEGER, required: !0 },
            oldName: { type: o.STRING, required: !0 },
            isDeleted: { type: o.BOOLEAN, required: !0 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = p.PathUtil.getDbPath(this.userId, this.company),
            t = new c.SQLConfig();
          n.open(e, "r", function (r, i) {
            if (r && "ENOENT" == r.code);
            else {
              var a = t.connect(e);
              a.serialize(function () {
                a.all(
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='units'",
                  function (e, t) {
                    e
                      ? p.Log.error(e)
                      : u.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(units)", function (e, t) {
                          if (e) p.Log.error(e);
                          else {
                            for (var r = !1, i = 0, o = t; i < o.length; i++) {
                              "unitQuantityCode" === o[i].name && (r = !0);
                            }
                            !1 === r && a.run("ALTER TABLE units ADD unitQuantityCode TEXT");
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
