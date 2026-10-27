// webpack module #1102 (from background_worker, BA Mobile Connector 8.4.41)
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
          for (
            var r = t.tallyCompanyName.trim(),
              i = a
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
              o = 0,
              s = e;
            o < s.length;
            o++
          ) {
            var u = s[o],
              p = n.formatDDMMMYYYY(u.startDate, t.timezone),
              c = n.formatDDMMMYYYY(u.endDate, t.timezone);
            i = i.ele("REPEATSET").ele("SVFROMDATE", p).up().ele("SVTODATE", c).up().up();
          }
          return (i = i.up().up().up()).end({ pretty: !0 });
        }),
        e
      );
    })();
  t.default = i;
};
