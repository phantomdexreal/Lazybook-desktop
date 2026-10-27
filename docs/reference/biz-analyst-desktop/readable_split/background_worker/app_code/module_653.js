// webpack module #653 (from background_worker, BA Mobile Connector 8.4.41)
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
    s = r(0),
    u = r(14),
    p = r(32),
    c = (function (e) {
      function t(t, r) {
        return e.call(this, t, r) || this;
      }
      return (
        a(t, e),
        (t.prototype.getModelName = function () {
          return "ledger_entries";
        }),
        (t.prototype.getAttributes = function () {
          return {
            _id: { type: o.STRING, required: !0, primaryKey: !0 },
            name: { type: o.STRING, required: !1 },
            userEmail: { type: o.STRING, required: !1 },
            userName: { type: o.STRING, required: !1 },
            parentGroup: { type: o.STRING, required: !1 },
            userId: { type: o.STRING, required: !1 },
            serverUpdatedAt: { type: o.INTEGER, required: !1 },
            tallyUpdatedAt: { type: o.INTEGER, required: !1 },
            companyId: { type: o.STRING, required: !1 },
            isDeleted: { type: o.BOOLEAN, required: !1 },
            contactDetails: { type: o.ABSTRACT, required: !1 },
            creditPeriod: { type: o.INTEGER, required: !1 },
            creditLimit: { type: o.STRING, required: !1 },
            creditLimitType: { type: o.STRING, required: !1 },
            cstNumber: { type: o.STRING, required: !1 },
            gstIn: { type: o.STRING, required: !1 },
            tallyErrorMessage: { type: o.STRING, required: !1 },
            tallyMasterId: { type: o.STRING, required: !1 },
            status: { type: o.STRING, required: !1 },
            createdAt: { type: o.INTEGER, required: !1 },
            updatedAt: { type: o.INTEGER, required: !1 },
            vatTinNumber: { type: o.STRING, required: !1 },
            panNumber: { type: o.STRING, required: !1 },
            priceLevel: { type: o.STRING, required: !1 },
            isBillwiseOn: { type: o.BOOLEAN, required: !1 },
            gstRegistrationType: { type: o.STRING, required: !1 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = s.PathUtil.getDbPath(this.userId, this.company),
            t = new p.SQLConfig();
          i.open(e, "r", function (r, n) {
            if (r && "ENOENT" == r.code) s.Log.error(r);
            else {
              var a = t.connect(e);
              a.serialize(function () {
                a.all(
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='ledger_entries'",
                  function (e, t) {
                    e
                      ? s.Log.error(e)
                      : s.Util.isFilledArray(t) &&
                        a.all("PRAGMA table_info(ledger_entries)", function (e, t) {
                          if (e) s.Log.error(e);
                          else {
                            for (
                              var r = !1, n = !1, i = !1, o = !1, u = !1, p = 0, c = t;
                              p < c.length;
                              p++
                            ) {
                              var l = c[p];
                              "vatTinNumber" === l.name
                                ? (r = !0)
                                : "panNumber" === l.name
                                  ? (n = !0)
                                  : "priceLevel" === l.name
                                    ? (i = !0)
                                    : "isBillwiseOn" === l.name
                                      ? (o = !0)
                                      : "gstRegistrationType" === l.name && (u = !0);
                            }
                            (!1 === r && a.run("ALTER TABLE ledger_entries ADD vatTinNumber TEXT"),
                              !1 === n && a.run("ALTER TABLE ledger_entries ADD panNumber TEXT"),
                              !1 === i && a.run("ALTER TABLE ledger_entries ADD priceLevel TEXT"),
                              !1 === o &&
                                a.run("ALTER TABLE ledger_entries ADD isBillwiseOn BOOLEAN"),
                              !1 === u &&
                                a.run("ALTER TABLE ledger_entries ADD gstRegistrationType TEXT"));
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
    })(u.ModelBase);
  t.default = c;
};
