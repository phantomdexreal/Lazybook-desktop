// webpack module #94 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = r(5),
    i = r(28),
    o = r(8),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            a.Master.compare(this.hsnCode, e.hsnCode) &&
            a.Master.compare(this.hsnMasterName, e.hsnMasterName) &&
            a.Master.compare(this.hsn, e.hsn) &&
            a.Master.compare(this.applicableFrom, e.applicableFrom) &&
            a.Master.compare(this.taxability, e.taxability) &&
            a.Master.compare(this.stateWiseDetails, e.stateWiseDetails) &&
            a.Master.compare(this.calculationType, e.calculationType) &&
            a.Master.compare(this.isNonGstGoods, e.isNonGstGoods) &&
            a.Master.compare(this.sourceOfGstDetails, e.sourceOfGstDetails) &&
            a.Master.compare(this.isReverseChargeApplicable, e.isReverseChargeApplicable)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if (
            (n.Util.assign(r, t),
            n.Util.isNotNull(t) &&
              n.Util.isNotNull(t.stateWiseDetails) &&
              t.stateWiseDetails.length > 0)
          ) {
            r.stateWiseDetails = [];
            for (var a = 0, o = t.stateWiseDetails; a < o.length; a++) {
              var s = o[a];
              r.stateWiseDetails.push(i.StateWiseDetail.toObject(s));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          ((a.calculationType = n.TallyUtil.getStringValue(t, "calculationtype")),
            (a.sourceOfGstDetails = n.TallyUtil.getStringValue(t, "srcofgstdetails")),
            n.Util.isNotEmpty(a.sourceOfGstDetails) &&
              (o.default.GST_SOURCE_TYPES.SPECIFY_SLAB_BASED_RATES === a.sourceOfGstDetails
                ? (a.calculationType = o.default.GST_CALCULATION_TYPES.ON_ITEM_RATE)
                : (a.calculationType = o.default.GST_CALCULATION_TYPES.ON_VALUE)),
            (a.hsnCode = n.TallyUtil.getStringValue(t, "hsncode")),
            (a.hsnMasterName = n.TallyUtil.getStringValue(t, "hsnmastername")),
            (a.hsn = n.TallyUtil.getStringValue(t, "hsn")),
            n.Util.isNotNull(r) &&
            n.Util.isNotNull(r.company) &&
            n.Util.isNotNull(r.company.timezone)
              ? (a.applicableFrom = n.TallyUtil.parseDate(
                  n.TallyUtil.getJsonValue(t, "applicablefrom"),
                  n.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone,
                ))
              : (a.applicableFrom = n.TallyUtil.parseDate(
                  n.TallyUtil.getJsonValue(t, "applicablefrom"),
                  n.DateUtil.FORMAT_YYYYMMDD,
                )),
            (a.isNonGstGoods = n.TallyUtil.getBoolean(t, "isnongstgoods")),
            (a.taxability = n.TallyUtil.getStringValue(t, "taxability")),
            n.Util.isNotEmpty(a.taxability) &&
              (o.default.TAXABILITY_TYPES.TAXABLE != a.taxability
                ? (a.isNonGstGoods = !0)
                : (a.isNonGstGoods = !1)),
            (a.isReverseChargeApplicable = n.TallyUtil.getBoolean(t, "isreversechargeapplicable")));
          var s = n.TallyUtil.parseArray(n.TallyUtil.getJsonValue(t, "statewisedetails.list"));
          if (s.length > 0) {
            for (var u = [], p = 0; p < s.length; ++p)
              null !== s[p] && void 0 !== s[p] && u.push(i.StateWiseDetail.convert(s[p]));
            a.stateWiseDetails = u;
          }
          return a;
        }),
        e
      );
    })();
  t.default = s;
};
