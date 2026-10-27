// webpack module #1116 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = r(5),
    i = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            a.Master.compare(this.applicableFrom, e.applicableFrom) &&
            a.Master.compare(this.challanCode, e.challanCode) &&
            a.Master.compare(this.section, e.section) &&
            a.Master.compare(this.remittanceCode, e.remittanceCode) &&
            a.Master.compare(this.isTransporterCategory, e.isTransporterCategory) &&
            a.Master.compare(this.isSoftwareRoyalty, e.isSoftwareRoyalty) &&
            a.Master.compare(this.isAboveExemptionLimit, e.isAboveExemptionLimit) &&
            a.Master.compare(this.rateOfTax, e.rateOfTax) &&
            a.Master.compare(this.otherRate, e.otherRate) &&
            a.Master.compare(this.noPanRateOfTax, e.noPanRateOfTax) &&
            a.Master.compare(this.noPanOtherRate, e.noPanOtherRate) &&
            a.Master.compare(this.exemptionLimit, e.exemptionLimit)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (n.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
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
            (a.challanCode = n.TallyUtil.getStringValue(t, "tdsratechallancode")),
            (a.section = n.TallyUtil.getStringValue(t, "tdsratesection")),
            (a.remittanceCode = n.TallyUtil.getStringValue(t, "tdsremittancecode")),
            (a.isTransporterCategory = n.TallyUtil.getBoolean(t, "istransportercategory")),
            (a.isSoftwareRoyalty = n.TallyUtil.getBoolean(t, "issoftwareroyalty")),
            (a.isAboveExemptionLimit = n.TallyUtil.getBoolean(t, "isaboveexemptionlimit")),
            (a.rateOfTax = n.TallyUtil.parseNumber(n.TallyUtil.getJsonValue(t, "rateoftax"))),
            (a.otherRate = n.TallyUtil.parseNumber(n.TallyUtil.getJsonValue(t, "otherrate"))),
            (a.noPanRateOfTax = n.TallyUtil.parseNumber(
              n.TallyUtil.getJsonValue(t, "nopanrateoftax"),
            )),
            (a.noPanOtherRate = n.TallyUtil.parseNumber(
              n.TallyUtil.getJsonValue(t, "nopanotherrate"),
            )),
            (a.exemptionLimit = n.TallyUtil.parseNumber(
              n.TallyUtil.getJsonValue(t, "exemptionlimit"),
            )),
            a
          );
        }),
        e
      );
    })();
  t.default = i;
};
