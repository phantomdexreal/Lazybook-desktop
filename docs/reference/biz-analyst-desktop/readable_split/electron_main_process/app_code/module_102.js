// webpack module #102 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = r(5),
    o = r(32),
    s = r(11),
    n = (function () {
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
            (i.Util.assign(r, t),
            i.Util.isNotNull(t) &&
              i.Util.isNotNull(t.stateWiseDetails) &&
              t.stateWiseDetails.length > 0)
          ) {
            r.stateWiseDetails = [];
            for (var a = 0, s = t.stateWiseDetails; a < s.length; a++) {
              var n = s[a];
              r.stateWiseDetails.push(o.StateWiseDetail.toObject(n));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          ((a.calculationType = i.TallyUtil.getStringValue(t, "calculationtype")),
            (a.sourceOfGstDetails = i.TallyUtil.getStringValue(t, "srcofgstdetails")),
            i.Util.isNotEmpty(a.sourceOfGstDetails) &&
              (s.default.GST_SOURCE_TYPES.SPECIFY_SLAB_BASED_RATES === a.sourceOfGstDetails
                ? (a.calculationType = s.default.GST_CALCULATION_TYPES.ON_ITEM_RATE)
                : (a.calculationType = s.default.GST_CALCULATION_TYPES.ON_VALUE)),
            (a.hsnCode = i.TallyUtil.getStringValue(t, "hsncode")),
            (a.hsnMasterName = i.TallyUtil.getStringValue(t, "hsnmastername")),
            (a.hsn = i.TallyUtil.getStringValue(t, "hsn")),
            i.Util.isNotNull(r) &&
            i.Util.isNotNull(r.company) &&
            i.Util.isNotNull(r.company.timezone)
              ? (a.applicableFrom = i.TallyUtil.parseDate(
                  i.TallyUtil.getJsonValue(t, "applicablefrom"),
                  i.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone,
                ))
              : (a.applicableFrom = i.TallyUtil.parseDate(
                  i.TallyUtil.getJsonValue(t, "applicablefrom"),
                  i.DateUtil.FORMAT_YYYYMMDD,
                )),
            (a.isNonGstGoods = i.TallyUtil.getBoolean(t, "isnongstgoods")),
            (a.taxability = i.TallyUtil.getStringValue(t, "taxability")),
            i.Util.isNotEmpty(a.taxability) &&
              (s.default.TAXABILITY_TYPES.TAXABLE != a.taxability
                ? (a.isNonGstGoods = !0)
                : (a.isNonGstGoods = !1)),
            (a.isReverseChargeApplicable = i.TallyUtil.getBoolean(t, "isreversechargeapplicable")));
          var n = i.TallyUtil.parseArray(i.TallyUtil.getJsonValue(t, "statewisedetails.list"));
          if (n.length > 0) {
            for (var u = [], p = 0; p < n.length; ++p)
              null !== n[p] && void 0 !== n[p] && u.push(o.StateWiseDetail.convert(n[p]));
            a.stateWiseDetails = u;
          }
          return a;
        }),
        e
      );
    })();
  t.default = n;
};
