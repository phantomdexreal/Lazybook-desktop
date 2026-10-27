// webpack module #1267 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = r(5),
    o = (function () {
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
          return (i.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            (a.name = i.TallyUtil.getStringValue(t, "name")),
            (a.rate = i.TallyUtil.parseRate(i.TallyUtil.getJsonValue(t, "classrate"))),
            (a.overrideDefault = i.TallyUtil.getBoolean(t, "ledgerfromitem")),
            (a.removeZeroEntries = i.TallyUtil.getBoolean(t, "removezeroentries")),
            a
          );
        }),
        e
      );
    })();
  t.default = o;
};
