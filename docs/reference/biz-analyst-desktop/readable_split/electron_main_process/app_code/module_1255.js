// webpack module #1255 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(592),
    a = r(241),
    o = r(5),
    s = r(2),
    n = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !(
            !o.Master.compare(this.rateDetails, e.rateDetails) ||
            !o.Master.compare(this.gstSlabRates, e.gstSlabRates)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((s.Util.assign(r, t), s.Util.isNotNull(t.rateDetails) && t.rateDetails.length > 0)) {
            r.rateDetails = [];
            for (var o = 0, n = t.rateDetails; o < n.length; o++) {
              var u = n[o];
              r.rateDetails.push(a.default.toObject(u));
            }
          }
          if (s.Util.isNotNull(t.gstSlabRates) && t.gstSlabRates.length > 0) {
            r.gstSlabRates = [];
            for (var p = 0, c = t.gstSlabRates; p < c.length; p++) {
              var m = c[p];
              r.gstSlabRates.push(i.default.toObject(m));
            }
          }
          return r;
        }),
        (e.convert = function (t) {
          var r = new e(),
            o = s.TallyUtil.parseArray(s.TallyUtil.getJsonValue(t, "ratedetails.list"));
          if (o.length > 0) {
            for (var n = [], u = 0; u < o.length; ++u)
              null !== o[u] && void 0 !== o[u] && n.push(a.default.convert(o[u]));
            r.rateDetails = n;
          }
          var p = s.TallyUtil.parseArray(s.TallyUtil.getJsonValue(t, "gstslabrates.list"));
          if (p.length > 0) {
            var c = [];
            for (u = 0; u < p.length; ++u)
              null !== p[u] && void 0 !== p[u] && c.push(i.default.convert(p[u]));
            r.gstSlabRates = c;
          }
          return r;
        }),
        e
      );
    })();
  t.default = n;
};
