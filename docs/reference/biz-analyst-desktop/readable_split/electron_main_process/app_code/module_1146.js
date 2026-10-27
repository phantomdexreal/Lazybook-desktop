// webpack module #1146 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(52),
    a = r(1147),
    o = r(2),
    s = r(216),
    n = r(65),
    u = (function () {
      function e() {}
      return (
        (e.prototype.getLedgerEntryList = function (e, t) {
          var r = [],
            i = e.total;
          if (
            (a.InventoryVoucherEntry.TYPE_DELIVERY_NOTE === e.type
              ? r.push({
                  LEDGERNAME: e.partyId,
                  ISDEEMEDPOSITIVE: "Yes",
                  ISLASTDEEMEDPOSITIVE: "Yes",
                  AMOUNT: -1 * i,
                  ISPARTYLEDGER: "Yes",
                })
              : a.InventoryVoucherEntry.TYPE_RECEIPT_NOTE === e.type &&
                r.push({
                  LEDGERNAME: e.partyId,
                  ISDEEMEDPOSITIVE: "No",
                  ISLASTDEEMEDPOSITIVE: "No",
                  AMOUNT: i,
                  ISPARTYLEDGER: "Yes",
                }),
            o.Util.isFilledArray(e.charges))
          )
            for (var n = 0, u = e.charges; n < u.length; n++) {
              var p = u[n];
              if (a.InventoryVoucherEntry.TYPE_DELIVERY_NOTE === e.type) {
                var c = {
                  LEDGERNAME: p.type,
                  GSTCLASS: "",
                  ISDEEMEDPOSITIVE: "No",
                  AMOUNT: p.taxAmount,
                  VATEXPAMOUNT: p.taxAmount,
                  ISPARTYLEDGER: "No",
                };
                if (
                  (o.Util.isPositiveNumber(p.taxPercentage) &&
                    (c["BASICRATEOFINVOICETAX.LIST"] = {
                      "@TYPE": "Number",
                      BASICRATEOFINVOICETAX: p.taxPercentage,
                    }),
                  o.Util.isNotEmptyString(p.hsnCode) && (c.GSTHSNNAME = p.hsnCode),
                  o.Util.isNotEmpty(p.gstTypeOfSupply) &&
                    (c.GSTOVRDNTYPEOFSUPPLY = p.gstTypeOfSupply),
                  o.Util.isNotEmpty(p.appropriateFor) && (c.APPROPRIATEFOR = p.appropriateFor),
                  o.Util.isNotEmpty(p.gstAppropriateTo) &&
                    (c.GSTAPPROPRIATETO = p.gstAppropriateTo),
                  o.Util.isNotEmpty(p.exciseAllocType) && (c.EXCISEALLOCTYPE = p.exciseAllocType),
                  o.Util.isNotEmpty(p.taxability) && (c.GSTOVRDNTAXABILITY = p.taxability),
                  o.Util.isFilledArray(p.rateDetails))
                ) {
                  for (var m = [], l = 0, d = p.rateDetails; l < d.length; l++) {
                    var y = d[l],
                      b = s.default.getRateDetailEntryXmlRequest(y, t);
                    o.Util.isNotEmpty(b) && m.push(b);
                  }
                  c["RATEDETAILS.LIST"] = m;
                }
                r.push(c);
              } else if (a.InventoryVoucherEntry.TYPE_RECEIPT_NOTE === e.type) {
                var h = -1 * p.taxAmount;
                c = {
                  LEDGERNAME: p.type,
                  GSTCLASS: "",
                  ISDEEMEDPOSITIVE: "Yes",
                  AMOUNT: h,
                  VATEXPAMOUNT: h,
                  ISPARTYLEDGER: "No",
                };
                if (
                  (o.Util.isPositiveNumber(p.taxPercentage) &&
                    (c["BASICRATEOFINVOICETAX.LIST"] = {
                      "@TYPE": "Number",
                      BASICRATEOFINVOICETAX: p.taxPercentage,
                    }),
                  o.Util.isNotEmptyString(p.hsnCode) && (c.GSTHSNNAME = p.hsnCode),
                  o.Util.isNotEmpty(p.gstTypeOfSupply) &&
                    (c.GSTOVRDNTYPEOFSUPPLY = p.gstTypeOfSupply),
                  o.Util.isNotEmpty(p.appropriateFor) && (c.APPROPRIATEFOR = p.appropriateFor),
                  o.Util.isNotEmpty(p.gstAppropriateTo) &&
                    (c.GSTAPPROPRIATETO = p.gstAppropriateTo),
                  o.Util.isNotEmpty(p.exciseAllocType) && (c.EXCISEALLOCTYPE = p.exciseAllocType),
                  o.Util.isNotEmpty(p.taxability) && (c.GSTOVRDNTAXABILITY = p.taxability),
                  o.Util.isFilledArray(p.rateDetails))
                ) {
                  m = [];
                  for (var g = 0, S = p.rateDetails; g < S.length; g++) {
                    ((y = S[g]), (b = s.default.getRateDetailEntryXmlRequest(y, t)));
                    o.Util.isNotEmpty(b) && m.push(b);
                  }
                  c["RATEDETAILS.LIST"] = m;
                }
                r.push(c);
              }
            }
          return r;
        }),
        (e.prototype.getVoucherType = function (e) {
          return o.Util.isNotEmptyString(e.customType) ? e.customType : e.type;
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
              a.InventoryVoucherEntry.TYPE_DELIVERY_NOTE === e.type
                ? ((m.ISDEEMEDPOSITIVE = "No"),
                  (m.ISLASTDEEMEDPOSITIVE = "No"),
                  (m.AMOUNT = c.amount))
                : a.InventoryVoucherEntry.TYPE_RECEIPT_NOTE === e.type &&
                  ((m.ISDEEMEDPOSITIVE = "Yes"),
                  (m.ISLASTDEEMEDPOSITIVE = "Yes"),
                  (m.AMOUNT = -1 * c.amount));
              var d = String(c.invQuantity);
              (o.Util.isNotEmptyString(c.unit) && (d = d + " " + c.unit),
                o.Util.isNotEmptyString(c.discount) && (m.DISCOUNT = c.discount),
                o.Util.isEmptyString(c.rateUnit)
                  ? (m.RATE = c.rate)
                  : (m.RATE = c.rate + "/" + c.rateUnit),
                o.Util.isNotNull(c.rateWithTax) &&
                  (o.Util.isEmptyString(c.rateUnit)
                    ? (m.INCLVATRATE = c.rateWithTax)
                    : (m.INCLVATRATE = c.rateWithTax + "/" + c.rateUnit)),
                o.Util.isEmptyString(c.subUnit)
                  ? ((m.ACTUALQTY = d), (m.BILLEDQTY = d))
                  : ((m.ACTUALQTY = d + " " + c.invSubQuantity + " " + c.subUnit),
                    (m.BILLEDQTY = d + " " + c.invSubQuantity + " " + c.subUnit)),
                (m["BATCHALLOCATIONS.LIST"] = { TRACKINGNUMBER: "" }),
                o.Util.isNotEmptyString(c.batchName) &&
                  (m["BATCHALLOCATIONS.LIST"].BATCHNAME = c.batchName),
                (m["BATCHALLOCATIONS.LIST"].GODOWNNAME = c.godownName),
                a.InventoryVoucherEntry.TYPE_DELIVERY_NOTE === e.type
                  ? (m["BATCHALLOCATIONS.LIST"].AMOUNT = c.amount)
                  : a.InventoryVoucherEntry.TYPE_RECEIPT_NOTE === e.type &&
                    (m["BATCHALLOCATIONS.LIST"].AMOUNT = -1 * c.amount),
                o.Util.isEmptyString(c.subUnit)
                  ? ((m["BATCHALLOCATIONS.LIST"].ACTUALQTY = d),
                    (m["BATCHALLOCATIONS.LIST"].BILLEDQTY = d))
                  : ((m["BATCHALLOCATIONS.LIST"].ACTUALQTY =
                      d + " " + c.unit + " " + c.invSubQuantity + " " + c.subUnit),
                    (m["BATCHALLOCATIONS.LIST"].BILLEDQTY =
                      d + " " + c.unit + " " + c.invSubQuantity + " " + c.subUnit)));
              var y = e.orderDetail;
              if (
                (o.Util.isNotNull(y) &&
                  o.Util.isFilledArray(y.orderNumbers) &&
                  ((m["BATCHALLOCATIONS.LIST"].ORDERNO = y.orderNumbers[0].name),
                  (m["BATCHALLOCATIONS.LIST"].ORDERDUEDATE = i.getFormattedDate(
                    i.FORMAT_DD_MMM_YYYY,
                    y.orderNumbers[0].date,
                    t.timezone,
                  ))),
                a.InventoryVoucherEntry.TYPE_DELIVERY_NOTE === e.type
                  ? (m["ACCOUNTINGALLOCATIONS.LIST"] = {
                      LEDGERNAME: e.accountLedgerName,
                      ISDEEMEDPOSITIVE: "No",
                      ISLASTDEEMEDPOSITIVE: "No",
                      AMOUNT: c.amount,
                      ISPARTYLEDGER: "No",
                    })
                  : a.InventoryVoucherEntry.TYPE_RECEIPT_NOTE === e.type &&
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
                for (var b = [], h = 0, g = c.rateDetails; h < g.length; h++) {
                  var S = g[h],
                    f = s.default.getRateDetailEntryXmlRequest(S, r);
                  o.Util.isNotEmpty(f) && b.push(f);
                }
                m["RATEDETAILS.LIST"] = b;
              }
              n.push(m);
            }
          return n;
        }),
        (e.prototype.getBody = function (e, t, r) {
          var a = i.getFormattedDate(i.FORMAT_YYYYMMDD, e.date, t.timezone),
            s = {
              ENVELOPE: {
                HEADER: { TALLYREQUEST: "Import Data" },
                BODY: {
                  IMPORTDATA: {
                    REQUESTDESC: {
                      REPORTNAME: "Vouchers",
                      STATICVARIABLES: { SVCURRENTCOMPANY: t.tallyCompanyName.trim() },
                    },
                    REQUESTDATA: {
                      TALLYMESSAGE: {
                        VOUCHER: {
                          "ADDRESS.LIST": { ADDRESS: o.Util.breakStringToArr(e.partyAddress) },
                          "BASICBUYERADDRESS.LIST": {
                            BASICBUYERADDRESS: o.Util.breakStringToArr(e.partyAddress),
                          },
                          DATE: a,
                          PARTYLEDGERNAME: e.partyId,
                          VOUCHERTYPENAME: this.getVoucherType(e),
                          BASICBASEPARTYNAME: e.partyId,
                          PERSISTEDVIEW: "Invoice Voucher View",
                          ISOPTIONAL: e.isOptional ? "Yes" : "No",
                          "ALLINVENTORYENTRIES.LIST": this.getInventoryDetails(e, t, r),
                          "LEDGERENTRIES.LIST": this.getLedgerEntryList(e, r),
                        },
                      },
                    },
                  },
                },
              },
            },
            u = s.ENVELOPE.BODY.IMPORTDATA.REQUESTDATA.TALLYMESSAGE.VOUCHER,
            p = e.orderDetail;
          o.Util.isNotNull(p) &&
            (o.Util.isFilledArray(p.orderNumbers) &&
              (u["INVOICEORDERLIST.LIST"] = p.orderNumbers.map(function (e) {
                return {
                  BASICPURCHASEORDERNO: e.name,
                  BASICORDERDATE: i.getFormattedDate(i.FORMAT_YYYYMMDD, e.date, t.timezone),
                };
              })),
            o.Util.isNotEmptyString(p.termsOfDelivery) &&
              (u["BASICORDERTERMS.LIST"] = {
                "@TYPE": "String",
                BASICORDERTERMS: o.Util.breakStringToArr(p.termsOfDelivery),
              }),
            o.Util.isNotEmptyString(p.otherRef) && (u.BASICORDERREF = p.otherRef),
            o.Util.isNotEmptyString(p.termsOfPayment) && (u.BASICDUEDATEOFPYMT = p.termsOfPayment));
          var c = e.dispatchDetail;
          o.Util.isNotNull(c) &&
            (o.Util.isNumber(c.lrDate) &&
              (u.BILLOFLADINGDATE = i.getFormattedDate(i.FORMAT_YYYYMMDD, c.lrDate, t.timezone)),
            o.Util.isNotEmptyString(c.lrNo) && (u.BILLOFLADINGNO = c.lrNo),
            o.Util.isNotEmptyString(c.shippedBy) && (u.BASICSHIPPEDBY = c.shippedBy),
            o.Util.isNotEmptyString(c.shipDocumentNo) && (u.BASICSHIPDOCUMENTNO = c.shipDocumentNo),
            o.Util.isNotEmptyString(c.finalDestination) &&
              (u.BASICFINALDESTINATION = c.finalDestination),
            o.Util.isNotEmptyString(c.motorVehicleNumber) &&
              (u.BASICSHIPVESSELNO = c.motorVehicleNumber));
          var m = e.buyerDetail;
          o.Util.isNotNull(m) &&
            (o.Util.isNotEmptyString(m.partyName) && (u.PARTYNAME = m.partyName),
            o.Util.isNotEmptyString(m.stateName) && (u.STATENAME = m.stateName),
            o.Util.isNotEmptyString(m.country) && (u.COUNTRYOFRESIDENCE = m.country),
            o.Util.isNotEmptyString(m.gstNo) && (u.PARTYGSTIN = m.gstNo),
            o.Util.isNotEmptyString(m.placeOfSupply) && (u.PLACEOFSUPPLY = m.placeOfSupply),
            o.Util.isNotEmptyString(m.registrationType) &&
              (u.GSTREGISTRATIONTYPE = m.registrationType),
            o.Util.isNotEmptyString(m.cstNo) && (u.BUYERSCSTNUMBER = m.cstNo),
            o.Util.isNotEmptyString(m.salesTaxNumber) &&
              (u.BASICBUYERSSALESTAXNO = m.salesTaxNumber),
            o.Util.isNotEmptyString(m.address) &&
              (u["ADDRESS.LIST"] = { ADDRESS: o.Util.breakStringToArr(m.address) }),
            o.Util.isNotEmptyString(m.pincode) && (u.PARTYPINCODE = m.pincode));
          var l = e.consigneeDetail;
          o.Util.isNotNull(l) &&
            (o.Util.isNotEmptyString(l.address) &&
              (u["BASICBUYERADDRESS.LIST"] = {
                BASICBUYERADDRESS: o.Util.breakStringToArr(l.address),
              }),
            o.Util.isNotEmptyString(l.cstNo) && (u.CONSIGNEECSTNUMBER = l.cstNo),
            o.Util.isNotEmptyString(l.gstNo) && (u.CONSIGNEEGSTIN = l.gstNo),
            o.Util.isNotEmptyString(l.partyName) && (u.BASICBUYERNAME = l.partyName),
            o.Util.isNotEmptyString(l.stateName) && (u.CONSIGNEESTATENAME = l.stateName),
            o.Util.isNotEmptyString(l.pincode) && (u.CONSIGNEEPINCODE = l.pincode),
            o.Util.isNotEmptyString(l.salesTaxNumber) &&
              (u["UDF:TRADERCONSVATTINNO.LIST"] = {
                "@DESC": "TraderConsVATTINNo",
                "@ISLIST": "YES",
                "@TYPE": "String",
                "@INDEX": 10015,
                "UDF:TRADERCONSVATTINNO": {
                  "@DESC": "TraderConsVATTINNo",
                  "#text": l.salesTaxNumber,
                },
              }));
          var d = e.ewayBillDetail;
          if (o.Util.isNotNull(d)) {
            var y = {};
            if (
              (o.Util.isNotEmptyString(d.ewayBillNo) && (y.BILLNUMBER = d.ewayBillNo),
              o.Util.isNotEmptyString(d.subType) && (y.SUBTYPE = d.subType),
              o.Util.isNotEmptyString(d.documentType) && (y.DOCUMENTTYPE = d.documentType),
              o.Util.isNumber(d.date) &&
                (y.BILLDATE = i.getFormattedDate(i.FORMAT_YYYYMMDD, d.date, t.timezone)),
              o.Util.isNotEmptyString(d.statusOfBill) && (y.BILLSTATUS = d.statusOfBill),
              o.Util.isFilledArray(d.transportDetails))
            ) {
              for (var b = [], h = 0, g = d.transportDetails; h < g.length; h++) {
                var S = g[h],
                  f = {};
                (o.Util.isNumber(S.documentDate) &&
                  (f.DOCUMENTDATE = i.getFormattedDate(
                    i.FORMAT_YYYYMMDD,
                    S.documentDate,
                    t.timezone,
                  )),
                  o.Util.isNotEmptyString(S.transporterId) && (f.TRANSPORTERID = S.transporterId),
                  o.Util.isNotEmptyString(S.transporterName) &&
                    (f.TRANSPORTERNAME = S.transporterName),
                  o.Util.isNotEmptyString(S.transporterMode) &&
                    (f.TRANSPORTMODE = o.Util.getTallyTransportMode(S.transporterMode)),
                  o.Util.isNotEmptyString(S.vehicleNumber) && (f.VEHICLENUMBER = S.vehicleNumber),
                  o.Util.isNotEmptyString(S.documentNumber) &&
                    (f.DOCUMENTNUMBER = S.documentNumber),
                  o.Util.isNotEmptyString(S.vehicleType) &&
                    (f.VEHICLETYPE = o.Util.getTallyVehicleType(S.vehicleType)),
                  o.Util.isNumber(S.distance)
                    ? (f.DISTANCE = S.distance)
                    : o.Util.isNotEmptyString(S.distanceInString) &&
                      (f.DISTANCE = S.distanceInString),
                  b.push(f));
              }
              y["TRANSPORTDETAILS.LIST"] = b;
            }
            u["EWAYBILLDETAILS.LIST"] = y;
          }
          return (
            o.Util.isNotEmptyString(e.narration) &&
              (u.NARRATION = o.Util.removeSpecialChar(e.narration)),
            o.Util.isNotEmptyString(e.partyGstNo) && (u.PARTYGSTIN = e.partyGstNo),
            o.Util.isNotEmptyString(e.customId) && (u.VOUCHERNUMBER = e.customId),
            o.Util.isNotEmptyString(e.costCenterName) &&
              ((u.COSTCENTRENAME = e.costCenterName), (u.ISCOSTCENTRE = "Yes")),
            o.Util.isNotEmptyString(e.referenceNumber) && (u.REFERENCE = e.referenceNumber),
            o.Util.isNotEmptyString(e.priceLevel) && (u.PRICELEVEL = e.priceLevel),
            o.Util.isNotEmptyString(e.voucherClassName) && (u.CLASSNAME = e.voucherClassName),
            o.Util.isNotEmptyString(e.partyStateName) && (u.STATENAME = e.partyStateName),
            o.Util.isNotEmptyString(e.placeOfSupply) && (u.PLACEOFSUPPLY = e.placeOfSupply),
            o.Util.isNotEmptyString(e.companyGstIn) && (u.CMPGSTIN = e.companyGstIn),
            o.Util.isNotEmptyString(e.companyGstState) && (u.CMPGSTSTATE = e.companyGstState),
            n.create(s).end({ pretty: !0 })
          );
        }),
        e
      );
    })();
  t.default = u;
};
