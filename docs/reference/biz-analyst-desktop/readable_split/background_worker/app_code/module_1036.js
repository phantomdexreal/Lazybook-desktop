// webpack module #1036 (from background_worker, BA Mobile Connector 8.4.41)
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
            a.Master.compare(this.documentDate, e.documentDate) &&
            a.Master.compare(this.transporterId, e.transporterId) &&
            a.Master.compare(this.transporterName, e.transporterName) &&
            a.Master.compare(this.transporterMode, e.transporterMode) &&
            a.Master.compare(this.vehicleNumber, e.vehicleNumber) &&
            a.Master.compare(this.documentNumber, e.documentNumber) &&
            a.Master.compare(this.vehicleType, e.vehicleType) &&
            a.Master.compare(this.distance, e.distance) &&
            a.Master.compare(this.distanceInString, e.distanceInString)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (n.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e();
          ((a.documentDate = n.TallyUtil.parseDate(
            n.TallyUtil.getJsonValue(t, "documentdate"),
            n.DateUtil.FORMAT_YYYYMMDD,
          )),
            (a.transporterId = n.TallyUtil.getStringValue(t, "transporterid")),
            (a.transporterName = n.TallyUtil.getStringValue(t, "transportername")),
            (a.transporterMode = n.TallyUtil.getStringValue(t, "transportmode")),
            (a.vehicleNumber = n.TallyUtil.getStringValue(t, "vehiclenumber")),
            (a.documentNumber = n.TallyUtil.getStringValue(t, "documentnumber")),
            (a.vehicleType = n.TallyUtil.getStringValue(t, "vehicletype")));
          var i = n.TallyUtil.parseNumber(n.TallyUtil.getJsonValue(t, "distance"));
          return (
            n.Util.isNotNull(i) && i > -2147483648 && i < 2147483647
              ? (a.distance = i)
              : (a.distance = 0),
            (a.distanceInString = n.TallyUtil.getStringValue(t, "distance")),
            a
          );
        }),
        e
      );
    })();
  t.default = i;
};
