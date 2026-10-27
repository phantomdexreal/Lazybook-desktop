// webpack module #516 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(5),
    a = r(0),
    i = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            n.Master.compare(this.bankName, e.bankName) &&
            n.Master.compare(this.transactionType, e.transactionType) &&
            n.Master.compare(this.bankBranchName, e.bankBranchName) &&
            n.Master.compare(this.bankPartyName, e.bankPartyName) &&
            n.Master.compare(this.transferMode, e.transferMode) &&
            n.Master.compare(this.chequeCrossComment, e.chequeCrossComment) &&
            n.Master.compare(this.instrumentDate, e.instrumentDate) &&
            n.Master.compare(this.bankersDate, e.bankersDate) &&
            n.Master.compare(this.amount, e.amount) &&
            n.Master.compare(this.chequeNumber, e.chequeNumber)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return a.Util.assign(r, t), r;
        }),
        (e.convert = function (t, r) {
          var n = new e();
          (n.bankName = a.TallyUtil.getStringValue(t, "bankname")),
            (n.transactionType = a.TallyUtil.getStringValue(t, "transactiontype")),
            (n.bankBranchName = a.TallyUtil.getStringValue(t, "bankbranchname")),
            (n.bankPartyName = a.TallyUtil.getStringValue(t, "paymentfavouring")),
            (n.transferMode = a.TallyUtil.getStringValue(t, "transfermode")),
            (null !== n.transferMode && void 0 !== n.transferMode) ||
              (n.transferMode = a.TallyUtil.getStringValue(t, "paymentmode")),
            (n.chequeCrossComment = a.TallyUtil.getStringValue(t, "chequecrosscomment")),
            (n.amount = a.TallyUtil.parseAmount(a.TallyUtil.getJsonValue(t, "amount"))),
            (n.chequeNumber = a.TallyUtil.getStringValue(t, "instrumentnumber"));
          var i = a.TallyUtil.getJsonValue(t, "instrumentdate");
          (i =
            null != i && "" !== i
              ? a.Util.isNotNull(r) &&
                a.Util.isNotNull(r.company) &&
                a.Util.isNotNull(r.company.timezone)
                ? a.TallyUtil.parseDate(i, null, r.company.timezone)
                : a.TallyUtil.parseDate(i)
              : 0),
            (n.instrumentDate = i);
          var o = a.TallyUtil.getJsonValue(t, "bankersdate");
          return (
            (o =
              null != o && "" !== o
                ? a.Util.isNotNull(r) &&
                  a.Util.isNotNull(r.company) &&
                  a.Util.isNotNull(r.company.timezone)
                  ? a.TallyUtil.parseDate(o, null, r.company.timezone)
                  : a.TallyUtil.parseDate(o)
                : 0),
            (n.bankersDate = o),
            n
          );
        }),
        e
      );
    })();
  t.default = i;
};
