// webpack module #1224 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = "##PARAM##",
    a =
      "<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>Export</TALLYREQUEST><TYPE>Function</TYPE><ID>$$LicenseInfo</ID></HEADER><BODY><DESC><FUNCPARAMLIST><PARAM>" +
      i +
      "</PARAM></FUNCPARAMLIST></DESC></BODY></ENVELOPE>",
    o = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e) {
          var t = a;
          return (t = t.replace(i, e));
        }),
        (e.PARAM_SERIAL_NUMBER = "Serial Number"),
        (e.PARAM_ISINDIAN = "IsIndian"),
        (e.PARAM_ACCOUNT_ID = "Account ID"),
        (e.PARAM_IS_GOLD = "IsGold"),
        (e.PARAM_IS_SILVER = "IsSilver"),
        (e.PARAM_IS_EDUCATIONAL_MODE = "IsEducationalMode"),
        (e.PARAM_IS_LICENSED_MODE = "IsLicensedMode"),
        e
      );
    })();
  t.default = o;
};
