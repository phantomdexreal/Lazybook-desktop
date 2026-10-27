// webpack module #1120 (from electron_main_process, BA Mobile Connector 8.4.41)
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
            a.Master.compare(this.gstRegistrationType, e.gstRegistrationType) &&
            a.Master.compare(this.placeOfSupply, e.placeOfSupply) &&
            a.Master.compare(this.gstIn, e.gstIn)
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
            (a.gstRegistrationType = i.TallyUtil.getStringValue(t, "gstregistrationtype")),
            (a.placeOfSupply = i.TallyUtil.getStringValue(t, "placeofsupply")),
            (a.gstIn = i.TallyUtil.getStringValue(t, "gstin")),
            a
          );
        }),
        e
      );
    })();
  t.default = o;
};
