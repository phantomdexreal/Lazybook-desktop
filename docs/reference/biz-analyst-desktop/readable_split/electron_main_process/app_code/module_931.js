// webpack module #931 (from electron_main_process, BA Mobile Connector 8.4.41)
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
    n = r(2),
    u = r(18),
    p = r(34),
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
            _id: { type: s.STRING, required: !0, primaryKey: !0 },
            name: { type: s.STRING, required: !1 },
            userEmail: { type: s.STRING, required: !1 },
            userName: { type: s.STRING, required: !1 },
            parentGroup: { type: s.STRING, required: !1 },
            userId: { type: s.STRING, required: !1 },
            serverUpdatedAt: { type: s.INTEGER, required: !1 },
            tallyUpdatedAt: { type: s.INTEGER, required: !1 },
            companyId: { type: s.STRING, required: !1 },
            isDeleted: { type: s.BOOLEAN, required: !1 },
            contactDetails: { type: s.ABSTRACT, required: !1 },
            creditPeriod: { type: s.INTEGER, required: !1 },
            creditLimit: { type: s.STRING, required: !1 },
            creditLimitType: { type: s.STRING, required: !1 },
            cstNumber: { type: s.STRING, required: !1 },
            gstIn: { type: s.STRING, required: !1 },
            tallyErrorMessage: { type: s.STRING, required: !1 },
            tallyMasterId: { type: s.STRING, required: !1 },
            status: { type: s.STRING, required: !1 },
            createdAt: { type: s.INTEGER, required: !1 },
            updatedAt: { type: s.INTEGER, required: !1 },
            vatTinNumber: { type: s.STRING, required: !1 },
            panNumber: { type: s.STRING, required: !1 },
            priceLevel: { type: s.STRING, required: !1 },
            isBillwiseOn: { type: s.BOOLEAN, required: !1 },
            gstRegistrationType: { type: s.STRING, required: !1 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = n.PathUtil.getDbPath(this.userId, this.company),
            t = new p.SQLConfig();
          o.open(e, "r", function (r, i) {
            if (r && "ENOENT" == r.code) n.Log.error(r);
            else {
              var a = t.connect(e);
              a.serialize(function () {
                a.all(
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='ledger_entries'",
                  function (e, t) {
                    e
                      ? n.Log.error(e)
                      : n.Util.isFilledArray(t) &&
                        a.all("PRAGMA table_info(ledger_entries)", function (e, t) {
                          if (e) n.Log.error(e);
                          else {
                            for (
                              var r = !1, i = !1, o = !1, s = !1, u = !1, p = 0, c = t;
                              p < c.length;
                              p++
                            ) {
                              var m = c[p];
                              "vatTinNumber" === m.name
                                ? (r = !0)
                                : "panNumber" === m.name
                                  ? (i = !0)
                                  : "priceLevel" === m.name
                                    ? (o = !0)
                                    : "isBillwiseOn" === m.name
                                      ? (s = !0)
                                      : "gstRegistrationType" === m.name && (u = !0);
                            }
                            (!1 === r && a.run("ALTER TABLE ledger_entries ADD vatTinNumber TEXT"),
                              !1 === i && a.run("ALTER TABLE ledger_entries ADD panNumber TEXT"),
                              !1 === o && a.run("ALTER TABLE ledger_entries ADD priceLevel TEXT"),
                              !1 === s &&
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
