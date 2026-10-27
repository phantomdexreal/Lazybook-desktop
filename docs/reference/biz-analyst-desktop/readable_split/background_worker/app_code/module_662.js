// webpack module #662 (from background_worker, BA Mobile Connector 8.4.41)
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
      function t(t, r) {
        return e.call(this, t, r) || this;
      }
      return (
        a(t, e),
        (t.prototype.getModelName = function () {
          return "stockItem";
        }),
        (t.prototype.getAttributes = function (e) {
          return {
            _id: { type: o.UUID, primaryKey: !0, defaultValue: o.UUIDV4 },
            name: { type: o.STRING, required: !1 },
            parentGroup: { type: o.STRING, required: !1 },
            aliases: { type: o.ABSTRACT, required: !0 },
            category: { type: o.STRING, required: !1 },
            openingStock: { type: o.TEXT, required: !1 },
            closingStock: { type: o.TEXT, required: !1 },
            subOpeningStock: { type: o.INTEGER, required: !1 },
            subClosingStock: { type: o.INTEGER, required: !1 },
            openingRate: { type: o.TEXT, required: !1 },
            closingRate: { type: o.TEXT, required: !1 },
            openingAmount: { type: o.TEXT, required: !1 },
            closingAmount: { type: o.TEXT, required: !1 },
            alternateOpeningStock: { type: o.TEXT, required: !1 },
            alternateClosingStock: { type: o.TEXT, required: !1 },
            unit: { type: o.STRING, required: !1 },
            mainUnit: { type: o.STRING, required: !1 },
            subUnit: { type: o.STRING, required: !1 },
            alternateUnit: { type: o.STRING, required: !1 },
            denominator: { type: o.INTEGER, required: !1 },
            conversion: { type: o.INTEGER, required: !1 },
            ignorePhysicalDifference: { type: o.STRING, required: !1 },
            batches: { type: o.ABSTRACT, required: !0 },
            tallyUpdatedAt: { type: o.INTEGER, required: !0 },
            uptoDate: { type: o.BOOLEAN, required: !0 },
            masterId: { type: o.INTEGER, required: !0 },
            alterId: { type: o.INTEGER, required: !0 },
            oldName: { type: o.STRING, required: !0 },
            lastSaleDate: { type: o.INTEGER, required: !1 },
            isDeleted: { type: o.BOOLEAN, required: !0 },
            gstDetails: { type: o.ABSTRACT, required: !1 },
            gstApplicable: { type: o.BOOLEAN, required: !1 },
            alias: { type: o.STRING, required: !1 },
            partNumber: { type: o.STRING, required: !1 },
            reOrderBase: { type: o.INTEGER, required: !1 },
            minOrderBase: { type: o.INTEGER, required: !1 },
            priceList: { type: o.ABSTRACT, required: !1 },
            standardPriceList: { type: o.ABSTRACT, required: !1 },
            standardCostList: { type: o.ABSTRACT, required: !1 },
            desc: { type: o.STRING, required: !1 },
            vatDetails: { type: o.ABSTRACT, required: !1 },
            vatApplicable: { type: o.BOOLEAN, required: !1 },
            mrpDetails: { type: o.ABSTRACT, required: !1 },
            costingMethod: { type: o.STRING, required: !1 },
            valuationMethod: { type: o.STRING, required: !1 },
            isCostCentresOn: { type: o.BOOLEAN, required: !1 },
            isPerishableOn: { type: o.BOOLEAN, required: !1 },
            reOrderAsHigher: { type: o.BOOLEAN, required: !1 },
            minOrderAsHighe: { type: o.BOOLEAN, required: !1 },
            gstTypeOfSupply: { type: o.STRING, required: !1 },
            hsnDetails: { type: o.ABSTRACT, required: !1 },
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
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='stockItems'",
                  function (e, t) {
                    e
                      ? u.Log.error(e)
                      : s.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(stockItems)", function (e, t) {
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
                                k = !1,
                                R = !1,
                                C = !1,
                                E = !1,
                                _ = !1,
                                D = 0,
                                L = t;
                              D < L.length;
                              D++
                            ) {
                              var x = L[D];
                              ("aliases" === x.name && (r = !0),
                                "alias" === x.name && (n = !0),
                                "partNumber" === x.name && (i = !0),
                                "priceList" === x.name && (o = !0),
                                "standardPriceList" === x.name && (s = !0),
                                "standardCostList" === x.name && (p = !0),
                                "reOrderBase" === x.name && (c = !0),
                                "minOrderBase" === x.name && (l = !0),
                                "mainUnit" === x.name && (m = !0),
                                "subUnit" === x.name && (d = !0),
                                "alternateUnit" === x.name && (y = !0),
                                "denominator" === x.name && (b = !0),
                                "conversion" === x.name && (h = !0),
                                "subOpeningStock" === x.name && (f = !0),
                                "subClosingStock" === x.name && (g = !0),
                                "desc" === x.name && (M = !0),
                                "alternateOpeningStock" === x.name && (S = !0),
                                "alternateClosingStock" === x.name && (A = !0),
                                "gstApplicable" === x.name && (O = !0),
                                "vatDetails" === x.name && (N = !0),
                                "vatApplicable" === x.name && (v = !0),
                                "mrpDetails" === x.name && (T = !0),
                                "costingMethod" === x.name && (z = !0),
                                "valuationMethod" === x.name && (I = !0),
                                "isCostCentresOn" === x.name && (q = !0),
                                "isPerishableOn" === x.name && (k = !0),
                                "reOrderAsHigher" === x.name && (R = !0),
                                "minOrderAsHighe" === x.name && (C = !0),
                                "gstTypeOfSupply" === x.name && (E = !0),
                                "hsnDetails" === x.name && (_ = !0));
                            }
                            (!1 === r && a.run("ALTER TABLE stockItems ADD aliases ABSTRACT"),
                              !1 === n && a.run("ALTER TABLE stockItems ADD alias TEXT"),
                              !1 === i && a.run("ALTER TABLE stockItems ADD partNumber TEXT"),
                              !1 === o && a.run("ALTER TABLE stockItems ADD priceList ABSTRACT"),
                              !1 === s &&
                                a.run("ALTER TABLE stockItems ADD standardPriceList ABSTRACT"),
                              !1 === p &&
                                a.run("ALTER TABLE stockItems ADD standardCostList ABSTRACT"),
                              !1 === c && a.run("ALTER TABLE stockItems ADD reOrderBase TEXT"),
                              !1 === l && a.run("ALTER TABLE stockItems ADD minOrderBase TEXT"),
                              !1 === m && a.run("ALTER TABLE stockItems ADD mainUnit TEXT"),
                              !1 === d && a.run("ALTER TABLE stockItems ADD subUnit TEXT"),
                              !1 === y && a.run("ALTER TABLE stockItems ADD alternateUnit TEXT"),
                              !1 === b && a.run("ALTER TABLE stockItems ADD denominator TEXT"),
                              !1 === h && a.run("ALTER TABLE stockItems ADD conversion ABSTRACT"),
                              !1 === f && a.run("ALTER TABLE stockItems ADD subOpeningStock TEXT"),
                              !1 === g && a.run("ALTER TABLE stockItems ADD subClosingStock TEXT"),
                              !1 === M && a.run("ALTER TABLE stockItems ADD desc TEXT"),
                              !1 === S &&
                                a.run("ALTER TABLE stockItems ADD alternateOpeningStock TEXT"),
                              !1 === A &&
                                a.run("ALTER TABLE stockItems ADD alternateClosingStock TEXT"),
                              !1 === O && a.run("ALTER TABLE stockItems ADD gstApplicable BOOLEAN"),
                              !1 === N && a.run("ALTER TABLE stockItems ADD vatDetails ABSTRACT"),
                              !1 === v && a.run("ALTER TABLE stockItems ADD vatApplicable BOOLEAN"),
                              !1 === T && a.run("ALTER TABLE stockItems ADD mrpDetails ABSTRACT"),
                              !1 === z && a.run("ALTER TABLE stockItems ADD costingMethod TEXT"),
                              !1 === I && a.run("ALTER TABLE stockItems ADD valuationMethod TEXT"),
                              !1 === q &&
                                a.run("ALTER TABLE stockItems ADD isCostCentresOn BOOLEAN"),
                              !1 === k &&
                                a.run("ALTER TABLE stockItems ADD isPerishableOn BOOLEAN"),
                              !1 === R &&
                                a.run("ALTER TABLE stockItems ADD reOrderAsHigher BOOLEAN"),
                              !1 === C &&
                                a.run("ALTER TABLE stockItems ADD minOrderAsHighe BOOLEAN"),
                              !1 === E && a.run("ALTER TABLE stockItems ADD gstTypeOfSupply TEXT"),
                              !1 === _ && a.run("ALTER TABLE stockItems ADD hsnDetails ABSTRACT"));
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
