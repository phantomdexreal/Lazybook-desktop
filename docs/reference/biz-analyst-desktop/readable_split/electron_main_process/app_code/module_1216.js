// webpack module #1216 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(52),
    a = r(10),
    o = r(589),
    s = r(10),
    n = r(65),
    u = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e, t) {
          var r = "",
            u = i.getFormattedDate(i.FORMAT_YYYYMMDD, e.date, t.timezone),
            p = e.total,
            c = t.tallyCompanyName.trim(),
            m = n
              .create("ENVELOPE", { encoding: "UTF-8" })
              .ele("HEADER")
              .ele("VERSION", "1")
              .up()
              .ele("TALLYREQUEST", "Import")
              .up()
              .ele("TYPE", "Data")
              .up()
              .ele("ID", "Vouchers")
              .up()
              .up()
              .ele("BODY")
              .ele("DESC")
              .ele("STATICVARIABLES")
              .ele("SVCURRENTCOMPANY", c)
              .up()
              .up()
              .up()
              .ele("DATA")
              .ele("TALLYMESSAGE")
              .ele("VOUCHER")
              .ele("DATE", u)
              .up();
          if (
            (!0 === e.isOptional && (m = m.ele("ISOPTIONAL", "Yes").up()),
            (m = m.ele("PERSISTEDVIEW", "Accounting Voucher View").up()),
            a.isNotEmptyString(e.costCenterName) &&
              (m = (m = m.ele("COSTCENTRENAME", e.costCenterName).up())
                .ele("ISCOSTCENTRE", "Yes")
                .up()),
            a.isNotEmptyString(e.narration) &&
              (m = m.ele("NARRATION", a.removeSpecialChar(e.narration)).up()),
            a.isNotEmptyString(e.customId) && (m = m.ele("VOUCHERNUMBER", e.customId).up()),
            (m = (m = a.isNotEmptyString(e.customType)
              ? m.ele("VOUCHERTYPENAME", e.customType).up()
              : m.ele("VOUCHERTYPENAME", e.type).up())
              .ele("ALLLEDGERENTRIES.LIST")
              .ele("LEDGERNAME", e.partyId)
              .up()),
            o.default.PAYMENT === e.type)
          ) {
            var l = -1 * p;
            m = m.ele("ISDEEMEDPOSITIVE", "Yes").up().ele("AMOUNT", l).up();
          } else
            o.default.RECEIPT === e.type &&
              (m = m.ele("ISDEEMEDPOSITIVE", "No").up().ele("AMOUNT", p).up());
          if (a.isFilledArray(e.billEntries))
            for (var d = 0, y = e.billEntries; d < y.length; d++) {
              var b = y[d];
              if (
                ((m = m.ele("BILLALLOCATIONS.LIST").ele("BILLTYPE", b.billType).up()),
                a.isEmptyString(b.customId) || (m = m.ele("NAME", b.customId).up()),
                o.default.PAYMENT === e.type)
              ) {
                l = -1 * b.amount;
                m = m.ele("AMOUNT", l).up();
              } else o.default.RECEIPT === e.type && (m = m.ele("AMOUNT", b.amount).up());
              (a.isEmptyString(b.creditPeriod) ||
                (m = m.ele("BILLCREDITPERIOD", { P: b.creditPeriod }, b.creditPeriod).up()),
                (m = m.up()));
            }
          if (
            ((m = m.up().ele("ALLLEDGERENTRIES.LIST").ele("LEDGERNAME", e.bankName).up()),
            o.default.PAYMENT === e.type)
          )
            m = m.ele("ISDEEMEDPOSITIVE", "No").up().ele("AMOUNT", p).up();
          else if (o.default.RECEIPT === e.type) {
            l = -1 * p;
            m = m.ele("ISDEEMEDPOSITIVE", "Yes").up().ele("AMOUNT", l).up();
          }
          if (
            !a.isEmptyString(e.mode) &&
            ((m = m.ele("BANKALLOCATIONS.LIST").ele("TRANSACTIONTYPE", e.mode).up()),
            a.isNotNull(e.bankAllocation))
          ) {
            if (
              s.isNotNull(e.bankAllocation.instrumentDate) &&
              s.isNumber(e.bankAllocation.instrumentDate) &&
              e.bankAllocation.instrumentDate > 0
            ) {
              var h = i.getFormattedDate(
                i.FORMAT_YYYYMMDD,
                e.bankAllocation.instrumentDate,
                t.timezone,
              );
              m = m.ele("INSTRUMENTDATE", h).up();
            }
            (s.isNotEmptyString(e.bankAllocation.instrumentNumber) &&
              (m = m.ele("INSTRUMENTNUMBER", e.bankAllocation.instrumentNumber).up()),
              s.isNotEmptyString(e.bankAllocation.ifscode) &&
                (m = m.ele("IFSCODE", e.bankAllocation.ifscode).up()),
              s.isNotEmptyString(e.bankAllocation.bankName) &&
                (m = m.ele("BANKNAME", e.bankAllocation.bankName).up()),
              s.isNotEmptyString(e.bankAllocation.accountNumber) &&
                (m = m.ele("ACCOUNTNUMBER", e.bankAllocation.accountNumber).up()),
              s.isNumber(e.bankAllocation.amount) &&
                s.isNotNull(e.bankAllocation.amount) &&
                (m = m.ele("AMOUNT", e.bankAllocation.amount).up()));
          }
          if (o.default.PAYMENT === e.type)
            m = m.ele("ISDEEMEDPOSITIVE", "No").up().ele("AMOUNT", p).up();
          else if (o.default.RECEIPT === e.type) {
            l = -1 * p;
            m = m.ele("ISDEEMEDPOSITIVE", "Yes").up().ele("AMOUNT", l).up();
          }
          return (r += m = m.up().up().up().up().up().end({ pretty: !0 }));
        }),
        e
      );
    })();
  t.default = u;
};
