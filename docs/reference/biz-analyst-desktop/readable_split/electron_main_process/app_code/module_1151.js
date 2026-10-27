// webpack module #1151 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(52),
    a = r(10),
    o = r(573),
    s = r(216),
    n = r(65),
    u = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e, t, r) {
          var u = "",
            p = i.getFormattedDate(i.FORMAT_YYYYMMDD, e.date, t.timezone),
            c = i.getFormattedDate(i.FORMAT_DD_MMM_YYYY, e.dueOn, t.timezone),
            m = e.total,
            l = t.tallyCompanyName.trim(),
            d = n
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
              .ele("SVCURRENTCOMPANY", l)
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
                  var g = h[b];
                  d = d.ele("ADDRESS", g).up();
                }
                d = d.up();
              }
              if (
                !a.isNotNull(e.consigneeDetail) ||
                !a.isNotEmptyString(e.consigneeDetail.address)
              ) {
                d = d.ele("BASICBUYERADDRESS.LIST", { TYPE: "String" });
                for (var S = 0, f = y; S < f.length; S++) {
                  g = f[S];
                  d = d.ele("BASICBUYERADDRESS", g).up();
                }
                d = d.up();
              }
            }
          }
          (a.isNotEmptyString(e.narration) &&
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
              (d = d.ele("CMPGSTSTATE", e.companyGstState).up()));
          var A = "0";
          if (
            (a.isNotEmptyString(e.orderNo) && e.orderNo.length > 0 && (A = e.orderNo),
            (d = d.ele("REFERENCE", A).up()),
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
            o.default.SALES_ORDER === e.orderType)
          ) {
            var N = -1 * m;
            d = d
              .ele("ISDEEMEDPOSITIVE", "Yes")
              .up()
              .ele("ISLASTDEEMEDPOSITIVE", "Yes")
              .up()
              .ele("AMOUNT", N)
              .up();
          } else
            o.default.PURCHASE_ORDER === e.orderType &&
              (d = d
                .ele("ISDEEMEDPOSITIVE", "No")
                .up()
                .ele("ISLASTDEEMEDPOSITIVE", "No")
                .up()
                .ele("AMOUNT", m)
                .up());
          if (
            ((d = d.ele("LEDGERFROMITEM", "No").up().ele("ISPARTYLEDGER", "Yes").up().up()),
            a.isFilledArray(e.charges))
          )
            for (var I = 0, T = e.charges; I < T.length; I++) {
              var M = T[I];
              if (
                ((d = d
                  .ele("LEDGERENTRIES.LIST")
                  .ele("LEDGERNAME", M.type)
                  .up()
                  .ele("GSTCLASS")
                  .up()),
                o.default.SALES_ORDER === e.orderType)
              )
                d = d
                  .ele("ISDEEMEDPOSITIVE", "No")
                  .up()
                  .ele("AMOUNT", M.taxAmount)
                  .up()
                  .ele("VATEXPAMOUNT", M.taxAmount)
                  .up();
              else if (o.default.PURCHASE_ORDER === e.orderType) {
                N = -1 * M.taxAmount;
                d = d
                  .ele("ISDEEMEDPOSITIVE", "Yes")
                  .up()
                  .ele("AMOUNT", N)
                  .up()
                  .ele("VATEXPAMOUNT", N)
                  .up();
              }
              if (
                (a.isPositiveNumber(M.taxPercentage) &&
                  (d = d
                    .ele("BASICRATEOFINVOICETAX.LIST", { TYPE: "Number" })
                    .ele("BASICRATEOFINVOICETAX", M.taxPercentage)
                    .up()
                    .up()),
                a.isNotEmptyString(M.hsnCode) && d.ele("GSTHSNNAME", M.hsnCode).up(),
                a.isNotEmpty(M.gstTypeOfSupply) &&
                  d.ele("GSTOVRDNTYPEOFSUPPLY", M.gstTypeOfSupply).up(),
                a.isNotEmpty(M.appropriateFor) && d.ele("APPROPRIATEFOR", M.appropriateFor).up(),
                a.isNotEmpty(M.gstAppropriateTo) &&
                  d.ele("GSTAPPROPRIATETO", M.gstAppropriateTo).up(),
                a.isNotEmpty(M.exciseAllocType) && d.ele("EXCISEALLOCTYPE", M.exciseAllocType).up(),
                a.isNotEmpty(M.taxability) && d.ele("GSTOVRDNTAXABILITY", M.taxability).up(),
                a.isFilledArray(M.rateDetails))
              )
                for (var v = 0, k = M.rateDetails; v < k.length; v++) {
                  var C = k[v];
                  d = s.default.getRateDetailEntryXmlRequestForOrder(d, C, r);
                }
              d = d.ele("ISPARTYLEDGER", "No").up().up();
            }
          if (a.isFilledArray(e.items))
            for (var q = 0, R = e.items; q < R.length; q++) {
              var D = R[q];
              if (
                ((d = d.ele("ALLINVENTORYENTRIES.LIST").ele("STOCKITEMNAME", D.name).up()),
                a.isNotEmptyString(D.itemDesc))
              ) {
                var E = D.itemDesc.match(/.{1,50}/g);
                if (a.isFilledArray(E)) {
                  d = d.ele("BASICUSERDESCRIPTION.LIST", { TYPE: "String" });
                  for (var x = 0, O = E; x < O.length; x++) {
                    var z = O[x];
                    d = d.ele("BASICUSERDESCRIPTION", z).up();
                  }
                  d = d.up();
                }
              }
              if (o.default.SALES_ORDER === e.orderType)
                d = d
                  .ele("ISDEEMEDPOSITIVE", "No")
                  .up()
                  .ele("ISLASTDEEMEDPOSITIVE", "No")
                  .up()
                  .ele("AMOUNT", D.amount)
                  .up();
              else if (o.default.PURCHASE_ORDER === e.orderType) {
                N = -1 * D.amount;
                d = d
                  .ele("ISDEEMEDPOSITIVE", "Yes")
                  .up()
                  .ele("ISLASTDEEMEDPOSITIVE", "Yes")
                  .up()
                  .ele("AMOUNT", N)
                  .up();
              }
              var P = String(D.invQuantity);
              if (
                (a.isNotEmptyString(D.unit) && (P = P + " " + D.unit),
                a.isNotEmptyString(D.discount) && (d = d.ele("DISCOUNT", D.discount).up()),
                (d = a.isEmptyString(D.rateUnit)
                  ? d.ele("RATE", D.rate).up()
                  : d.ele("RATE", D.rate + "/" + D.rateUnit).up()),
                a.isNotNull(D.rateWithTax) &&
                  (d = a.isEmptyString(D.rateUnit)
                    ? d.ele("INCLVATRATE", D.rateWithTax).up()
                    : d.ele("INCLVATRATE", D.rateWithTax + "/" + D.rateUnit).up()),
                (d = a.isEmptyString(D.subUnit)
                  ? d.ele("ACTUALQTY", P).up().ele("BILLEDQTY", P).up()
                  : d
                      .ele("ACTUALQTY", P + " " + D.invSubQuantity + " " + D.subUnit)
                      .up()
                      .ele("BILLEDQTY", P + " " + D.invSubQuantity + " " + D.subUnit)
                      .up()),
                a.isNotEmptyString(D.hsnCode) && (d = d.ele("GSTHSNNAME", D.hsnCode).up()),
                a.isNotEmpty(D.taxability) && (d = d.ele("GSTOVRDNTAXABILITY", D.taxability).up()),
                a.isFilledArray(D.rateDetails))
              )
                for (var L = 0, w = D.rateDetails; L < w.length; L++) {
                  C = w[L];
                  d = s.default.getRateDetailEntryXmlRequestForOrder(d, C, r);
                }
              if (
                ((d = d.ele("BATCHALLOCATIONS.LIST")),
                a.isNotEmptyString(D.batchName) && (d = d.ele("BATCHNAME", D.batchName).up()),
                a.isNotEmptyString(D.godownName) && (d = d.ele("GODOWNNAME", D.godownName).up()),
                (d = (d = d.ele("ORDERNO", A).up()).ele("TRACKINGNUMBER").up()),
                o.default.SALES_ORDER === e.orderType)
              )
                d = d.ele("AMOUNT", D.amount).up();
              else if (o.default.PURCHASE_ORDER === e.orderType) {
                N = -1 * D.amount;
                d = d.ele("AMOUNT", N).up();
              }
              ((d = a.isEmptyString(D.subUnit)
                ? d.ele("ACTUALQTY", P).up().ele("BILLEDQTY", P).up()
                : d
                    .ele("ACTUALQTY", P + " " + D.unit + " " + D.invSubQuantity + " " + D.subUnit)
                    .up()
                    .ele("BILLEDQTY", P + " " + D.unit + " " + D.invSubQuantity + " " + D.subUnit)
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
                    o.default.SALES_ORDER === e.orderType
                      ? (d = (d = d.ele("ISDEEMEDPOSITIVE", "No").up())
                          .ele("ISLASTDEEMEDPOSITIVE", "No")
                          .up())
                          .ele("AMOUNT", D.amount)
                          .up()
                      : (d = (d = d.ele("ISDEEMEDPOSITIVE", "Yes").up())
                          .ele("ISLASTDEEMEDPOSITIVE", "Yes")
                          .up())
                          .ele("AMOUNT", -1 * D.amount)
                          .up()).up())),
                (d = d.up().up()));
            }
          var _ = e.orderDetail;
          if (
            a.isNotNull(_) &&
            (a.isNotEmptyString(_.termsOfPayment) &&
              (d = d.ele("BASICDUEDATEOFPYMT", _.termsOfPayment).up()),
            a.isNotEmptyString(_.otherRef) && (d = d.ele("BASICORDERREF", _.otherRef).up()),
            a.isNotEmptyString(_.termsOfDelivery))
          ) {
            d = d.ele("BASICORDERTERMS.LIST", { TYPE: "String" });
            for (var U = 0, B = a.breakStringToArr(_.termsOfDelivery); U < B.length; U++) {
              var F = B[U];
              d = d.ele("BASICORDERTERMS", F).up();
            }
            d = d.up();
          }
          var G = e.dispatchDetail;
          a.isNotNull(G) &&
            (a.isNotEmptyString(G.shippedBy) && (d = d.ele("BASICSHIPPEDBY", G.shippedBy).up()),
            a.isNotEmptyString(G.finalDestination) &&
              (d = d.ele("BASICFINALDESTINATION", G.finalDestination).up()),
            a.isNumber(G.lrDate) &&
              (d = d
                .ele(
                  "BILLOFLADINGDATE",
                  i.getFormattedDate(i.FORMAT_YYYYMMDD, G.lrDate, t.timezone),
                )
                .up()),
            a.isNotEmptyString(G.lrNo) && (d = d.ele("BILLOFLADINGNO", G.lrNo).up()),
            a.isNotEmptyString(G.shipDocumentNo) &&
              (d = d.ele("BASICSHIPDOCUMENTNO", G.shipDocumentNo).up()),
            a.isNotEmptyString(G.motorVehicleNumber) &&
              (d = d.ele("BASICSHIPVESSELNO", G.motorVehicleNumber).up()));
          var V = e.buyerDetail;
          if (a.isNotNull(V)) {
            if (
              (a.isNotEmptyString(V.partyName) && (d = d.ele("PARTYNAME", V.partyName).up()),
              a.isNotEmptyString(V.address))
            ) {
              d = d.ele("ADDRESS.LIST");
              for (var W = 0, j = a.breakStringToArr(V.address); W < j.length; W++) {
                var H = j[W];
                d = d.ele("ADDRESS", H).up();
              }
              d = d.up();
            }
            (a.isNotEmptyString(V.gstNo) && (d = d.ele("PARTYGSTIN", V.gstNo).up()),
              a.isNotEmptyString(V.cstNo) && (d = d.ele("BUYERSCSTNUMBER", V.cstNo).up()),
              a.isNotEmptyString(V.stateName) && (d = d.ele("STATENAME", V.stateName).up()),
              a.isNotEmptyString(V.salesTaxNumber) &&
                (d = d.ele("BASICBUYERSSALESTAXNO", V.salesTaxNumber).up()),
              a.isNotEmptyString(V.country) && (d = d.ele("COUNTRYOFRESIDENCE", V.country).up()),
              a.isNotEmptyString(V.placeOfSupply) &&
                (d = d.ele("PLACEOFSUPPLY", V.placeOfSupply).up()),
              a.isNotEmptyString(V.registrationType) &&
                (d = d.ele("GSTREGISTRATIONTYPE", V.registrationType).up()),
              a.isNotEmptyString(V.pincode) && (d = d.ele("PARTYPINCODE", V.pincode).up()));
          }
          var K = e.consigneeDetail;
          if (a.isNotNull(K)) {
            if (
              (a.isNotEmptyString(K.partyName) && (d = d.ele("BASICBUYERNAME", K.partyName).up()),
              a.isNotEmptyString(K.address))
            ) {
              d = d.ele("BASICBUYERADDRESS.LIST");
              for (var Y = 0, Q = a.breakStringToArr(K.address); Y < Q.length; Y++) {
                H = Q[Y];
                d = d.ele("BASICBUYERADDRESS", H).up();
              }
              d = d.up();
            }
            (a.isNotEmptyString(K.gstNo) && (d = d.ele("CONSIGNEEGSTIN", K.gstNo).up()),
              a.isNotEmptyString(K.cstNo) && (d = d.ele("CONSIGNEECSTNUMBER", K.cstNo).up()),
              a.isNotEmptyString(K.stateName) &&
                (d = d.ele("CONSIGNEESTATENAME", K.stateName).up()),
              a.isNotEmptyString(K.pincode) && (d = d.ele("CONSIGNEEPINCODE", K.pincode).up()),
              a.isNotEmptyString(K.salesTaxNumber) &&
                (d = d
                  .ele("UDF:TRADERCONSVATTINNO.LIST", {
                    DESC: "TraderConsVATTINNo",
                    ISLIST: "YES",
                    TYPE: "String",
                    INDEX: "10015",
                  })
                  .ele("UDF:TRADERCONSVATTINNO", { DESC: "TraderConsVATTINNo" }, K.salesTaxNumber)
                  .up()
                  .up()));
          }
          return (u += d = d.up().up().up().up().end({ pretty: !0 }));
        }),
        e
      );
    })();
  t.default = u;
};
