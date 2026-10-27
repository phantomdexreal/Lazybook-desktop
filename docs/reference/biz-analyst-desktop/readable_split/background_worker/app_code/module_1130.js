// webpack module #1130 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = (function () {
    function e(e, t, r, n, a) {
      ((this.companyId = e),
        (this.masterName = t),
        (this.voucherDate = r),
        (this.tallyUpdatedAt = n),
        (this.serverUpdatedAt = a));
    }
    return (
      (e.toObject = function (t) {
        return new e(t.companyId, t.masterName, t.voucherDate, t.tallyUpdatedAt, t.serverUpdatedAt);
      }),
      e
    );
  })();
  t.default = n;
};
