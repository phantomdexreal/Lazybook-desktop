// webpack module #546 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = r(5),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            a.Master.compare(this.godownName, e.godownName) &&
            a.Master.compare(this.batchName, e.batchName) &&
            a.Master.compare(this.openingStock, e.openingStock) &&
            a.Master.compare(this.openingRate, e.openingRate) &&
            a.Master.compare(this.openingAmount, e.openingAmount) &&
            a.Master.compare(this.manufactureDate, e.manufactureDate) &&
            a.Master.compare(this.expiryDate, e.expiryDate)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (i.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            (a.godownName = i.TallyUtil.getStringValue(t, "godownname")),
            (a.batchName = i.TallyUtil.getStringValue(t, "batchname")),
            (a.openingStock = i.TallyUtil.parseQuantity(
              i.TallyUtil.getJsonValue(t, "openingbalance"),
            )),
            (a.openingRate = i.TallyUtil.parseRate(i.TallyUtil.getJsonValue(t, "openingrate"))),
            (a.openingAmount = i.TallyUtil.parseAmount(
              i.TallyUtil.getJsonValue(t, "openingvalue"),
            )),
            i.Util.isNotNull(r) &&
            i.Util.isNotNull(r.company) &&
            i.Util.isNotNull(r.company.timezone)
              ? ((a.manufactureDate = i.TallyUtil.parseDate(
                  i.TallyUtil.getStringValue(t, "mfdon"),
                  i.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone,
                )),
                (a.expiryDate = i.TallyUtil.parseDate(
                  i.TallyUtil.getStringValue(t, "expiryperiod"),
                  i.DateUtil.FORMAT_DD_MMM_YYYY,
                  r.company.timezone,
                )))
              : ((a.manufactureDate = i.TallyUtil.parseDate(
                  i.TallyUtil.getStringValue(t, "mfdon"),
                  i.DateUtil.FORMAT_YYYYMMDD,
                )),
                (a.expiryDate = i.TallyUtil.parseDate(
                  i.TallyUtil.getStringValue(t, "expiryperiod"),
                  i.DateUtil.FORMAT_DD_MMM_YYYY,
                ))),
            a
          );
        }),
        e
      );
    })();
  t.default = o;
};
