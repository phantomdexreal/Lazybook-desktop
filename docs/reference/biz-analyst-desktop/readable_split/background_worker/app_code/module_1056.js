// webpack module #1056 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(59),
    a = r(0),
    i = "##COMPANY##",
    o = "##START_DATE##",
    s = "##END_DATE##",
    u = "##MASTER_TYPE##",
    p = "##KEYS##",
    c = "##FILTERS##",
    l = "##FORMULAE##",
    m =
      "<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>Export</TALLYREQUEST><TYPE>Collection</TYPE><ID>On Account Balance</ID></HEADER><BODY><DESC><STATICVARIABLES>" +
      i +
      o +
      s +
      '<SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT></STATICVARIABLES><TDL><TDLMESSAGE><COLLECTION NAME="On Account Balance" ISMODIFY="No">' +
      u +
      p +
      c +
      "</COLLECTION>" +
      l +
      "</TDLMESSAGE></TDL></DESC></BODY></ENVELOPE>",
    d = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e, t) {
          var r = m,
            d = "",
            y = "",
            b = "",
            h = "",
            f = "",
            g = "";
          if (a.Util.isNotNull(t)) {
            if (a.Util.isNotNull(t.company) && a.Util.isNotEmpty(t.company.tallyCompanyName)) {
              new n.default();
              d =
                "<SVCURRENTCOMPANY>" +
                a.TallyUtil.encode(t.company.tallyCompanyName) +
                "</SVCURRENTCOMPANY>";
            }
            if (a.Util.isNotNull(t.dateRange)) {
              if (a.Util.isNotNull(t.dateRange.start)) {
                var M = a.DateUtil.formatDDMMMYYYY(t.dateRange.start, t.company.timezone);
                y = '<SVFROMDATE TYPE="Date">' + a.TallyUtil.encode(M) + "</SVFROMDATE>";
              }
              if (a.Util.isNotNull(t.dateRange.end)) {
                var S = a.DateUtil.formatDDMMMYYYY(t.dateRange.end, t.company.timezone);
                b = '<SVTODATE TYPE="Date">' + a.TallyUtil.encode(S) + "</SVTODATE>";
              }
            }
            h = "<TYPE>" + a.TallyUtil.encode(e.getName()) + "</TYPE>";
            ((f = "<FETCH>" + (a.Util.isNotNull(t.keys) ? t.keys : e.getKeys()) + "</FETCH>"),
              (g += '<SYSTEM TYPE="FORMULAE" NAME="FilterVouchers"/>'));
          }
          return (r = (r = (r = (r = (r = (r = (r = r.replace(i, d)).replace(o, y)).replace(
            s,
            b,
          )).replace(u, h)).replace(p, f)).replace(c, "")).replace(l, g));
        }),
        e
      );
    })();
  t.default = d;
};
