// webpack module #939 (from electron_main_process, BA Mobile Connector 8.4.41)
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
          return "stockItem";
        }),
        (t.prototype.getAttributes = function (e) {
          return {
            _id: { type: s.UUID, primaryKey: !0, defaultValue: s.UUIDV4 },
            name: { type: s.STRING, required: !1 },
            parentGroup: { type: s.STRING, required: !1 },
            aliases: { type: s.ABSTRACT, required: !0 },
            category: { type: s.STRING, required: !1 },
            openingStock: { type: s.TEXT, required: !1 },
            closingStock: { type: s.TEXT, required: !1 },
            subOpeningStock: { type: s.INTEGER, required: !1 },
            subClosingStock: { type: s.INTEGER, required: !1 },
            openingRate: { type: s.TEXT, required: !1 },
            closingRate: { type: s.TEXT, required: !1 },
            openingAmount: { type: s.TEXT, required: !1 },
            closingAmount: { type: s.TEXT, required: !1 },
            alternateOpeningStock: { type: s.TEXT, required: !1 },
            alternateClosingStock: { type: s.TEXT, required: !1 },
            unit: { type: s.STRING, required: !1 },
            mainUnit: { type: s.STRING, required: !1 },
            subUnit: { type: s.STRING, required: !1 },
            alternateUnit: { type: s.STRING, required: !1 },
            denominator: { type: s.INTEGER, required: !1 },
            conversion: { type: s.INTEGER, required: !1 },
            ignorePhysicalDifference: { type: s.STRING, required: !1 },
            batches: { type: s.ABSTRACT, required: !0 },
            tallyUpdatedAt: { type: s.INTEGER, required: !0 },
            uptoDate: { type: s.BOOLEAN, required: !0 },
            masterId: { type: s.INTEGER, required: !0 },
            alterId: { type: s.INTEGER, required: !0 },
            oldName: { type: s.STRING, required: !0 },
            lastSaleDate: { type: s.INTEGER, required: !1 },
            isDeleted: { type: s.BOOLEAN, required: !0 },
            gstDetails: { type: s.ABSTRACT, required: !1 },
            gstApplicable: { type: s.BOOLEAN, required: !1 },
            alias: { type: s.STRING, required: !1 },
            partNumber: { type: s.STRING, required: !1 },
            reOrderBase: { type: s.INTEGER, required: !1 },
            minOrderBase: { type: s.INTEGER, required: !1 },
            priceList: { type: s.ABSTRACT, required: !1 },
            standardPriceList: { type: s.ABSTRACT, required: !1 },
            standardCostList: { type: s.ABSTRACT, required: !1 },
            desc: { type: s.STRING, required: !1 },
            vatDetails: { type: s.ABSTRACT, required: !1 },
            vatApplicable: { type: s.BOOLEAN, required: !1 },
            mrpDetails: { type: s.ABSTRACT, required: !1 },
            costingMethod: { type: s.STRING, required: !1 },
            valuationMethod: { type: s.STRING, required: !1 },
            isCostCentresOn: { type: s.BOOLEAN, required: !1 },
            isPerishableOn: { type: s.BOOLEAN, required: !1 },
            reOrderAsHigher: { type: s.BOOLEAN, required: !1 },
            minOrderAsHighe: { type: s.BOOLEAN, required: !1 },
            gstTypeOfSupply: { type: s.STRING, required: !1 },
            hsnDetails: { type: s.ABSTRACT, required: !1 },
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
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='stockItems'",
                  function (e, t) {
                    e
                      ? u.Log.error(e)
                      : n.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(stockItems)", function (e, t) {
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
                                R = !1,
                                D = !1,
                                E = !1,
                                x = !1,
                                O = !1,
                                z = 0,
                                P = t;
                              z < P.length;
                              z++
                            ) {
                              var L = P[z];
                              ("aliases" === L.name && (r = !0),
                                "alias" === L.name && (i = !0),
                                "partNumber" === L.name && (o = !0),
                                "priceList" === L.name && (s = !0),
                                "standardPriceList" === L.name && (n = !0),
                                "standardCostList" === L.name && (p = !0),
                                "reOrderBase" === L.name && (c = !0),
                                "minOrderBase" === L.name && (m = !0),
                                "mainUnit" === L.name && (l = !0),
                                "subUnit" === L.name && (d = !0),
                                "alternateUnit" === L.name && (y = !0),
                                "denominator" === L.name && (b = !0),
                                "conversion" === L.name && (h = !0),
                                "subOpeningStock" === L.name && (g = !0),
                                "subClosingStock" === L.name && (S = !0),
                                "desc" === L.name && (f = !0),
                                "alternateOpeningStock" === L.name && (A = !0),
                                "alternateClosingStock" === L.name && (N = !0),
                                "gstApplicable" === L.name && (I = !0),
                                "vatDetails" === L.name && (T = !0),
                                "vatApplicable" === L.name && (M = !0),
                                "mrpDetails" === L.name && (v = !0),
                                "costingMethod" === L.name && (k = !0),
                                "valuationMethod" === L.name && (C = !0),
                                "isCostCentresOn" === L.name && (q = !0),
                                "isPerishableOn" === L.name && (R = !0),
                                "reOrderAsHigher" === L.name && (D = !0),
                                "minOrderAsHighe" === L.name && (E = !0),
                                "gstTypeOfSupply" === L.name && (x = !0),
                                "hsnDetails" === L.name && (O = !0));
                            }
                            (!1 === r && a.run("ALTER TABLE stockItems ADD aliases ABSTRACT"),
                              !1 === i && a.run("ALTER TABLE stockItems ADD alias TEXT"),
                              !1 === o && a.run("ALTER TABLE stockItems ADD partNumber TEXT"),
                              !1 === s && a.run("ALTER TABLE stockItems ADD priceList ABSTRACT"),
                              !1 === n &&
                                a.run("ALTER TABLE stockItems ADD standardPriceList ABSTRACT"),
                              !1 === p &&
                                a.run("ALTER TABLE stockItems ADD standardCostList ABSTRACT"),
                              !1 === c && a.run("ALTER TABLE stockItems ADD reOrderBase TEXT"),
                              !1 === m && a.run("ALTER TABLE stockItems ADD minOrderBase TEXT"),
                              !1 === l && a.run("ALTER TABLE stockItems ADD mainUnit TEXT"),
                              !1 === d && a.run("ALTER TABLE stockItems ADD subUnit TEXT"),
                              !1 === y && a.run("ALTER TABLE stockItems ADD alternateUnit TEXT"),
                              !1 === b && a.run("ALTER TABLE stockItems ADD denominator TEXT"),
                              !1 === h && a.run("ALTER TABLE stockItems ADD conversion ABSTRACT"),
                              !1 === g && a.run("ALTER TABLE stockItems ADD subOpeningStock TEXT"),
                              !1 === S && a.run("ALTER TABLE stockItems ADD subClosingStock TEXT"),
                              !1 === f && a.run("ALTER TABLE stockItems ADD desc TEXT"),
                              !1 === A &&
                                a.run("ALTER TABLE stockItems ADD alternateOpeningStock TEXT"),
                              !1 === N &&
                                a.run("ALTER TABLE stockItems ADD alternateClosingStock TEXT"),
                              !1 === I && a.run("ALTER TABLE stockItems ADD gstApplicable BOOLEAN"),
                              !1 === T && a.run("ALTER TABLE stockItems ADD vatDetails ABSTRACT"),
                              !1 === M && a.run("ALTER TABLE stockItems ADD vatApplicable BOOLEAN"),
                              !1 === v && a.run("ALTER TABLE stockItems ADD mrpDetails ABSTRACT"),
                              !1 === k && a.run("ALTER TABLE stockItems ADD costingMethod TEXT"),
                              !1 === C && a.run("ALTER TABLE stockItems ADD valuationMethod TEXT"),
                              !1 === q &&
                                a.run("ALTER TABLE stockItems ADD isCostCentresOn BOOLEAN"),
                              !1 === R &&
                                a.run("ALTER TABLE stockItems ADD isPerishableOn BOOLEAN"),
                              !1 === D &&
                                a.run("ALTER TABLE stockItems ADD reOrderAsHigher BOOLEAN"),
                              !1 === E &&
                                a.run("ALTER TABLE stockItems ADD minOrderAsHighe BOOLEAN"),
                              !1 === x && a.run("ALTER TABLE stockItems ADD gstTypeOfSupply TEXT"),
                              !1 === O && a.run("ALTER TABLE stockItems ADD hsnDetails ABSTRACT"));
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
