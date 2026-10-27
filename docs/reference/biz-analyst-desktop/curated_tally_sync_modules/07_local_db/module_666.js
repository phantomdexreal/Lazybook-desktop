// webpack module #666 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
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
      });
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(13),
    o = r(14),
    s = r(27),
    u = r(11),
    p = r(0),
    c = r(32),
    l = (function (e) {
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
            name: { type: i.STRING, required: !1 },
            isSimpleUnit: { type: i.BOOLEAN, required: !1 },
            baseUnits: { type: i.STRING, required: !1 },
            additionalUnits: { type: i.STRING, required: !1 },
            conversion: { type: i.INTEGER, required: !1 },
            unitQuantityCode: { type: i.STRING, required: !1 },
            _id: { type: i.UUID, primaryKey: !0, defaultValue: i.UUIDV4 },
            tallyUpdatedAt: { type: i.INTEGER, required: !0 },
            uptoDate: { type: i.BOOLEAN, required: !0 },
            masterId: { type: i.INTEGER, required: !0 },
            alterId: { type: i.INTEGER, required: !0 },
            oldName: { type: i.STRING, required: !0 },
            isDeleted: { type: i.BOOLEAN, required: !0 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = p.PathUtil.getDbPath(this.userId, this.company),
            t = new c.SQLConfig();
          s.open(e, "r", function (r, n) {
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
                            for (var r = !1, n = 0, i = t; n < i.length; n++) {
                              "unitQuantityCode" === i[n].name && (r = !0);
                            }
                            !1 === r && a.run("ALTER TABLE units ADD unitQuantityCode TEXT");
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
    })(o.ModelBase);
  t.default = l;
};
