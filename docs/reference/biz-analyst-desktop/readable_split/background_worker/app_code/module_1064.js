// webpack module #1064 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(45),
    a = r(531),
    i = r(0),
    o = r(207),
    s = r(70),
    u = (function () {
      function e() {}
      return (
        (e.prototype.getLedgerEntryList = function (e, t) {
          var r = [],
            n = e.total;
          if (
            (a.InventoryVoucherEntry.TYPE_DELIVERY_NOTE === e.type
              ? r.push({
                  LEDGERNAME: e.partyId,
                  ISDEEMEDPOSITIVE: "Yes",
                  ISLASTDEEMEDPOSITIVE: "Yes",
                  AMOUNT: -1 * n,
                  ISPARTYLEDGER: "Yes",
                })
              : a.InventoryVoucherEntry.TYPE_RECEIPT_NOTE === e.type &&
                r.push({
                  LEDGERNAME: e.partyId,
                  ISDEEMEDPOSITIVE: "No",
                  ISLASTDEEMEDPOSITIVE: "No",
                  AMOUNT: n,
                  ISPARTYLEDGER: "Yes",
                }),
            i.Util.isFilledArray(e.charges))
          )
            for (var s = 0, u = e.charges; s < u.length; s++) {
              var p = u[s];
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
                  (i.Util.isPositiveNumber(p.taxPercentage) &&
                    (c["BASICRATEOFINVOICETAX.LIST"] = {
                      "@TYPE": "Number",
                      BASICRATEOFINVOICETAX: p.taxPercentage,
                    }),
                  i.Util.isNotEmptyString(p.hsnCode) && (c.GSTHSNNAME = p.hsnCode),
                  i.Util.isNotEmpty(p.gstTypeOfSupply) &&
                    (c.GSTOVRDNTYPEOFSUPPLY = p.gstTypeOfSupply),
                  i.Util.isNotEmpty(p.appropriateFor) && (c.APPROPRIATEFOR = p.appropriateFor),
                  i.Util.isNotEmpty(p.gstAppropriateTo) &&
                    (c.GSTAPPROPRIATETO = p.gstAppropriateTo),
                  i.Util.isNotEmpty(p.exciseAllocType) && (c.EXCISEALLOCTYPE = p.exciseAllocType),
                  i.Util.isNotEmpty(p.taxability) && (c.GSTOVRDNTAXABILITY = p.taxability),
                  i.Util.isFilledArray(p.rateDetails))
                ) {
                  for (var l = [], m = 0, d = p.rateDetails; m < d.length; m++) {
                    var y = d[m],
                      b = o.default.getRateDetailEntryXmlRequest(y, t);
                    i.Util.isNotEmpty(b) && l.push(b);
                  }
                  c["RATEDETAILS.LIST"] = l;
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
                  (i.Util.isPositiveNumber(p.taxPercentage) &&
                    (c["BASICRATEOFINVOICETAX.LIST"] = {
                      "@TYPE": "Number",
                      BASICRATEOFINVOICETAX: p.taxPercentage,
                    }),
                  i.Util.isNotEmptyString(p.hsnCode) && (c.GSTHSNNAME = p.hsnCode),
                  i.Util.isNotEmpty(p.gstTypeOfSupply) &&
                    (c.GSTOVRDNTYPEOFSUPPLY = p.gstTypeOfSupply),
                  i.Util.isNotEmpty(p.appropriateFor) && (c.APPROPRIATEFOR = p.appropriateFor),
                  i.Util.isNotEmpty(p.gstAppropriateTo) &&
                    (c.GSTAPPROPRIATETO = p.gstAppropriateTo),
                  i.Util.isNotEmpty(p.exciseAllocType) && (c.EXCISEALLOCTYPE = p.exciseAllocType),
                  i.Util.isNotEmpty(p.taxability) && (c.GSTOVRDNTAXABILITY = p.taxability),
                  i.Util.isFilledArray(p.rateDetails))
                ) {
                  l = [];
                  for (var f = 0, g = p.rateDetails; f < g.length; f++) {
                    ((y = g[f]), (b = o.default.getRateDetailEntryXmlRequest(y, t)));
                    i.Util.isNotEmpty(b) && l.push(b);
                  }
                  c["RATEDETAILS.LIST"] = l;
                }
                r.push(c);
              }
            }
          return r;
        }),
        (e.prototype.getVoucherType = function (e) {
          return i.Util.isNotEmptyString(e.customType) ? e.customType : e.type;
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
              a.InventoryVoucherEntry.TYPE_DELIVERY_NOTE === e.type
                ? ((l.ISDEEMEDPOSITIVE = "No"),
                  (l.ISLASTDEEMEDPOSITIVE = "No"),
                  (l.AMOUNT = c.amount))
                : a.InventoryVoucherEntry.TYPE_RECEIPT_NOTE === e.type &&
                  ((l.ISDEEMEDPOSITIVE = "Yes"),
                  (l.ISLASTDEEMEDPOSITIVE = "Yes"),
                  (l.AMOUNT = -1 * c.amount));
              var d = String(c.invQuantity);
              (i.Util.isNotEmptyString(c.unit) && (d = d + " " + c.unit),
                i.Util.isNotEmptyString(c.discount) && (l.DISCOUNT = c.discount),
                i.Util.isEmptyString(c.rateUnit)
                  ? (l.RATE = c.rate)
                  : (l.RATE = c.rate + "/" + c.rateUnit),
                i.Util.isNotNull(c.rateWithTax) &&
                  (i.Util.isEmptyString(c.rateUnit)
                    ? (l.INCLVATRATE = c.rateWithTax)
                    : (l.INCLVATRATE = c.rateWithTax + "/" + c.rateUnit)),
                i.Util.isEmptyString(c.subUnit)
                  ? ((l.ACTUALQTY = d), (l.BILLEDQTY = d))
                  : ((l.ACTUALQTY = d + " " + c.invSubQuantity + " " + c.subUnit),
                    (l.BILLEDQTY = d + " " + c.invSubQuantity + " " + c.subUnit)),
                (l["BATCHALLOCATIONS.LIST"] = { TRACKINGNUMBER: "" }),
                i.Util.isNotEmptyString(c.batchName) &&
                  (l["BATCHALLOCATIONS.LIST"].BATCHNAME = c.batchName),
                (l["BATCHALLOCATIONS.LIST"].GODOWNNAME = c.godownName),
                a.InventoryVoucherEntry.TYPE_DELIVERY_NOTE === e.type
                  ? (l["BATCHALLOCATIONS.LIST"].AMOUNT = c.amount)
                  : a.InventoryVoucherEntry.TYPE_RECEIPT_NOTE === e.type &&
                    (l["BATCHALLOCATIONS.LIST"].AMOUNT = -1 * c.amount),
                i.Util.isEmptyString(c.subUnit)
                  ? ((l["BATCHALLOCATIONS.LIST"].ACTUALQTY = d),
                    (l["BATCHALLOCATIONS.LIST"].BILLEDQTY = d))
                  : ((l["BATCHALLOCATIONS.LIST"].ACTUALQTY =
                      d + " " + c.unit + " " + c.invSubQuantity + " " + c.subUnit),
                    (l["BATCHALLOCATIONS.LIST"].BILLEDQTY =
                      d + " " + c.unit + " " + c.invSubQuantity + " " + c.subUnit)));
              var y = e.orderDetail;
              if (
                (i.Util.isNotNull(y) &&
                  i.Util.isFilledArray(y.orderNumbers) &&
                  ((l["BATCHALLOCATIONS.LIST"].ORDERNO = y.orderNumbers[0].name),
                  (l["BATCHALLOCATIONS.LIST"].ORDERDUEDATE = n.getFormattedDate(
                    n.FORMAT_DD_MMM_YYYY,
                    y.orderNumbers[0].date,
                    t.timezone,
                  ))),
                a.InventoryVoucherEntry.TYPE_DELIVERY_NOTE === e.type
                  ? (l["ACCOUNTINGALLOCATIONS.LIST"] = {
                      LEDGERNAME: e.accountLedgerName,
                      ISDEEMEDPOSITIVE: "No",
                      ISLASTDEEMEDPOSITIVE: "No",
                      AMOUNT: c.amount,
                      ISPARTYLEDGER: "No",
                    })
                  : a.InventoryVoucherEntry.TYPE_RECEIPT_NOTE === e.type &&
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
                for (var b = [], h = 0, f = c.rateDetails; h < f.length; h++) {
                  var g = f[h],
                    M = o.default.getRateDetailEntryXmlRequest(g, r);
                  i.Util.isNotEmpty(M) && b.push(M);
                }
                l["RATEDETAILS.LIST"] = b;
              }
              s.push(l);
            }
          return s;
        }),
        (e.prototype.getBody = function (e, t, r) {
          var a = n.getFormattedDate(n.FORMAT_YYYYMMDD, e.date, t.timezone),
            o = {
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
                          "ADDRESS.LIST": { ADDRESS: i.Util.breakStringToArr(e.partyAddress) },
                          "BASICBUYERADDRESS.LIST": {
                            BASICBUYERADDRESS: i.Util.breakStringToArr(e.partyAddress),
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
            u = o.ENVELOPE.BODY.IMPORTDATA.REQUESTDATA.TALLYMESSAGE.VOUCHER,
            p = e.orderDetail;
          i.Util.isNotNull(p) &&
            (i.Util.isFilledArray(p.orderNumbers) &&
              (u["INVOICEORDERLIST.LIST"] = p.orderNumbers.map(function (e) {
                return {
                  BASICPURCHASEORDERNO: e.name,
                  BASICORDERDATE: n.getFormattedDate(n.FORMAT_YYYYMMDD, e.date, t.timezone),
                };
              })),
            i.Util.isNotEmptyString(p.termsOfDelivery) &&
              (u["BASICORDERTERMS.LIST"] = {
                "@TYPE": "String",
                BASICORDERTERMS: i.Util.breakStringToArr(p.termsOfDelivery),
              }),
            i.Util.isNotEmptyString(p.otherRef) && (u.BASICORDERREF = p.otherRef),
            i.Util.isNotEmptyString(p.termsOfPayment) && (u.BASICDUEDATEOFPYMT = p.termsOfPayment));
          var c = e.dispatchDetail;
          i.Util.isNotNull(c) &&
            (i.Util.isNumber(c.lrDate) &&
              (u.BILLOFLADINGDATE = n.getFormattedDate(n.FORMAT_YYYYMMDD, c.lrDate, t.timezone)),
            i.Util.isNotEmptyString(c.lrNo) && (u.BILLOFLADINGNO = c.lrNo),
            i.Util.isNotEmptyString(c.shippedBy) && (u.BASICSHIPPEDBY = c.shippedBy),
            i.Util.isNotEmptyString(c.shipDocumentNo) && (u.BASICSHIPDOCUMENTNO = c.shipDocumentNo),
            i.Util.isNotEmptyString(c.finalDestination) &&
              (u.BASICFINALDESTINATION = c.finalDestination),
            i.Util.isNotEmptyString(c.motorVehicleNumber) &&
              (u.BASICSHIPVESSELNO = c.motorVehicleNumber));
          var l = e.buyerDetail;
          i.Util.isNotNull(l) &&
            (i.Util.isNotEmptyString(l.partyName) && (u.PARTYNAME = l.partyName),
            i.Util.isNotEmptyString(l.stateName) && (u.STATENAME = l.stateName),
            i.Util.isNotEmptyString(l.country) && (u.COUNTRYOFRESIDENCE = l.country),
            i.Util.isNotEmptyString(l.gstNo) && (u.PARTYGSTIN = l.gstNo),
            i.Util.isNotEmptyString(l.placeOfSupply) && (u.PLACEOFSUPPLY = l.placeOfSupply),
            i.Util.isNotEmptyString(l.registrationType) &&
              (u.GSTREGISTRATIONTYPE = l.registrationType),
            i.Util.isNotEmptyString(l.cstNo) && (u.BUYERSCSTNUMBER = l.cstNo),
            i.Util.isNotEmptyString(l.salesTaxNumber) &&
              (u.BASICBUYERSSALESTAXNO = l.salesTaxNumber),
            i.Util.isNotEmptyString(l.address) &&
              (u["ADDRESS.LIST"] = { ADDRESS: i.Util.breakStringToArr(l.address) }),
            i.Util.isNotEmptyString(l.pincode) && (u.PARTYPINCODE = l.pincode));
          var m = e.consigneeDetail;
          i.Util.isNotNull(m) &&
            (i.Util.isNotEmptyString(m.address) &&
              (u["BASICBUYERADDRESS.LIST"] = {
                BASICBUYERADDRESS: i.Util.breakStringToArr(m.address),
              }),
            i.Util.isNotEmptyString(m.cstNo) && (u.CONSIGNEECSTNUMBER = m.cstNo),
            i.Util.isNotEmptyString(m.gstNo) && (u.CONSIGNEEGSTIN = m.gstNo),
            i.Util.isNotEmptyString(m.partyName) && (u.BASICBUYERNAME = m.partyName),
            i.Util.isNotEmptyString(m.stateName) && (u.CONSIGNEESTATENAME = m.stateName),
            i.Util.isNotEmptyString(m.pincode) && (u.CONSIGNEEPINCODE = m.pincode),
            i.Util.isNotEmptyString(m.salesTaxNumber) &&
              (u["UDF:TRADERCONSVATTINNO.LIST"] = {
                "@DESC": "TraderConsVATTINNo",
                "@ISLIST": "YES",
                "@TYPE": "String",
                "@INDEX": 10015,
                "UDF:TRADERCONSVATTINNO": {
                  "@DESC": "TraderConsVATTINNo",
                  "#text": m.salesTaxNumber,
                },
              }));
          var d = e.ewayBillDetail;
          if (i.Util.isNotNull(d)) {
            var y = {};
            if (
              (i.Util.isNotEmptyString(d.ewayBillNo) && (y.BILLNUMBER = d.ewayBillNo),
              i.Util.isNotEmptyString(d.subType) && (y.SUBTYPE = d.subType),
              i.Util.isNotEmptyString(d.documentType) && (y.DOCUMENTTYPE = d.documentType),
              i.Util.isNumber(d.date) &&
                (y.BILLDATE = n.getFormattedDate(n.FORMAT_YYYYMMDD, d.date, t.timezone)),
              i.Util.isNotEmptyString(d.statusOfBill) && (y.BILLSTATUS = d.statusOfBill),
              i.Util.isFilledArray(d.transportDetails))
            ) {
              for (var b = [], h = 0, f = d.transportDetails; h < f.length; h++) {
                var g = f[h],
                  M = {};
                (i.Util.isNumber(g.documentDate) &&
                  (M.DOCUMENTDATE = n.getFormattedDate(
                    n.FORMAT_YYYYMMDD,
                    g.documentDate,
                    t.timezone,
                  )),
                  i.Util.isNotEmptyString(g.transporterId) && (M.TRANSPORTERID = g.transporterId),
                  i.Util.isNotEmptyString(g.transporterName) &&
                    (M.TRANSPORTERNAME = g.transporterName),
                  i.Util.isNotEmptyString(g.transporterMode) &&
                    (M.TRANSPORTMODE = i.Util.getTallyTransportMode(g.transporterMode)),
                  i.Util.isNotEmptyString(g.vehicleNumber) && (M.VEHICLENUMBER = g.vehicleNumber),
                  i.Util.isNotEmptyString(g.documentNumber) &&
                    (M.DOCUMENTNUMBER = g.documentNumber),
                  i.Util.isNotEmptyString(g.vehicleType) &&
                    (M.VEHICLETYPE = i.Util.getTallyVehicleType(g.vehicleType)),
                  i.Util.isNumber(g.distance)
                    ? (M.DISTANCE = g.distance)
                    : i.Util.isNotEmptyString(g.distanceInString) &&
                      (M.DISTANCE = g.distanceInString),
                  b.push(M));
              }
              y["TRANSPORTDETAILS.LIST"] = b;
            }
            u["EWAYBILLDETAILS.LIST"] = y;
          }
          return (
            i.Util.isNotEmptyString(e.narration) &&
              (u.NARRATION = i.Util.removeSpecialChar(e.narration)),
            i.Util.isNotEmptyString(e.partyGstNo) && (u.PARTYGSTIN = e.partyGstNo),
            i.Util.isNotEmptyString(e.customId) && (u.VOUCHERNUMBER = e.customId),
            i.Util.isNotEmptyString(e.costCenterName) &&
              ((u.COSTCENTRENAME = e.costCenterName), (u.ISCOSTCENTRE = "Yes")),
            i.Util.isNotEmptyString(e.referenceNumber) && (u.REFERENCE = e.referenceNumber),
            i.Util.isNotEmptyString(e.priceLevel) && (u.PRICELEVEL = e.priceLevel),
            i.Util.isNotEmptyString(e.voucherClassName) && (u.CLASSNAME = e.voucherClassName),
            i.Util.isNotEmptyString(e.partyStateName) && (u.STATENAME = e.partyStateName),
            i.Util.isNotEmptyString(e.placeOfSupply) && (u.PLACEOFSUPPLY = e.placeOfSupply),
            i.Util.isNotEmptyString(e.companyGstIn) && (u.CMPGSTIN = e.companyGstIn),
            i.Util.isNotEmptyString(e.companyGstState) && (u.CMPGSTSTATE = e.companyGstState),
            s.create(o).end({ pretty: !0 })
          );
        }),
        e
      );
    })();
  t.default = u;
};
