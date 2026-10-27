// webpack module #592 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(5),
    a = r(32),
    o = r(2),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            i.Master.compare(this.taxability, e.taxability) &&
            i.Master.compare(this.toItemRate, e.toItemRate) &&
            i.Master.compare(this.rateDetails, e.rateDetails)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((o.Util.assign(r, t), o.Util.isNotNull(t.rateDetails) && t.rateDetails.length > 0)) {
            r.rateDetails = [];
            for (var i = 0, s = t.rateDetails; i < s.length; i++) {
              var n = s[i];
              r.rateDetails.push(a.RateDetail.toObject(n));
            }
          }
          return r;
        }),
        (e.convert = function (t) {
          var r = new e();
          ((r.taxability = o.TallyUtil.getStringValue(t, "taxability")),
            (r.toItemRate = o.TallyUtil.parseNumber(o.TallyUtil.getJsonValue(t, "toitemrate"))));
          var i = o.TallyUtil.parseArray(o.TallyUtil.getJsonValue(t, "ratedetails.list"));
          if (i.length > 0) {
            for (var s = [], n = 0; n < i.length; ++n)
              null !== i[n] && void 0 !== i[n] && s.push(a.RateDetail.convert(i[n]));
            r.rateDetails = s;
          }
          return r;
        }),
        e
      );
    })();
  t.default = s;
};
