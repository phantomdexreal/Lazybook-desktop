// webpack module #1259 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = r(5),
    o = r(1260),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !(
            !a.Master.compare(this.applicableFrom, e.applicableFrom) ||
            !a.Master.compare(this.mrpRateDetails, e.mrpRateDetails)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if (
            (i.Util.assign(r, t), i.Util.isNotNull(t.mrpRateDetails) && t.mrpRateDetails.length > 0)
          ) {
            r.mrpRateDetails = [];
            for (var a = 0, s = t.mrpRateDetails; a < s.length; a++) {
              var n = s[a];
              r.mrpRateDetails.push(o.default.toObject(n));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          i.Util.isNotNull(r) && i.Util.isNotNull(r.company) && i.Util.isNotNull(r.company.timezone)
            ? (a.applicableFrom = i.TallyUtil.parseDate(
                i.TallyUtil.getJsonValue(t, "fromdate"),
                i.DateUtil.FORMAT_YYYYMMDD,
                r.company.timezone,
              ))
            : (a.applicableFrom = i.TallyUtil.parseDate(
                i.TallyUtil.getJsonValue(t, "fromdate"),
                i.DateUtil.FORMAT_YYYYMMDD,
              ));
          var s = i.TallyUtil.parseArray(i.TallyUtil.getJsonValue(t, "mrpratedetails.list"));
          if (s.length > 0) {
            for (var n = [], u = 0; u < s.length; ++u)
              null !== s[u] && void 0 !== s[u] && n.push(o.default.convert(s[u], r));
            a.mrpRateDetails = n;
          }
          return a;
        }),
        e
      );
    })();
  t.default = s;
};
