// webpack module #508 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

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
          return (n.Util.assign(r, t), r);
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            (a.godownName = n.TallyUtil.getStringValue(t, "godownname")),
            (a.batchName = n.TallyUtil.getStringValue(t, "batchname")),
            (a.openingStock = n.TallyUtil.parseQuantity(
              n.TallyUtil.getJsonValue(t, "openingbalance"),
            )),
            (a.openingRate = n.TallyUtil.parseRate(n.TallyUtil.getJsonValue(t, "openingrate"))),
            (a.openingAmount = n.TallyUtil.parseAmount(
              n.TallyUtil.getJsonValue(t, "openingvalue"),
            )),
            n.Util.isNotNull(r) &&
            n.Util.isNotNull(r.company) &&
            n.Util.isNotNull(r.company.timezone)
              ? ((a.manufactureDate = n.TallyUtil.parseDate(
                  n.TallyUtil.getStringValue(t, "mfdon"),
                  n.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone,
                )),
                (a.expiryDate = n.TallyUtil.parseDate(
                  n.TallyUtil.getStringValue(t, "expiryperiod"),
                  n.DateUtil.FORMAT_DD_MMM_YYYY,
                  r.company.timezone,
                )))
              : ((a.manufactureDate = n.TallyUtil.parseDate(
                  n.TallyUtil.getStringValue(t, "mfdon"),
                  n.DateUtil.FORMAT_YYYYMMDD,
                )),
                (a.expiryDate = n.TallyUtil.parseDate(
                  n.TallyUtil.getStringValue(t, "expiryperiod"),
                  n.DateUtil.FORMAT_DD_MMM_YYYY,
                ))),
            a
          );
        }),
        e
      );
    })();
  t.default = i;
};
