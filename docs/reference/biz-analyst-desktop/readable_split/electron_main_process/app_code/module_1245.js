// webpack module #1245 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = r(5),
    o = (function () {
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
          return (i.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
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
            (a.challanCode = i.TallyUtil.getStringValue(t, "tdsratechallancode")),
            (a.section = i.TallyUtil.getStringValue(t, "tdsratesection")),
            (a.remittanceCode = i.TallyUtil.getStringValue(t, "tdsremittancecode")),
            (a.isTransporterCategory = i.TallyUtil.getBoolean(t, "istransportercategory")),
            (a.isSoftwareRoyalty = i.TallyUtil.getBoolean(t, "issoftwareroyalty")),
            (a.isAboveExemptionLimit = i.TallyUtil.getBoolean(t, "isaboveexemptionlimit")),
            (a.rateOfTax = i.TallyUtil.parseNumber(i.TallyUtil.getJsonValue(t, "rateoftax"))),
            (a.otherRate = i.TallyUtil.parseNumber(i.TallyUtil.getJsonValue(t, "otherrate"))),
            (a.noPanRateOfTax = i.TallyUtil.parseNumber(
              i.TallyUtil.getJsonValue(t, "nopanrateoftax"),
            )),
            (a.noPanOtherRate = i.TallyUtil.parseNumber(
              i.TallyUtil.getJsonValue(t, "nopanotherrate"),
            )),
            (a.exemptionLimit = i.TallyUtil.parseNumber(
              i.TallyUtil.getJsonValue(t, "exemptionlimit"),
            )),
            a
          );
        }),
        e
      );
    })();
  t.default = o;
};
