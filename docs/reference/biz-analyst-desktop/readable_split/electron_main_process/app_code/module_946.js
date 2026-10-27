// webpack module #946 (from electron_main_process, BA Mobile Connector 8.4.41)
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
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.prototype.getModelName = function () {
          return "voucherType";
        }),
        (t.prototype.getAttributes = function () {
          return {
            name: { type: s.STRING, required: !1 },
            reservedName: { type: s.STRING, required: !1 },
            parent: { type: s.STRING, required: !1 },
            _id: { type: s.UUID, primaryKey: !0, defaultValue: s.UUIDV4 },
            aliases: { type: s.ABSTRACT, required: !0 },
            tallyUpdatedAt: { type: s.INTEGER, required: !0 },
            uptoDate: { type: s.BOOLEAN, required: !0 },
            masterId: { type: s.INTEGER, required: !0 },
            alterId: { type: s.INTEGER, required: !0 },
            oldName: { type: s.STRING, required: !0 },
            isDeleted: { type: s.BOOLEAN, required: !0 },
            useForPosInvoice: { type: s.BOOLEAN, required: !1 },
            numberingMethod: { type: s.STRING, required: !1 },
            preventDuplicates: { type: s.BOOLEAN, required: !1 },
            voucherClassList: { type: s.ABSTRACT, required: !1 },
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
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='voucherTypes'",
                  function (e, t) {
                    e
                      ? u.Log.error(e)
                      : n.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(voucherTypes)", function (e, t) {
                          if (e) u.Log.error(e);
                          else {
                            for (
                              var r = !1, i = !1, o = !1, s = !1, n = !1, p = 0, c = t;
                              p < c.length;
                              p++
                            ) {
                              var m = c[p];
                              ("aliases" === m.name && (r = !0),
                                "useForPosInvoice" === m.name && (i = !0),
                                "numberingMethod" === m.name && (o = !0),
                                "preventDuplicates" === m.name && (s = !0),
                                "voucherClassList" === m.name && (n = !0));
                            }
                            (!1 === r && a.run("ALTER TABLE voucherTypes ADD aliases ABSTRACT"),
                              !1 === i &&
                                a.run("ALTER TABLE voucherTypes ADD useForPosInvoice BOOLEAN"),
                              !1 === o &&
                                a.run("ALTER TABLE voucherTypes ADD numberingMethod TEXT"),
                              !1 === s &&
                                a.run("ALTER TABLE voucherTypes ADD preventDuplicates BOOLEAN"),
                              !1 === n &&
                                a.run("ALTER TABLE voucherTypes ADD voucherClassList ABSTRACT"));
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
