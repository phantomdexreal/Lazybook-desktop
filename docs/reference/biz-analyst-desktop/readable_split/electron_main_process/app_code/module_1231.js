// webpack module #1231 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(52),
    a = r(65),
    o = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e, t) {
          for (
            var r = t.tallyCompanyName.trim(),
              o = a
                .create("ENVELOPE", { encoding: "UTF-8" })
                .ele("HEADER")
                .ele("VERSION", "1")
                .up()
                .ele("TALLYREQUEST", "Export")
                .up()
                .ele("TYPE", "Data")
                .up()
                .ele("ID", "Statistics")
                .up()
                .up()
                .ele("BODY")
                .ele("DESC")
                .ele("STATICVARIABLES")
                .ele("SVEXPORTFORMAT", "$$SysName:XML")
                .up()
                .ele("SVCURRENTCOMPANY", r)
                .up()
                .up()
                .ele("REPEATVARIABLES"),
              s = 0,
              n = e;
            s < n.length;
            s++
          ) {
            var u = n[s],
              p = i.formatDDMMMYYYY(u.startDate, t.timezone),
              c = i.formatDDMMMYYYY(u.endDate, t.timezone);
            o = o.ele("REPEATSET").ele("SVFROMDATE", p).up().ele("SVTODATE", c).up().up();
          }
          return (o = o.up().up().up()).end({ pretty: !0 });
        }),
        e
      );
    })();
  t.default = o;
};
