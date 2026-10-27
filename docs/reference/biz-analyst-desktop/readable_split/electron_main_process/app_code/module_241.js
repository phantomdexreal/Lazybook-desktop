// webpack module #241 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(5),
    a = r(2),
    o = r(11),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            i.Master.compare(this.gstRateDutyHead, e.gstRateDutyHead) &&
            i.Master.compare(this.gstRateDutyHeadNew, e.gstRateDutyHeadNew) &&
            i.Master.compare(this.gstRateValuationType, e.gstRateValuationType) &&
            i.Master.compare(this.gstRate, e.gstRate)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (a.Util.assign(r, t), r);
        }),
        (e.convert = function (t) {
          var r = new e();
          return (
            (r.gstRateDutyHeadNew = a.TallyUtil.getStringValue(t, "gstratedutyhead")),
            a.Util.isNotEmptyString(r.gstRateDutyHeadNew) &&
              (o.default.DUTY_HEADS_NEW.CENTRAL_TAX === r.gstRateDutyHeadNew
                ? (r.gstRateDutyHead = o.default.DUTY_HEADS_OLD.CENTRAL_TAX)
                : o.default.DUTY_HEADS_NEW.STATE_TAX === r.gstRateDutyHeadNew
                  ? (r.gstRateDutyHead = o.default.DUTY_HEADS_OLD.STATE_TAX)
                  : o.default.DUTY_HEADS_NEW.INTEGRATED_TAX === r.gstRateDutyHeadNew
                    ? (r.gstRateDutyHead = o.default.DUTY_HEADS_OLD.INTEGRATED_TAX)
                    : o.default.DUTY_HEADS_NEW.CESS === r.gstRateDutyHeadNew
                      ? (r.gstRateDutyHead = o.default.DUTY_HEADS_OLD.CESS)
                      : (r.gstRateDutyHead = a.TallyUtil.getStringValue(t, "gstratedutyhead"))),
            (r.gstRateValuationType = a.TallyUtil.getStringValue(t, "gstratevaluationtype")),
            (r.gstRate = a.TallyUtil.parseRate(a.TallyUtil.getJsonValue(t, "gstrate"))),
            r
          );
        }),
        e
      );
    })();
  t.default = s;
};
