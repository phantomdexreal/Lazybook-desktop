// webpack module #1125 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(537),
    a = r(227),
    i = r(5),
    o = r(0),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !(
            !i.Master.compare(this.rateDetails, e.rateDetails) ||
            !i.Master.compare(this.gstSlabRates, e.gstSlabRates)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((o.Util.assign(r, t), o.Util.isNotNull(t.rateDetails) && t.rateDetails.length > 0)) {
            r.rateDetails = [];
            for (var i = 0, s = t.rateDetails; i < s.length; i++) {
              var u = s[i];
              r.rateDetails.push(a.default.toObject(u));
            }
          }
          if (o.Util.isNotNull(t.gstSlabRates) && t.gstSlabRates.length > 0) {
            r.gstSlabRates = [];
            for (var p = 0, c = t.gstSlabRates; p < c.length; p++) {
              var l = c[p];
              r.gstSlabRates.push(n.default.toObject(l));
            }
          }
          return r;
        }),
        (e.convert = function (t) {
          var r = new e(),
            i = o.TallyUtil.parseArray(o.TallyUtil.getJsonValue(t, "ratedetails.list"));
          if (i.length > 0) {
            for (var s = [], u = 0; u < i.length; ++u)
              null !== i[u] && void 0 !== i[u] && s.push(a.default.convert(i[u]));
            r.rateDetails = s;
          }
          var p = o.TallyUtil.parseArray(o.TallyUtil.getJsonValue(t, "gstslabrates.list"));
          if (p.length > 0) {
            var c = [];
            for (u = 0; u < p.length; ++u)
              null !== p[u] && void 0 !== p[u] && c.push(n.default.convert(p[u]));
            r.gstSlabRates = c;
          }
          return r;
        }),
        e
      );
    })();
  t.default = s;
};
