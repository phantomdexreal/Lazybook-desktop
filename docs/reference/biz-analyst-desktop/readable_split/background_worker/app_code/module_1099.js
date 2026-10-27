// webpack module #1099 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(45),
    a = r(70),
    i = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e, t) {
          var r = t.tallyCompanyName.trim(),
            i = n.formatDDMMMYYYY(e.startDate, t.timezone),
            o = n.formatDDMMMYYYY(e.endDate, t.timezone);
          return a
            .create("ENVELOPE", { encoding: "UTF-8" })
            .ele("HEADER")
            .ele("VERSION", "1")
            .up()
            .ele("TALLYREQUEST", "Export")
            .up()
            .ele("TYPE", "Data")
            .up()
            .ele("ID", "Trial Balance")
            .up()
            .up()
            .ele("BODY")
            .ele("DESC")
            .ele("STATICVARIABLES")
            .ele("SVEXPORTFORMAT", "$$SysName:XML")
            .up()
            .ele("SVCURRENTCOMPANY", r)
            .up()
            .ele("IsLedgerWise", "Yes")
            .up()
            .ele("EXPLODEFLAG", "No")
            .up()
            .up()
            .ele("REPEATVARIABLES")
            .ele("REPEATSET")
            .ele("SVFROMDATE", i)
            .up()
            .ele("SVTODATE", o)
            .up()
            .up()
            .up()
            .ele("TDL")
            .ele("TDLMESSAGE")
            .ele("REPORT", {
              ISINTERNAL: "No",
              ISOPTION: "No",
              ISINITIALIZE: "No",
              ISFIXED: "No",
              ISMODIFY: "Yes",
              isledgerwise: "Yes",
              NAME: "Trial Balance",
            })
            .ele("SET", "ExplodeFlag:Yes")
            .up()
            .ele("SET", "IsLedgerWise:Yes")
            .up()
            .up()
            .up()
            .up()
            .up()
            .up()
            .end({ pretty: !0 });
        }),
        e
      );
    })();
  t.default = i;
};
