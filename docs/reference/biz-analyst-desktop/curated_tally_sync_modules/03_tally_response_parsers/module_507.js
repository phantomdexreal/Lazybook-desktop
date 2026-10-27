// webpack module #507 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(5),
    a = r(0),
    i = r(28),
    o = (function () {
      function e() {
        this.amount = 0;
      }
      return (
        (e.prototype.equals = function (e) {
          return !(!n.Master.compare(this.id, e.id) || !n.Master.compare(this.amount, e.amount));
        }),
        (e.toObject = function (t) {
          var r = new e();
          return a.Util.assign(r, t), r;
        }),
        (e.convert = function (t, r) {
          var n = new e();
          return (
            (n.id = a.TallyUtil.getStringValue(t, "ledgername")),
            (n.masterId = i.Voucher.getLedgerMasterId(n.id)),
            (n.amount = a.TallyUtil.parseAmount(a.TallyUtil.getJsonValue(t, "amount"))),
            n
          );
        }),
        e
      );
    })();
  t.default = o;
};
