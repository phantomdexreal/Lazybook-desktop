// webpack module #1037 (from background_worker, BA Mobile Connector 8.4.41)
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
            a.Master.compare(this.gstRegistrationType, e.gstRegistrationType) &&
            a.Master.compare(this.placeOfSupply, e.placeOfSupply) &&
            a.Master.compare(this.gstIn, e.gstIn)
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
            (a.gstRegistrationType = n.TallyUtil.getStringValue(t, "gstregistrationtype")),
            (a.placeOfSupply = n.TallyUtil.getStringValue(t, "placeofsupply")),
            (a.gstIn = n.TallyUtil.getStringValue(t, "gstin")),
            a
          );
        }),
        e
      );
    })();
  t.default = i;
};
