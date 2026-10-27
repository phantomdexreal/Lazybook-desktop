// webpack module #1068 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(45),
    a = r(11),
    i = r(144),
    o = r(207),
    s = r(70),
    u = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e, t, r) {
          var u = "",
            p = n.getFormattedDate(n.FORMAT_YYYYMMDD, e.date, t.timezone),
            c = n.getFormattedDate(n.FORMAT_DD_MMM_YYYY, e.dueOn, t.timezone),
            l = e.total,
            m = t.tallyCompanyName.trim(),
            d = s
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
              .ele("SVCURRENTCOMPANY", m)
              .up()
              .up()
              .up()
              .ele("DATA")
              .ele("TALLYMESSAGE")
              .ele("VOUCHER")
              .ele("DATE", p)
              .up();
          if (
            (!0 === e.isOptional && (d = d.ele("ISOPTIONAL", "Yes").up()),
            (d = d.ele("PERSISTEDVIEW", "Invoice Voucher View").up()),
            a.isNotEmptyString(e.costCenterName) &&
              (d = (d = d.ele("COSTCENTRENAME", e.costCenterName).up())
                .ele("ISCOSTCENTRE", "Yes")
                .up()),
            a.isNotEmptyString(e.partyAddress))
          ) {
            var y = e.partyAddress.match(/.{1,50}/g);
            if (a.isFilledArray(y)) {
              if (!a.isNotNull(e.buyerDetail) || !a.isNotEmptyString(e.buyerDetail.address)) {
                d = d.ele("ADDRESS.LIST", { TYPE: "String" });
                for (var b = 0, h = y; b < h.length; b++) {
                  var f = h[b];
                  d = d.ele("ADDRESS", f).up();
                }
                d = d.up();
              }
              if (
                !a.isNotNull(e.consigneeDetail) ||
                !a.isNotEmptyString(e.consigneeDetail.address)
              ) {
                d = d.ele("BASICBUYERADDRESS.LIST", { TYPE: "String" });
                for (var g = 0, M = y; g < M.length; g++) {
                  f = M[g];
                  d = d.ele("BASICBUYERADDRESS", f).up();
                }
                d = d.up();
              }
            }
          }
          a.isNotEmptyString(e.narration) &&
            (d = d.ele("NARRATION", a.removeSpecialChar(e.narration)).up()),
            (d = d.ele("PARTYNAME", e.partyId).up()),
            (d = a.isNotEmptyString(e.customType)
              ? d.ele("VOUCHERTYPENAME", e.customType).up()
              : d.ele("VOUCHERTYPENAME", e.orderType).up()),
            a.isEmptyString(e.partyGstNo) || (d = d.ele("PARTYGSTIN", e.partyGstNo).up()),
            a.isNotEmptyString(e.priceLevel) && (d = d.ele("PRICELEVEL", e.priceLevel).up()),
            a.isNotEmptyString(e.voucherClassName) &&
              (d = d.ele("CLASSNAME", e.voucherClassName).up()),
            a.isNotEmptyString(e.partyStateName) && (d = d.ele("STATENAME", e.partyStateName).up()),
            a.isNotEmptyString(e.placeOfSupply) &&
              (d = d.ele("PLACEOFSUPPLY", e.placeOfSupply).up()),
            a.isNotEmptyString(e.companyGstIn) && (d = d.ele("CMPGSTIN", e.companyGstIn).up()),
            a.isNotEmptyString(e.companyGstState) &&
              (d = d.ele("CMPGSTSTATE", e.companyGstState).up());
          var S = "0";
          if (
            (a.isNotEmptyString(e.orderNo) && e.orderNo.length > 0 && (S = e.orderNo),
            (d = d.ele("REFERENCE", S).up()),
            a.isNotEmptyString(e.customId) && (d = d.ele("VOUCHERNUMBER", e.customId).up()),
            (d = d
              .ele("PARTYLEDGERNAME", e.partyId)
              .up()
              .ele("BASICBASEPARTYNAME", e.partyId)
              .up()
              .ele("BASICBUYERNAME", e.partyId)
              .up()
              .ele("VCHGSTCLASS")
              .up()
              .ele("LEDGERENTRIES.LIST")
              .ele("LEDGERNAME", e.partyId)
              .up()),
            i.default.SALES_ORDER === e.orderType)
          ) {
            var A = -1 * l;
            d = d
              .ele("ISDEEMEDPOSITIVE", "Yes")
              .up()
              .ele("ISLASTDEEMEDPOSITIVE", "Yes")
              .up()
              .ele("AMOUNT", A)
              .up();
          } else
            i.default.PURCHASE_ORDER === e.orderType &&
              (d = d
                .ele("ISDEEMEDPOSITIVE", "No")
                .up()
                .ele("ISLASTDEEMEDPOSITIVE", "No")
                .up()
                .ele("AMOUNT", l)
                .up());
          if (
            ((d = d.ele("LEDGERFROMITEM", "No").up().ele("ISPARTYLEDGER", "Yes").up().up()),
            a.isFilledArray(e.charges))
          )
            for (var O = 0, N = e.charges; O < N.length; O++) {
              var v = N[O];
              if (
                ((d = d
                  .ele("LEDGERENTRIES.LIST")
                  .ele("LEDGERNAME", v.type)
                  .up()
                  .ele("GSTCLASS")
                  .up()),
                i.default.SALES_ORDER === e.orderType)
              )
                d = d
                  .ele("ISDEEMEDPOSITIVE", "No")
                  .up()
                  .ele("AMOUNT", v.taxAmount)
                  .up()
                  .ele("VATEXPAMOUNT", v.taxAmount)
                  .up();
              else if (i.default.PURCHASE_ORDER === e.orderType) {
                A = -1 * v.taxAmount;
                d = d
                  .ele("ISDEEMEDPOSITIVE", "Yes")
                  .up()
                  .ele("AMOUNT", A)
                  .up()
                  .ele("VATEXPAMOUNT", A)
                  .up();
              }
              if (
                (a.isPositiveNumber(v.taxPercentage) &&
                  (d = d
                    .ele("BASICRATEOFINVOICETAX.LIST", { TYPE: "Number" })
                    .ele("BASICRATEOFINVOICETAX", v.taxPercentage)
                    .up()
                    .up()),
                a.isNotEmptyString(v.hsnCode) && d.ele("GSTHSNNAME", v.hsnCode).up(),
                a.isNotEmpty(v.gstTypeOfSupply) &&
                  d.ele("GSTOVRDNTYPEOFSUPPLY", v.gstTypeOfSupply).up(),
                a.isNotEmpty(v.appropriateFor) && d.ele("APPROPRIATEFOR", v.appropriateFor).up(),
                a.isNotEmpty(v.gstAppropriateTo) &&
                  d.ele("GSTAPPROPRIATETO", v.gstAppropriateTo).up(),
                a.isNotEmpty(v.exciseAllocType) && d.ele("EXCISEALLOCTYPE", v.exciseAllocType).up(),
                a.isNotEmpty(v.taxability) && d.ele("GSTOVRDNTAXABILITY", v.taxability).up(),
                a.isFilledArray(v.rateDetails))
              )
                for (var T = 0, z = v.rateDetails; T < z.length; T++) {
                  var I = z[T];
                  d = o.default.getRateDetailEntryXmlRequestForOrder(d, I, r);
                }
              d = d.ele("ISPARTYLEDGER", "No").up().up();
            }
          if (a.isFilledArray(e.items))
            for (var q = 0, k = e.items; q < k.length; q++) {
              var R = k[q];
              if (
                ((d = d.ele("ALLINVENTORYENTRIES.LIST").ele("STOCKITEMNAME", R.name).up()),
                a.isNotEmptyString(R.itemDesc))
              ) {
                var C = R.itemDesc.match(/.{1,50}/g);
                if (a.isFilledArray(C)) {
                  d = d.ele("BASICUSERDESCRIPTION.LIST", { TYPE: "String" });
                  for (var E = 0, _ = C; E < _.length; E++) {
                    var D = _[E];
                    d = d.ele("BASICUSERDESCRIPTION", D).up();
                  }
                  d = d.up();
                }
              }
              if (i.default.SALES_ORDER === e.orderType)
                d = d
                  .ele("ISDEEMEDPOSITIVE", "No")
                  .up()
                  .ele("ISLASTDEEMEDPOSITIVE", "No")
                  .up()
                  .ele("AMOUNT", R.amount)
                  .up();
              else if (i.default.PURCHASE_ORDER === e.orderType) {
                A = -1 * R.amount;
                d = d
                  .ele("ISDEEMEDPOSITIVE", "Yes")
                  .up()
                  .ele("ISLASTDEEMEDPOSITIVE", "Yes")
                  .up()
                  .ele("AMOUNT", A)
                  .up();
              }
              var L = String(R.invQuantity);
              if (
                (a.isNotEmptyString(R.unit) && (L = L + " " + R.unit),
                a.isNotEmptyString(R.discount) && (d = d.ele("DISCOUNT", R.discount).up()),
                (d = a.isEmptyString(R.rateUnit)
                  ? d.ele("RATE", R.rate).up()
                  : d.ele("RATE", R.rate + "/" + R.rateUnit).up()),
                a.isNotNull(R.rateWithTax) &&
                  (d = a.isEmptyString(R.rateUnit)
                    ? d.ele("INCLVATRATE", R.rateWithTax).up()
                    : d.ele("INCLVATRATE", R.rateWithTax + "/" + R.rateUnit).up()),
                (d = a.isEmptyString(R.subUnit)
                  ? d.ele("ACTUALQTY", L).up().ele("BILLEDQTY", L).up()
                  : d
                      .ele("ACTUALQTY", L + " " + R.invSubQuantity + " " + R.subUnit)
                      .up()
                      .ele("BILLEDQTY", L + " " + R.invSubQuantity + " " + R.subUnit)
                      .up()),
                a.isNotEmptyString(R.hsnCode) && (d = d.ele("GSTHSNNAME", R.hsnCode).up()),
                a.isNotEmpty(R.taxability) && (d = d.ele("GSTOVRDNTAXABILITY", R.taxability).up()),
                a.isFilledArray(R.rateDetails))
              )
                for (var x = 0, w = R.rateDetails; x < w.length; x++) {
                  I = w[x];
                  d = o.default.getRateDetailEntryXmlRequestForOrder(d, I, r);
                }
              if (
                ((d = d.ele("BATCHALLOCATIONS.LIST")),
                a.isNotEmptyString(R.batchName) && (d = d.ele("BATCHNAME", R.batchName).up()),
                a.isNotEmptyString(R.godownName) && (d = d.ele("GODOWNNAME", R.godownName).up()),
                (d = (d = d.ele("ORDERNO", S).up()).ele("TRACKINGNUMBER").up()),
                i.default.SALES_ORDER === e.orderType)
              )
                d = d.ele("AMOUNT", R.amount).up();
              else if (i.default.PURCHASE_ORDER === e.orderType) {
                A = -1 * R.amount;
                d = d.ele("AMOUNT", A).up();
              }
              (d = a.isEmptyString(R.subUnit)
                ? d.ele("ACTUALQTY", L).up().ele("BILLEDQTY", L).up()
                : d
                    .ele("ACTUALQTY", L + " " + R.unit + " " + R.invSubQuantity + " " + R.subUnit)
                    .up()
                    .ele("BILLEDQTY", L + " " + R.unit + " " + R.invSubQuantity + " " + R.subUnit)
                    .up()),
                e.dueOn > 0 && (d = d.ele("ORDERDUEDATE", { P: c }, c).up()),
                a.isEmptyString(e.accountLedgerName) ||
                  ((d = d
                    .ele("ACCOUNTINGALLOCATIONS.LIST")
                    .ele("LEDGERNAME", e.accountLedgerName)
                    .up()
                    .ele("ISPARTYLEDGER", "No")
                    .up()),
                  (d = (d =
                    i.default.SALES_ORDER === e.orderType
                      ? (d = (d = d.ele("ISDEEMEDPOSITIVE", "No").up())
                          .ele("ISLASTDEEMEDPOSITIVE", "No")
                          .up())
                          .ele("AMOUNT", R.amount)
                          .up()
                      : (d = (d = d.ele("ISDEEMEDPOSITIVE", "Yes").up())
                          .ele("ISLASTDEEMEDPOSITIVE", "Yes")
                          .up())
                          .ele("AMOUNT", -1 * R.amount)
                          .up()).up())),
                (d = d.up().up());
            }
          var P = e.orderDetail;
          if (
            a.isNotNull(P) &&
            (a.isNotEmptyString(P.termsOfPayment) &&
              (d = d.ele("BASICDUEDATEOFPYMT", P.termsOfPayment).up()),
            a.isNotEmptyString(P.otherRef) && (d = d.ele("BASICORDERREF", P.otherRef).up()),
            a.isNotEmptyString(P.termsOfDelivery))
          ) {
            d = d.ele("BASICORDERTERMS.LIST", { TYPE: "String" });
            for (var W = 0, B = a.breakStringToArr(P.termsOfDelivery); W < B.length; W++) {
              var U = B[W];
              d = d.ele("BASICORDERTERMS", U).up();
            }
            d = d.up();
          }
          var F = e.dispatchDetail;
          a.isNotNull(F) &&
            (a.isNotEmptyString(F.shippedBy) && (d = d.ele("BASICSHIPPEDBY", F.shippedBy).up()),
            a.isNotEmptyString(F.finalDestination) &&
              (d = d.ele("BASICFINALDESTINATION", F.finalDestination).up()),
            a.isNumber(F.lrDate) &&
              (d = d
                .ele(
                  "BILLOFLADINGDATE",
                  n.getFormattedDate(n.FORMAT_YYYYMMDD, F.lrDate, t.timezone)
                )
                .up()),
            a.isNotEmptyString(F.lrNo) && (d = d.ele("BILLOFLADINGNO", F.lrNo).up()),
            a.isNotEmptyString(F.shipDocumentNo) &&
              (d = d.ele("BASICSHIPDOCUMENTNO", F.shipDocumentNo).up()),
            a.isNotEmptyString(F.motorVehicleNumber) &&
              (d = d.ele("BASICSHIPVESSELNO", F.motorVehicleNumber).up()));
          var G = e.buyerDetail;
          if (a.isNotNull(G)) {
            if (
              (a.isNotEmptyString(G.partyName) && (d = d.ele("PARTYNAME", G.partyName).up()),
              a.isNotEmptyString(G.address))
            ) {
              d = d.ele("ADDRESS.LIST");
              for (var j = 0, V = a.breakStringToArr(G.address); j < V.length; j++) {
                var Y = V[j];
                d = d.ele("ADDRESS", Y).up();
              }
              d = d.up();
            }
            a.isNotEmptyString(G.gstNo) && (d = d.ele("PARTYGSTIN", G.gstNo).up()),
              a.isNotEmptyString(G.cstNo) && (d = d.ele("BUYERSCSTNUMBER", G.cstNo).up()),
              a.isNotEmptyString(G.stateName) && (d = d.ele("STATENAME", G.stateName).up()),
              a.isNotEmptyString(G.salesTaxNumber) &&
                (d = d.ele("BASICBUYERSSALESTAXNO", G.salesTaxNumber).up()),
              a.isNotEmptyString(G.country) && (d = d.ele("COUNTRYOFRESIDENCE", G.country).up()),
              a.isNotEmptyString(G.placeOfSupply) &&
                (d = d.ele("PLACEOFSUPPLY", G.placeOfSupply).up()),
              a.isNotEmptyString(G.registrationType) &&
                (d = d.ele("GSTREGISTRATIONTYPE", G.registrationType).up()),
              a.isNotEmptyString(G.pincode) && (d = d.ele("PARTYPINCODE", G.pincode).up());
          }
          var H = e.consigneeDetail;
          if (a.isNotNull(H)) {
            if (
              (a.isNotEmptyString(H.partyName) && (d = d.ele("BASICBUYERNAME", H.partyName).up()),
              a.isNotEmptyString(H.address))
            ) {
              d = d.ele("BASICBUYERADDRESS.LIST");
              for (var K = 0, X = a.breakStringToArr(H.address); K < X.length; K++) {
                Y = X[K];
                d = d.ele("BASICBUYERADDRESS", Y).up();
              }
              d = d.up();
            }
            a.isNotEmptyString(H.gstNo) && (d = d.ele("CONSIGNEEGSTIN", H.gstNo).up()),
              a.isNotEmptyString(H.cstNo) && (d = d.ele("CONSIGNEECSTNUMBER", H.cstNo).up()),
              a.isNotEmptyString(H.stateName) &&
                (d = d.ele("CONSIGNEESTATENAME", H.stateName).up()),
              a.isNotEmptyString(H.pincode) && (d = d.ele("CONSIGNEEPINCODE", H.pincode).up()),
              a.isNotEmptyString(H.salesTaxNumber) &&
                (d = d
                  .ele("UDF:TRADERCONSVATTINNO.LIST", {
                    DESC: "TraderConsVATTINNo",
                    ISLIST: "YES",
                    TYPE: "String",
                    INDEX: "10015",
                  })
                  .ele("UDF:TRADERCONSVATTINNO", { DESC: "TraderConsVATTINNo" }, H.salesTaxNumber)
                  .up()
                  .up());
          }
          return (u += d = d.up().up().up().up().end({ pretty: !0 }));
        }),
        e
      );
    })();
  t.default = u;
};
