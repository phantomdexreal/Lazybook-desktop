// webpack module #1092 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(59),
    a = r(0),
    i = "##COMPANY##",
    o =
      "<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>EXPORT</TALLYREQUEST><TYPE>DATA</TYPE><ID>Company GST Details</ID></HEADER><BODY><DESC><STATICVARIABLES><SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>" +
      i +
      "</STATICVARIABLES></DESC></BODY></ENVELOPE>",
    s = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e) {
          var t = o,
            r = "";
          if (a.Util.isNotNull(e.company) && a.Util.isNotEmpty(e.company.tallyCompanyName)) {
            new n.default();
            (r =
              "<SVCURRENTCOMPANY>" +
              a.TallyUtil.encode(e.company.tallyCompanyName) +
              "</SVCURRENTCOMPANY>"),
              (t = t.replace(i, r));
          }
          return t;
        }),
        e
      );
    })();
  t.default = s;
};
