// webpack module #540 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
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
      }),
    i =
      (this && this.__awaiter) ||
      function (e, t, r, n) {
        return new (r || (r = Promise))(function (a, i) {
          function o(e) {
            try {
              u(n.next(e));
            } catch (e) {
              i(e);
            }
          }
          function s(e) {
            try {
              u(n.throw(e));
            } catch (e) {
              i(e);
            }
          }
          function u(e) {
            e.done
              ? a(e.value)
              : new r(function (t) {
                  t(e.value);
                }).then(o, s);
          }
          u((n = n.apply(e, t || [])).next());
        });
      },
    o =
      (this && this.__generator) ||
      function (e, t) {
        var r,
          n,
          a,
          i,
          o = {
            label: 0,
            sent: function () {
              if (1 & a[0]) throw a[1];
              return a[1];
            },
            trys: [],
            ops: [],
          };
        return (
          (i = { next: s(0), throw: s(1), return: s(2) }),
          "function" == typeof Symbol &&
            (i[Symbol.iterator] = function () {
              return this;
            }),
          i
        );
        function s(i) {
          return function (s) {
            return (function (i) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; o; )
                try {
                  if (
                    ((r = 1),
                    n &&
                      (a =
                        2 & i[0]
                          ? n.return
                          : i[0]
                          ? n.throw || ((a = n.return) && a.call(n), 0)
                          : n.next) &&
                      !(a = a.call(n, i[1])).done)
                  )
                    return a;
                  switch (((n = 0), a && (i = [2 & i[0], a.value]), i[0])) {
                    case 0:
                    case 1:
                      a = i;
                      break;
                    case 4:
                      return o.label++, { value: i[1], done: !1 };
                    case 5:
                      o.label++, (n = i[1]), (i = [0]);
                      continue;
                    case 7:
                      (i = o.ops.pop()), o.trys.pop();
                      continue;
                    default:
                      if (
                        !((a = o.trys),
                        (a = a.length > 0 && a[a.length - 1]) || (6 !== i[0] && 2 !== i[0]))
                      ) {
                        o = 0;
                        continue;
                      }
                      if (3 === i[0] && (!a || (i[1] > a[0] && i[1] < a[3]))) {
                        o.label = i[1];
                        break;
                      }
                      if (6 === i[0] && o.label < a[1]) {
                        (o.label = a[1]), (a = i);
                        break;
                      }
                      if (a && o.label < a[2]) {
                        (o.label = a[2]), o.ops.push(i);
                        break;
                      }
                      a[2] && o.ops.pop(), o.trys.pop();
                      continue;
                  }
                  i = t.call(e, o);
                } catch (e) {
                  (i = [6, e]), (n = 0);
                } finally {
                  r = a = 0;
                }
              if (5 & i[0]) throw i[1];
              return { value: i[0] ? i[1] : void 0, done: !0 };
            })([i, s]);
          };
        }
      };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var s = r(508),
    u = r(94),
    p = r(111),
    c = r(539),
    l = r(1128),
    m = r(0),
    d = r(49),
    y = r(5),
    b = r(28),
    h = r(29),
    f = (function (e) {
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
          return i(this, void 0, void 0, function () {
            var n;
            return o(this, function (a) {
              return (n = []).push(t.convert(e, r)), [2, n];
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
          (this.isDeleted = e.isDeleted),
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
            (this.gstTypeOfSupply = e.gstTypeOfSupply);
        }),
        (t.prototype.updateOldName = function (e) {
          y.Master.compare(this.name, e.name) || (this.oldName = this.name);
        }),
        (t.toObject = function (e) {
          var r = new t();
          if ((m.Util.assign(r, e), m.Util.isNotNull(e.aliases) && e.aliases.length > 0)) {
            r.aliases = [];
            for (var n = 0, a = e.aliases; n < a.length; n++) {
              var i = a[n];
              r.aliases.push(h.StringItem.toObject(i));
            }
          }
          if (m.Util.isNotNull(e.batches) && e.batches.length > 0) {
            r.batches = [];
            for (var o = 0, d = e.batches; o < d.length; o++) {
              var y = d[o];
              r.batches.push(s.default.toObject(y));
            }
          }
          if (m.Util.isNotNull(e.gstDetails) && e.gstDetails.length > 0) {
            r.gstDetails = [];
            for (var f = 0, g = e.gstDetails; f < g.length; f++) {
              var M = g[f];
              r.gstDetails.push(u.default.toObject(M));
            }
          }
          if (m.Util.isNotNull(e.hsnDetails) && e.hsnDetails.length > 0) {
            r.hsnDetails = [];
            for (var S = 0, A = e.hsnDetails; S < A.length; S++) {
              var O = A[S];
              r.hsnDetails.push(p.default.toObject(O));
            }
          }
          if (m.Util.isNotNull(e.vatDetails) && e.vatDetails.length > 0) {
            r.vatDetails = [];
            for (var N = 0, v = e.vatDetails; N < v.length; N++) {
              var T = v[N];
              r.vatDetails.push(c.default.toObject(T));
            }
          }
          if (m.Util.isNotNull(e.mrpDetails) && e.mrpDetails.length > 0) {
            r.mrpDetails = [];
            for (var z = 0, I = e.mrpDetails; z < I.length; z++) {
              var q = I[z];
              r.mrpDetails.push(l.default.toObject(q));
            }
          }
          if (m.Util.isNotNull(e.priceList) && e.priceList.length > 0) {
            r.priceList = [];
            for (var k = 0, R = e.priceList; k < R.length; k++) {
              var C = R[k];
              r.priceList.push(b.Price.toObject(C));
            }
          }
          if (m.Util.isNotNull(e.standardPriceList) && e.standardPriceList.length > 0) {
            r.standardPriceList = [];
            for (var E = 0, _ = e.standardPriceList; E < _.length; E++) {
              C = _[E];
              r.standardPriceList.push(b.StandardRate.toObject(C));
            }
          }
          if (m.Util.isNotNull(e.standardCostList) && e.standardCostList.length > 0) {
            r.standardCostList = [];
            for (var D = 0, L = e.standardCostList; D < L.length; D++) {
              var x = L[D];
              r.standardCostList.push(b.StandardRate.toObject(x));
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
          var n = new t();
          if (
            ((n._id = m.TallyUtil.getStringValue(e, "guid")),
            (n.masterId = m.TallyUtil.getIntValue(e, "masterid")),
            (n.alterId = m.TallyUtil.getIntValue(e, "alterid")),
            (n.name = m.TallyUtil.getStringValue(e, "name", !0)),
            m.Util.isEmpty(n._id) && (n._id = n.name),
            (n.parentGroup = m.TallyUtil.getStringValue(e, "parent")),
            (n.category = m.TallyUtil.getStringValue(e, "category")),
            (n.openingStock = m.TallyUtil.parseQuantity(
              m.TallyUtil.getJsonValue(e, "openingbalance")
            )),
            (n.closingStock = m.TallyUtil.parseQuantity(
              m.TallyUtil.getJsonValue(e, "closingbalance")
            )),
            (n.subOpeningStock = m.TallyUtil.parseAdditionalQuantity(
              m.TallyUtil.getJsonValue(e, "openingbalance")
            )),
            (n.subClosingStock = m.TallyUtil.parseAdditionalQuantity(
              m.TallyUtil.getJsonValue(e, "closingbalance")
            )),
            (n.openingAmount = m.TallyUtil.parseAmount(
              m.TallyUtil.getJsonValue(e, "openingvalue")
            )),
            (n.closingAmount =
              -1 * m.TallyUtil.parseAmount(m.TallyUtil.getJsonValue(e, "closingvalue"))),
            (n.alternateOpeningStock = m.TallyUtil.parseAlternateQuantity(
              m.TallyUtil.getJsonValue(e, "openingbalance")
            )),
            (n.alternateClosingStock = m.TallyUtil.parseAlternateQuantity(
              m.TallyUtil.getJsonValue(e, "closingbalance")
            )),
            (n.desc = m.TallyUtil.getStringValue(e, "description")),
            (n.unit = m.TallyUtil.getStringValue(e, "baseunits")),
            m.Util.isNotEmpty(n.unit))
          ) {
            var a = b.Voucher.getUnitByName(n.unit);
            m.Util.isNotNull(a) &&
              (a.isSimpleUnit
                ? (n.mainUnit = a.name)
                : ((n.mainUnit = a.baseUnits), (n.subUnit = a.additionalUnits)));
          }
          (n.alternateUnit = m.TallyUtil.getStringValue(e, "additionalunits")),
            (n.denominator = m.TallyUtil.getFloatValue(e, "denominator")),
            (n.conversion = m.TallyUtil.getFloatValue(e, "conversion")),
            (n.ignorePhysicalDifference = m.TallyUtil.getStringValue(
              e,
              "ignorephysicaldifference"
            ));
          var i = m.TallyUtil.parseArray(m.TallyUtil.getJsonValue(e, "batchallocations.list"));
          if (i.length > 0) {
            for (var o = [], d = 0; d < i.length; ++d)
              null !== i[d] && void 0 !== i[d] && o.push(s.default.convert(i[d], r));
            n.batches = o;
          }
          var y = m.TallyUtil.parseArray(m.TallyUtil.getJsonValue(e, "hsndetails.list"));
          if (m.Util.isFilledArray(y)) {
            var f = [];
            for (d = 0; d < y.length; ++d)
              null !== y[d] && void 0 !== y[d] && f.push(p.default.convert(y[d], r));
            n.hsnDetails = f;
          }
          var g = m.TallyUtil.parseArray(m.TallyUtil.getJsonValue(e, "gstdetails.list"));
          if (m.Util.isFilledArray(g)) {
            var M = [];
            for (d = 0; d < g.length; ++d)
              if (null !== g[d] && void 0 !== g[d])
                if (m.Util.isFilledArray(n.hsnDetails)) {
                  var S = u.default.convert(g[d], r);
                  M.push(b.GstClassification.modifyGstDetail(S, n.hsnDetails));
                } else M.push(u.default.convert(g[d], r));
            n.gstDetails = M;
          }
          var A = m.TallyUtil.parseArray(m.TallyUtil.getJsonValue(e, "vatdetails.list"));
          if (A.length > 0) {
            var O = [];
            for (d = 0; d < A.length; ++d)
              null !== A[d] && void 0 !== A[d] && O.push(c.default.convert(A[d], r));
            n.vatDetails = O;
          }
          var N = m.TallyUtil.parseArray(m.TallyUtil.getJsonValue(e, "mrpdetails.list"));
          if (N.length > 0) {
            var v = [];
            for (d = 0; d < N.length; ++d)
              null !== N[d] && void 0 !== N[d] && v.push(l.default.convert(N[d], r));
            n.mrpDetails = v;
          }
          var T = m.TallyUtil.getStringValue(e, "gstapplicable");
          m.Util.isNotEmpty(T) && T.toLowerCase().includes("not applicable")
            ? (n.gstApplicable = !1)
            : (n.gstApplicable = !0);
          var z = m.TallyUtil.getStringValue(e, "vatapplicable");
          m.Util.isNotEmpty(z) && z.toLowerCase().includes("not applicable")
            ? (n.vatApplicable = !1)
            : (n.vatApplicable = !0);
          var I = m.TallyUtil.getAliasList(e, "languagename.list", "name.list", "name");
          (n.aliases = h.StringItem.convertStringArray(I, n.name)),
            (n.alias = t.getAliasString(I, n.name));
          var q = [],
            k = m.TallyUtil.parseArray(m.TallyUtil.getJsonValue(e, "mailingname.list"));
          if (k.length > 0)
            for (d = 0; d < k.length; d++)
              if (m.Util.isNotNull(k[d])) {
                var R = m.TallyUtil.getJsonValue(k[d], "mailingname"),
                  C = void 0;
                if (m.Util.isArray(R)) {
                  if (((C = m.TallyUtil.parseArray(R)), m.Util.isNotNull(C)))
                    for (var E = 0, _ = C; E < _.length; E++) {
                      var D = _[E];
                      m.Util.isNotNull(D) &&
                        m.Util.isObject(D) &&
                        D.hasOwnProperty("$") &&
                        q.push(D.$);
                    }
                } else q.push(R);
              }
          (n.partNumber = t.getAliasString(q)),
            m.Util.isNotNull(r) &&
            m.Util.isNotNull(r.company) &&
            m.Util.isNotNull(r.company.timezone)
              ? (n.lastSaleDate = m.TallyUtil.parseDate(
                  m.TallyUtil.getStringValue(e, "lastsaledate"),
                  m.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone
                ))
              : (n.lastSaleDate = m.TallyUtil.parseDate(
                  m.TallyUtil.getStringValue(e, "lastsaledate"),
                  m.DateUtil.FORMAT_YYYYMMDD
                )),
            (n.reOrderBase = m.TallyUtil.parseQuantity(m.TallyUtil.getJsonValue(e, "reorderbase"))),
            (n.minOrderBase = m.TallyUtil.parseQuantity(
              m.TallyUtil.getJsonValue(e, "minimumorderbase")
            ));
          var L = m.TallyUtil.parseArray(m.TallyUtil.getJsonValue(e, "fullpricelist.list"));
          if (L.length > 0) {
            var x = [];
            for (d = 0; d < L.length; ++d)
              m.Util.isNotNull(L[d]) && x.push(b.Price.convert(L[d], r));
            n.priceList = x;
          }
          var w = m.TallyUtil.parseArray(m.TallyUtil.getJsonValue(e, "standardpricelist.list"));
          if (w.length > 0) {
            for (x = [], d = 0; d < w.length; ++d)
              m.Util.isNotNull(w[d]) && x.push(b.StandardRate.convert(w[d], r));
            n.standardPriceList = x;
          }
          var P = m.TallyUtil.parseArray(m.TallyUtil.getJsonValue(e, "standardcostlist.list"));
          if (P.length > 0) {
            var W = [];
            for (d = 0; d < P.length; ++d)
              m.Util.isNotNull(P[d]) && W.push(b.StandardRate.convert(P[d], r));
            n.standardCostList = W;
          }
          return (
            (n.costingMethod = m.TallyUtil.getStringValue(e, "costingmethod")),
            (n.valuationMethod = m.TallyUtil.getStringValue(e, "valuationmethod")),
            (n.isCostCentresOn = m.TallyUtil.getBoolean(e, "iscostcentreson")),
            (n.isPerishableOn = m.TallyUtil.getBoolean(e, "isperishableon")),
            (n.reOrderAsHigher = m.TallyUtil.getBoolean(e, "reorderashigher")),
            (n.minOrderAsHighe = m.TallyUtil.getBoolean(e, "minorderashighe")),
            (n.gstTypeOfSupply = m.TallyUtil.getStringValue(e, "gsttypeofsupply")),
            n
          );
        }),
        (t.getAliasString = function (e, t) {
          var r = [];
          if (m.Util.isNotNull(e))
            for (var n = 0, a = e; n < a.length; n++) {
              var i = a[n];
              i !== t && r.push(i);
            }
          return r.join("!@#$%");
        }),
        t
      );
    })(y.Master);
  t.default = f;
};
