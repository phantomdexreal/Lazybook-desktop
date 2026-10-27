// webpack module #1032 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(5),
    a = r(0),
    i = r(1033),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            n.Master.compare(this.irn, e.irn) &&
            n.Master.compare(this.ackNo, e.ackNo) &&
            n.Master.compare(this.ackDate, e.ackDate) &&
            n.Master.compare(this.qrCode, e.qrCode) &&
            n.Master.compare(this.isCancelled, e.isCancelled) &&
            n.Master.compare(this.billToPlace, e.billToPlace) &&
            n.Master.compare(this.shipToPlace, e.shipToPlace) &&
            n.Master.compare(this.dispatchFromDetails, e.dispatchFromDetails)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (
            a.Util.assign(r, t),
            a.Util.isNotNull(t.dispatchFromDetails) &&
              (r.dispatchFromDetails = i.default.toObject(t.dispatchFromDetails)),
            r
          );
        }),
        (e.convert = function (t, r) {
          var n = new e(),
            o = a.TallyUtil.getStringValue(t, "irn");
          a.Util.isNotEmptyString(o) && (n.irn = o);
          var s = a.TallyUtil.getStringValue(t, "irnackno");
          a.Util.isNotEmptyString(s) && (n.ackNo = s);
          var u = a.TallyUtil.getStringValue(t, "irnackdate");
          a.Util.isNotEmptyString(u) &&
            (a.Util.isNotNull(r) &&
            a.Util.isNotNull(r.company) &&
            a.Util.isNotNull(r.company.timezone)
              ? (n.ackDate = a.TallyUtil.parseDate(
                  u,
                  a.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone,
                ))
              : (n.ackDate = a.TallyUtil.parseDate(u, a.DateUtil.FORMAT_YYYYMMDD)));
          var p = a.TallyUtil.getStringValue(t, "irnqrcode");
          return (
            a.Util.isNotEmptyString(p) && (n.qrCode = p),
            (n.isCancelled = a.TallyUtil.getBoolean(t, "irncancelled")),
            (n.billToPlace = a.TallyUtil.getStringValue(t, "billtoplace")),
            (n.shipToPlace = a.TallyUtil.getStringValue(t, "shiptoplace")),
            (n.dispatchFromDetails = i.default.convert(t, r)),
            n
          );
        }),
        e
      );
    })();
  t.default = o;
};
