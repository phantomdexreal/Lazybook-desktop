// webpack module #227 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(5),
    a = r(0),
    i = r(8),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            n.Master.compare(this.gstRateDutyHead, e.gstRateDutyHead) &&
            n.Master.compare(this.gstRateDutyHeadNew, e.gstRateDutyHeadNew) &&
            n.Master.compare(this.gstRateValuationType, e.gstRateValuationType) &&
            n.Master.compare(this.gstRate, e.gstRate)
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
              (i.default.DUTY_HEADS_NEW.CENTRAL_TAX === r.gstRateDutyHeadNew
                ? (r.gstRateDutyHead = i.default.DUTY_HEADS_OLD.CENTRAL_TAX)
                : i.default.DUTY_HEADS_NEW.STATE_TAX === r.gstRateDutyHeadNew
                  ? (r.gstRateDutyHead = i.default.DUTY_HEADS_OLD.STATE_TAX)
                  : i.default.DUTY_HEADS_NEW.INTEGRATED_TAX === r.gstRateDutyHeadNew
                    ? (r.gstRateDutyHead = i.default.DUTY_HEADS_OLD.INTEGRATED_TAX)
                    : i.default.DUTY_HEADS_NEW.CESS === r.gstRateDutyHeadNew
                      ? (r.gstRateDutyHead = i.default.DUTY_HEADS_OLD.CESS)
                      : (r.gstRateDutyHead = a.TallyUtil.getStringValue(t, "gstratedutyhead"))),
            (r.gstRateValuationType = a.TallyUtil.getStringValue(t, "gstratevaluationtype")),
            (r.gstRate = a.TallyUtil.parseRate(a.TallyUtil.getJsonValue(t, "gstrate"))),
            r
          );
        }),
        e
      );
    })();
  t.default = o;
};
