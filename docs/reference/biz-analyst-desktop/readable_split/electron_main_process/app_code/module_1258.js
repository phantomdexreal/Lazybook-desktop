// webpack module #1258 (from electron_main_process, BA Mobile Connector 8.4.41)
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
      }),
    o =
      (this && this.__awaiter) ||
      function (e, t, r, i) {
        return new (r || (r = Promise))(function (a, o) {
          function s(e) {
            try {
              u(i.next(e));
            } catch (e) {
              o(e);
            }
          }
          function n(e) {
            try {
              u(i.throw(e));
            } catch (e) {
              o(e);
            }
          }
          function u(e) {
            e.done
              ? a(e.value)
              : new r(function (t) {
                  t(e.value);
                }).then(s, n);
          }
          u((i = i.apply(e, t || [])).next());
        });
      },
    s =
      (this && this.__generator) ||
      function (e, t) {
        var r,
          i,
          a,
          o,
          s = {
            label: 0,
            sent: function () {
              if (1 & a[0]) throw a[1];
              return a[1];
            },
            trys: [],
            ops: [],
          };
        return (
          (o = { next: n(0), throw: n(1), return: n(2) }),
          "function" == typeof Symbol &&
            (o[Symbol.iterator] = function () {
              return this;
            }),
          o
        );
        function n(o) {
          return function (n) {
            return (function (o) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; s;)
                try {
                  if (
                    ((r = 1),
                    i &&
                      (a =
                        2 & o[0]
                          ? i.return
                          : o[0]
                            ? i.throw || ((a = i.return) && a.call(i), 0)
                            : i.next) &&
                      !(a = a.call(i, o[1])).done)
                  )
                    return a;
                  switch (((i = 0), a && (o = [2 & o[0], a.value]), o[0])) {
                    case 0:
                    case 1:
                      a = o;
                      break;
                    case 4:
                      return (s.label++, { value: o[1], done: !1 });
                    case 5:
                      (s.label++, (i = o[1]), (o = [0]));
                      continue;
                    case 7:
                      ((o = s.ops.pop()), s.trys.pop());
                      continue;
                    default:
                      if (
                        !((a = s.trys),
                        (a = a.length > 0 && a[a.length - 1]) || (6 !== o[0] && 2 !== o[0]))
                      ) {
                        s = 0;
                        continue;
                      }
                      if (3 === o[0] && (!a || (o[1] > a[0] && o[1] < a[3]))) {
                        s.label = o[1];
                        break;
                      }
                      if (6 === o[0] && s.label < a[1]) {
                        ((s.label = a[1]), (a = o));
                        break;
                      }
                      if (a && s.label < a[2]) {
                        ((s.label = a[2]), s.ops.push(o));
                        break;
                      }
                      (a[2] && s.ops.pop(), s.trys.pop());
                      continue;
                  }
                  o = t.call(e, s);
                } catch (e) {
                  ((o = [6, e]), (i = 0));
                } finally {
                  r = a = 0;
                }
              if (5 & o[0]) throw o[1];
              return { value: o[0] ? o[1] : void 0, done: !0 };
            })([o, n]);
          };
        }
      };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(546),
    u = r(102),
    p = r(120),
    c = r(593),
    m = r(1259),
    l = r(2),
    d = r(51),
    y = r(5),
    b = r(32),
    h = r(28),
    g = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.prototype.getName = function () {
          return t.masterName;
        }),
        (t.prototype.getKeys = function () {
          return y.Master.keys.concat(t.keys);
        }),
        (t.prototype.parse = function (e, r) {
          return o(this, void 0, void 0, function () {
            var i;
            return s(this, function (a) {
              return ((i = []).push(t.convert(e, r)), [2, i]);
            });
          });
        }),
        (t.prototype.getSyncConfig = function () {
          return t.syncconfig;
        }),
        (t.prototype.equals = function (e) {
          return !!(
            y.Master.compare(this._id, e._id) &&
            y.Master.compare(this.isDeleted, e.isDeleted) &&
            y.Master.compare(this.name, e.name) &&
            y.Master.compare(this.parentGroup, e.parentGroup) &&
            y.Master.compare(this.aliases, e.aliases) &&
            y.Master.compare(this.category, e.category) &&
            y.Master.compare(this.openingStock, e.openingStock) &&
            y.Master.compare(this.closingStock, e.closingStock) &&
            y.Master.compare(this.subOpeningStock, e.subOpeningStock) &&
            y.Master.compare(this.subClosingStock, e.subClosingStock) &&
            y.Master.compare(this.openingAmount, e.openingAmount) &&
            y.Master.compare(this.closingAmount, e.closingAmount) &&
            y.Master.compare(this.alternateOpeningStock, e.alternateOpeningStock) &&
            y.Master.compare(this.alternateClosingStock, e.alternateClosingStock) &&
            y.Master.compare(this.unit, e.unit) &&
            y.Master.compare(this.mainUnit, e.mainUnit) &&
            y.Master.compare(this.subUnit, e.subUnit) &&
            y.Master.compare(this.alternateUnit, e.alternateUnit) &&
            y.Master.compare(this.denominator, e.denominator) &&
            y.Master.compare(this.conversion, e.conversion) &&
            y.Master.compare(this.ignorePhysicalDifference, e.ignorePhysicalDifference) &&
            y.Master.compare(this.batches, e.batches) &&
            y.Master.compare(this.lastSaleDate, e.lastSaleDate) &&
            y.Master.compare(this.gstDetails, e.gstDetails) &&
            y.Master.compare(this.hsnDetails, e.hsnDetails) &&
            y.Master.compare(this.vatDetails, e.vatDetails) &&
            y.Master.compare(this.mrpDetails, e.mrpDetails) &&
            y.Master.compare(this.vatApplicable, e.vatApplicable) &&
            y.Master.compare(this.gstApplicable, e.gstApplicable) &&
            y.Master.compare(this.alias, e.alias) &&
            y.Master.compare(this.partNumber, e.partNumber) &&
            y.Master.compare(this.reOrderBase, e.reOrderBase) &&
            y.Master.compare(this.minOrderBase, e.minOrderBase) &&
            y.Master.compare(this.priceList, e.priceList) &&
            y.Master.compare(this.standardPriceList, e.standardPriceList) &&
            y.Master.compare(this.standardCostList, e.standardCostList) &&
            y.Master.compare(this.desc, e.desc) &&
            y.Master.compare(this.costingMethod, e.costingMethod) &&
            y.Master.compare(this.valuationMethod, e.valuationMethod) &&
            y.Master.compare(this.isCostCentresOn, e.isCostCentresOn) &&
            y.Master.compare(this.isPerishableOn, e.isPerishableOn) &&
            y.Master.compare(this.reOrderAsHigher, e.reOrderAsHigher) &&
            y.Master.compare(this.minOrderAsHighe, e.minOrderAsHighe) &&
            y.Master.compare(this.gstTypeOfSupply, e.gstTypeOfSupply)
          );
        }),
        (t.prototype.updateFromTally = function (e) {
          ((this.isDeleted = e.isDeleted),
            (this.name = e.name),
            (this.parentGroup = e.parentGroup),
            (this.aliases = e.aliases),
            (this.category = e.category),
            (this.openingStock = e.openingStock),
            (this.closingStock = e.closingStock),
            (this.subOpeningStock = e.subOpeningStock),
            (this.subClosingStock = e.subClosingStock),
            (this.openingAmount = e.openingAmount),
            (this.closingAmount = e.closingAmount),
            (this.alternateOpeningStock = e.alternateOpeningStock),
            (this.alternateClosingStock = e.alternateClosingStock),
            (this.unit = e.unit),
            (this.mainUnit = e.mainUnit),
            (this.subUnit = e.subUnit),
            (this.alternateUnit = e.alternateUnit),
            (this.denominator = e.denominator),
            (this.conversion = e.conversion),
            (this.ignorePhysicalDifference = e.ignorePhysicalDifference),
            (this.batches = e.batches),
            (this.lastSaleDate = e.lastSaleDate),
            (this.gstDetails = e.gstDetails),
            (this.hsnDetails = e.hsnDetails),
            (this.vatDetails = e.vatDetails),
            (this.mrpDetails = e.mrpDetails),
            (this.gstApplicable = e.gstApplicable),
            (this.vatApplicable = e.vatApplicable),
            (this.alias = e.alias),
            (this.partNumber = e.partNumber),
            (this.reOrderBase = e.reOrderBase),
            (this.minOrderBase = e.minOrderBase),
            (this.priceList = e.priceList),
            (this.standardPriceList = e.standardPriceList),
            (this.standardCostList = e.standardCostList),
            (this.desc = e.desc),
            (this.costingMethod = e.costingMethod),
            (this.valuationMethod = e.valuationMethod),
            (this.isCostCentresOn = e.isCostCentresOn),
            (this.isPerishableOn = e.isPerishableOn),
            (this.reOrderAsHigher = e.reOrderAsHigher),
            (this.minOrderAsHighe = e.minOrderAsHighe),
            (this.gstTypeOfSupply = e.gstTypeOfSupply));
        }),
        (t.prototype.updateOldName = function (e) {
          y.Master.compare(this.name, e.name) || (this.oldName = this.name);
        }),
        (t.toObject = function (e) {
          var r = new t();
          if ((l.Util.assign(r, e), l.Util.isNotNull(e.aliases) && e.aliases.length > 0)) {
            r.aliases = [];
            for (var i = 0, a = e.aliases; i < a.length; i++) {
              var o = a[i];
              r.aliases.push(h.StringItem.toObject(o));
            }
          }
          if (l.Util.isNotNull(e.batches) && e.batches.length > 0) {
            r.batches = [];
            for (var s = 0, d = e.batches; s < d.length; s++) {
              var y = d[s];
              r.batches.push(n.default.toObject(y));
            }
          }
          if (l.Util.isNotNull(e.gstDetails) && e.gstDetails.length > 0) {
            r.gstDetails = [];
            for (var g = 0, S = e.gstDetails; g < S.length; g++) {
              var f = S[g];
              r.gstDetails.push(u.default.toObject(f));
            }
          }
          if (l.Util.isNotNull(e.hsnDetails) && e.hsnDetails.length > 0) {
            r.hsnDetails = [];
            for (var A = 0, N = e.hsnDetails; A < N.length; A++) {
              var I = N[A];
              r.hsnDetails.push(p.default.toObject(I));
            }
          }
          if (l.Util.isNotNull(e.vatDetails) && e.vatDetails.length > 0) {
            r.vatDetails = [];
            for (var T = 0, M = e.vatDetails; T < M.length; T++) {
              var v = M[T];
              r.vatDetails.push(c.default.toObject(v));
            }
          }
          if (l.Util.isNotNull(e.mrpDetails) && e.mrpDetails.length > 0) {
            r.mrpDetails = [];
            for (var k = 0, C = e.mrpDetails; k < C.length; k++) {
              var q = C[k];
              r.mrpDetails.push(m.default.toObject(q));
            }
          }
          if (l.Util.isNotNull(e.priceList) && e.priceList.length > 0) {
            r.priceList = [];
            for (var R = 0, D = e.priceList; R < D.length; R++) {
              var E = D[R];
              r.priceList.push(b.Price.toObject(E));
            }
          }
          if (l.Util.isNotNull(e.standardPriceList) && e.standardPriceList.length > 0) {
            r.standardPriceList = [];
            for (var x = 0, O = e.standardPriceList; x < O.length; x++) {
              E = O[x];
              r.standardPriceList.push(b.StandardRate.toObject(E));
            }
          }
          if (l.Util.isNotNull(e.standardCostList) && e.standardCostList.length > 0) {
            r.standardCostList = [];
            for (var z = 0, P = e.standardCostList; z < P.length; z++) {
              var L = P[z];
              r.standardCostList.push(b.StandardRate.toObject(L));
            }
          }
          return r;
        }),
        (t.masterName = "StockItem"),
        (t.keys = [
          "NAME",
          "GUID",
          "PARENT",
          "CATEGORY",
          "OPENINGBALANCE",
          "OPENINGVALUE",
          "CLOSINGBALANCE",
          "CLOSINGVALUE",
          "BASEUNITS",
          "ADDITIONALUNITS",
          "DENOMINATOR",
          "CONVERSION",
          "BATCHALLOCATIONS.LIST",
          "LASTSALEDATE",
          "GSTDETAILS.LIST",
          "HSNDETAILS.LIST",
          "GSTAPPLICABLE",
          "LANGUAGENAME.LIST",
          "MAILINGNAME.LIST",
          "REORDERBASE",
          "MINIMUMORDERBASE",
          "FULLPRICELIST.LIST",
          "STANDARDCOSTLIST.LIST",
          "STANDARDPRICELIST.LIST",
          "DESCRIPTION",
          "IGNOREPHYSICALDIFFERENCE",
          "COSTINGMETHOD",
          "VALUATIONMETHOD",
          "ISCOSTCENTRESON",
          "ISPERISHABLEON",
          "MRPDETAILS.LIST",
          "VATDETAILS.LIST",
          "VATAPPLICABLE",
          "REORDERASHIGHER",
          "MINORDERASHIGHE",
          "GSTTYPEOFSUPPLY",
        ]),
        (t.CLOSING_BALANCE_KEYS = [
          "GUID",
          "ALTERID",
          "MASTERID",
          "CLOSINGBALANCE",
          "CLOSINGVALUE",
        ]),
        (t.syncconfig = new d.SyncConfig(t.masterName, 36e5, 0)),
        (t.convert = function (e, r) {
          var i = new t();
          if (
            ((i._id = l.TallyUtil.getStringValue(e, "guid")),
            (i.masterId = l.TallyUtil.getIntValue(e, "masterid")),
            (i.alterId = l.TallyUtil.getIntValue(e, "alterid")),
            (i.name = l.TallyUtil.getStringValue(e, "name", !0)),
            l.Util.isEmpty(i._id) && (i._id = i.name),
            (i.parentGroup = l.TallyUtil.getStringValue(e, "parent")),
            (i.category = l.TallyUtil.getStringValue(e, "category")),
            (i.openingStock = l.TallyUtil.parseQuantity(
              l.TallyUtil.getJsonValue(e, "openingbalance"),
            )),
            (i.closingStock = l.TallyUtil.parseQuantity(
              l.TallyUtil.getJsonValue(e, "closingbalance"),
            )),
            (i.subOpeningStock = l.TallyUtil.parseAdditionalQuantity(
              l.TallyUtil.getJsonValue(e, "openingbalance"),
            )),
            (i.subClosingStock = l.TallyUtil.parseAdditionalQuantity(
              l.TallyUtil.getJsonValue(e, "closingbalance"),
            )),
            (i.openingAmount = l.TallyUtil.parseAmount(
              l.TallyUtil.getJsonValue(e, "openingvalue"),
            )),
            (i.closingAmount =
              -1 * l.TallyUtil.parseAmount(l.TallyUtil.getJsonValue(e, "closingvalue"))),
            (i.alternateOpeningStock = l.TallyUtil.parseAlternateQuantity(
              l.TallyUtil.getJsonValue(e, "openingbalance"),
            )),
            (i.alternateClosingStock = l.TallyUtil.parseAlternateQuantity(
              l.TallyUtil.getJsonValue(e, "closingbalance"),
            )),
            (i.desc = l.TallyUtil.getStringValue(e, "description")),
            (i.unit = l.TallyUtil.getStringValue(e, "baseunits")),
            l.Util.isNotEmpty(i.unit))
          ) {
            var a = b.Voucher.getUnitByName(i.unit);
            l.Util.isNotNull(a) &&
              (a.isSimpleUnit
                ? (i.mainUnit = a.name)
                : ((i.mainUnit = a.baseUnits), (i.subUnit = a.additionalUnits)));
          }
          ((i.alternateUnit = l.TallyUtil.getStringValue(e, "additionalunits")),
            (i.denominator = l.TallyUtil.getFloatValue(e, "denominator")),
            (i.conversion = l.TallyUtil.getFloatValue(e, "conversion")),
            (i.ignorePhysicalDifference = l.TallyUtil.getStringValue(
              e,
              "ignorephysicaldifference",
            )));
          var o = l.TallyUtil.parseArray(l.TallyUtil.getJsonValue(e, "batchallocations.list"));
          if (o.length > 0) {
            for (var s = [], d = 0; d < o.length; ++d)
              null !== o[d] && void 0 !== o[d] && s.push(n.default.convert(o[d], r));
            i.batches = s;
          }
          var y = l.TallyUtil.parseArray(l.TallyUtil.getJsonValue(e, "hsndetails.list"));
          if (l.Util.isFilledArray(y)) {
            var g = [];
            for (d = 0; d < y.length; ++d)
              null !== y[d] && void 0 !== y[d] && g.push(p.default.convert(y[d], r));
            i.hsnDetails = g;
          }
          var S = l.TallyUtil.parseArray(l.TallyUtil.getJsonValue(e, "gstdetails.list"));
          if (l.Util.isFilledArray(S)) {
            var f = [];
            for (d = 0; d < S.length; ++d)
              if (null !== S[d] && void 0 !== S[d])
                if (l.Util.isFilledArray(i.hsnDetails)) {
                  var A = u.default.convert(S[d], r);
                  f.push(b.GstClassification.modifyGstDetail(A, i.hsnDetails));
                } else f.push(u.default.convert(S[d], r));
            i.gstDetails = f;
          }
          var N = l.TallyUtil.parseArray(l.TallyUtil.getJsonValue(e, "vatdetails.list"));
          if (N.length > 0) {
            var I = [];
            for (d = 0; d < N.length; ++d)
              null !== N[d] && void 0 !== N[d] && I.push(c.default.convert(N[d], r));
            i.vatDetails = I;
          }
          var T = l.TallyUtil.parseArray(l.TallyUtil.getJsonValue(e, "mrpdetails.list"));
          if (T.length > 0) {
            var M = [];
            for (d = 0; d < T.length; ++d)
              null !== T[d] && void 0 !== T[d] && M.push(m.default.convert(T[d], r));
            i.mrpDetails = M;
          }
          var v = l.TallyUtil.getStringValue(e, "gstapplicable");
          l.Util.isNotEmpty(v) && v.toLowerCase().includes("not applicable")
            ? (i.gstApplicable = !1)
            : (i.gstApplicable = !0);
          var k = l.TallyUtil.getStringValue(e, "vatapplicable");
          l.Util.isNotEmpty(k) && k.toLowerCase().includes("not applicable")
            ? (i.vatApplicable = !1)
            : (i.vatApplicable = !0);
          var C = l.TallyUtil.getAliasList(e, "languagename.list", "name.list", "name");
          ((i.aliases = h.StringItem.convertStringArray(C, i.name)),
            (i.alias = t.getAliasString(C, i.name)));
          var q = [],
            R = l.TallyUtil.parseArray(l.TallyUtil.getJsonValue(e, "mailingname.list"));
          if (R.length > 0)
            for (d = 0; d < R.length; d++)
              if (l.Util.isNotNull(R[d])) {
                var D = l.TallyUtil.getJsonValue(R[d], "mailingname"),
                  E = void 0;
                if (l.Util.isArray(D)) {
                  if (((E = l.TallyUtil.parseArray(D)), l.Util.isNotNull(E)))
                    for (var x = 0, O = E; x < O.length; x++) {
                      var z = O[x];
                      l.Util.isNotNull(z) &&
                        l.Util.isObject(z) &&
                        z.hasOwnProperty("$") &&
                        q.push(z.$);
                    }
                } else q.push(D);
              }
          ((i.partNumber = t.getAliasString(q)),
            l.Util.isNotNull(r) &&
            l.Util.isNotNull(r.company) &&
            l.Util.isNotNull(r.company.timezone)
              ? (i.lastSaleDate = l.TallyUtil.parseDate(
                  l.TallyUtil.getStringValue(e, "lastsaledate"),
                  l.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone,
                ))
              : (i.lastSaleDate = l.TallyUtil.parseDate(
                  l.TallyUtil.getStringValue(e, "lastsaledate"),
                  l.DateUtil.FORMAT_YYYYMMDD,
                )),
            (i.reOrderBase = l.TallyUtil.parseQuantity(l.TallyUtil.getJsonValue(e, "reorderbase"))),
            (i.minOrderBase = l.TallyUtil.parseQuantity(
              l.TallyUtil.getJsonValue(e, "minimumorderbase"),
            )));
          var P = l.TallyUtil.parseArray(l.TallyUtil.getJsonValue(e, "fullpricelist.list"));
          if (P.length > 0) {
            var L = [];
            for (d = 0; d < P.length; ++d)
              l.Util.isNotNull(P[d]) && L.push(b.Price.convert(P[d], r));
            i.priceList = L;
          }
          var w = l.TallyUtil.parseArray(l.TallyUtil.getJsonValue(e, "standardpricelist.list"));
          if (w.length > 0) {
            for (L = [], d = 0; d < w.length; ++d)
              l.Util.isNotNull(w[d]) && L.push(b.StandardRate.convert(w[d], r));
            i.standardPriceList = L;
          }
          var _ = l.TallyUtil.parseArray(l.TallyUtil.getJsonValue(e, "standardcostlist.list"));
          if (_.length > 0) {
            var U = [];
            for (d = 0; d < _.length; ++d)
              l.Util.isNotNull(_[d]) && U.push(b.StandardRate.convert(_[d], r));
            i.standardCostList = U;
          }
          return (
            (i.costingMethod = l.TallyUtil.getStringValue(e, "costingmethod")),
            (i.valuationMethod = l.TallyUtil.getStringValue(e, "valuationmethod")),
            (i.isCostCentresOn = l.TallyUtil.getBoolean(e, "iscostcentreson")),
            (i.isPerishableOn = l.TallyUtil.getBoolean(e, "isperishableon")),
            (i.reOrderAsHigher = l.TallyUtil.getBoolean(e, "reorderashigher")),
            (i.minOrderAsHighe = l.TallyUtil.getBoolean(e, "minorderashighe")),
            (i.gstTypeOfSupply = l.TallyUtil.getStringValue(e, "gsttypeofsupply")),
            i
          );
        }),
        (t.getAliasString = function (e, t) {
          var r = [];
          if (l.Util.isNotNull(e))
            for (var i = 0, a = e; i < a.length; i++) {
              var o = a[i];
              o !== t && r.push(o);
            }
          return r.join("!@#$%");
        }),
        t
      );
    })(y.Master);
  t.default = g;
};
