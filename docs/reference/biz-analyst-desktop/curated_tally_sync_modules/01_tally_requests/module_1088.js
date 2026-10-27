// webpack module #1088 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(45),
    a = r(11),
    i = r(147),
    o = r(11),
    s = r(70),
    u = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e, t) {
          var r = "",
            u = n.getFormattedDate(n.FORMAT_YYYYMMDD, e.date, t.timezone),
            p = e.total,
            c = t.tallyCompanyName.trim(),
            l = s
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
            (!0 === e.isOptional && (l = l.ele("ISOPTIONAL", "Yes").up()),
            (l = l.ele("PERSISTEDVIEW", "Accounting Voucher View").up()),
            a.isNotEmptyString(e.costCenterName) &&
              (l = (l = l.ele("COSTCENTRENAME", e.costCenterName).up())
                .ele("ISCOSTCENTRE", "Yes")
                .up()),
            a.isNotEmptyString(e.narration) &&
              (l = l.ele("NARRATION", a.removeSpecialChar(e.narration)).up()),
            a.isNotEmptyString(e.customId) && (l = l.ele("VOUCHERNUMBER", e.customId).up()),
            (l = (l = a.isNotEmptyString(e.customType)
              ? l.ele("VOUCHERTYPENAME", e.customType).up()
              : l.ele("VOUCHERTYPENAME", e.type).up())
              .ele("ALLLEDGERENTRIES.LIST")
              .ele("LEDGERNAME", e.partyId)
              .up()),
            i.default.PAYMENT === e.type)
          ) {
            var m = -1 * p;
            l = l.ele("ISDEEMEDPOSITIVE", "Yes").up().ele("AMOUNT", m).up();
          } else
            i.default.RECEIPT === e.type &&
              (l = l.ele("ISDEEMEDPOSITIVE", "No").up().ele("AMOUNT", p).up());
          if (a.isFilledArray(e.billEntries))
            for (var d = 0, y = e.billEntries; d < y.length; d++) {
              var b = y[d];
              if (
                ((l = l.ele("BILLALLOCATIONS.LIST").ele("BILLTYPE", b.billType).up()),
                a.isEmptyString(b.customId) || (l = l.ele("NAME", b.customId).up()),
                i.default.PAYMENT === e.type)
              ) {
                m = -1 * b.amount;
                l = l.ele("AMOUNT", m).up();
              } else i.default.RECEIPT === e.type && (l = l.ele("AMOUNT", b.amount).up());
              a.isEmptyString(b.creditPeriod) ||
                (l = l.ele("BILLCREDITPERIOD", { P: b.creditPeriod }, b.creditPeriod).up()),
                (l = l.up());
            }
          if (
            ((l = l.up().ele("ALLLEDGERENTRIES.LIST").ele("LEDGERNAME", e.bankName).up()),
            i.default.PAYMENT === e.type)
          )
            l = l.ele("ISDEEMEDPOSITIVE", "No").up().ele("AMOUNT", p).up();
          else if (i.default.RECEIPT === e.type) {
            m = -1 * p;
            l = l.ele("ISDEEMEDPOSITIVE", "Yes").up().ele("AMOUNT", m).up();
          }
          if (
            !a.isEmptyString(e.mode) &&
            ((l = l.ele("BANKALLOCATIONS.LIST").ele("TRANSACTIONTYPE", e.mode).up()),
            a.isNotNull(e.bankAllocation))
          ) {
            if (
              o.isNotNull(e.bankAllocation.instrumentDate) &&
              o.isNumber(e.bankAllocation.instrumentDate) &&
              e.bankAllocation.instrumentDate > 0
            ) {
              var h = n.getFormattedDate(
                n.FORMAT_YYYYMMDD,
                e.bankAllocation.instrumentDate,
                t.timezone
              );
              l = l.ele("INSTRUMENTDATE", h).up();
            }
            o.isNotEmptyString(e.bankAllocation.instrumentNumber) &&
              (l = l.ele("INSTRUMENTNUMBER", e.bankAllocation.instrumentNumber).up()),
              o.isNotEmptyString(e.bankAllocation.ifscode) &&
                (l = l.ele("IFSCODE", e.bankAllocation.ifscode).up()),
              o.isNotEmptyString(e.bankAllocation.bankName) &&
                (l = l.ele("BANKNAME", e.bankAllocation.bankName).up()),
              o.isNotEmptyString(e.bankAllocation.accountNumber) &&
                (l = l.ele("ACCOUNTNUMBER", e.bankAllocation.accountNumber).up()),
              o.isNumber(e.bankAllocation.amount) &&
                o.isNotNull(e.bankAllocation.amount) &&
                (l = l.ele("AMOUNT", e.bankAllocation.amount).up());
          }
          if (i.default.PAYMENT === e.type)
            l = l.ele("ISDEEMEDPOSITIVE", "No").up().ele("AMOUNT", p).up();
          else if (i.default.RECEIPT === e.type) {
            m = -1 * p;
            l = l.ele("ISDEEMEDPOSITIVE", "Yes").up().ele("AMOUNT", m).up();
          }
          return (r += l = l.up().up().up().up().up().end({ pretty: !0 }));
        }),
        e
      );
    })();
  t.default = u;
};
