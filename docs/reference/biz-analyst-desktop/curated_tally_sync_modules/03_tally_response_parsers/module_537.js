// webpack module #537 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(5),
    a = r(28),
    i = r(0),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            n.Master.compare(this.taxability, e.taxability) &&
            n.Master.compare(this.toItemRate, e.toItemRate) &&
            n.Master.compare(this.rateDetails, e.rateDetails)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((i.Util.assign(r, t), i.Util.isNotNull(t.rateDetails) && t.rateDetails.length > 0)) {
            r.rateDetails = [];
            for (var n = 0, o = t.rateDetails; n < o.length; n++) {
              var s = o[n];
              r.rateDetails.push(a.RateDetail.toObject(s));
            }
          }
          return r;
        }),
        (e.convert = function (t) {
          var r = new e();
          (r.taxability = i.TallyUtil.getStringValue(t, "taxability")),
            (r.toItemRate = i.TallyUtil.parseNumber(i.TallyUtil.getJsonValue(t, "toitemrate")));
          var n = i.TallyUtil.parseArray(i.TallyUtil.getJsonValue(t, "ratedetails.list"));
          if (n.length > 0) {
            for (var o = [], s = 0; s < n.length; ++s)
              null !== n[s] && void 0 !== n[s] && o.push(a.RateDetail.convert(n[s]));
            r.rateDetails = o;
          }
          return r;
        }),
        e
      );
    })();
  t.default = o;
};
