// webpack module #932 (from electron_main_process, BA Mobile Connector 8.4.41)
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
          return "ledger";
        }),
        (t.prototype.getAttributes = function (e) {
          return {
            _id: { type: s.UUID, primaryKey: !0, defaultValue: s.UUIDV4 },
            name: { type: s.STRING, required: !1 },
            parentGroup: { type: s.STRING, required: !1 },
            aliases: { type: s.ABSTRACT, required: !0 },
            currency: { type: s.STRING, required: !1 },
            openingAmount: { type: s.STRING, required: !1 },
            creditPeriodMs: { type: s.STRING, required: !1 },
            creditLimit: { type: s.STRING, required: !1 },
            fromDate: { type: s.TEXT, required: !1 },
            salesType: { type: s.STRING, required: !1 },
            vatNo: { type: s.STRING, required: !1 },
            cstNo: { type: s.STRING, required: !1 },
            taxType: { type: s.STRING, required: !1 },
            exciseNo: { type: s.STRING, required: !1 },
            incomeTaxNumber: { type: s.STRING, required: !1 },
            stRegNo: { type: s.STRING, required: !1 },
            performance: { type: s.TEXT, required: !1 },
            contact: { type: s.ABSTRACT, required: !0 },
            mailingDetails: { type: s.ABSTRACT, required: !1 },
            pendingBills: { type: s.ABSTRACT, required: !0 },
            groupList: { type: s.ABSTRACT, required: !0 },
            tags: { type: s.ABSTRACT, required: !0 },
            bank: { type: s.ABSTRACT, required: !0 },
            tallyUpdatedAt: { type: s.INTEGER, required: !0 },
            uptoDate: { type: s.BOOLEAN, required: !0 },
            masterId: { type: s.INTEGER, required: !0 },
            alterId: { type: s.INTEGER, required: !0 },
            oldName: { type: s.STRING, required: !0 },
            gstNatureOfSupply: { type: s.STRING, required: !0 },
            gstTypeOfSupply: { type: s.STRING, required: !1 },
            partyGstIn: { type: s.STRING, required: !0 },
            isECommOperator: { type: s.STRING, required: !0 },
            gstDutyHead: { type: s.STRING, required: !0 },
            gstDutyHeadNew: { type: s.STRING, required: !1 },
            alias: { type: s.STRING, required: !1 },
            isDeleted: { type: s.BOOLEAN, required: !0 },
            gstDetails: { type: s.ABSTRACT, required: !0 },
            hsnDetails: { type: s.ABSTRACT, required: !1 },
            gstRegDetails: { type: s.ABSTRACT, required: !1 },
            gstAppropriateTo: { type: s.STRING, required: !1 },
            appropriateFor: { type: s.STRING, required: !1 },
            gstApplicable: { type: s.BOOLEAN, required: !1 },
            exciseAllocType: { type: s.STRING, required: !1 },
            isBillWiseOff: { type: s.BOOLEAN, required: !0 },
            onAccountAmount: { type: s.INTEGER, required: !1 },
            desc: { type: s.STRING, required: !1 },
            priceLevel: { type: s.STRING, required: !1 },
            rateOfTax: { type: s.INTEGER, required: !1 },
            gstRegistrationType: { type: s.STRING, required: !1 },
            roundingMethod: { type: s.STRING, required: !1 },
            roundingLimit: { type: s.INTEGER, required: !1 },
            typeOfLedger: { type: s.STRING, required: !1 },
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
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='ledgers'",
                  function (e, t) {
                    e
                      ? u.Log.error(e)
                      : n.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(ledgers)", function (e, t) {
                          if (e) u.Log.error(e);
                          else {
                            for (
                              var r = !1,
                                i = !1,
                                o = !1,
                                s = !1,
                                n = !1,
                                p = !1,
                                c = !1,
                                m = !1,
                                l = !1,
                                d = !1,
                                y = !1,
                                b = !1,
                                h = !1,
                                g = !1,
                                S = !1,
                                f = !1,
                                A = !1,
                                N = !1,
                                I = !1,
                                T = !1,
                                M = !1,
                                v = !1,
                                k = !1,
                                C = !1,
                                q = !1,
                                R = 0,
                                D = t;
                              R < D.length;
                              R++
                            ) {
                              var E = D[R];
                              "gstNatureOfSupply" === E.name
                                ? (r = !0)
                                : "gstTypeOfSupply" === E.name
                                  ? (i = !0)
                                  : "partyGstIn" === E.name
                                    ? (o = !0)
                                    : "gstDutyHead" === E.name
                                      ? (s = !0)
                                      : "isECommOperator" === E.name
                                        ? (n = !0)
                                        : "alias" === E.name
                                          ? (p = !0)
                                          : "aliases" === E.name
                                            ? (c = !0)
                                            : "gstDetails" === E.name
                                              ? (m = !0)
                                              : "gstAppropriateTo" === E.name
                                                ? (l = !0)
                                                : "appropriateFor" === E.name
                                                  ? (d = !0)
                                                  : "gstApplicable" === E.name
                                                    ? (y = !0)
                                                    : "exciseAllocType" === E.name
                                                      ? (b = !0)
                                                      : "isBillWiseOff" === E.name
                                                        ? (h = !0)
                                                        : "onAccountAmount" === E.name
                                                          ? (g = !0)
                                                          : "desc" === E.name
                                                            ? (S = !0)
                                                            : "priceLevel" === E.name
                                                              ? (f = !0)
                                                              : "rateOfTax" === E.name
                                                                ? (A = !0)
                                                                : "gstRegistrationType" === E.name
                                                                  ? (N = !0)
                                                                  : "roundingMethod" === E.name
                                                                    ? (I = !0)
                                                                    : "roundingLimit" === E.name
                                                                      ? (T = !0)
                                                                      : "mailingDetails" === E.name
                                                                        ? (M = !0)
                                                                        : "gstDutyHeadNew" ===
                                                                            E.name
                                                                          ? (v = !0)
                                                                          : "hsnDetails" === E.name
                                                                            ? (k = !0)
                                                                            : "gstRegDetails" ===
                                                                                E.name
                                                                              ? (C = !0)
                                                                              : "typeOfLedger" ===
                                                                                  E.name &&
                                                                                (q = !0);
                            }
                            (!1 === r && a.run("ALTER TABLE ledgers ADD gstNatureOfSupply TEXT"),
                              !1 === i && a.run("ALTER TABLE ledgers ADD gstTypeOfSupply TEXT"),
                              !1 === o && a.run("ALTER TABLE ledgers ADD partyGstIn TEXT"),
                              !1 === s && a.run("ALTER TABLE ledgers ADD gstDutyHead TEXT"),
                              !1 === n && a.run("ALTER TABLE ledgers ADD isECommOperator TEXT"),
                              !1 === p && a.run("ALTER TABLE ledgers ADD alias TEXT"),
                              !1 === c && a.run("ALTER TABLE ledgers ADD aliases ABSTRACT"),
                              !1 === m && a.run("ALTER TABLE ledgers ADD gstDetails ABSTRACT"),
                              !1 === l && a.run("ALTER TABLE ledgers ADD gstAppropriateTo TEXT"),
                              !1 === d && a.run("ALTER TABLE ledgers ADD appropriateFor TEXT"),
                              !1 === y && a.run("ALTER TABLE ledgers ADD gstApplicable BOOLEAN"),
                              !1 === b && a.run("ALTER TABLE ledgers ADD exciseAllocType TEXT"),
                              !1 === h && a.run("ALTER TABLE ledgers ADD isBillWiseOff BOOLEAN"),
                              !1 === g && a.run("ALTER TABLE ledgers ADD onAccountAmount INTEGER"),
                              !1 === S && a.run("ALTER TABLE ledgers ADD desc TEXT"),
                              !1 === f && a.run("ALTER TABLE ledgers ADD priceLevel TEXT"),
                              !1 === A && a.run("ALTER TABLE ledgers ADD rateOfTax INTEGER"),
                              !1 === N && a.run("ALTER TABLE ledgers ADD gstRegistrationType TEXT"),
                              !1 === I && a.run("ALTER TABLE ledgers ADD roundingMethod TEXT"),
                              !1 === T && a.run("ALTER TABLE ledgers ADD roundingLimit INTEGER"),
                              !1 === M && a.run("ALTER TABLE ledgers ADD mailingDetails ABSTRACT"),
                              !1 === v && a.run("ALTER TABLE ledgers ADD gstDutyHeadNew TEXT"),
                              !1 === k && a.run("ALTER TABLE ledgers ADD hsnDetails ABSTRACT"),
                              !1 === C && a.run("ALTER TABLE ledgers ADD gstRegDetails ABSTRACT"),
                              !1 === q && a.run("ALTER TABLE ledgers ADD typeOfLedger TEXT"));
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
