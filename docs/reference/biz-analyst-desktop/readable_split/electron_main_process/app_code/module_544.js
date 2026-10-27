// webpack module #544 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(5),
    a = r(2),
    o = r(32),
    s = (function () {
      function e() {
        this.amount = 0;
      }
      return (
        (e.prototype.equals = function (e) {
          return !(!i.Master.compare(this.id, e.id) || !i.Master.compare(this.amount, e.amount));
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (a.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var i = new e();
          return (
            (i.id = a.TallyUtil.getStringValue(t, "ledgername")),
            (i.masterId = o.Voucher.getLedgerMasterId(i.id)),
            (i.amount = a.TallyUtil.parseAmount(a.TallyUtil.getJsonValue(t, "amount"))),
            i
          );
        }),
        e
      );
    })();
  t.default = s;
};
