// webpack module #1220 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(60),
    a = r(2),
    o = "##COMPANY##",
    s =
      "<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>EXPORT</TALLYREQUEST><TYPE>DATA</TYPE><ID>Company GST Details</ID></HEADER><BODY><DESC><STATICVARIABLES><SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>" +
      o +
      "</STATICVARIABLES></DESC></BODY></ENVELOPE>",
    n = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e) {
          var t = s,
            r = "";
          if (a.Util.isNotNull(e.company) && a.Util.isNotEmpty(e.company.tallyCompanyName)) {
            new i.default();
            ((r =
              "<SVCURRENTCOMPANY>" +
              a.TallyUtil.encode(e.company.tallyCompanyName) +
              "</SVCURRENTCOMPANY>"),
              (t = t.replace(o, r)));
          }
          return t;
        }),
        e
      );
    })();
  t.default = n;
};
