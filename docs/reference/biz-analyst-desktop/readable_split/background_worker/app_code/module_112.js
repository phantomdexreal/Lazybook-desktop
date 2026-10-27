// webpack module #112 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = "##PARAM##",
    a =
      "<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>Export</TALLYREQUEST><TYPE>Function</TYPE><ID>$$ProdInfo</ID></HEADER><BODY><DESC><FUNCPARAMLIST><PARAM>" +
      n +
      "</PARAM></FUNCPARAMLIST></DESC></BODY></ENVELOPE>",
    i = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e) {
          var t = a;
          return (t = t.replace(n, e));
        }),
        (e.PARAM_PRODUCT_NAME = "Prod Name"),
        (e.PARAM_BUILD_NUMBER = "Prod Build Number"),
        (e.PARAM_VERSION_STRING = "Prod Release As Str"),
        e
      );
    })();
  t.default = i;
};
