// webpack module #1066 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(45),
    a = r(28),
    i = r(0),
    o = r(70),
    s = (function () {
      function e() {}
      return (
        (e.prototype.getAllLedgerEntries = function (e) {
          var t = [];
          if (i.Util.isFilledArray(e.parties))
            for (var r = 0, n = e.parties; r < n.length; r++) {
              var o = n[r],
                s = {};
              if (
                (i.Util.isNotEmptyString(o.partyId) && (s.LEDGERNAME = o.partyId),
                a.JournalVoucherEntry.ACCOUNT_DEBIT_TYPE === o.type
                  ? ((s.ISDEEMEDPOSITIVE = "Yes"),
                    (s.AMOUNT = -1 * o.amount),
                    (s.VATEXPAMOUNT = s.AMOUNT))
                  : a.JournalVoucherEntry.ACCOUNT_CREDIT_TYPE === o.type &&
                    ((s.ISDEEMEDPOSITIVE = "No"),
                    (s.AMOUNT = o.amount),
                    (s.VATEXPAMOUNT = s.AMOUNT)),
                i.Util.isFilledArray(o.bills))
              ) {
                for (var u = [], p = 0, c = o.bills; p < c.length; p++) {
                  var l = c[p],
                    m = {};
                  (i.Util.isNotEmptyString(l.customId) && (m.NAME = l.customId),
                    (m.AMOUNT = l.amount),
                    a.JournalVoucherEntry.ACCOUNT_DEBIT_TYPE === o.type &&
                      (m.AMOUNT = -1 * l.amount),
                    i.Util.isNotEmptyString(l.billType) && (m.BILLTYPE = l.billType),
                    (m.TDSDEDUCTEEISSPECIALRATE = "No"),
                    i.Util.isNotEmptyString(l.creditPeriod) &&
                      (m.BILLCREDITPERIOD = { "@P": l.creditPeriod, "#text": l.creditPeriod }),
                    u.push(m));
                }
                s["BILLALLOCATIONS.LIST"] = u;
              }
              if (i.Util.isFilledArray(o.items)) {
                for (var d = [], y = 0, b = o.items; y < b.length; y++) {
                  var h = b[y],
                    f = { STOCKITEMNAME: h.name };
                  if (i.Util.isNotEmptyString(h.itemDesc)) {
                    var g = h.itemDesc.match(/.{1,50}/g);
                    i.Util.isFilledArray(g) &&
                      (f["BASICUSERDESCRIPTION.LIST"] = {
                        "@TYPE": "String",
                        BASICUSERDESCRIPTION: g,
                      });
                  }
                  a.JournalVoucherEntry.ACCOUNT_DEBIT_TYPE === o.type
                    ? ((f.ISDEEMEDPOSITIVE = "Yes"),
                      (f.ISLASTDEEMEDPOSITIVE = "Yes"),
                      (f.AMOUNT = -1 * h.amount))
                    : a.JournalVoucherEntry.ACCOUNT_CREDIT_TYPE === o.type &&
                      ((f.ISDEEMEDPOSITIVE = "No"),
                      (f.ISLASTDEEMEDPOSITIVE = "No"),
                      (f.AMOUNT = h.amount));
                  var M = String(h.invQuantity);
                  (i.Util.isNotEmptyString(h.unit) && (M = M + " " + h.unit),
                    i.Util.isNotEmptyString(h.discount) && (f.DISCOUNT = h.discount),
                    i.Util.isEmptyString(h.rateUnit)
                      ? (f.RATE = h.rate)
                      : (f.RATE = h.rate + "/" + h.rateUnit),
                    i.Util.isNotNull(h.rateWithTax) &&
                      (i.Util.isEmptyString(h.rateUnit)
                        ? (f.INCLVATRATE = h.rateWithTax)
                        : (f.INCLVATRATE = h.rateWithTax + "/" + h.rateUnit)),
                    i.Util.isEmptyString(h.subUnit)
                      ? ((f.ACTUALQTY = M), (f.BILLEDQTY = M))
                      : ((f.ACTUALQTY = M + " " + h.invSubQuantity + " " + h.subUnit),
                        (f.BILLEDQTY = M + " " + h.invSubQuantity + " " + h.subUnit)),
                    (f["BATCHALLOCATIONS.LIST"] = { TRACKINGNUMBER: "" }),
                    i.Util.isNotEmptyString(h.batchName) &&
                      (f["BATCHALLOCATIONS.LIST"].BATCHNAME = h.batchName),
                    (f["BATCHALLOCATIONS.LIST"].GODOWNNAME = h.godownName),
                    a.JournalVoucherEntry.ACCOUNT_CREDIT_TYPE === o.type
                      ? (f["BATCHALLOCATIONS.LIST"].AMOUNT = h.amount)
                      : a.JournalVoucherEntry.ACCOUNT_DEBIT_TYPE === o.type &&
                        (f["BATCHALLOCATIONS.LIST"].AMOUNT = -1 * h.amount),
                    i.Util.isEmptyString(h.subUnit)
                      ? ((f["BATCHALLOCATIONS.LIST"].ACTUALQTY = M),
                        (f["BATCHALLOCATIONS.LIST"].BILLEDQTY = M))
                      : ((f["BATCHALLOCATIONS.LIST"].ACTUALQTY =
                          M + " " + h.invSubQuantity + " " + h.subUnit),
                        (f["BATCHALLOCATIONS.LIST"].BILLEDQTY =
                          M + " " + h.invSubQuantity + " " + h.subUnit)),
                    d.push(f));
                }
                s["INVENTORYALLOCATIONS.LIST"] = d;
              }
              t.push(s);
            }
          return t;
        }),
        (e.prototype.getVoucherType = function (e) {
          return i.Util.isNotEmptyString(e.customType) ? e.customType : e.type;
        }),
        (e.prototype.getBody = function (e, t) {
          var r = n.getFormattedDate(n.FORMAT_YYYYMMDD, e.date, t.timezone),
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
            s = a.ENVELOPE.BODY.REQUESTDATA.TALLYMESSAGE.VOUCHER;
          return (
            i.Util.isNotEmptyString(e.customId) && (s.VOUCHERNUMBER = e.customId),
            i.Util.isNotEmptyString(e.narration) &&
              (s.NARRATION = i.Util.removeSpecialChar(e.narration)),
            i.Util.isNotEmptyString(e.costCenterName) &&
              ((s.COSTCENTRENAME = e.costCenterName), (s.ISCOSTCENTRE = "Yes")),
            o.create(a).end({ pretty: !0 })
          );
        }),
        e
      );
    })();
  t.default = s;
};
