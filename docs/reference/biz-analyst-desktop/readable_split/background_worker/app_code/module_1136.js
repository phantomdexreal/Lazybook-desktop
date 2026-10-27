// webpack module #1136 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = r(5),
    i = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            a.Master.compare(this.name, e.name) &&
            a.Master.compare(this.rate, e.rate) &&
            a.Master.compare(this.overrideDefault, e.overrideDefault) &&
            a.Master.compare(this.removeZeroEntries, e.removeZeroEntries)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (n.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            (a.name = n.TallyUtil.getStringValue(t, "name")),
            (a.rate = n.TallyUtil.parseRate(n.TallyUtil.getJsonValue(t, "classrate"))),
            (a.overrideDefault = n.TallyUtil.getBoolean(t, "ledgerfromitem")),
            (a.removeZeroEntries = n.TallyUtil.getBoolean(t, "removezeroentries")),
            a
          );
        }),
        e
      );
    })();
  t.default = i;
};
