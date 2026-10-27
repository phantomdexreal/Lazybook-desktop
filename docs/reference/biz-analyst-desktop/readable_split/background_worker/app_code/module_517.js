// webpack module #517 (from background_worker, BA Mobile Connector 8.4.41)
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
            n.Master.compare(this.shippedBy, e.shippedBy) &&
            n.Master.compare(this.shipDocumentNo, e.shipDocumentNo) &&
            n.Master.compare(this.finalDestination, e.finalDestination)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (a.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var n = new e();
          return (
            (n.shippedBy = a.TallyUtil.getStringValue(t, "basicshippedby")),
            (n.shipDocumentNo = a.TallyUtil.getStringValue(t, "basicshipdocumentno")),
            (n.finalDestination = a.TallyUtil.getStringValue(t, "basicfinaldestination")),
            n
          );
        }),
        e
      );
    })();
  t.default = i;
};
