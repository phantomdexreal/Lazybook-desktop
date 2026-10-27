// webpack module #555 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(5),
    a = r(2),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            i.Master.compare(this.bankName, e.bankName) &&
            i.Master.compare(this.transactionType, e.transactionType) &&
            i.Master.compare(this.bankBranchName, e.bankBranchName) &&
            i.Master.compare(this.bankPartyName, e.bankPartyName) &&
            i.Master.compare(this.transferMode, e.transferMode) &&
            i.Master.compare(this.chequeCrossComment, e.chequeCrossComment) &&
            i.Master.compare(this.instrumentDate, e.instrumentDate) &&
            i.Master.compare(this.bankersDate, e.bankersDate) &&
            i.Master.compare(this.amount, e.amount) &&
            i.Master.compare(this.chequeNumber, e.chequeNumber)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (a.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var i = new e();
          ((i.bankName = a.TallyUtil.getStringValue(t, "bankname")),
            (i.transactionType = a.TallyUtil.getStringValue(t, "transactiontype")),
            (i.bankBranchName = a.TallyUtil.getStringValue(t, "bankbranchname")),
            (i.bankPartyName = a.TallyUtil.getStringValue(t, "paymentfavouring")),
            (i.transferMode = a.TallyUtil.getStringValue(t, "transfermode")),
            (null !== i.transferMode && void 0 !== i.transferMode) ||
              (i.transferMode = a.TallyUtil.getStringValue(t, "paymentmode")),
            (i.chequeCrossComment = a.TallyUtil.getStringValue(t, "chequecrosscomment")),
            (i.amount = a.TallyUtil.parseAmount(a.TallyUtil.getJsonValue(t, "amount"))),
            (i.chequeNumber = a.TallyUtil.getStringValue(t, "instrumentnumber")));
          var o = a.TallyUtil.getJsonValue(t, "instrumentdate");
          ((o =
            null != o && "" !== o
              ? a.Util.isNotNull(r) &&
                a.Util.isNotNull(r.company) &&
                a.Util.isNotNull(r.company.timezone)
                ? a.TallyUtil.parseDate(o, null, r.company.timezone)
                : a.TallyUtil.parseDate(o)
              : 0),
            (i.instrumentDate = o));
          var s = a.TallyUtil.getJsonValue(t, "bankersdate");
          return (
            (s =
              null != s && "" !== s
                ? a.Util.isNotNull(r) &&
                  a.Util.isNotNull(r.company) &&
                  a.Util.isNotNull(r.company.timezone)
                  ? a.TallyUtil.parseDate(s, null, r.company.timezone)
                  : a.TallyUtil.parseDate(s)
                : 0),
            (i.bankersDate = s),
            i
          );
        }),
        e
      );
    })();
  t.default = o;
};
