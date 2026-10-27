// webpack module #202 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = r(45),
    i = r(5),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            i.Master.compare(this.partyId, e.partyId) &&
            i.Master.compare(this.customId, e.customId) &&
            i.Master.compare(this.date, e.date) &&
            i.Master.compare(this.dueDate, e.dueDate) &&
            i.Master.compare(this.amount, e.amount) &&
            i.Master.compare(this.desc, e.desc) &&
            i.Master.compare(this.type, e.type) &&
            i.Master.compare(this.customType, e.customType)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return n.Util.assign(r, t), r;
        }),
        (e.convertPendingBill = function (t, r) {
          var a = new e();
          (a.customId = n.TallyUtil.getStringValue(t, "name")),
            n.Util.isNotNull(r) &&
            n.Util.isNotNull(r.company) &&
            n.Util.isNotNull(r.company.timezone)
              ? (a.date = n.TallyUtil.parseDate(
                  n.TallyUtil.getJsonValue(t, "billdate"),
                  n.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone
                ))
              : (a.date = n.TallyUtil.parseDate(
                  n.TallyUtil.getJsonValue(t, "billdate"),
                  n.DateUtil.FORMAT_YYYYMMDD
                ));
          var i = n.TallyUtil.getJsonValue(t, "billcreditperiod");
          return (
            (a.dueDate = e.parseBillCreditPeriod(i, a.date, r)),
            (a.amount =
              -1 * n.TallyUtil.parseAmount(n.TallyUtil.getJsonValue(t, "openingbalance"))),
            (a.desc = n.TallyUtil.getStringValue(t, "billtype")),
            a
          );
        }),
        (e.convertVoucherBill = function (t, r, a, i, o) {
          var s = new e();
          n.Util.isNotEmptyString(o) && (s.partyId = o),
            (s.customId = n.TallyUtil.getStringValue(t, "name")),
            (s.date = r);
          var u = n.TallyUtil.getJsonValue(t, "billcreditperiod");
          return (
            (s.dueDate = e.parseBillCreditPeriod(u, r, i)),
            (s.amount = n.TallyUtil.parseAmount(n.TallyUtil.getJsonValue(t, "amount")) * a),
            (s.desc = n.TallyUtil.getStringValue(t, "billtype")),
            s
          );
        }),
        (e.parseBillCreditPeriod = function (e, t, r) {
          var i = t;
          return (
            null != e &&
              "" !== e.trim() &&
              (-1 !== e.indexOf("Day")
                ? ((e = n.TallyUtil.parseNumber(e)), (i = n.DateUtil.addDate(t, e, a.Duration.DAY)))
                : -1 !== e.indexOf("Week")
                ? ((e = n.TallyUtil.parseNumber(e)),
                  (i = n.DateUtil.addDate(t, e, a.Duration.WEEK)))
                : -1 !== e.indexOf("Month")
                ? ((e = n.TallyUtil.parseNumber(e)),
                  (i = n.DateUtil.addDate(t, e, a.Duration.MONTH)))
                : -1 !== e.indexOf("Year")
                ? ((e = n.TallyUtil.parseNumber(e)),
                  (i = n.DateUtil.addDate(t, e, a.Duration.YEAR)))
                : (i =
                    n.Util.isNotNull(r) &&
                    n.Util.isNotNull(r.company) &&
                    n.Util.isNotNull(r.company.timezone)
                      ? n.TallyUtil.parseDate(e, n.DateUtil.FORMAT_DD_MMM_YYYY, r.company.timezone)
                      : n.TallyUtil.parseDate(e, n.DateUtil.FORMAT_DD_MMM_YYYY))),
            i
          );
        }),
        e
      );
    })();
  t.default = o;
};
