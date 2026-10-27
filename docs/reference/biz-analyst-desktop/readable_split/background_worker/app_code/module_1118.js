// webpack module #1118 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

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
            n.Master.compare(this.bankDetails, e.bankDetails) &&
            n.Master.compare(this.branchName, e.branchName) &&
            n.Master.compare(this.accountHolder, e.accountHolder) &&
            n.Master.compare(this.bsrCode, e.bsrCode) &&
            n.Master.compare(this.ifsCode, e.ifsCode) &&
            n.Master.compare(this.branchCode, e.branchCode) &&
            n.Master.compare(this.bankName, e.bankName)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (a.Util.assign(r, t), r);
        }),
        (e.prototype.updateFromTally = function (e) {
          ((this.bankDetails = e.bankDetails),
            (this.branchName = e.branchName),
            (this.accountHolder = e.accountHolder),
            (this.bsrCode = e.bsrCode),
            (this.ifsCode = e.ifsCode),
            (this.bankName = e.bankName),
            (this.branchCode = e.branchCode));
        }),
        (e.convert = function (t, r) {
          var n = new e();
          return (
            (n.bankDetails = a.TallyUtil.getStringValue(t, "bankdetails")),
            (n.branchName = a.TallyUtil.getStringValue(t, "bankbranchname")),
            a.Util.isEmptyString(n.branchName) &&
              (n.branchName = a.TallyUtil.getStringValue(t, "branchname")),
            (n.accountHolder = a.TallyUtil.getStringValue(t, "bankaccholdername")),
            (n.bsrCode = a.TallyUtil.getStringValue(t, "bankbsrcode")),
            (n.ifsCode = a.TallyUtil.getStringValue(t, "ifscode")),
            (n.branchCode = a.TallyUtil.getStringValue(t, "branchCode")),
            (n.bankName = a.TallyUtil.getStringValue(t, "bankingconfigbank")),
            n
          );
        }),
        e
      );
    })();
  t.default = i;
};
