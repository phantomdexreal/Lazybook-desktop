// webpack module #560 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(52),
    a = r(561),
    o = r(2),
    s = r(216),
    n = r(65),
    u = (function () {
      function e() {}
      return (
        (e.prototype.getLedgerEntryList = function (e, t, r) {
          var n = [],
            u = e.total,
            p = i.getFormattedDate(i.FORMAT_YYYYMMDD, e.date, t.timezone);
          if (o.Util.isFilledArray(e.posDetails))
            for (var c = 0, m = e.posDetails; c < m.length; c++) {
              var l = m[c],
                d = l.amount,
                y = {
                  LEDGERNAME: l.ledgerName,
                  ISPARTYLEDGER: "Yes",
                  POSPAYMENTTYPE: l.posPaymentType,
                  ISDEEMEDPOSITIVE: "No",
                  ISLASTDEEMEDPOSITIVE: "NO",
                  AMOUNT: d,
                };
              ((a.default.TYPE_SALES !== e.type && a.default.TYPE_DEBIT_NOTE !== e.type) ||
                ((d *= -1),
                (y.ISDEEMEDPOSITIVE = "Yes"),
                (y.ISLASTDEEMEDPOSITIVE = "Yes"),
                (y.AMOUNT = d)),
                a.PosPaymentType.Card === l.posPaymentType && o.Util.isNotEmptyString(l.cardNo)
                  ? (y["BANKALLOCATIONS.LIST"] = {
                      INSTRUMENTNUMBER: l.cardNo,
                      AMOUNT: d,
                      DATE: p,
                      INSTRUMENTDATE: p,
                      TRANSACTIONTYPE: "Others",
                      PAYMENTMODE: "Transacted",
                      PAYMENTFAVOURING: t.tallyCompanyName.trim(),
                    })
                  : a.PosPaymentType.Bank === l.posPaymentType &&
                    (y["BANKALLOCATIONS.LIST"] = {
                      BANKNAME: l.partyBankName,
                      INSTRUMENTNUMBER: l.chequeNo,
                      AMOUNT: d,
                      DATE: p,
                      INSTRUMENTDATE: p,
                      TRANSACTIONTYPE: "Cheque/DD",
                      PAYMENTMODE: "Transacted",
                    }),
                n.push(y));
            }
          else {
            var b = [];
            if (o.Util.isFilledArray(e.billEntries))
              for (var h = 0, g = e.billEntries; h < g.length; h++) {
                var S = g[h],
                  f = { BILLTYPE: S.billType };
                if (
                  (o.Util.isEmptyString(S.customId) || (f.NAME = S.customId),
                  a.default.TYPE_SALES === e.type || a.default.TYPE_DEBIT_NOTE === e.type)
                ) {
                  var A = -1 * S.amount;
                  f.AMOUNT = A;
                } else
                  (a.default.TYPE_PURCHASE !== e.type && a.default.TYPE_CREDIT_NOTE !== e.type) ||
                    (f.AMOUNT = S.amount);
                b.push(f);
              }
            if (a.default.TYPE_SALES === e.type || a.default.TYPE_DEBIT_NOTE === e.type) {
              var N = {
                LEDGERNAME: e.partyId,
                ISDEEMEDPOSITIVE: "Yes",
                ISLASTDEEMEDPOSITIVE: "Yes",
                AMOUNT: -1 * u,
                ISPARTYLEDGER: "Yes",
              };
              (o.Util.isFilledArray(b) && (N["BILLALLOCATIONS.LIST"] = b), n.push(N));
            } else if (
              a.default.TYPE_PURCHASE === e.type ||
              a.default.TYPE_CREDIT_NOTE === e.type
            ) {
              N = {
                LEDGERNAME: e.partyId,
                ISDEEMEDPOSITIVE: "No",
                ISLASTDEEMEDPOSITIVE: "No",
                AMOUNT: u,
                ISPARTYLEDGER: "Yes",
              };
              (o.Util.isFilledArray(b) && (N["BILLALLOCATIONS.LIST"] = b), n.push(N));
            }
          }
          if (o.Util.isFilledArray(e.charges))
            for (var I = 0, T = e.charges; I < T.length; I++) {
              var M = T[I];
              if (a.default.TYPE_SALES === e.type || a.default.TYPE_DEBIT_NOTE === e.type) {
                var v = {
                  LEDGERNAME: M.type,
                  GSTCLASS: "",
                  ISDEEMEDPOSITIVE: "No",
                  AMOUNT: M.taxAmount,
                  VATEXPAMOUNT: M.taxAmount,
                  ISPARTYLEDGER: "No",
                };
                if (
                  (o.Util.isPositiveNumber(M.taxPercentage) &&
                    (v["BASICRATEOFINVOICETAX.LIST"] = {
                      "@TYPE": "Number",
                      BASICRATEOFINVOICETAX: M.taxPercentage,
                    }),
                  o.Util.isNotEmptyString(M.hsnCode) && (v.GSTHSNNAME = M.hsnCode),
                  o.Util.isNotEmpty(M.gstTypeOfSupply) &&
                    (v.GSTOVRDNTYPEOFSUPPLY = M.gstTypeOfSupply),
                  o.Util.isNotEmpty(M.appropriateFor) && (v.APPROPRIATEFOR = M.appropriateFor),
                  o.Util.isNotEmpty(M.gstAppropriateTo) &&
                    (v.GSTAPPROPRIATETO = M.gstAppropriateTo),
                  o.Util.isNotEmpty(M.exciseAllocType) && (v.EXCISEALLOCTYPE = M.exciseAllocType),
                  o.Util.isNotEmpty(M.taxability) && (v.GSTOVRDNTAXABILITY = M.taxability),
                  o.Util.isFilledArray(M.rateDetails))
                ) {
                  for (var k = [], C = 0, q = M.rateDetails; C < q.length; C++) {
                    var R = q[C],
                      D = s.default.getRateDetailEntryXmlRequest(R, r);
                    o.Util.isNotEmpty(D) && k.push(D);
                  }
                  v["RATEDETAILS.LIST"] = k;
                }
                n.push(v);
              } else if (
                a.default.TYPE_PURCHASE === e.type ||
                a.default.TYPE_CREDIT_NOTE === e.type
              ) {
                ((A = -1 * M.taxAmount),
                  (v = {
                    LEDGERNAME: M.type,
                    GSTCLASS: "",
                    ISDEEMEDPOSITIVE: "Yes",
                    AMOUNT: A,
                    VATEXPAMOUNT: A,
                    ISPARTYLEDGER: "No",
                  }));
                if (
                  (o.Util.isPositiveNumber(M.taxPercentage) &&
                    (v["BASICRATEOFINVOICETAX.LIST"] = {
                      "@TYPE": "Number",
                      BASICRATEOFINVOICETAX: M.taxPercentage,
                    }),
                  o.Util.isNotEmptyString(M.hsnCode) && (v.GSTHSNNAME = M.hsnCode),
                  o.Util.isNotEmpty(M.gstTypeOfSupply) &&
                    (v.GSTOVRDNTYPEOFSUPPLY = M.gstTypeOfSupply),
                  o.Util.isNotEmpty(M.appropriateFor) && (v.APPROPRIATEFOR = M.appropriateFor),
                  o.Util.isNotEmpty(M.gstAppropriateTo) &&
                    (v.GSTAPPROPRIATETO = M.gstAppropriateTo),
                  o.Util.isNotEmpty(M.exciseAllocType) && (v.EXCISEALLOCTYPE = M.exciseAllocType),
                  o.Util.isNotEmpty(M.taxability) && (v.GSTOVRDNTAXABILITY = M.taxability),
                  o.Util.isFilledArray(M.rateDetails))
                ) {
                  k = [];
                  for (var E = 0, x = M.rateDetails; E < x.length; E++) {
                    ((R = x[E]), (D = s.default.getRateDetailEntryXmlRequest(R, r)));
                    o.Util.isNotEmpty(D) && k.push(D);
                  }
                  v["RATEDETAILS.LIST"] = k;
                }
                n.push(v);
              }
            }
          return n;
        }),
        (e.prototype.getVoucherType = function (e) {
          return o.Util.isNotEmptyString(e.customType) ? e.customType : e.type;
        }),
        (e.prototype.getAddress = function (e) {
          return o.Util.breakStringToArr(e.partyAddress);
        }),
        (e.prototype.getInventoryDetails = function (e, t, r) {
          var n = [];
          if (o.Util.isFilledArray(e.items))
            for (var u = 0, p = e.items; u < p.length; u++) {
              var c = p[u],
                m = { STOCKITEMNAME: c.name };
              if (o.Util.isNotEmptyString(c.itemDesc)) {
                var l = c.itemDesc.match(/.{1,50}/g);
                o.Util.isFilledArray(l) &&
                  (m["BASICUSERDESCRIPTION.LIST"] = { "@TYPE": "String", BASICUSERDESCRIPTION: l });
              }
              a.default.TYPE_SALES === e.type || a.default.TYPE_DEBIT_NOTE === e.type
                ? ((m.ISDEEMEDPOSITIVE = "No"),
                  (m.ISLASTDEEMEDPOSITIVE = "No"),
                  (m.AMOUNT = c.amount))
                : (a.default.TYPE_PURCHASE !== e.type && a.default.TYPE_CREDIT_NOTE !== e.type) ||
                  ((m.ISDEEMEDPOSITIVE = "Yes"),
                  (m.ISLASTDEEMEDPOSITIVE = "Yes"),
                  (m.AMOUNT = -1 * c.amount));
              var d = String(c.invQuantity);
              o.Util.isNotEmptyString(c.unit) && (d = d + " " + c.unit);
              var y = void 0;
              if (
                (!0 === c.includeActualAndBilledQuantity &&
                  o.Util.isNotNull(c.accQuantity) &&
                  ((y = String(c.accQuantity)),
                  o.Util.isNotEmptyString(c.unit) && (y = y + " " + c.unit)),
                o.Util.isNotEmptyString(c.discount) && (m.DISCOUNT = c.discount),
                o.Util.isEmptyString(c.rateUnit)
                  ? (m.RATE = c.rate)
                  : (m.RATE = c.rate + "/" + c.rateUnit),
                o.Util.isNotNull(c.rateWithTax) &&
                  (o.Util.isEmptyString(c.rateUnit)
                    ? (m.INCLVATRATE = c.rateWithTax)
                    : (m.INCLVATRATE = c.rateWithTax + "/" + c.rateUnit)),
                o.Util.isNotEmptyString(y) && !0 === c.includeActualAndBilledQuantity)
              ) {
                var b = void 0;
                (o.Util.isNotNull(c.accSubQuantity) && (b = String(c.accSubQuantity)),
                  o.Util.isEmptyString(c.subUnit) || o.Util.isEmptyString(b)
                    ? ((m.ACTUALQTY = y), (m.BILLEDQTY = d))
                    : ((m.ACTUALQTY = y + " " + b + " " + c.subUnit),
                      (m.BILLEDQTY = d + " " + c.invSubQuantity + " " + c.subUnit)));
              } else
                o.Util.isEmptyString(c.subUnit)
                  ? ((m.ACTUALQTY = d), (m.BILLEDQTY = d))
                  : ((m.ACTUALQTY = d + " " + c.invSubQuantity + " " + c.subUnit),
                    (m.BILLEDQTY = d + " " + c.invSubQuantity + " " + c.subUnit));
              if (
                ((m["BATCHALLOCATIONS.LIST"] = { TRACKINGNUMBER: "" }),
                o.Util.isNotEmptyString(c.batchName) &&
                  (m["BATCHALLOCATIONS.LIST"].BATCHNAME = c.batchName),
                (m["BATCHALLOCATIONS.LIST"].GODOWNNAME = c.godownName),
                a.default.TYPE_SALES === e.type || a.default.TYPE_DEBIT_NOTE === e.type
                  ? (m["BATCHALLOCATIONS.LIST"].AMOUNT = c.amount)
                  : (a.default.TYPE_PURCHASE !== e.type && a.default.TYPE_CREDIT_NOTE !== e.type) ||
                    (m["BATCHALLOCATIONS.LIST"].AMOUNT = -1 * c.amount),
                o.Util.isNotEmptyString(y) && !0 === c.includeActualAndBilledQuantity)
              ) {
                b = void 0;
                (o.Util.isNotNull(c.accSubQuantity) && (b = String(c.accSubQuantity)),
                  o.Util.isEmptyString(c.subUnit) || o.Util.isEmptyString(b)
                    ? ((m["BATCHALLOCATIONS.LIST"].ACTUALQTY = y),
                      (m["BATCHALLOCATIONS.LIST"].BILLEDQTY = d))
                    : ((m["BATCHALLOCATIONS.LIST"].ACTUALQTY = y + " " + b + " " + c.subUnit),
                      (m["BATCHALLOCATIONS.LIST"].BILLEDQTY =
                        d + " " + c.invSubQuantity + " " + c.subUnit)));
              } else
                o.Util.isEmptyString(c.subUnit)
                  ? ((m["BATCHALLOCATIONS.LIST"].ACTUALQTY = d),
                    (m["BATCHALLOCATIONS.LIST"].BILLEDQTY = d))
                  : ((m["BATCHALLOCATIONS.LIST"].ACTUALQTY =
                      d + " " + c.invSubQuantity + " " + c.subUnit),
                    (m["BATCHALLOCATIONS.LIST"].BILLEDQTY =
                      d + " " + c.invSubQuantity + " " + c.subUnit));
              var h = e.orderDetail;
              if (
                (o.Util.isNotNull(h) &&
                  o.Util.isFilledArray(h.orderNumbers) &&
                  ((m["BATCHALLOCATIONS.LIST"].ORDERNO = h.orderNumbers[0].name),
                  (m["BATCHALLOCATIONS.LIST"].ORDERDUEDATE = i.getFormattedDate(
                    i.FORMAT_DD_MMM_YYYY,
                    h.orderNumbers[0].date,
                    t.timezone,
                  ))),
                a.default.TYPE_SALES === e.type || a.default.TYPE_DEBIT_NOTE === e.type
                  ? (m["ACCOUNTINGALLOCATIONS.LIST"] = {
                      LEDGERNAME: e.accountLedgerName,
                      ISDEEMEDPOSITIVE: "No",
                      ISLASTDEEMEDPOSITIVE: "No",
                      AMOUNT: c.amount,
                      ISPARTYLEDGER: "No",
                    })
                  : (a.default.TYPE_PURCHASE !== e.type && a.default.TYPE_CREDIT_NOTE !== e.type) ||
                    (m["ACCOUNTINGALLOCATIONS.LIST"] = {
                      LEDGERNAME: e.accountLedgerName,
                      ISDEEMEDPOSITIVE: "Yes",
                      ISLASTDEEMEDPOSITIVE: "Yes",
                      AMOUNT: -1 * c.amount,
                      ISPARTYLEDGER: "No",
                    }),
                o.Util.isNotEmptyString(c.hsnCode) && (m.GSTHSNNAME = c.hsnCode),
                o.Util.isNotEmpty(c.taxability) && (m.GSTOVRDNTAXABILITY = c.taxability),
                o.Util.isFilledArray(c.rateDetails))
              ) {
                for (var g = [], S = 0, f = c.rateDetails; S < f.length; S++) {
                  var A = f[S],
                    N = s.default.getRateDetailEntryXmlRequest(A, r);
                  o.Util.isNotEmpty(N) && g.push(N);
                }
                m["RATEDETAILS.LIST"] = g;
              }
              n.push(m);
            }
          return n;
        }),
        (e.prototype.getBody = function (e, t, r) {
          var s = i.getFormattedDate(i.FORMAT_YYYYMMDD, e.date, t.timezone),
            u = {
              ENVELOPE: {
                HEADER: { VERSION: "1", TALLYREQUEST: "Import", TYPE: "Data", ID: "Vouchers" },
                BODY: {
                  DESC: { STATICVARIABLES: { SVCURRENTCOMPANY: t.tallyCompanyName.trim() } },
                  DATA: {
                    TALLYMESSAGE: {
                      VOUCHER: {
                        DATE: s,
                        ISINVOICE: "Yes",
                        ISOPTIONAL: e.isOptional ? "Yes" : "No",
                        PERSISTEDVIEW: "Invoice Voucher View",
                        "ADDRESS.LIST": { ADDRESS: this.getAddress(e) },
                        "BASICBUYERADDRESS.LIST": { BASICBUYERADDRESS: this.getAddress(e) },
                        PARTYNAME: e.partyId,
                        VOUCHERTYPENAME: this.getVoucherType(e),
                        PARTYLEDGERNAME: e.partyId,
                        BASICBASEPARTYNAME: e.partyId,
                        BASICBUYERNAME: e.partyId,
                        VCHGSTCLASS: [],
                        "LEDGERENTRIES.LIST": this.getLedgerEntryList(e, t, r),
                        "ALLINVENTORYENTRIES.LIST": this.getInventoryDetails(e, t, r),
                      },
                    },
                  },
                },
              },
            },
            p = u.ENVELOPE.BODY.DATA.TALLYMESSAGE.VOUCHER;
          (o.Util.isNotEmptyString(e.partyGstNo) && (p.PARTYGSTIN = e.partyGstNo),
            o.Util.isNotEmptyString(e.customId) && (p.VOUCHERNUMBER = e.customId),
            o.Util.isNotEmptyString(e.narration) &&
              (p.NARRATION = o.Util.removeSpecialChar(e.narration)),
            o.Util.isNotEmptyString(e.voucherClassName) && (p.CLASSNAME = e.voucherClassName),
            o.Util.isNotEmptyString(e.costCenterName) &&
              ((p.COSTCENTRENAME = e.costCenterName), (p.ISCOSTCENTRE = "Yes")),
            (a.default.TYPE_CREDIT_NOTE !== e.type && a.default.TYPE_DEBIT_NOTE !== e.type) ||
            !o.Util.isNotEmptyString(e.originalVoucherNumber)
              ? o.Util.isNotEmptyString(e.referenceNumber) && (p.REFERENCE = e.referenceNumber)
              : (p.REFERENCE = e.originalVoucherNumber),
            o.Util.isNumber(e.originalVoucherDate) &&
              e.originalVoucherDate > 0 &&
              (p.REFERENCEDATE = i.getFormattedDate(
                i.FORMAT_YYYYMMDD,
                e.originalVoucherDate,
                t.timezone,
              )),
            o.Util.isNotEmptyString(e.priceLevel) && (p.PRICELEVEL = e.priceLevel),
            o.Util.isNotEmptyString(e.partyStateName) &&
              ((p.STATENAME = e.partyStateName),
              (p.BILLTOPLACE = e.partyStateName),
              (p.SHIPTOPLACE = e.partyStateName)),
            o.Util.isNotEmptyString(e.placeOfSupply) && (p.PLACEOFSUPPLY = e.placeOfSupply),
            o.Util.isNotEmptyString(e.companyGstIn) && (p.CMPGSTIN = e.companyGstIn),
            o.Util.isNotEmptyString(e.companyGstState) && (p.CMPGSTSTATE = e.companyGstState));
          var c = e.orderDetail;
          o.Util.isNotNull(c) &&
            (o.Util.isFilledArray(c.orderNumbers) &&
              (p["INVOICEORDERLIST.LIST"] = c.orderNumbers.map(function (e) {
                return {
                  BASICPURCHASEORDERNO: e.name,
                  BASICORDERDATE: i.getFormattedDate(i.FORMAT_YYYYMMDD, e.date, t.timezone),
                };
              })),
            o.Util.isNotEmptyString(c.termsOfPayment) && (p.BASICDUEDATEOFPYMT = c.termsOfPayment),
            o.Util.isNotEmptyString(c.otherRef) && (p.BASICORDERREF = c.otherRef),
            o.Util.isNotEmptyString(c.termsOfDelivery) &&
              (p["BASICORDERTERMS.LIST"] = {
                "@TYPE": "String",
                BASICORDERTERMS: o.Util.breakStringToArr(c.termsOfDelivery),
              }));
          var m = e.dispatchDetail;
          (o.Util.isNotNull(m) &&
            (o.Util.isFilledArray(m.deliveryNoteList) &&
              (p["INVOICEDELNOTES.LIST"] = m.deliveryNoteList.map(function (e) {
                return {
                  BASICSHIPDELIVERYNOTE: e.name,
                  BASICSHIPPINGDATE: i.getFormattedDate(i.FORMAT_YYYYMMDD, e.date, t.timezone),
                };
              })),
            o.Util.isNotEmptyString(m.shipDocumentNo) && (p.BASICSHIPDOCUMENTNO = m.shipDocumentNo),
            o.Util.isNotEmptyString(m.shippedBy) && (p.BASICSHIPPEDBY = m.shippedBy),
            o.Util.isNotEmptyString(m.lrNo) && (p.BILLOFLADINGNO = m.lrNo),
            o.Util.isNumber(m.lrDate) &&
              (p.BILLOFLADINGDATE = i.getFormattedDate(i.FORMAT_YYYYMMDD, m.lrDate, t.timezone)),
            o.Util.isNotEmptyString(m.motorVehicleNumber) &&
              (p.BASICSHIPVESSELNO = m.motorVehicleNumber),
            o.Util.isNotEmptyString(m.finalDestination) &&
              (p.BASICFINALDESTINATION = m.finalDestination)),
            (p.PARTYMAILINGNAME = e.partyId),
            (p.CONSIGNEEMAILINGNAME = e.partyId));
          var l = e.buyerDetail;
          o.Util.isNotNull(l) &&
            (o.Util.isNotEmptyString(l.partyName) &&
              ((p.PARTYNAME = l.partyName), (p.PARTYMAILINGNAME = l.partyName)),
            o.Util.isNotEmptyString(l.address) &&
              (p["ADDRESS.LIST"] = { ADDRESS: o.Util.breakStringToArr(l.address) }),
            o.Util.isNotEmptyString(l.gstNo) && (p.PARTYGSTIN = l.gstNo),
            o.Util.isNotEmptyString(l.cstNo) && (p.BUYERSCSTNUMBER = l.cstNo),
            o.Util.isNotEmptyString(l.stateName) &&
              ((p.STATENAME = l.stateName), (p.BILLTOPLACE = l.stateName)),
            o.Util.isNotEmptyString(l.salesTaxNumber) &&
              (p.BASICBUYERSSALESTAXNO = l.salesTaxNumber),
            o.Util.isNotEmptyString(l.country) && (p.COUNTRYOFRESIDENCE = l.country),
            o.Util.isNotEmptyString(l.placeOfSupply) && (p.PLACEOFSUPPLY = l.placeOfSupply),
            o.Util.isNotEmptyString(l.registrationType) &&
              (p.GSTREGISTRATIONTYPE = l.registrationType),
            o.Util.isNotEmptyString(l.pincode) && (p.PARTYPINCODE = l.pincode));
          var d = e.consigneeDetail;
          o.Util.isNotNull(d) &&
            (o.Util.isNotEmptyString(d.partyName) &&
              ((p.BASICBUYERNAME = d.partyName), (p.CONSIGNEEMAILINGNAME = d.partyName)),
            o.Util.isNotEmptyString(d.address) &&
              (p["BASICBUYERADDRESS.LIST"] = {
                BASICBUYERADDRESS: o.Util.breakStringToArr(d.address),
              }),
            o.Util.isNotEmptyString(d.gstNo) && (p.CONSIGNEEGSTIN = d.gstNo),
            o.Util.isNotEmptyString(d.cstNo) && (p.CONSIGNEECSTNUMBER = d.cstNo),
            o.Util.isNotEmptyString(d.stateName) &&
              ((p.CONSIGNEESTATENAME = d.stateName), (p.SHIPTOPLACE = d.stateName)),
            o.Util.isNotEmptyString(d.pincode) && (p.CONSIGNEEPINCODE = d.pincode),
            o.Util.isNotEmptyString(d.salesTaxNumber) &&
              (p["UDF:TRADERCONSVATTINNO.LIST"] = {
                "@DESC": "TraderConsVATTINNo",
                "@ISLIST": "YES",
                "@TYPE": "String",
                "@INDEX": 10015,
                "UDF:TRADERCONSVATTINNO": {
                  "@DESC": "TraderConsVATTINNo",
                  "#text": d.salesTaxNumber,
                },
              }));
          var y = e.ewayBillDetail;
          if (o.Util.isNotNull(y)) {
            var b = {};
            if (
              (o.Util.isNotEmptyString(y.ewayBillNo) && (b.BILLNUMBER = y.ewayBillNo),
              o.Util.isNotEmptyString(y.subType) && (b.SUBTYPE = y.subType),
              o.Util.isNotEmptyString(y.documentType) && (b.DOCUMENTTYPE = y.documentType),
              o.Util.isNumber(y.date) &&
                y.date > 0 &&
                (b.BILLDATE = i.getFormattedDate(i.FORMAT_YYYYMMDD, y.date, t.timezone)),
              o.Util.isNotEmptyString(y.statusOfBill) && (b.BILLSTATUS = y.statusOfBill),
              o.Util.isFilledArray(y.transportDetails))
            ) {
              for (var h = [], g = 0, S = y.transportDetails; g < S.length; g++) {
                var f = S[g],
                  A = {};
                (o.Util.isNumber(f.documentDate) &&
                  f.documentDate > 0 &&
                  (A.DOCUMENTDATE = i.getFormattedDate(
                    i.FORMAT_YYYYMMDD,
                    f.documentDate,
                    t.timezone,
                  )),
                  o.Util.isNotEmptyString(f.transporterId) && (A.TRANSPORTERID = f.transporterId),
                  o.Util.isNotEmptyString(f.transporterName) &&
                    (A.TRANSPORTERNAME = f.transporterName),
                  o.Util.isNotEmptyString(f.transporterMode) &&
                    (A.TRANSPORTMODE = o.Util.getTallyTransportMode(f.transporterMode)),
                  o.Util.isNotEmptyString(f.vehicleNumber) && (A.VEHICLENUMBER = f.vehicleNumber),
                  o.Util.isNotEmptyString(f.documentNumber) &&
                    (A.DOCUMENTNUMBER = f.documentNumber),
                  o.Util.isNotEmptyString(f.vehicleType) &&
                    (A.VEHICLETYPE = o.Util.getTallyVehicleType(f.vehicleType)),
                  o.Util.isNumber(f.distance)
                    ? (A.DISTANCE = f.distance)
                    : o.Util.isNotEmptyString(f.distanceInString) &&
                      (A.DISTANCE = f.distanceInString),
                  h.push(A));
              }
              b["TRANSPORTDETAILS.LIST"] = h;
            }
            p["EWAYBILLDETAILS.LIST"] = b;
          }
          var N = e.eInvoiceDetail;
          if (o.Util.isNotNull(N)) {
            (o.Util.isNotEmptyString(N.irn) && (p.IRN = N.irn),
              o.Util.isNotEmptyString(N.ackNo) && (p.IRNACKNO = N.ackNo),
              o.Util.isNumber(N.ackDate) &&
                N.ackDate > 0 &&
                (p.IRNACKDATE = i.getFormattedDate(i.FORMAT_YYYYMMDD, N.ackDate, t.timezone)),
              o.Util.isNotEmptyString(N.signedQRCode) && (p.IRNQRCODE = N.signedQRCode),
              o.Util.isNotNull(N.isCancelled) &&
                (p.IRNCANCELLED = !0 === N.isCancelled ? "Yes" : "No"),
              o.Util.isNotEmptyString(N.billToPlace) && (p.BILLTOPLACE = N.billToPlace),
              o.Util.isNotEmptyString(N.shipToPlace) && (p.SHIPTOPLACE = N.shipToPlace));
            var I = N.dispatchFromDetails;
            o.Util.isNotNull(I) &&
              (o.Util.isNotEmptyString(I.name) && (p.DISPATCHFROMNAME = I.name),
              o.Util.isNotEmptyString(I.address) &&
                (p["DISPATCHFROMADDRESS.LIST"] = {
                  "@TYPE": "String",
                  DISPATCHFROMADDRESS: o.Util.breakStringToArr(I.address),
                }),
              o.Util.isNotEmptyString(I.state) && (p.DISPATCHFROMSTATENAME = I.state),
              o.Util.isNotEmptyString(I.pincode) && (p.DISPATCHFROMPINCODE = I.pincode),
              o.Util.isNotEmptyString(I.place) && (p.DISPATCHFROMPLACE = I.place));
          }
          if (o.Util.isFilledArray(e.posDetails)) {
            var T = e.posDetails.filter(function (e) {
                return e.posPaymentType === a.PosPaymentType.Card;
              }),
              M = e.posDetails.filter(function (e) {
                return e.posPaymentType === a.PosPaymentType.Bank;
              }),
              v = e.posDetails.filter(function (e) {
                return e.posPaymentType === a.PosPaymentType.Cash;
              });
            ((p.PARTYLEDGERNAME = e.posDetails[0].ledgerName),
              o.Util.isFilledArray(T) && (p.POSCARDLEDGER = T[0].ledgerName),
              o.Util.isFilledArray(M) && (p.POSCHEQUELEDGER = M[0].ledgerName),
              o.Util.isFilledArray(v) && (p.POSCASHLEDGER = v[0].ledgerName));
            var k = 1;
            (a.default.TYPE_SALES !== e.type && a.default.TYPE_DEBIT_NOTE !== e.type) || (k = -1);
            for (var C = 0, q = e.posDetails; C < q.length; C++) {
              var R = q[C];
              R.posPaymentType === a.PosPaymentType.Cash && R.amount >= 0
                ? (p.POSCASHRECEIVED = R.amount * k)
                : R.posPaymentType === a.PosPaymentType.Card && o.Util.isNotEmptyString(R.cardNo)
                  ? (p.POSCARDNUMBER = R.cardNo)
                  : R.posPaymentType === a.PosPaymentType.Bank &&
                    (o.Util.isNotEmptyString(R.chequeNo) && (p.POSCHEQUENUMBER = R.chequeNo),
                    o.Util.isNotEmptyString(R.partyBankName) &&
                      (p.POSCHEQUEBANKNAME = R.partyBankName));
            }
          }
          return n.create(u).end({ pretty: !0 });
        }),
        e
      );
    })();
  t.default = u;
};
