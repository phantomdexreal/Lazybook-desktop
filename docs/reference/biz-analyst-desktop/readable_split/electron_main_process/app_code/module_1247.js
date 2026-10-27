// webpack module #1247 (from electron_main_process, BA Mobile Connector 8.4.41)
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
            i.Master.compare(this.bankDetails, e.bankDetails) &&
            i.Master.compare(this.branchName, e.branchName) &&
            i.Master.compare(this.accountHolder, e.accountHolder) &&
            i.Master.compare(this.bsrCode, e.bsrCode) &&
            i.Master.compare(this.ifsCode, e.ifsCode) &&
            i.Master.compare(this.branchCode, e.branchCode) &&
            i.Master.compare(this.bankName, e.bankName)
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
          var i = new e();
          return (
            (i.bankDetails = a.TallyUtil.getStringValue(t, "bankdetails")),
            (i.branchName = a.TallyUtil.getStringValue(t, "bankbranchname")),
            a.Util.isEmptyString(i.branchName) &&
              (i.branchName = a.TallyUtil.getStringValue(t, "branchname")),
            (i.accountHolder = a.TallyUtil.getStringValue(t, "bankaccholdername")),
            (i.bsrCode = a.TallyUtil.getStringValue(t, "bankbsrcode")),
            (i.ifsCode = a.TallyUtil.getStringValue(t, "ifscode")),
            (i.branchCode = a.TallyUtil.getStringValue(t, "branchCode")),
            (i.bankName = a.TallyUtil.getStringValue(t, "bankingconfigbank")),
            i
          );
        }),
        e
      );
    })();
  t.default = o;
};
