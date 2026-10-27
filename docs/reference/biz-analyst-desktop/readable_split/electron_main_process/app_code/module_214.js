// webpack module #214 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = r(52),
    o = r(5),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            o.Master.compare(this.partyId, e.partyId) &&
            o.Master.compare(this.customId, e.customId) &&
            o.Master.compare(this.date, e.date) &&
            o.Master.compare(this.dueDate, e.dueDate) &&
            o.Master.compare(this.amount, e.amount) &&
            o.Master.compare(this.desc, e.desc) &&
            o.Master.compare(this.type, e.type) &&
            o.Master.compare(this.customType, e.customType)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (i.Util.assign(r, t), r);
        }),
        (e.convertPendingBill = function (t, r) {
          var a = new e();
          ((a.customId = i.TallyUtil.getStringValue(t, "name")),
            i.Util.isNotNull(r) &&
            i.Util.isNotNull(r.company) &&
            i.Util.isNotNull(r.company.timezone)
              ? (a.date = i.TallyUtil.parseDate(
                  i.TallyUtil.getJsonValue(t, "billdate"),
                  i.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone,
                ))
              : (a.date = i.TallyUtil.parseDate(
                  i.TallyUtil.getJsonValue(t, "billdate"),
                  i.DateUtil.FORMAT_YYYYMMDD,
                )));
          var o = i.TallyUtil.getJsonValue(t, "billcreditperiod");
          return (
            (a.dueDate = e.parseBillCreditPeriod(o, a.date, r)),
            (a.amount =
              -1 * i.TallyUtil.parseAmount(i.TallyUtil.getJsonValue(t, "openingbalance"))),
            (a.desc = i.TallyUtil.getStringValue(t, "billtype")),
            a
          );
        }),
        (e.convertVoucherBill = function (t, r, a, o, s) {
          var n = new e();
          (i.Util.isNotEmptyString(s) && (n.partyId = s),
            (n.customId = i.TallyUtil.getStringValue(t, "name")),
            (n.date = r));
          var u = i.TallyUtil.getJsonValue(t, "billcreditperiod");
          return (
            (n.dueDate = e.parseBillCreditPeriod(u, r, o)),
            (n.amount = i.TallyUtil.parseAmount(i.TallyUtil.getJsonValue(t, "amount")) * a),
            (n.desc = i.TallyUtil.getStringValue(t, "billtype")),
            n
          );
        }),
        (e.parseBillCreditPeriod = function (e, t, r) {
          var o = t;
          return (
            null != e &&
              "" !== e.trim() &&
              (-1 !== e.indexOf("Day")
                ? ((e = i.TallyUtil.parseNumber(e)), (o = i.DateUtil.addDate(t, e, a.Duration.DAY)))
                : -1 !== e.indexOf("Week")
                  ? ((e = i.TallyUtil.parseNumber(e)),
                    (o = i.DateUtil.addDate(t, e, a.Duration.WEEK)))
                  : -1 !== e.indexOf("Month")
                    ? ((e = i.TallyUtil.parseNumber(e)),
                      (o = i.DateUtil.addDate(t, e, a.Duration.MONTH)))
                    : -1 !== e.indexOf("Year")
                      ? ((e = i.TallyUtil.parseNumber(e)),
                        (o = i.DateUtil.addDate(t, e, a.Duration.YEAR)))
                      : (o =
                          i.Util.isNotNull(r) &&
                          i.Util.isNotNull(r.company) &&
                          i.Util.isNotNull(r.company.timezone)
                            ? i.TallyUtil.parseDate(
                                e,
                                i.DateUtil.FORMAT_DD_MMM_YYYY,
                                r.company.timezone,
                              )
                            : i.TallyUtil.parseDate(e, i.DateUtil.FORMAT_DD_MMM_YYYY))),
            o
          );
        }),
        e
      );
    })();
  t.default = s;
};
