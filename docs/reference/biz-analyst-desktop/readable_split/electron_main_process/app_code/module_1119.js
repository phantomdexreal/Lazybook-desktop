// webpack module #1119 (from electron_main_process, BA Mobile Connector 8.4.41)
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
          return (i.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e();
          ((a.documentDate = i.TallyUtil.parseDate(
            i.TallyUtil.getJsonValue(t, "documentdate"),
            i.DateUtil.FORMAT_YYYYMMDD,
          )),
            (a.transporterId = i.TallyUtil.getStringValue(t, "transporterid")),
            (a.transporterName = i.TallyUtil.getStringValue(t, "transportername")),
            (a.transporterMode = i.TallyUtil.getStringValue(t, "transportmode")),
            (a.vehicleNumber = i.TallyUtil.getStringValue(t, "vehiclenumber")),
            (a.documentNumber = i.TallyUtil.getStringValue(t, "documentnumber")),
            (a.vehicleType = i.TallyUtil.getStringValue(t, "vehicletype")));
          var o = i.TallyUtil.parseNumber(i.TallyUtil.getJsonValue(t, "distance"));
          return (
            i.Util.isNotNull(o) && o > -2147483648 && o < 2147483647
              ? (a.distance = o)
              : (a.distance = 0),
            (a.distanceInString = i.TallyUtil.getStringValue(t, "distance")),
            a
          );
        }),
        e
      );
    })();
  t.default = o;
};
