// webpack module #1139 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(60),
    a = r(2),
    o = "##COMPANY##",
    s = "##START_DATE##",
    n = "##END_DATE##",
    u = "##MASTER_TYPE##",
    p = "##KEYS##",
    c = "##FILTERS##",
    m = "##FORMULAE##",
    l =
      "<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>Export</TALLYREQUEST><TYPE>Collection</TYPE><ID>On Account Balance</ID></HEADER><BODY><DESC><STATICVARIABLES>" +
      o +
      s +
      n +
      '<SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT></STATICVARIABLES><TDL><TDLMESSAGE><COLLECTION NAME="On Account Balance" ISMODIFY="No">' +
      u +
      p +
      c +
      "</COLLECTION>" +
      m +
      "</TDLMESSAGE></TDL></DESC></BODY></ENVELOPE>",
    d = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e, t) {
          var r = l,
            d = "",
            y = "",
            b = "",
            h = "",
            g = "",
            S = "";
          if (a.Util.isNotNull(t)) {
            if (a.Util.isNotNull(t.company) && a.Util.isNotEmpty(t.company.tallyCompanyName)) {
              new i.default();
              d =
                "<SVCURRENTCOMPANY>" +
                a.TallyUtil.encode(t.company.tallyCompanyName) +
                "</SVCURRENTCOMPANY>";
            }
            if (a.Util.isNotNull(t.dateRange)) {
              if (a.Util.isNotNull(t.dateRange.start)) {
                var f = a.DateUtil.formatDDMMMYYYY(t.dateRange.start, t.company.timezone);
                y = '<SVFROMDATE TYPE="Date">' + a.TallyUtil.encode(f) + "</SVFROMDATE>";
              }
              if (a.Util.isNotNull(t.dateRange.end)) {
                var A = a.DateUtil.formatDDMMMYYYY(t.dateRange.end, t.company.timezone);
                b = '<SVTODATE TYPE="Date">' + a.TallyUtil.encode(A) + "</SVTODATE>";
              }
            }
            h = "<TYPE>" + a.TallyUtil.encode(e.getName()) + "</TYPE>";
            ((g = "<FETCH>" + (a.Util.isNotNull(t.keys) ? t.keys : e.getKeys()) + "</FETCH>"),
              (S += '<SYSTEM TYPE="FORMULAE" NAME="FilterVouchers"/>'));
          }
          return (r = (r = (r = (r = (r = (r = (r = r.replace(o, d)).replace(s, y)).replace(
            n,
            b,
          )).replace(u, h)).replace(p, g)).replace(c, "")).replace(m, S));
        }),
        e
      );
    })();
  t.default = d;
};
