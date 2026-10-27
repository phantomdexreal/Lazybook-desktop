// webpack module #588 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = "##PARAM##",
    a =
      "<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>Export</TALLYREQUEST><TYPE>Function</TYPE><ID>$$ProdInfo</ID></HEADER><BODY><DESC><FUNCPARAMLIST><PARAM>" +
      i +
      "</PARAM></FUNCPARAMLIST></DESC></BODY></ENVELOPE>",
    o = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e) {
          var t = a;
          return (t = t.replace(i, e));
        }),
        (e.PARAM_PRODUCT_NAME = "Prod Name"),
        (e.PARAM_BUILD_NUMBER = "Prod Build Number"),
        (e.PARAM_VERSION_STRING = "Prod Release As Str"),
        e
      );
    })();
  t.default = o;
};
