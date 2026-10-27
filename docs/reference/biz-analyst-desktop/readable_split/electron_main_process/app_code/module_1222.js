// webpack module #1222 (from electron_main_process, BA Mobile Connector 8.4.41)
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
      "<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>Export</TALLYREQUEST><TYPE>Collection</TYPE><ID>Collection of Ledgers</ID></HEADER><BODY><DESC><STATICVARIABLES>" +
      o +
      s +
      n +
      '<SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT></STATICVARIABLES><TDL><TDLMESSAGE><COLLECTION NAME="Collection of Ledgers" ISMODIFY="No">' +
      u +
      p +
      c +
      "</COLLECTION>" +
      m +
      "</TDLMESSAGE></TDL></DESC></BODY></ENVELOPE>",
    d =
      "<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>Export</TALLYREQUEST><TYPE>Collection</TYPE><ID>Collection of Ledgers Details</ID></HEADER><BODY><DESC><STATICVARIABLES>" +
      o +
      s +
      n +
      '<SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT></STATICVARIABLES><TDL><TDLMESSAGE><COLLECTION NAME="Collection of Ledgers" ISMODIFY="No">' +
      u +
      p +
      c +
      '</COLLECTION><COLLECTION NAME="Collection of Ledgers Details" ISMODIFY="No"><SOURCECOLLECTION>Collection of Ledgers</SOURCECOLLECTION><FETCH>*</FETCH></COLLECTION>' +
      m +
      "</TDLMESSAGE></TDL></DESC></BODY></ENVELOPE>",
    y = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e, t, r) {
          void 0 === r && (r = !1);
          var y = l;
          r && (y = d);
          var b = "",
            h = "",
            g = "",
            S = "",
            f = "",
            A = "",
            N = "";
          if (a.Util.isNotNull(t)) {
            if (a.Util.isNotNull(t.company) && a.Util.isNotEmpty(t.company.tallyCompanyName)) {
              new i.default();
              b =
                "<SVCURRENTCOMPANY>" +
                a.TallyUtil.encode(t.company.tallyCompanyName) +
                "</SVCURRENTCOMPANY>";
            }
            if (a.Util.isNotNull(t.dateRange)) {
              if (a.Util.isNotNull(t.dateRange.start)) {
                var I = a.DateUtil.formatDDMMMYYYY(t.dateRange.start, t.company.timezone);
                h = '<SVFROMDATE TYPE="Date">' + a.TallyUtil.encode(I) + "</SVFROMDATE>";
              }
              if (a.Util.isNotNull(t.dateRange.end)) {
                var T = a.DateUtil.formatDDMMMYYYY(t.dateRange.end, t.company.timezone);
                g = '<SVTODATE TYPE="Date">' + a.TallyUtil.encode(T) + "</SVTODATE>";
              }
            }
            S = "<TYPE>" + a.TallyUtil.encode(e.getName()) + "</TYPE>";
            if (
              ((f = "<FETCH>" + (a.Util.isNotNull(t.keys) ? t.keys : e.getKeys()) + "</FETCH>"),
              a.Util.isNotNull(t.filters) && t.filters.length > 0)
            ) {
              for (var M = [], v = 0, k = t.filters; v < k.length; v++) {
                var C = k[v];
                if (
                  (M.push(a.TallyUtil.encode(C.name)),
                  a.Util.isNotNull(C.values) && C.values.length > 0)
                ) {
                  var q = [];
                  N += '<SYSTEM TYPE="FORMULAE" NAME="' + a.TallyUtil.encode(C.name) + '">';
                  for (var R = 0, D = C.values; R < D.length; R++) {
                    var E = D[R],
                      x = "";
                    if (a.Util.isNull(E.value)) x = "";
                    else if (a.Util.isNumber(E.value)) x = E.value.toString();
                    else {
                      if (!a.Util.isString(E.value))
                        throw new Error(
                          "Filter value of type: " + typeof E.value + " not implemented",
                        );
                      x = ' "' + a.TallyUtil.encode(E.value) + '" ';
                    }
                    q.push(
                      "$" +
                        a.TallyUtil.encode(C.key) +
                        " " +
                        a.TallyUtil.encode(E.operator) +
                        " " +
                        x,
                    );
                  }
                  ((N += q.join(" " + a.TallyUtil.encode(C.joinOperator) + " ")),
                    (N += "</SYSTEM>"));
                }
              }
              A = "<FILTERS>" + M.join(",") + "</FILTERS>";
            }
          }
          return (y = (y = (y = (y = (y = (y = (y = y.replace(o, b)).replace(s, h)).replace(
            n,
            g,
          )).replace(u, S)).replace(p, f)).replace(c, A)).replace(m, N));
        }),
        e
      );
    })();
  t.default = y;
};
