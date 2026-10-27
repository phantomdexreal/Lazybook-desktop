// webpack module #520 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(45),
    a = r(206),
    i = r(0),
    o = r(207),
    s = r(70),
    u = (function () {
      function e() {}
      return (
        (e.prototype.getLedgerEntryList = function (e, t, r) {
          var s = [],
            u = e.total,
            p = n.getFormattedDate(n.FORMAT_YYYYMMDD, e.date, t.timezone);
          if (i.Util.isFilledArray(e.posDetails))
            for (var c = 0, l = e.posDetails; c < l.length; c++) {
              var m = l[c],
                d = m.amount,
                y = {
                  LEDGERNAME: m.ledgerName,
                  ISPARTYLEDGER: "Yes",
                  POSPAYMENTTYPE: m.posPaymentType,
                  ISDEEMEDPOSITIVE: "No",
                  ISLASTDEEMEDPOSITIVE: "NO",
                  AMOUNT: d,
                };
              ((a.default.TYPE_SALES !== e.type && a.default.TYPE_DEBIT_NOTE !== e.type) ||
                ((d *= -1),
                (y.ISDEEMEDPOSITIVE = "Yes"),
                (y.ISLASTDEEMEDPOSITIVE = "Yes"),
                (y.AMOUNT = d)),
                a.PosPaymentType.Card === m.posPaymentType && i.Util.isNotEmptyString(m.cardNo)
                  ? (y["BANKALLOCATIONS.LIST"] = {
                      INSTRUMENTNUMBER: m.cardNo,
                      AMOUNT: d,
                      DATE: p,
                      INSTRUMENTDATE: p,
                      TRANSACTIONTYPE: "Others",
                      PAYMENTMODE: "Transacted",
                      PAYMENTFAVOURING: t.tallyCompanyName.trim(),
                    })
                  : a.PosPaymentType.Bank === m.posPaymentType &&
                    (y["BANKALLOCATIONS.LIST"] = {
                      BANKNAME: m.partyBankName,
                      INSTRUMENTNUMBER: m.chequeNo,
                      AMOUNT: d,
                      DATE: p,
                      INSTRUMENTDATE: p,
                      TRANSACTIONTYPE: "Cheque/DD",
                      PAYMENTMODE: "Transacted",
                    }),
                s.push(y));
            }
          else {
            var b = [];
            if (i.Util.isFilledArray(e.billEntries))
              for (var h = 0, f = e.billEntries; h < f.length; h++) {
                var g = f[h],
                  M = { BILLTYPE: g.billType };
                if (
                  (i.Util.isEmptyString(g.customId) || (M.NAME = g.customId),
                  a.default.TYPE_SALES === e.type || a.default.TYPE_DEBIT_NOTE === e.type)
                ) {
                  var S = -1 * g.amount;
                  M.AMOUNT = S;
                } else
                  (a.default.TYPE_PURCHASE !== e.type && a.default.TYPE_CREDIT_NOTE !== e.type) ||
                    (M.AMOUNT = g.amount);
                b.push(M);
              }
            if (a.default.TYPE_SALES === e.type || a.default.TYPE_DEBIT_NOTE === e.type) {
              var A = {
                LEDGERNAME: e.partyId,
                ISDEEMEDPOSITIVE: "Yes",
                ISLASTDEEMEDPOSITIVE: "Yes",
                AMOUNT: -1 * u,
                ISPARTYLEDGER: "Yes",
              };
              (i.Util.isFilledArray(b) && (A["BILLALLOCATIONS.LIST"] = b), s.push(A));
            } else if (
              a.default.TYPE_PURCHASE === e.type ||
              a.default.TYPE_CREDIT_NOTE === e.type
            ) {
              A = {
                LEDGERNAME: e.partyId,
                ISDEEMEDPOSITIVE: "No",
                ISLASTDEEMEDPOSITIVE: "No",
                AMOUNT: u,
                ISPARTYLEDGER: "Yes",
              };
              (i.Util.isFilledArray(b) && (A["BILLALLOCATIONS.LIST"] = b), s.push(A));
            }
          }
          if (i.Util.isFilledArray(e.charges))
            for (var O = 0, N = e.charges; O < N.length; O++) {
              var v = N[O];
              if (a.default.TYPE_SALES === e.type || a.default.TYPE_DEBIT_NOTE === e.type) {
                var T = {
                  LEDGERNAME: v.type,
                  GSTCLASS: "",
                  ISDEEMEDPOSITIVE: "No",
                  AMOUNT: v.taxAmount,
                  VATEXPAMOUNT: v.taxAmount,
                  ISPARTYLEDGER: "No",
                };
                if (
                  (i.Util.isPositiveNumber(v.taxPercentage) &&
                    (T["BASICRATEOFINVOICETAX.LIST"] = {
                      "@TYPE": "Number",
                      BASICRATEOFINVOICETAX: v.taxPercentage,
                    }),
                  i.Util.isNotEmptyString(v.hsnCode) && (T.GSTHSNNAME = v.hsnCode),
                  i.Util.isNotEmpty(v.gstTypeOfSupply) &&
                    (T.GSTOVRDNTYPEOFSUPPLY = v.gstTypeOfSupply),
                  i.Util.isNotEmpty(v.appropriateFor) && (T.APPROPRIATEFOR = v.appropriateFor),
                  i.Util.isNotEmpty(v.gstAppropriateTo) &&
                    (T.GSTAPPROPRIATETO = v.gstAppropriateTo),
                  i.Util.isNotEmpty(v.exciseAllocType) && (T.EXCISEALLOCTYPE = v.exciseAllocType),
                  i.Util.isNotEmpty(v.taxability) && (T.GSTOVRDNTAXABILITY = v.taxability),
                  i.Util.isFilledArray(v.rateDetails))
                ) {
                  for (var z = [], I = 0, q = v.rateDetails; I < q.length; I++) {
                    var k = q[I],
                      R = o.default.getRateDetailEntryXmlRequest(k, r);
                    i.Util.isNotEmpty(R) && z.push(R);
                  }
                  T["RATEDETAILS.LIST"] = z;
                }
                s.push(T);
              } else if (
                a.default.TYPE_PURCHASE === e.type ||
                a.default.TYPE_CREDIT_NOTE === e.type
              ) {
                ((S = -1 * v.taxAmount),
                  (T = {
                    LEDGERNAME: v.type,
                    GSTCLASS: "",
                    ISDEEMEDPOSITIVE: "Yes",
                    AMOUNT: S,
                    VATEXPAMOUNT: S,
                    ISPARTYLEDGER: "No",
                  }));
                if (
                  (i.Util.isPositiveNumber(v.taxPercentage) &&
                    (T["BASICRATEOFINVOICETAX.LIST"] = {
                      "@TYPE": "Number",
                      BASICRATEOFINVOICETAX: v.taxPercentage,
                    }),
                  i.Util.isNotEmptyString(v.hsnCode) && (T.GSTHSNNAME = v.hsnCode),
                  i.Util.isNotEmpty(v.gstTypeOfSupply) &&
                    (T.GSTOVRDNTYPEOFSUPPLY = v.gstTypeOfSupply),
                  i.Util.isNotEmpty(v.appropriateFor) && (T.APPROPRIATEFOR = v.appropriateFor),
                  i.Util.isNotEmpty(v.gstAppropriateTo) &&
                    (T.GSTAPPROPRIATETO = v.gstAppropriateTo),
                  i.Util.isNotEmpty(v.exciseAllocType) && (T.EXCISEALLOCTYPE = v.exciseAllocType),
                  i.Util.isNotEmpty(v.taxability) && (T.GSTOVRDNTAXABILITY = v.taxability),
                  i.Util.isFilledArray(v.rateDetails))
                ) {
                  z = [];
                  for (var C = 0, E = v.rateDetails; C < E.length; C++) {
                    ((k = E[C]), (R = o.default.getRateDetailEntryXmlRequest(k, r)));
                    i.Util.isNotEmpty(R) && z.push(R);
                  }
                  T["RATEDETAILS.LIST"] = z;
                }
                s.push(T);
              }
            }
          return s;
        }),
        (e.prototype.getVoucherType = function (e) {
          return i.Util.isNotEmptyString(e.customType) ? e.customType : e.type;
        }),
        (e.prototype.getAddress = function (e) {
          return i.Util.breakStringToArr(e.partyAddress);
        }),
        (e.prototype.getInventoryDetails = function (e, t, r) {
          var s = [];
          if (i.Util.isFilledArray(e.items))
            for (var u = 0, p = e.items; u < p.length; u++) {
              var c = p[u],
                l = { STOCKITEMNAME: c.name };
              if (i.Util.isNotEmptyString(c.itemDesc)) {
                var m = c.itemDesc.match(/.{1,50}/g);
                i.Util.isFilledArray(m) &&
                  (l["BASICUSERDESCRIPTION.LIST"] = { "@TYPE": "String", BASICUSERDESCRIPTION: m });
              }
              a.default.TYPE_SALES === e.type || a.default.TYPE_DEBIT_NOTE === e.type
                ? ((l.ISDEEMEDPOSITIVE = "No"),
                  (l.ISLASTDEEMEDPOSITIVE = "No"),
                  (l.AMOUNT = c.amount))
                : (a.default.TYPE_PURCHASE !== e.type && a.default.TYPE_CREDIT_NOTE !== e.type) ||
                  ((l.ISDEEMEDPOSITIVE = "Yes"),
                  (l.ISLASTDEEMEDPOSITIVE = "Yes"),
                  (l.AMOUNT = -1 * c.amount));
              var d = String(c.invQuantity);
              i.Util.isNotEmptyString(c.unit) && (d = d + " " + c.unit);
              var y = void 0;
              if (
                (!0 === c.includeActualAndBilledQuantity &&
                  i.Util.isNotNull(c.accQuantity) &&
                  ((y = String(c.accQuantity)),
                  i.Util.isNotEmptyString(c.unit) && (y = y + " " + c.unit)),
                i.Util.isNotEmptyString(c.discount) && (l.DISCOUNT = c.discount),
                i.Util.isEmptyString(c.rateUnit)
                  ? (l.RATE = c.rate)
                  : (l.RATE = c.rate + "/" + c.rateUnit),
                i.Util.isNotNull(c.rateWithTax) &&
                  (i.Util.isEmptyString(c.rateUnit)
                    ? (l.INCLVATRATE = c.rateWithTax)
                    : (l.INCLVATRATE = c.rateWithTax + "/" + c.rateUnit)),
                i.Util.isNotEmptyString(y) && !0 === c.includeActualAndBilledQuantity)
              ) {
                var b = void 0;
                (i.Util.isNotNull(c.accSubQuantity) && (b = String(c.accSubQuantity)),
                  i.Util.isEmptyString(c.subUnit) || i.Util.isEmptyString(b)
                    ? ((l.ACTUALQTY = y), (l.BILLEDQTY = d))
                    : ((l.ACTUALQTY = y + " " + b + " " + c.subUnit),
                      (l.BILLEDQTY = d + " " + c.invSubQuantity + " " + c.subUnit)));
              } else
                i.Util.isEmptyString(c.subUnit)
                  ? ((l.ACTUALQTY = d), (l.BILLEDQTY = d))
                  : ((l.ACTUALQTY = d + " " + c.invSubQuantity + " " + c.subUnit),
                    (l.BILLEDQTY = d + " " + c.invSubQuantity + " " + c.subUnit));
              if (
                ((l["BATCHALLOCATIONS.LIST"] = { TRACKINGNUMBER: "" }),
                i.Util.isNotEmptyString(c.batchName) &&
                  (l["BATCHALLOCATIONS.LIST"].BATCHNAME = c.batchName),
                (l["BATCHALLOCATIONS.LIST"].GODOWNNAME = c.godownName),
                a.default.TYPE_SALES === e.type || a.default.TYPE_DEBIT_NOTE === e.type
                  ? (l["BATCHALLOCATIONS.LIST"].AMOUNT = c.amount)
                  : (a.default.TYPE_PURCHASE !== e.type && a.default.TYPE_CREDIT_NOTE !== e.type) ||
                    (l["BATCHALLOCATIONS.LIST"].AMOUNT = -1 * c.amount),
                i.Util.isNotEmptyString(y) && !0 === c.includeActualAndBilledQuantity)
              ) {
                b = void 0;
                (i.Util.isNotNull(c.accSubQuantity) && (b = String(c.accSubQuantity)),
                  i.Util.isEmptyString(c.subUnit) || i.Util.isEmptyString(b)
                    ? ((l["BATCHALLOCATIONS.LIST"].ACTUALQTY = y),
                      (l["BATCHALLOCATIONS.LIST"].BILLEDQTY = d))
                    : ((l["BATCHALLOCATIONS.LIST"].ACTUALQTY = y + " " + b + " " + c.subUnit),
                      (l["BATCHALLOCATIONS.LIST"].BILLEDQTY =
                        d + " " + c.invSubQuantity + " " + c.subUnit)));
              } else
                i.Util.isEmptyString(c.subUnit)
                  ? ((l["BATCHALLOCATIONS.LIST"].ACTUALQTY = d),
                    (l["BATCHALLOCATIONS.LIST"].BILLEDQTY = d))
                  : ((l["BATCHALLOCATIONS.LIST"].ACTUALQTY =
                      d + " " + c.invSubQuantity + " " + c.subUnit),
                    (l["BATCHALLOCATIONS.LIST"].BILLEDQTY =
                      d + " " + c.invSubQuantity + " " + c.subUnit));
              var h = e.orderDetail;
              if (
                (i.Util.isNotNull(h) &&
                  i.Util.isFilledArray(h.orderNumbers) &&
                  ((l["BATCHALLOCATIONS.LIST"].ORDERNO = h.orderNumbers[0].name),
                  (l["BATCHALLOCATIONS.LIST"].ORDERDUEDATE = n.getFormattedDate(
                    n.FORMAT_DD_MMM_YYYY,
                    h.orderNumbers[0].date,
                    t.timezone,
                  ))),
                a.default.TYPE_SALES === e.type || a.default.TYPE_DEBIT_NOTE === e.type
                  ? (l["ACCOUNTINGALLOCATIONS.LIST"] = {
                      LEDGERNAME: e.accountLedgerName,
                      ISDEEMEDPOSITIVE: "No",
                      ISLASTDEEMEDPOSITIVE: "No",
                      AMOUNT: c.amount,
                      ISPARTYLEDGER: "No",
                    })
                  : (a.default.TYPE_PURCHASE !== e.type && a.default.TYPE_CREDIT_NOTE !== e.type) ||
                    (l["ACCOUNTINGALLOCATIONS.LIST"] = {
                      LEDGERNAME: e.accountLedgerName,
                      ISDEEMEDPOSITIVE: "Yes",
                      ISLASTDEEMEDPOSITIVE: "Yes",
                      AMOUNT: -1 * c.amount,
                      ISPARTYLEDGER: "No",
                    }),
                i.Util.isNotEmptyString(c.hsnCode) && (l.GSTHSNNAME = c.hsnCode),
                i.Util.isNotEmpty(c.taxability) && (l.GSTOVRDNTAXABILITY = c.taxability),
                i.Util.isFilledArray(c.rateDetails))
              ) {
                for (var f = [], g = 0, M = c.rateDetails; g < M.length; g++) {
                  var S = M[g],
                    A = o.default.getRateDetailEntryXmlRequest(S, r);
                  i.Util.isNotEmpty(A) && f.push(A);
                }
                l["RATEDETAILS.LIST"] = f;
              }
              s.push(l);
            }
          return s;
        }),
        (e.prototype.getBody = function (e, t, r) {
          var o = n.getFormattedDate(n.FORMAT_YYYYMMDD, e.date, t.timezone),
            u = {
              ENVELOPE: {
                HEADER: { VERSION: "1", TALLYREQUEST: "Import", TYPE: "Data", ID: "Vouchers" },
                BODY: {
                  DESC: { STATICVARIABLES: { SVCURRENTCOMPANY: t.tallyCompanyName.trim() } },
                  DATA: {
                    TALLYMESSAGE: {
                      VOUCHER: {
                        DATE: o,
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
          (i.Util.isNotEmptyString(e.partyGstNo) && (p.PARTYGSTIN = e.partyGstNo),
            i.Util.isNotEmptyString(e.customId) && (p.VOUCHERNUMBER = e.customId),
            i.Util.isNotEmptyString(e.narration) &&
              (p.NARRATION = i.Util.removeSpecialChar(e.narration)),
            i.Util.isNotEmptyString(e.voucherClassName) && (p.CLASSNAME = e.voucherClassName),
            i.Util.isNotEmptyString(e.costCenterName) &&
              ((p.COSTCENTRENAME = e.costCenterName), (p.ISCOSTCENTRE = "Yes")),
            (a.default.TYPE_CREDIT_NOTE !== e.type && a.default.TYPE_DEBIT_NOTE !== e.type) ||
            !i.Util.isNotEmptyString(e.originalVoucherNumber)
              ? i.Util.isNotEmptyString(e.referenceNumber) && (p.REFERENCE = e.referenceNumber)
              : (p.REFERENCE = e.originalVoucherNumber),
            i.Util.isNumber(e.originalVoucherDate) &&
              e.originalVoucherDate > 0 &&
              (p.REFERENCEDATE = n.getFormattedDate(
                n.FORMAT_YYYYMMDD,
                e.originalVoucherDate,
                t.timezone,
              )),
            i.Util.isNotEmptyString(e.priceLevel) && (p.PRICELEVEL = e.priceLevel),
            i.Util.isNotEmptyString(e.partyStateName) &&
              ((p.STATENAME = e.partyStateName),
              (p.BILLTOPLACE = e.partyStateName),
              (p.SHIPTOPLACE = e.partyStateName)),
            i.Util.isNotEmptyString(e.placeOfSupply) && (p.PLACEOFSUPPLY = e.placeOfSupply),
            i.Util.isNotEmptyString(e.companyGstIn) && (p.CMPGSTIN = e.companyGstIn),
            i.Util.isNotEmptyString(e.companyGstState) && (p.CMPGSTSTATE = e.companyGstState));
          var c = e.orderDetail;
          i.Util.isNotNull(c) &&
            (i.Util.isFilledArray(c.orderNumbers) &&
              (p["INVOICEORDERLIST.LIST"] = c.orderNumbers.map(function (e) {
                return {
                  BASICPURCHASEORDERNO: e.name,
                  BASICORDERDATE: n.getFormattedDate(n.FORMAT_YYYYMMDD, e.date, t.timezone),
                };
              })),
            i.Util.isNotEmptyString(c.termsOfPayment) && (p.BASICDUEDATEOFPYMT = c.termsOfPayment),
            i.Util.isNotEmptyString(c.otherRef) && (p.BASICORDERREF = c.otherRef),
            i.Util.isNotEmptyString(c.termsOfDelivery) &&
              (p["BASICORDERTERMS.LIST"] = {
                "@TYPE": "String",
                BASICORDERTERMS: i.Util.breakStringToArr(c.termsOfDelivery),
              }));
          var l = e.dispatchDetail;
          (i.Util.isNotNull(l) &&
            (i.Util.isFilledArray(l.deliveryNoteList) &&
              (p["INVOICEDELNOTES.LIST"] = l.deliveryNoteList.map(function (e) {
                return {
                  BASICSHIPDELIVERYNOTE: e.name,
                  BASICSHIPPINGDATE: n.getFormattedDate(n.FORMAT_YYYYMMDD, e.date, t.timezone),
                };
              })),
            i.Util.isNotEmptyString(l.shipDocumentNo) && (p.BASICSHIPDOCUMENTNO = l.shipDocumentNo),
            i.Util.isNotEmptyString(l.shippedBy) && (p.BASICSHIPPEDBY = l.shippedBy),
            i.Util.isNotEmptyString(l.lrNo) && (p.BILLOFLADINGNO = l.lrNo),
            i.Util.isNumber(l.lrDate) &&
              (p.BILLOFLADINGDATE = n.getFormattedDate(n.FORMAT_YYYYMMDD, l.lrDate, t.timezone)),
            i.Util.isNotEmptyString(l.motorVehicleNumber) &&
              (p.BASICSHIPVESSELNO = l.motorVehicleNumber),
            i.Util.isNotEmptyString(l.finalDestination) &&
              (p.BASICFINALDESTINATION = l.finalDestination)),
            (p.PARTYMAILINGNAME = e.partyId),
            (p.CONSIGNEEMAILINGNAME = e.partyId));
          var m = e.buyerDetail;
          i.Util.isNotNull(m) &&
            (i.Util.isNotEmptyString(m.partyName) &&
              ((p.PARTYNAME = m.partyName), (p.PARTYMAILINGNAME = m.partyName)),
            i.Util.isNotEmptyString(m.address) &&
              (p["ADDRESS.LIST"] = { ADDRESS: i.Util.breakStringToArr(m.address) }),
            i.Util.isNotEmptyString(m.gstNo) && (p.PARTYGSTIN = m.gstNo),
            i.Util.isNotEmptyString(m.cstNo) && (p.BUYERSCSTNUMBER = m.cstNo),
            i.Util.isNotEmptyString(m.stateName) &&
              ((p.STATENAME = m.stateName), (p.BILLTOPLACE = m.stateName)),
            i.Util.isNotEmptyString(m.salesTaxNumber) &&
              (p.BASICBUYERSSALESTAXNO = m.salesTaxNumber),
            i.Util.isNotEmptyString(m.country) && (p.COUNTRYOFRESIDENCE = m.country),
            i.Util.isNotEmptyString(m.placeOfSupply) && (p.PLACEOFSUPPLY = m.placeOfSupply),
            i.Util.isNotEmptyString(m.registrationType) &&
              (p.GSTREGISTRATIONTYPE = m.registrationType),
            i.Util.isNotEmptyString(m.pincode) && (p.PARTYPINCODE = m.pincode));
          var d = e.consigneeDetail;
          i.Util.isNotNull(d) &&
            (i.Util.isNotEmptyString(d.partyName) &&
              ((p.BASICBUYERNAME = d.partyName), (p.CONSIGNEEMAILINGNAME = d.partyName)),
            i.Util.isNotEmptyString(d.address) &&
              (p["BASICBUYERADDRESS.LIST"] = {
                BASICBUYERADDRESS: i.Util.breakStringToArr(d.address),
              }),
            i.Util.isNotEmptyString(d.gstNo) && (p.CONSIGNEEGSTIN = d.gstNo),
            i.Util.isNotEmptyString(d.cstNo) && (p.CONSIGNEECSTNUMBER = d.cstNo),
            i.Util.isNotEmptyString(d.stateName) &&
              ((p.CONSIGNEESTATENAME = d.stateName), (p.SHIPTOPLACE = d.stateName)),
            i.Util.isNotEmptyString(d.pincode) && (p.CONSIGNEEPINCODE = d.pincode),
            i.Util.isNotEmptyString(d.salesTaxNumber) &&
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
          if (i.Util.isNotNull(y)) {
            var b = {};
            if (
              (i.Util.isNotEmptyString(y.ewayBillNo) && (b.BILLNUMBER = y.ewayBillNo),
              i.Util.isNotEmptyString(y.subType) && (b.SUBTYPE = y.subType),
              i.Util.isNotEmptyString(y.documentType) && (b.DOCUMENTTYPE = y.documentType),
              i.Util.isNumber(y.date) &&
                y.date > 0 &&
                (b.BILLDATE = n.getFormattedDate(n.FORMAT_YYYYMMDD, y.date, t.timezone)),
              i.Util.isNotEmptyString(y.statusOfBill) && (b.BILLSTATUS = y.statusOfBill),
              i.Util.isFilledArray(y.transportDetails))
            ) {
              for (var h = [], f = 0, g = y.transportDetails; f < g.length; f++) {
                var M = g[f],
                  S = {};
                (i.Util.isNumber(M.documentDate) &&
                  M.documentDate > 0 &&
                  (S.DOCUMENTDATE = n.getFormattedDate(
                    n.FORMAT_YYYYMMDD,
                    M.documentDate,
                    t.timezone,
                  )),
                  i.Util.isNotEmptyString(M.transporterId) && (S.TRANSPORTERID = M.transporterId),
                  i.Util.isNotEmptyString(M.transporterName) &&
                    (S.TRANSPORTERNAME = M.transporterName),
                  i.Util.isNotEmptyString(M.transporterMode) &&
                    (S.TRANSPORTMODE = i.Util.getTallyTransportMode(M.transporterMode)),
                  i.Util.isNotEmptyString(M.vehicleNumber) && (S.VEHICLENUMBER = M.vehicleNumber),
                  i.Util.isNotEmptyString(M.documentNumber) &&
                    (S.DOCUMENTNUMBER = M.documentNumber),
                  i.Util.isNotEmptyString(M.vehicleType) &&
                    (S.VEHICLETYPE = i.Util.getTallyVehicleType(M.vehicleType)),
                  i.Util.isNumber(M.distance)
                    ? (S.DISTANCE = M.distance)
                    : i.Util.isNotEmptyString(M.distanceInString) &&
                      (S.DISTANCE = M.distanceInString),
                  h.push(S));
              }
              b["TRANSPORTDETAILS.LIST"] = h;
            }
            p["EWAYBILLDETAILS.LIST"] = b;
          }
          var A = e.eInvoiceDetail;
          if (i.Util.isNotNull(A)) {
            (i.Util.isNotEmptyString(A.irn) && (p.IRN = A.irn),
              i.Util.isNotEmptyString(A.ackNo) && (p.IRNACKNO = A.ackNo),
              i.Util.isNumber(A.ackDate) &&
                A.ackDate > 0 &&
                (p.IRNACKDATE = n.getFormattedDate(n.FORMAT_YYYYMMDD, A.ackDate, t.timezone)),
              i.Util.isNotEmptyString(A.signedQRCode) && (p.IRNQRCODE = A.signedQRCode),
              i.Util.isNotNull(A.isCancelled) &&
                (p.IRNCANCELLED = !0 === A.isCancelled ? "Yes" : "No"),
              i.Util.isNotEmptyString(A.billToPlace) && (p.BILLTOPLACE = A.billToPlace),
              i.Util.isNotEmptyString(A.shipToPlace) && (p.SHIPTOPLACE = A.shipToPlace));
            var O = A.dispatchFromDetails;
            i.Util.isNotNull(O) &&
              (i.Util.isNotEmptyString(O.name) && (p.DISPATCHFROMNAME = O.name),
              i.Util.isNotEmptyString(O.address) &&
                (p["DISPATCHFROMADDRESS.LIST"] = {
                  "@TYPE": "String",
                  DISPATCHFROMADDRESS: i.Util.breakStringToArr(O.address),
                }),
              i.Util.isNotEmptyString(O.state) && (p.DISPATCHFROMSTATENAME = O.state),
              i.Util.isNotEmptyString(O.pincode) && (p.DISPATCHFROMPINCODE = O.pincode),
              i.Util.isNotEmptyString(O.place) && (p.DISPATCHFROMPLACE = O.place));
          }
          if (i.Util.isFilledArray(e.posDetails)) {
            var N = e.posDetails.filter(function (e) {
                return e.posPaymentType === a.PosPaymentType.Card;
              }),
              v = e.posDetails.filter(function (e) {
                return e.posPaymentType === a.PosPaymentType.Bank;
              }),
              T = e.posDetails.filter(function (e) {
                return e.posPaymentType === a.PosPaymentType.Cash;
              });
            ((p.PARTYLEDGERNAME = e.posDetails[0].ledgerName),
              i.Util.isFilledArray(N) && (p.POSCARDLEDGER = N[0].ledgerName),
              i.Util.isFilledArray(v) && (p.POSCHEQUELEDGER = v[0].ledgerName),
              i.Util.isFilledArray(T) && (p.POSCASHLEDGER = T[0].ledgerName));
            var z = 1;
            (a.default.TYPE_SALES !== e.type && a.default.TYPE_DEBIT_NOTE !== e.type) || (z = -1);
            for (var I = 0, q = e.posDetails; I < q.length; I++) {
              var k = q[I];
              k.posPaymentType === a.PosPaymentType.Cash && k.amount >= 0
                ? (p.POSCASHRECEIVED = k.amount * z)
                : k.posPaymentType === a.PosPaymentType.Card && i.Util.isNotEmptyString(k.cardNo)
                  ? (p.POSCARDNUMBER = k.cardNo)
                  : k.posPaymentType === a.PosPaymentType.Bank &&
                    (i.Util.isNotEmptyString(k.chequeNo) && (p.POSCHEQUENUMBER = k.chequeNo),
                    i.Util.isNotEmptyString(k.partyBankName) &&
                      (p.POSCHEQUEBANKNAME = k.partyBankName));
            }
          }
          return s.create(u).end({ pretty: !0 });
        }),
        e
      );
    })();
  t.default = u;
};
