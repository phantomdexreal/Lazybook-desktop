// webpack module #203 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(28),
    a = r(0),
    i = r(5),
    o = r(29),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            i.Master.compare(this.id, e.id) &&
            i.Master.compare(this.masterId, e.masterId) &&
            i.Master.compare(this.marksNo, e.marksNo) &&
            i.Master.compare(this.rate, e.rate) &&
            i.Master.compare(this.rateWithTax, e.rateWithTax) &&
            i.Master.compare(this.rateUnit, e.rateUnit) &&
            i.Master.compare(this.discount, e.discount) &&
            i.Master.compare(this.invQuantity, e.invQuantity) &&
            i.Master.compare(this.accQuantity, e.accQuantity) &&
            i.Master.compare(this.amount, e.amount) &&
            i.Master.compare(this.desc, e.desc) &&
            i.Master.compare(this.batchAllocations, e.batchAllocations) &&
            i.Master.compare(this.packageMarks, e.packageMarks) &&
            i.Master.compare(this.packageNo, e.packageNo) &&
            i.Master.compare(this.unit, e.unit) &&
            i.Master.compare(this.mainUnit, e.mainUnit) &&
            i.Master.compare(this.subUnit, e.subUnit) &&
            i.Master.compare(this.subQuantity, e.subQuantity) &&
            i.Master.compare(this.invSubQuantity, e.invSubQuantity) &&
            i.Master.compare(this.alternateUnit, e.alternateUnit) &&
            i.Master.compare(this.alternateQuantity, e.alternateQuantity) &&
            i.Master.compare(this.invAlternateQuantity, e.invAlternateQuantity) &&
            i.Master.compare(this.isDeemedPositive, e.isDeemedPositive) &&
            i.Master.compare(this.accounts, e.accounts) &&
            i.Master.compare(this.hsnCode, e.hsnCode) &&
            i.Master.compare(this.rateDetails, e.rateDetails)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((a.Util.assign(r, t), a.Util.isNotNull(t.desc) && t.desc.length > 0)) {
            r.desc = [];
            for (var i = 0, s = t.desc; i < s.length; i++) {
              var u = s[i];
              r.desc.push(o.StringItem.toObject(u));
            }
          }
          if (a.Util.isNotNull(t.batchAllocations) && t.batchAllocations.length > 0) {
            r.batchAllocations = [];
            for (var p = 0, c = t.batchAllocations; p < c.length; p++) {
              var l = c[p];
              r.batchAllocations.push(n.BatchAllocation.toObject(l));
            }
          }
          if (a.Util.isNotNull(t.accounts) && t.accounts.length > 0) {
            r.accounts = [];
            for (var m = 0, d = t.accounts; m < d.length; m++) {
              var y = d[m];
              r.accounts.push(n.Account.toObject(y));
            }
          }
          if (a.Util.isNotNull(t.rateDetails) && t.rateDetails.length > 0) {
            r.rateDetails = [];
            for (var b = 0, h = t.rateDetails; b < h.length; b++) {
              var f = h[b];
              r.rateDetails.push(n.RateDetail.toObject(f));
            }
          }
          return r;
        }),
        (e.convert = function (t, r, i, s) {
          var u = new e();
          (u.id = a.TallyUtil.getStringValue(t, "stockitemname")),
            (u.masterId = n.Voucher.getStockItemMasterId(u.id)),
            (u.rate = a.TallyUtil.parseRate(a.TallyUtil.getJsonValue(t, "rate"))),
            (u.rateWithTax = a.TallyUtil.parseRate(a.TallyUtil.getJsonValue(t, "inclvatrate"))),
            (u.rateUnit = a.TallyUtil.parseRateUnit(a.TallyUtil.getJsonValue(t, "rate"))),
            (u.discount = a.TallyUtil.parseNumber(a.TallyUtil.getJsonValue(t, "discount")));
          var p = a.TallyUtil.getJsonValue(t, "actualqty");
          u.invQuantity = a.TallyUtil.parseQuantity(p) * i;
          var c = a.TallyUtil.getJsonValue(t, "billedqty");
          (u.accQuantity = a.TallyUtil.parseQuantity(c) * i),
            (u.amount = a.TallyUtil.parseAmount(a.TallyUtil.getJsonValue(t, "amount")) * r),
            (u.marksNo = a.TallyUtil.getStringValue(t, "basicpackagemarks")),
            (u.packageNo = a.TallyUtil.getStringValue(t, "basicnumpackages"));
          var l = n.Voucher.getStockItemUnit(a.TallyUtil.getStringValue(t, "stockitemname"));
          if (
            ((u.alternateUnit = n.Voucher.getStockItemAlternateUnit(
              a.TallyUtil.getStringValue(t, "stockitemname")
            )),
            (u.alternateQuantity = a.TallyUtil.parseAlternateQuantity(c) * i),
            (u.invAlternateQuantity = a.TallyUtil.parseAlternateQuantity(p) * i),
            (u.isDeemedPositive = a.TallyUtil.getBoolean(t, "isdeemedpositive")),
            (u.hsnCode = a.TallyUtil.getStringValue(t, "gsthsnname")),
            a.Util.isNotEmpty(c) && a.Util.isNull(l))
          )
            a.Log.warn("[WARNING]: Unit is null for item: " + JSON.stringify(u));
          else if (a.Util.isNotNull(l)) {
            var m = n.Voucher.getUnitByName(l);
            a.Util.isNotNull(m) &&
              ((u.unit = m.name),
              (u.mainUnit = m.baseUnits),
              m.isSimpleUnit
                ? (u.mainUnit = m.name)
                : ((u.subUnit = m.additionalUnits),
                  (u.subQuantity = a.TallyUtil.parseAdditionalQuantity(c) * i),
                  (u.invSubQuantity = a.TallyUtil.parseAdditionalQuantity(p) * i)));
          }
          var d = a.TallyUtil.parseArray(a.TallyUtil.getJsonValue(t, "basicuserdescription.list"));
          if (null != d && d.length > 0 && null != (d = d[0].basicuserdescription))
            if ("[object Array]" === Object.prototype.toString.call(d)) {
              u.desc = [];
              for (var y = 0, b = d; y < b.length; y++) {
                var h = b[y];
                null != h &&
                  "object" == typeof h &&
                  h.hasOwnProperty("$") &&
                  u.desc.push(new o.StringItem(h.$));
              }
            } else
              "object" == typeof d &&
                d.hasOwnProperty("$") &&
                ((u.desc = []), u.desc.push(new o.StringItem(d.$)));
          var f = a.TallyUtil.parseArray(a.TallyUtil.getJsonValue(t, "batchallocations.list"));
          if (f.length > 0) {
            for (var g = [], M = 0; M < f.length; ++M)
              null !== f[M] && void 0 !== f[M] && g.push(n.BatchAllocation.convert(f[M], s));
            u.batchAllocations = g;
          }
          var S = a.TallyUtil.parseArray(a.TallyUtil.getJsonValue(t, "accountingallocations.list"));
          if (S.length > 0) {
            var A = [];
            for (M = 0; M < S.length; ++M)
              a.Util.isNotNull(S[M]) && A.push(n.Account.convert(S[M], s));
            u.accounts = A;
          }
          var O = a.TallyUtil.parseArray(a.TallyUtil.getJsonValue(t, "ratedetails.list"));
          if (a.Util.isFilledArray(O)) {
            var N = [];
            for (M = 0; M < O.length; ++M)
              null !== O[M] && void 0 !== O[M] && N.push(n.RateDetail.convert(O[M]));
            u.rateDetails = N;
          }
          return u;
        }),
        e
      );
    })();
  t.default = s;
};
