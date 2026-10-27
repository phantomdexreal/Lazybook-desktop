// webpack module #668 (from background_worker, BA Mobile Connector 8.4.41)
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
  var i = r(27),
    o = r(13),
    s = r(11),
    u = r(0),
    p = r(14),
    c = r(32),
    l = (function (e) {
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
            name: { type: o.STRING, required: !1 },
            reservedName: { type: o.STRING, required: !1 },
            parent: { type: o.STRING, required: !1 },
            _id: { type: o.UUID, primaryKey: !0, defaultValue: o.UUIDV4 },
            aliases: { type: o.ABSTRACT, required: !0 },
            tallyUpdatedAt: { type: o.INTEGER, required: !0 },
            uptoDate: { type: o.BOOLEAN, required: !0 },
            masterId: { type: o.INTEGER, required: !0 },
            alterId: { type: o.INTEGER, required: !0 },
            oldName: { type: o.STRING, required: !0 },
            isDeleted: { type: o.BOOLEAN, required: !0 },
            useForPosInvoice: { type: o.BOOLEAN, required: !1 },
            numberingMethod: { type: o.STRING, required: !1 },
            preventDuplicates: { type: o.BOOLEAN, required: !1 },
            voucherClassList: { type: o.ABSTRACT, required: !1 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = u.PathUtil.getDbPath(this.userId, this.company),
            t = new c.SQLConfig();
          i.open(e, "r", function (r, n) {
            if (r && "ENOENT" == r.code);
            else {
              var a = t.connect(e);
              a.serialize(function () {
                a.all(
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='voucherTypes'",
                  function (e, t) {
                    e
                      ? u.Log.error(e)
                      : s.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(voucherTypes)", function (e, t) {
                          if (e) u.Log.error(e);
                          else {
                            for (
                              var r = !1, n = !1, i = !1, o = !1, s = !1, p = 0, c = t;
                              p < c.length;
                              p++
                            ) {
                              var l = c[p];
                              ("aliases" === l.name && (r = !0),
                                "useForPosInvoice" === l.name && (n = !0),
                                "numberingMethod" === l.name && (i = !0),
                                "preventDuplicates" === l.name && (o = !0),
                                "voucherClassList" === l.name && (s = !0));
                            }
                            (!1 === r && a.run("ALTER TABLE voucherTypes ADD aliases ABSTRACT"),
                              !1 === n &&
                                a.run("ALTER TABLE voucherTypes ADD useForPosInvoice BOOLEAN"),
                              !1 === i &&
                                a.run("ALTER TABLE voucherTypes ADD numberingMethod TEXT"),
                              !1 === o &&
                                a.run("ALTER TABLE voucherTypes ADD preventDuplicates BOOLEAN"),
                              !1 === s &&
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
  t.default = l;
};
