// webpack module #1149 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(52),
    a = r(32),
    o = r(2),
    s = r(65),
    n = (function () {
      function e() {}
      return (
        (e.prototype.getAllLedgerEntries = function (e) {
          var t = [];
          if (o.Util.isFilledArray(e.parties))
            for (var r = 0, i = e.parties; r < i.length; r++) {
              var s = i[r],
                n = {};
              if (
                (o.Util.isNotEmptyString(s.partyId) && (n.LEDGERNAME = s.partyId),
                a.JournalVoucherEntry.ACCOUNT_DEBIT_TYPE === s.type
                  ? ((n.ISDEEMEDPOSITIVE = "Yes"),
                    (n.AMOUNT = -1 * s.amount),
                    (n.VATEXPAMOUNT = n.AMOUNT))
                  : a.JournalVoucherEntry.ACCOUNT_CREDIT_TYPE === s.type &&
                    ((n.ISDEEMEDPOSITIVE = "No"),
                    (n.AMOUNT = s.amount),
                    (n.VATEXPAMOUNT = n.AMOUNT)),
                o.Util.isFilledArray(s.bills))
              ) {
                for (var u = [], p = 0, c = s.bills; p < c.length; p++) {
                  var m = c[p],
                    l = {};
                  (o.Util.isNotEmptyString(m.customId) && (l.NAME = m.customId),
                    (l.AMOUNT = m.amount),
                    a.JournalVoucherEntry.ACCOUNT_DEBIT_TYPE === s.type &&
                      (l.AMOUNT = -1 * m.amount),
                    o.Util.isNotEmptyString(m.billType) && (l.BILLTYPE = m.billType),
                    (l.TDSDEDUCTEEISSPECIALRATE = "No"),
                    o.Util.isNotEmptyString(m.creditPeriod) &&
                      (l.BILLCREDITPERIOD = { "@P": m.creditPeriod, "#text": m.creditPeriod }),
                    u.push(l));
                }
                n["BILLALLOCATIONS.LIST"] = u;
              }
              if (o.Util.isFilledArray(s.items)) {
                for (var d = [], y = 0, b = s.items; y < b.length; y++) {
                  var h = b[y],
                    g = { STOCKITEMNAME: h.name };
                  if (o.Util.isNotEmptyString(h.itemDesc)) {
                    var S = h.itemDesc.match(/.{1,50}/g);
                    o.Util.isFilledArray(S) &&
                      (g["BASICUSERDESCRIPTION.LIST"] = {
                        "@TYPE": "String",
                        BASICUSERDESCRIPTION: S,
                      });
                  }
                  a.JournalVoucherEntry.ACCOUNT_DEBIT_TYPE === s.type
                    ? ((g.ISDEEMEDPOSITIVE = "Yes"),
                      (g.ISLASTDEEMEDPOSITIVE = "Yes"),
                      (g.AMOUNT = -1 * h.amount))
                    : a.JournalVoucherEntry.ACCOUNT_CREDIT_TYPE === s.type &&
                      ((g.ISDEEMEDPOSITIVE = "No"),
                      (g.ISLASTDEEMEDPOSITIVE = "No"),
                      (g.AMOUNT = h.amount));
                  var f = String(h.invQuantity);
                  (o.Util.isNotEmptyString(h.unit) && (f = f + " " + h.unit),
                    o.Util.isNotEmptyString(h.discount) && (g.DISCOUNT = h.discount),
                    o.Util.isEmptyString(h.rateUnit)
                      ? (g.RATE = h.rate)
                      : (g.RATE = h.rate + "/" + h.rateUnit),
                    o.Util.isNotNull(h.rateWithTax) &&
                      (o.Util.isEmptyString(h.rateUnit)
                        ? (g.INCLVATRATE = h.rateWithTax)
                        : (g.INCLVATRATE = h.rateWithTax + "/" + h.rateUnit)),
                    o.Util.isEmptyString(h.subUnit)
                      ? ((g.ACTUALQTY = f), (g.BILLEDQTY = f))
                      : ((g.ACTUALQTY = f + " " + h.invSubQuantity + " " + h.subUnit),
                        (g.BILLEDQTY = f + " " + h.invSubQuantity + " " + h.subUnit)),
                    (g["BATCHALLOCATIONS.LIST"] = { TRACKINGNUMBER: "" }),
                    o.Util.isNotEmptyString(h.batchName) &&
                      (g["BATCHALLOCATIONS.LIST"].BATCHNAME = h.batchName),
                    (g["BATCHALLOCATIONS.LIST"].GODOWNNAME = h.godownName),
                    a.JournalVoucherEntry.ACCOUNT_CREDIT_TYPE === s.type
                      ? (g["BATCHALLOCATIONS.LIST"].AMOUNT = h.amount)
                      : a.JournalVoucherEntry.ACCOUNT_DEBIT_TYPE === s.type &&
                        (g["BATCHALLOCATIONS.LIST"].AMOUNT = -1 * h.amount),
                    o.Util.isEmptyString(h.subUnit)
                      ? ((g["BATCHALLOCATIONS.LIST"].ACTUALQTY = f),
                        (g["BATCHALLOCATIONS.LIST"].BILLEDQTY = f))
                      : ((g["BATCHALLOCATIONS.LIST"].ACTUALQTY =
                          f + " " + h.invSubQuantity + " " + h.subUnit),
                        (g["BATCHALLOCATIONS.LIST"].BILLEDQTY =
                          f + " " + h.invSubQuantity + " " + h.subUnit)),
                    d.push(g));
                }
                n["INVENTORYALLOCATIONS.LIST"] = d;
              }
              t.push(n);
            }
          return t;
        }),
        (e.prototype.getVoucherType = function (e) {
          return o.Util.isNotEmptyString(e.customType) ? e.customType : e.type;
        }),
        (e.prototype.getBody = function (e, t) {
          var r = i.getFormattedDate(i.FORMAT_YYYYMMDD, e.date, t.timezone),
            a = {
              ENVELOPE: {
                HEADER: { TALLYREQUEST: "Import Data" },
                BODY: {
                  IMPORTDATA: {
                    REQUESTDESC: {
                      REPORTNAME: "Vouchers",
                      STATICVARIABLES: { SVCURRENTCOMPANY: t.tallyCompanyName.trim() },
                    },
                  },
                  REQUESTDATA: {
                    TALLYMESSAGE: {
                      VOUCHER: {
                        DATE: r,
                        ISOPTIONAL: e.isOptional ? "Yes" : "No",
                        VOUCHERTYPENAME: this.getVoucherType(e),
                        PERSISTEDVIEW: "Accounting Voucher View",
                        EFFECTIVEDATE: r,
                        "ALLLEDGERENTRIES.LIST": this.getAllLedgerEntries(e),
                      },
                    },
                  },
                },
              },
            },
            n = a.ENVELOPE.BODY.REQUESTDATA.TALLYMESSAGE.VOUCHER;
          return (
            o.Util.isNotEmptyString(e.customId) && (n.VOUCHERNUMBER = e.customId),
            o.Util.isNotEmptyString(e.narration) &&
              (n.NARRATION = o.Util.removeSpecialChar(e.narration)),
            o.Util.isNotEmptyString(e.costCenterName) &&
              ((n.COSTCENTRENAME = e.costCenterName), (n.ISCOSTCENTRE = "Yes")),
            s.create(a).end({ pretty: !0 })
          );
        }),
        e
      );
    })();
  t.default = n;
};
