// webpack module #654 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
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
  var i = r(27),
    o = r(13),
    s = r(11),
    u = r(0),
    p = r(14),
    c = r(32),
    l = (function (e) {
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
            _id: { type: o.UUID, primaryKey: !0, defaultValue: o.UUIDV4 },
            name: { type: o.STRING, required: !1 },
            parentGroup: { type: o.STRING, required: !1 },
            aliases: { type: o.ABSTRACT, required: !0 },
            currency: { type: o.STRING, required: !1 },
            openingAmount: { type: o.STRING, required: !1 },
            creditPeriodMs: { type: o.STRING, required: !1 },
            creditLimit: { type: o.STRING, required: !1 },
            fromDate: { type: o.TEXT, required: !1 },
            salesType: { type: o.STRING, required: !1 },
            vatNo: { type: o.STRING, required: !1 },
            cstNo: { type: o.STRING, required: !1 },
            taxType: { type: o.STRING, required: !1 },
            exciseNo: { type: o.STRING, required: !1 },
            incomeTaxNumber: { type: o.STRING, required: !1 },
            stRegNo: { type: o.STRING, required: !1 },
            performance: { type: o.TEXT, required: !1 },
            contact: { type: o.ABSTRACT, required: !0 },
            mailingDetails: { type: o.ABSTRACT, required: !1 },
            pendingBills: { type: o.ABSTRACT, required: !0 },
            groupList: { type: o.ABSTRACT, required: !0 },
            tags: { type: o.ABSTRACT, required: !0 },
            bank: { type: o.ABSTRACT, required: !0 },
            tallyUpdatedAt: { type: o.INTEGER, required: !0 },
            uptoDate: { type: o.BOOLEAN, required: !0 },
            masterId: { type: o.INTEGER, required: !0 },
            alterId: { type: o.INTEGER, required: !0 },
            oldName: { type: o.STRING, required: !0 },
            gstNatureOfSupply: { type: o.STRING, required: !0 },
            gstTypeOfSupply: { type: o.STRING, required: !1 },
            partyGstIn: { type: o.STRING, required: !0 },
            isECommOperator: { type: o.STRING, required: !0 },
            gstDutyHead: { type: o.STRING, required: !0 },
            gstDutyHeadNew: { type: o.STRING, required: !1 },
            alias: { type: o.STRING, required: !1 },
            isDeleted: { type: o.BOOLEAN, required: !0 },
            gstDetails: { type: o.ABSTRACT, required: !0 },
            hsnDetails: { type: o.ABSTRACT, required: !1 },
            gstRegDetails: { type: o.ABSTRACT, required: !1 },
            gstAppropriateTo: { type: o.STRING, required: !1 },
            appropriateFor: { type: o.STRING, required: !1 },
            gstApplicable: { type: o.BOOLEAN, required: !1 },
            exciseAllocType: { type: o.STRING, required: !1 },
            isBillWiseOff: { type: o.BOOLEAN, required: !0 },
            onAccountAmount: { type: o.INTEGER, required: !1 },
            desc: { type: o.STRING, required: !1 },
            priceLevel: { type: o.STRING, required: !1 },
            rateOfTax: { type: o.INTEGER, required: !1 },
            gstRegistrationType: { type: o.STRING, required: !1 },
            roundingMethod: { type: o.STRING, required: !1 },
            roundingLimit: { type: o.INTEGER, required: !1 },
            typeOfLedger: { type: o.STRING, required: !1 },
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
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='ledgers'",
                  function (e, t) {
                    e
                      ? u.Log.error(e)
                      : s.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(ledgers)", function (e, t) {
                          if (e) u.Log.error(e);
                          else {
                            for (
                              var r = !1,
                                n = !1,
                                i = !1,
                                o = !1,
                                s = !1,
                                p = !1,
                                c = !1,
                                l = !1,
                                m = !1,
                                d = !1,
                                y = !1,
                                b = !1,
                                h = !1,
                                f = !1,
                                g = !1,
                                M = !1,
                                S = !1,
                                A = !1,
                                O = !1,
                                N = !1,
                                v = !1,
                                T = !1,
                                z = !1,
                                I = !1,
                                q = !1,
                                k = 0,
                                R = t;
                              k < R.length;
                              k++
                            ) {
                              var C = R[k];
                              "gstNatureOfSupply" === C.name
                                ? (r = !0)
                                : "gstTypeOfSupply" === C.name
                                ? (n = !0)
                                : "partyGstIn" === C.name
                                ? (i = !0)
                                : "gstDutyHead" === C.name
                                ? (o = !0)
                                : "isECommOperator" === C.name
                                ? (s = !0)
                                : "alias" === C.name
                                ? (p = !0)
                                : "aliases" === C.name
                                ? (c = !0)
                                : "gstDetails" === C.name
                                ? (l = !0)
                                : "gstAppropriateTo" === C.name
                                ? (m = !0)
                                : "appropriateFor" === C.name
                                ? (d = !0)
                                : "gstApplicable" === C.name
                                ? (y = !0)
                                : "exciseAllocType" === C.name
                                ? (b = !0)
                                : "isBillWiseOff" === C.name
                                ? (h = !0)
                                : "onAccountAmount" === C.name
                                ? (f = !0)
                                : "desc" === C.name
                                ? (g = !0)
                                : "priceLevel" === C.name
                                ? (M = !0)
                                : "rateOfTax" === C.name
                                ? (S = !0)
                                : "gstRegistrationType" === C.name
                                ? (A = !0)
                                : "roundingMethod" === C.name
                                ? (O = !0)
                                : "roundingLimit" === C.name
                                ? (N = !0)
                                : "mailingDetails" === C.name
                                ? (v = !0)
                                : "gstDutyHeadNew" === C.name
                                ? (T = !0)
                                : "hsnDetails" === C.name
                                ? (z = !0)
                                : "gstRegDetails" === C.name
                                ? (I = !0)
                                : "typeOfLedger" === C.name && (q = !0);
                            }
                            !1 === r && a.run("ALTER TABLE ledgers ADD gstNatureOfSupply TEXT"),
                              !1 === n && a.run("ALTER TABLE ledgers ADD gstTypeOfSupply TEXT"),
                              !1 === i && a.run("ALTER TABLE ledgers ADD partyGstIn TEXT"),
                              !1 === o && a.run("ALTER TABLE ledgers ADD gstDutyHead TEXT"),
                              !1 === s && a.run("ALTER TABLE ledgers ADD isECommOperator TEXT"),
                              !1 === p && a.run("ALTER TABLE ledgers ADD alias TEXT"),
                              !1 === c && a.run("ALTER TABLE ledgers ADD aliases ABSTRACT"),
                              !1 === l && a.run("ALTER TABLE ledgers ADD gstDetails ABSTRACT"),
                              !1 === m && a.run("ALTER TABLE ledgers ADD gstAppropriateTo TEXT"),
                              !1 === d && a.run("ALTER TABLE ledgers ADD appropriateFor TEXT"),
                              !1 === y && a.run("ALTER TABLE ledgers ADD gstApplicable BOOLEAN"),
                              !1 === b && a.run("ALTER TABLE ledgers ADD exciseAllocType TEXT"),
                              !1 === h && a.run("ALTER TABLE ledgers ADD isBillWiseOff BOOLEAN"),
                              !1 === f && a.run("ALTER TABLE ledgers ADD onAccountAmount INTEGER"),
                              !1 === g && a.run("ALTER TABLE ledgers ADD desc TEXT"),
                              !1 === M && a.run("ALTER TABLE ledgers ADD priceLevel TEXT"),
                              !1 === S && a.run("ALTER TABLE ledgers ADD rateOfTax INTEGER"),
                              !1 === A && a.run("ALTER TABLE ledgers ADD gstRegistrationType TEXT"),
                              !1 === O && a.run("ALTER TABLE ledgers ADD roundingMethod TEXT"),
                              !1 === N && a.run("ALTER TABLE ledgers ADD roundingLimit INTEGER"),
                              !1 === v && a.run("ALTER TABLE ledgers ADD mailingDetails ABSTRACT"),
                              !1 === T && a.run("ALTER TABLE ledgers ADD gstDutyHeadNew TEXT"),
                              !1 === z && a.run("ALTER TABLE ledgers ADD hsnDetails ABSTRACT"),
                              !1 === I && a.run("ALTER TABLE ledgers ADD gstRegDetails ABSTRACT"),
                              !1 === q && a.run("ALTER TABLE ledgers ADD typeOfLedger TEXT");
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
    })(p.ModelBase);
  t.default = l;
};
