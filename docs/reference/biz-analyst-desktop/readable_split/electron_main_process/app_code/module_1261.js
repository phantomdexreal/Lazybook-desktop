// webpack module #1261 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = (function () {
    function e(e, t, r, i, a) {
      ((this.companyId = e),
        (this.masterName = t),
        (this.voucherDate = r),
        (this.tallyUpdatedAt = i),
        (this.serverUpdatedAt = a));
    }
    return (
      (e.toObject = function (t) {
        return new e(t.companyId, t.masterName, t.voucherDate, t.tallyUpdatedAt, t.serverUpdatedAt);
      }),
      e
    );
  })();
  t.default = i;
};
