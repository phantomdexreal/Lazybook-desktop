// webpack module #1115 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(5),
    a = r(2),
    o = r(1116),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            i.Master.compare(this.irn, e.irn) &&
            i.Master.compare(this.ackNo, e.ackNo) &&
            i.Master.compare(this.ackDate, e.ackDate) &&
            i.Master.compare(this.qrCode, e.qrCode) &&
            i.Master.compare(this.isCancelled, e.isCancelled) &&
            i.Master.compare(this.billToPlace, e.billToPlace) &&
            i.Master.compare(this.shipToPlace, e.shipToPlace) &&
            i.Master.compare(this.dispatchFromDetails, e.dispatchFromDetails)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (
            a.Util.assign(r, t),
            a.Util.isNotNull(t.dispatchFromDetails) &&
              (r.dispatchFromDetails = o.default.toObject(t.dispatchFromDetails)),
            r
          );
        }),
        (e.convert = function (t, r) {
          var i = new e(),
            s = a.TallyUtil.getStringValue(t, "irn");
          a.Util.isNotEmptyString(s) && (i.irn = s);
          var n = a.TallyUtil.getStringValue(t, "irnackno");
          a.Util.isNotEmptyString(n) && (i.ackNo = n);
          var u = a.TallyUtil.getStringValue(t, "irnackdate");
          a.Util.isNotEmptyString(u) &&
            (a.Util.isNotNull(r) &&
            a.Util.isNotNull(r.company) &&
            a.Util.isNotNull(r.company.timezone)
              ? (i.ackDate = a.TallyUtil.parseDate(
                  u,
                  a.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone,
                ))
              : (i.ackDate = a.TallyUtil.parseDate(u, a.DateUtil.FORMAT_YYYYMMDD)));
          var p = a.TallyUtil.getStringValue(t, "irnqrcode");
          return (
            a.Util.isNotEmptyString(p) && (i.qrCode = p),
            (i.isCancelled = a.TallyUtil.getBoolean(t, "irncancelled")),
            (i.billToPlace = a.TallyUtil.getStringValue(t, "billtoplace")),
            (i.shipToPlace = a.TallyUtil.getStringValue(t, "shiptoplace")),
            (i.dispatchFromDetails = o.default.convert(t, r)),
            i
          );
        }),
        e
      );
    })();
  t.default = s;
};
