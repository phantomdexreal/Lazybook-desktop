// webpack module #556 (from electron_main_process, BA Mobile Connector 8.4.41)
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
            i.Master.compare(this.shippedBy, e.shippedBy) &&
            i.Master.compare(this.shipDocumentNo, e.shipDocumentNo) &&
            i.Master.compare(this.finalDestination, e.finalDestination)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (a.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var i = new e();
          return (
            (i.shippedBy = a.TallyUtil.getStringValue(t, "basicshippedby")),
            (i.shipDocumentNo = a.TallyUtil.getStringValue(t, "basicshipdocumentno")),
            (i.finalDestination = a.TallyUtil.getStringValue(t, "basicfinaldestination")),
            i
          );
        }),
        e
      );
    })();
  t.default = o;
};
