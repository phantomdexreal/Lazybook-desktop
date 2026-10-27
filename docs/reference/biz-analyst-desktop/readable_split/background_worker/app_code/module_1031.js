// webpack module #1031 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(28),
    a = r(0),
    i = r(5),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            i.Master.compare(this.batch, e.batch) &&
            i.Master.compare(this.destGodownName, e.destGodownName) &&
            i.Master.compare(this.orderNo, e.orderNo) &&
            i.Master.compare(this.trackingNo, e.trackingNo) &&
            i.Master.compare(this.amount, e.amount) &&
            i.Master.compare(this.invQuantity, e.invQuantity) &&
            i.Master.compare(this.accQuantity, e.accQuantity) &&
            i.Master.compare(this.batchPhysicalDifference, e.batchPhysicalDifference) &&
            i.Master.compare(this.dueDate, e.dueDate) &&
            i.Master.compare(this.preClosureDate, e.preClosureDate) &&
            i.Master.compare(this.preClosureQuantity, e.preClosureQuantity) &&
            i.Master.compare(this.subPreClosureQuantity, e.subPreClosureQuantity) &&
            i.Master.compare(this.preClosureReason, e.preClosureReason) &&
            i.Master.compare(this.subQuantity, e.subQuantity) &&
            i.Master.compare(this.invSubQuantity, e.invSubQuantity)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (
            a.Util.assign(r, t),
            a.Util.isNotNull(t.batch) && (r.batch = n.Batch.toObject(t.batch)),
            r
          );
        }),
        (e.convert = function (t, r) {
          var i = new e();
          ((i.batch = n.Batch.convert(t, r)),
            (i.destGodownName = a.TallyUtil.getStringValue(t, "destinationgodownname")));
          var o = a.TallyUtil.getStringValue(t, "orderno");
          null != o &&
            "" !== o.trim() &&
            "not applicable" !== o.trim().toLowerCase() &&
            (i.orderNo = o);
          var s = a.TallyUtil.getStringValue(t, "trackingnumber");
          return (
            null != s &&
              "" !== s.trim() &&
              "not applicable" !== s.trim().toLowerCase() &&
              (i.trackingNo = s),
            (i.amount = a.TallyUtil.parseAmount(a.TallyUtil.getStringValue(t, "amount"))),
            (i.invQuantity = a.TallyUtil.parseQuantity(a.TallyUtil.getStringValue(t, "billedqty"))),
            (i.accQuantity = a.TallyUtil.parseQuantity(a.TallyUtil.getStringValue(t, "actualqty"))),
            (i.batchPhysicalDifference = a.TallyUtil.parseNumber(
              a.TallyUtil.getStringValue(t, "batchphysdiff"),
            )),
            a.Util.isNotNull(r) &&
            a.Util.isNotNull(r.company) &&
            a.Util.isNotNull(r.company.timezone)
              ? ((i.dueDate = a.TallyUtil.getDateValue(
                  t,
                  "orderduedate",
                  0,
                  a.DateUtil.FORMAT_DD_MMM_YYYY,
                  r.company.timezone,
                )),
                (i.preClosureDate = a.TallyUtil.getDateValue(
                  t,
                  "orderpreclosuredate",
                  0,
                  a.DateUtil.FORMAT_DD_MMM_YYYY,
                  r.company.timezone,
                )))
              : ((i.dueDate = a.TallyUtil.getDateValue(
                  t,
                  "orderduedate",
                  0,
                  a.DateUtil.FORMAT_DD_MMM_YYYY,
                )),
                (i.preClosureDate = a.TallyUtil.getDateValue(
                  t,
                  "orderpreclosuredate",
                  0,
                  a.DateUtil.FORMAT_DD_MMM_YYYY,
                ))),
            (i.preClosureQuantity = a.TallyUtil.parseNumber(
              a.TallyUtil.getStringValue(t, "orderpreclosureqty"),
            )),
            (i.subPreClosureQuantity = a.TallyUtil.parseAdditionalQuantity(
              a.TallyUtil.getStringValue(t, "orderpreclosureqty"),
            )),
            (i.preClosureReason = a.TallyUtil.getStringValue(t, "orderclosurereason")),
            (i.subQuantity = a.TallyUtil.parseAdditionalQuantity(
              a.TallyUtil.getJsonValue(t, "actualqty"),
            )),
            (i.invSubQuantity = a.TallyUtil.parseAdditionalQuantity(
              a.TallyUtil.getJsonValue(t, "billedqty"),
            )),
            i
          );
        }),
        e
      );
    })();
  t.default = o;
};
