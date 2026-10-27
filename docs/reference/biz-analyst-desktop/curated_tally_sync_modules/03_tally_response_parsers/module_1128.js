// webpack module #1128 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = r(5),
    i = r(1129),
    o = (function () {
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
            (n.Util.assign(r, t), n.Util.isNotNull(t.mrpRateDetails) && t.mrpRateDetails.length > 0)
          ) {
            r.mrpRateDetails = [];
            for (var a = 0, o = t.mrpRateDetails; a < o.length; a++) {
              var s = o[a];
              r.mrpRateDetails.push(i.default.toObject(s));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          n.Util.isNotNull(r) && n.Util.isNotNull(r.company) && n.Util.isNotNull(r.company.timezone)
            ? (a.applicableFrom = n.TallyUtil.parseDate(
                n.TallyUtil.getJsonValue(t, "fromdate"),
                n.DateUtil.FORMAT_YYYYMMDD,
                r.company.timezone
              ))
            : (a.applicableFrom = n.TallyUtil.parseDate(
                n.TallyUtil.getJsonValue(t, "fromdate"),
                n.DateUtil.FORMAT_YYYYMMDD
              ));
          var o = n.TallyUtil.parseArray(n.TallyUtil.getJsonValue(t, "mrpratedetails.list"));
          if (o.length > 0) {
            for (var s = [], u = 0; u < o.length; ++u)
              null !== o[u] && void 0 !== o[u] && s.push(i.default.convert(o[u], r));
            a.mrpRateDetails = s;
          }
          return a;
        }),
        e
      );
    })();
  t.default = o;
};
