// webpack module #1114 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(32),
    a = r(2),
    o = r(5),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            o.Master.compare(this.batch, e.batch) &&
            o.Master.compare(this.destGodownName, e.destGodownName) &&
            o.Master.compare(this.orderNo, e.orderNo) &&
            o.Master.compare(this.trackingNo, e.trackingNo) &&
            o.Master.compare(this.amount, e.amount) &&
            o.Master.compare(this.invQuantity, e.invQuantity) &&
            o.Master.compare(this.accQuantity, e.accQuantity) &&
            o.Master.compare(this.batchPhysicalDifference, e.batchPhysicalDifference) &&
            o.Master.compare(this.dueDate, e.dueDate) &&
            o.Master.compare(this.preClosureDate, e.preClosureDate) &&
            o.Master.compare(this.preClosureQuantity, e.preClosureQuantity) &&
            o.Master.compare(this.subPreClosureQuantity, e.subPreClosureQuantity) &&
            o.Master.compare(this.preClosureReason, e.preClosureReason) &&
            o.Master.compare(this.subQuantity, e.subQuantity) &&
            o.Master.compare(this.invSubQuantity, e.invSubQuantity)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (
            a.Util.assign(r, t),
            a.Util.isNotNull(t.batch) && (r.batch = i.Batch.toObject(t.batch)),
            r
          );
        }),
        (e.convert = function (t, r) {
          var o = new e();
          ((o.batch = i.Batch.convert(t, r)),
            (o.destGodownName = a.TallyUtil.getStringValue(t, "destinationgodownname")));
          var s = a.TallyUtil.getStringValue(t, "orderno");
          null != s &&
            "" !== s.trim() &&
            "not applicable" !== s.trim().toLowerCase() &&
            (o.orderNo = s);
          var n = a.TallyUtil.getStringValue(t, "trackingnumber");
          return (
            null != n &&
              "" !== n.trim() &&
              "not applicable" !== n.trim().toLowerCase() &&
              (o.trackingNo = n),
            (o.amount = a.TallyUtil.parseAmount(a.TallyUtil.getStringValue(t, "amount"))),
            (o.invQuantity = a.TallyUtil.parseQuantity(a.TallyUtil.getStringValue(t, "billedqty"))),
            (o.accQuantity = a.TallyUtil.parseQuantity(a.TallyUtil.getStringValue(t, "actualqty"))),
            (o.batchPhysicalDifference = a.TallyUtil.parseNumber(
              a.TallyUtil.getStringValue(t, "batchphysdiff"),
            )),
            a.Util.isNotNull(r) &&
            a.Util.isNotNull(r.company) &&
            a.Util.isNotNull(r.company.timezone)
              ? ((o.dueDate = a.TallyUtil.getDateValue(
                  t,
                  "orderduedate",
                  0,
                  a.DateUtil.FORMAT_DD_MMM_YYYY,
                  r.company.timezone,
                )),
                (o.preClosureDate = a.TallyUtil.getDateValue(
                  t,
                  "orderpreclosuredate",
                  0,
                  a.DateUtil.FORMAT_DD_MMM_YYYY,
                  r.company.timezone,
                )))
              : ((o.dueDate = a.TallyUtil.getDateValue(
                  t,
                  "orderduedate",
                  0,
                  a.DateUtil.FORMAT_DD_MMM_YYYY,
                )),
                (o.preClosureDate = a.TallyUtil.getDateValue(
                  t,
                  "orderpreclosuredate",
                  0,
                  a.DateUtil.FORMAT_DD_MMM_YYYY,
                ))),
            (o.preClosureQuantity = a.TallyUtil.parseNumber(
              a.TallyUtil.getStringValue(t, "orderpreclosureqty"),
            )),
            (o.subPreClosureQuantity = a.TallyUtil.parseAdditionalQuantity(
              a.TallyUtil.getStringValue(t, "orderpreclosureqty"),
            )),
            (o.preClosureReason = a.TallyUtil.getStringValue(t, "orderclosurereason")),
            (o.subQuantity = a.TallyUtil.parseAdditionalQuantity(
              a.TallyUtil.getJsonValue(t, "actualqty"),
            )),
            (o.invSubQuantity = a.TallyUtil.parseAdditionalQuantity(
              a.TallyUtil.getJsonValue(t, "billedqty"),
            )),
            o
          );
        }),
        e
      );
    })();
  t.default = s;
};
