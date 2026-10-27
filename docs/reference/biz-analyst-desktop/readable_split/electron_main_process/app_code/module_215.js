// webpack module #215 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(32),
    a = r(2),
    o = r(5),
    s = r(28),
    n = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            o.Master.compare(this.id, e.id) &&
            o.Master.compare(this.masterId, e.masterId) &&
            o.Master.compare(this.marksNo, e.marksNo) &&
            o.Master.compare(this.rate, e.rate) &&
            o.Master.compare(this.rateWithTax, e.rateWithTax) &&
            o.Master.compare(this.rateUnit, e.rateUnit) &&
            o.Master.compare(this.discount, e.discount) &&
            o.Master.compare(this.invQuantity, e.invQuantity) &&
            o.Master.compare(this.accQuantity, e.accQuantity) &&
            o.Master.compare(this.amount, e.amount) &&
            o.Master.compare(this.desc, e.desc) &&
            o.Master.compare(this.batchAllocations, e.batchAllocations) &&
            o.Master.compare(this.packageMarks, e.packageMarks) &&
            o.Master.compare(this.packageNo, e.packageNo) &&
            o.Master.compare(this.unit, e.unit) &&
            o.Master.compare(this.mainUnit, e.mainUnit) &&
            o.Master.compare(this.subUnit, e.subUnit) &&
            o.Master.compare(this.subQuantity, e.subQuantity) &&
            o.Master.compare(this.invSubQuantity, e.invSubQuantity) &&
            o.Master.compare(this.alternateUnit, e.alternateUnit) &&
            o.Master.compare(this.alternateQuantity, e.alternateQuantity) &&
            o.Master.compare(this.invAlternateQuantity, e.invAlternateQuantity) &&
            o.Master.compare(this.isDeemedPositive, e.isDeemedPositive) &&
            o.Master.compare(this.accounts, e.accounts) &&
            o.Master.compare(this.hsnCode, e.hsnCode) &&
            o.Master.compare(this.rateDetails, e.rateDetails)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((a.Util.assign(r, t), a.Util.isNotNull(t.desc) && t.desc.length > 0)) {
            r.desc = [];
            for (var o = 0, n = t.desc; o < n.length; o++) {
              var u = n[o];
              r.desc.push(s.StringItem.toObject(u));
            }
          }
          if (a.Util.isNotNull(t.batchAllocations) && t.batchAllocations.length > 0) {
            r.batchAllocations = [];
            for (var p = 0, c = t.batchAllocations; p < c.length; p++) {
              var m = c[p];
              r.batchAllocations.push(i.BatchAllocation.toObject(m));
            }
          }
          if (a.Util.isNotNull(t.accounts) && t.accounts.length > 0) {
            r.accounts = [];
            for (var l = 0, d = t.accounts; l < d.length; l++) {
              var y = d[l];
              r.accounts.push(i.Account.toObject(y));
            }
          }
          if (a.Util.isNotNull(t.rateDetails) && t.rateDetails.length > 0) {
            r.rateDetails = [];
            for (var b = 0, h = t.rateDetails; b < h.length; b++) {
              var g = h[b];
              r.rateDetails.push(i.RateDetail.toObject(g));
            }
          }
          return r;
        }),
        (e.convert = function (t, r, o, n) {
          var u = new e();
          ((u.id = a.TallyUtil.getStringValue(t, "stockitemname")),
            (u.masterId = i.Voucher.getStockItemMasterId(u.id)),
            (u.rate = a.TallyUtil.parseRate(a.TallyUtil.getJsonValue(t, "rate"))),
            (u.rateWithTax = a.TallyUtil.parseRate(a.TallyUtil.getJsonValue(t, "inclvatrate"))),
            (u.rateUnit = a.TallyUtil.parseRateUnit(a.TallyUtil.getJsonValue(t, "rate"))),
            (u.discount = a.TallyUtil.parseNumber(a.TallyUtil.getJsonValue(t, "discount"))));
          var p = a.TallyUtil.getJsonValue(t, "actualqty");
          u.invQuantity = a.TallyUtil.parseQuantity(p) * o;
          var c = a.TallyUtil.getJsonValue(t, "billedqty");
          ((u.accQuantity = a.TallyUtil.parseQuantity(c) * o),
            (u.amount = a.TallyUtil.parseAmount(a.TallyUtil.getJsonValue(t, "amount")) * r),
            (u.marksNo = a.TallyUtil.getStringValue(t, "basicpackagemarks")),
            (u.packageNo = a.TallyUtil.getStringValue(t, "basicnumpackages")));
          var m = i.Voucher.getStockItemUnit(a.TallyUtil.getStringValue(t, "stockitemname"));
          if (
            ((u.alternateUnit = i.Voucher.getStockItemAlternateUnit(
              a.TallyUtil.getStringValue(t, "stockitemname"),
            )),
            (u.alternateQuantity = a.TallyUtil.parseAlternateQuantity(c) * o),
            (u.invAlternateQuantity = a.TallyUtil.parseAlternateQuantity(p) * o),
            (u.isDeemedPositive = a.TallyUtil.getBoolean(t, "isdeemedpositive")),
            (u.hsnCode = a.TallyUtil.getStringValue(t, "gsthsnname")),
            a.Util.isNotEmpty(c) && a.Util.isNull(m))
          )
            a.Log.warn("[WARNING]: Unit is null for item: " + JSON.stringify(u));
          else if (a.Util.isNotNull(m)) {
            var l = i.Voucher.getUnitByName(m);
            a.Util.isNotNull(l) &&
              ((u.unit = l.name),
              (u.mainUnit = l.baseUnits),
              l.isSimpleUnit
                ? (u.mainUnit = l.name)
                : ((u.subUnit = l.additionalUnits),
                  (u.subQuantity = a.TallyUtil.parseAdditionalQuantity(c) * o),
                  (u.invSubQuantity = a.TallyUtil.parseAdditionalQuantity(p) * o)));
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
                  u.desc.push(new s.StringItem(h.$));
              }
            } else
              "object" == typeof d &&
                d.hasOwnProperty("$") &&
                ((u.desc = []), u.desc.push(new s.StringItem(d.$)));
          var g = a.TallyUtil.parseArray(a.TallyUtil.getJsonValue(t, "batchallocations.list"));
          if (g.length > 0) {
            for (var S = [], f = 0; f < g.length; ++f)
              null !== g[f] && void 0 !== g[f] && S.push(i.BatchAllocation.convert(g[f], n));
            u.batchAllocations = S;
          }
          var A = a.TallyUtil.parseArray(a.TallyUtil.getJsonValue(t, "accountingallocations.list"));
          if (A.length > 0) {
            var N = [];
            for (f = 0; f < A.length; ++f)
              a.Util.isNotNull(A[f]) && N.push(i.Account.convert(A[f], n));
            u.accounts = N;
          }
          var I = a.TallyUtil.parseArray(a.TallyUtil.getJsonValue(t, "ratedetails.list"));
          if (a.Util.isFilledArray(I)) {
            var T = [];
            for (f = 0; f < I.length; ++f)
              null !== I[f] && void 0 !== I[f] && T.push(i.RateDetail.convert(I[f]));
            u.rateDetails = T;
          }
          return u;
        }),
        e
      );
    })();
  t.default = n;
};
