// webpack module #120 (from electron_main_process, BA Mobile Connector 8.4.41)
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
            a.Master.compare(this.hsnCode, e.hsnCode) &&
            a.Master.compare(this.hsn, e.hsn) &&
            a.Master.compare(this.applicableFrom, e.applicableFrom) &&
            a.Master.compare(this.sourceOfHsnDetails, e.sourceOfHsnDetails) &&
            a.Master.compare(this.hsnClassificationName, e.hsnClassificationName)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (i.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            (a.hsnCode = i.TallyUtil.getStringValue(t, "hsncode")),
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
            (a.hsnClassificationName = i.TallyUtil.getStringValue(t, "hsnclassificationname")),
            (a.sourceOfHsnDetails = i.TallyUtil.getStringValue(t, "srcofhsndetails")),
            a
          );
        }),
        e
      );
    })();
  t.default = o;
};
