// webpack module #1091 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = "##COMPANY##",
    i =
      "<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>EXPORT</TALLYREQUEST><TYPE>Collection</TYPE><ID>TestTestGstDetSum</ID></HEADER><BODY><DESC><STATICVARIABLES><SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>" +
      a +
      '</STATICVARIABLES><TDL><TDLMESSAGE><COLLECTION NAME="TestTestGstDetSum" ISMODIFY="No"><TYPE>TaxUnit</TYPE><WALK>GSTDetails</WALK><COMPUTE>AppFrom:$ApplicableFrom</COMPUTE><COMPUTE>EInvAppl:$IsGSTeInvApplicable</COMPUTE><COMPUTE>EInvApplFrom:$GSTeInvApplicableDate</COMPUTE><COMPUTE> GSTeInvBillFromPlace: $GSTeInvBillFromPlace </COMPUTE><COMPUTE> GSTeInvReportPeriod:$GSTeInvReportPeriod </COMPUTE><COMPUTE> IsGSTeInvInclEWayBill:$IsGSTeInvInclEWayBill </COMPUTE><COMPUTE> IseWayBillApplicable: $IseWayBillApplicable </COMPUTE><COMPUTE> EWayBillApplicableDate: $EWayBillApplicableDate </COMPUTE><COMPUTE> EWayBillApplicableType: $EWayBillApplicableType </COMPUTE><COMPUTE> EWayBillApplicableAmount: $EWayBillApplicableAmount </COMPUTE><COMPUTE> IseWayBillApplicableForIntra: $IseWayBillApplicableForIntra </COMPUTE><COMPUTE> EWayBillApplicableAmountIntra: $EWayBillApplicableAmountIntra </COMPUTE></COLLECTION></TDLMESSAGE></TDL></DESC></BODY></ENVELOPE>',
    o = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e) {
          var t = i,
            r = "";
          n.Util.isNotNull(e) &&
            n.Util.isNotEmpty(e.tallyCompanyName) &&
            ((r =
              "<SVCURRENTCOMPANY>" +
              n.TallyUtil.encode(e.tallyCompanyName) +
              "</SVCURRENTCOMPANY>"),
            (t = t.replace(a, r)));
          return t;
        }),
        e
      );
    })();
  t.default = o;
};
