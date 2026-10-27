// webpack module #111 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = r(5),
    i = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            a.Master.compare(this.hsnCode, e.hsnCode) &&
            a.Master.compare(this.hsn, e.hsn) &&
            a.Master.compare(this.applicableFrom, e.applicableFrom) &&
            a.Master.compare(this.sourceOfHsnDetails, e.sourceOfHsnDetails) &&
            a.Master.compare(this.hsnClassificationName, e.hsnClassificationName)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return n.Util.assign(r, t), r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            (a.hsnCode = n.TallyUtil.getStringValue(t, "hsncode")),
            (a.hsn = n.TallyUtil.getStringValue(t, "hsn")),
            n.Util.isNotNull(r) &&
            n.Util.isNotNull(r.company) &&
            n.Util.isNotNull(r.company.timezone)
              ? (a.applicableFrom = n.TallyUtil.parseDate(
                  n.TallyUtil.getJsonValue(t, "applicablefrom"),
                  n.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone
                ))
              : (a.applicableFrom = n.TallyUtil.parseDate(
                  n.TallyUtil.getJsonValue(t, "applicablefrom"),
                  n.DateUtil.FORMAT_YYYYMMDD
                )),
            (a.hsnClassificationName = n.TallyUtil.getStringValue(t, "hsnclassificationname")),
            (a.sourceOfHsnDetails = n.TallyUtil.getStringValue(t, "srcofhsndetails")),
            a
          );
        }),
        e
      );
    })();
  t.default = i;
};
