// webpack module #1094 (from background_worker, BA Mobile Connector 8.4.41)
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
      "<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>Export</TALLYREQUEST><TYPE>Collection</TYPE><ID>Collection of Ledgers</ID></HEADER><BODY><DESC><STATICVARIABLES>" +
      i +
      o +
      s +
      '<SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT></STATICVARIABLES><TDL><TDLMESSAGE><COLLECTION NAME="Collection of Ledgers" ISMODIFY="No">' +
      u +
      p +
      c +
      "</COLLECTION>" +
      l +
      "</TDLMESSAGE></TDL></DESC></BODY></ENVELOPE>",
    d =
      "<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>Export</TALLYREQUEST><TYPE>Collection</TYPE><ID>Collection of Ledgers Details</ID></HEADER><BODY><DESC><STATICVARIABLES>" +
      i +
      o +
      s +
      '<SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT></STATICVARIABLES><TDL><TDLMESSAGE><COLLECTION NAME="Collection of Ledgers" ISMODIFY="No">' +
      u +
      p +
      c +
      '</COLLECTION><COLLECTION NAME="Collection of Ledgers Details" ISMODIFY="No"><SOURCECOLLECTION>Collection of Ledgers</SOURCECOLLECTION><FETCH>*</FETCH></COLLECTION>' +
      l +
      "</TDLMESSAGE></TDL></DESC></BODY></ENVELOPE>",
    y = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e, t, r) {
          void 0 === r && (r = !1);
          var y = m;
          r && (y = d);
          var b = "",
            h = "",
            f = "",
            g = "",
            M = "",
            S = "",
            A = "";
          if (a.Util.isNotNull(t)) {
            if (a.Util.isNotNull(t.company) && a.Util.isNotEmpty(t.company.tallyCompanyName)) {
              new n.default();
              b =
                "<SVCURRENTCOMPANY>" +
                a.TallyUtil.encode(t.company.tallyCompanyName) +
                "</SVCURRENTCOMPANY>";
            }
            if (a.Util.isNotNull(t.dateRange)) {
              if (a.Util.isNotNull(t.dateRange.start)) {
                var O = a.DateUtil.formatDDMMMYYYY(t.dateRange.start, t.company.timezone);
                h = '<SVFROMDATE TYPE="Date">' + a.TallyUtil.encode(O) + "</SVFROMDATE>";
              }
              if (a.Util.isNotNull(t.dateRange.end)) {
                var N = a.DateUtil.formatDDMMMYYYY(t.dateRange.end, t.company.timezone);
                f = '<SVTODATE TYPE="Date">' + a.TallyUtil.encode(N) + "</SVTODATE>";
              }
            }
            g = "<TYPE>" + a.TallyUtil.encode(e.getName()) + "</TYPE>";
            if (
              ((M = "<FETCH>" + (a.Util.isNotNull(t.keys) ? t.keys : e.getKeys()) + "</FETCH>"),
              a.Util.isNotNull(t.filters) && t.filters.length > 0)
            ) {
              for (var v = [], T = 0, z = t.filters; T < z.length; T++) {
                var I = z[T];
                if (
                  (v.push(a.TallyUtil.encode(I.name)),
                  a.Util.isNotNull(I.values) && I.values.length > 0)
                ) {
                  var q = [];
                  A += '<SYSTEM TYPE="FORMULAE" NAME="' + a.TallyUtil.encode(I.name) + '">';
                  for (var k = 0, R = I.values; k < R.length; k++) {
                    var C = R[k],
                      E = "";
                    if (a.Util.isNull(C.value)) E = "";
                    else if (a.Util.isNumber(C.value)) E = C.value.toString();
                    else {
                      if (!a.Util.isString(C.value))
                        throw new Error(
                          "Filter value of type: " + typeof C.value + " not implemented",
                        );
                      E = ' "' + a.TallyUtil.encode(C.value) + '" ';
                    }
                    q.push(
                      "$" +
                        a.TallyUtil.encode(I.key) +
                        " " +
                        a.TallyUtil.encode(C.operator) +
                        " " +
                        E,
                    );
                  }
                  ((A += q.join(" " + a.TallyUtil.encode(I.joinOperator) + " ")),
                    (A += "</SYSTEM>"));
                }
              }
              S = "<FILTERS>" + v.join(",") + "</FILTERS>";
            }
          }
          return (y = (y = (y = (y = (y = (y = (y = y.replace(i, b)).replace(o, h)).replace(
            s,
            f,
          )).replace(u, g)).replace(p, M)).replace(c, S)).replace(l, A));
        }),
        e
      );
    })();
  t.default = y;
};
