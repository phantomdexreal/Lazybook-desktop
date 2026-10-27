// webpack module #1219 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = "##COMPANY##",
    o =
      "<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>EXPORT</TALLYREQUEST><TYPE>Collection</TYPE><ID>TestTestGstDetSum</ID></HEADER><BODY><DESC><STATICVARIABLES><SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>" +
      a +
      '</STATICVARIABLES><TDL><TDLMESSAGE><COLLECTION NAME="TestTestGstDetSum" ISMODIFY="No"><TYPE>TaxUnit</TYPE><WALK>GSTDetails</WALK><COMPUTE>AppFrom:$ApplicableFrom</COMPUTE><COMPUTE>EInvAppl:$IsGSTeInvApplicable</COMPUTE><COMPUTE>EInvApplFrom:$GSTeInvApplicableDate</COMPUTE><COMPUTE> GSTeInvBillFromPlace: $GSTeInvBillFromPlace </COMPUTE><COMPUTE> GSTeInvReportPeriod:$GSTeInvReportPeriod </COMPUTE><COMPUTE> IsGSTeInvInclEWayBill:$IsGSTeInvInclEWayBill </COMPUTE><COMPUTE> IseWayBillApplicable: $IseWayBillApplicable </COMPUTE><COMPUTE> EWayBillApplicableDate: $EWayBillApplicableDate </COMPUTE><COMPUTE> EWayBillApplicableType: $EWayBillApplicableType </COMPUTE><COMPUTE> EWayBillApplicableAmount: $EWayBillApplicableAmount </COMPUTE><COMPUTE> IseWayBillApplicableForIntra: $IseWayBillApplicableForIntra </COMPUTE><COMPUTE> EWayBillApplicableAmountIntra: $EWayBillApplicableAmountIntra </COMPUTE></COLLECTION></TDLMESSAGE></TDL></DESC></BODY></ENVELOPE>',
    s = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e) {
          var t = o,
            r = "";
          i.Util.isNotNull(e) &&
            i.Util.isNotEmpty(e.tallyCompanyName) &&
            ((r =
              "<SVCURRENTCOMPANY>" +
              i.TallyUtil.encode(e.tallyCompanyName) +
              "</SVCURRENTCOMPANY>"),
            (t = t.replace(a, r)));
          return t;
        }),
        e
      );
    })();
  t.default = s;
};
