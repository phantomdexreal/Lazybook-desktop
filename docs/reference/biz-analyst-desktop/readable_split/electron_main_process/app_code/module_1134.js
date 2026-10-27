// webpack module #1134 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var i =
    (this && this.__assign) ||
    function () {
      return (i =
        Object.assign ||
        function (e) {
          for (var t, r = 1, i = arguments.length; r < i; r++)
            for (var a in (t = arguments[r]))
              Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
          return e;
        }).apply(this, arguments);
    };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var a = r(2),
    o = r(11),
    s = r(65),
    n = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e, t, r) {
          if (a.Util.isEmptyString(e.name))
            throw new Error("StockItem name or parent group can not be null");
          var n = e.parentGroup;
          (a.Util.isNull(e.parentGroup) || a.Util.isEmptyString(e.parentGroup)) && (n = "");
          var u = { PARENT: n };
          if (!0 === e.gstApplicable) {
            ((u.GSTAPPLICABLE = "#bracket Applicable"),
              a.Util.isNotEmptyString(e.desc) && (u.DESCRIPTION = e.desc),
              a.Util.isNotEmptyString(e.unit) &&
                ((u.BASEUNITS = e.unit), (u.VATBASEUNIT = e.unit)));
            var p = [];
            (a.Util.isNumber(e.cgst) &&
              e.cgst >= 0 &&
              p.push({
                GSTRATEDUTYHEAD: r
                  ? o.default.DUTY_HEADS_NEW.CENTRAL_TAX
                  : o.default.DUTY_HEADS_OLD.CENTRAL_TAX,
                GSTRATEVALUATIONTYPE: "Based on Value",
                GSTRATE: e.cgst,
              }),
              a.Util.isNumber(e.sgst) &&
                e.sgst >= 0 &&
                p.push({
                  GSTRATEDUTYHEAD: r
                    ? o.default.DUTY_HEADS_NEW.STATE_TAX
                    : o.default.DUTY_HEADS_OLD.STATE_TAX,
                  GSTRATEVALUATIONTYPE: "Based on Value",
                  GSTRATE: e.sgst,
                }),
              a.Util.isNumber(e.igst) &&
                e.igst >= 0 &&
                p.push({
                  GSTRATEDUTYHEAD: r
                    ? o.default.DUTY_HEADS_NEW.INTEGRATED_TAX
                    : o.default.DUTY_HEADS_OLD.INTEGRATED_TAX,
                  GSTRATEVALUATIONTYPE: "Based on Value",
                  GSTRATE: e.igst,
                }),
              a.Util.isNumber(e.cess) &&
                e.cess >= 0 &&
                p.push({
                  GSTRATEDUTYHEAD: r
                    ? o.default.DUTY_HEADS_NEW.CESS
                    : o.default.DUTY_HEADS_OLD.CESS,
                  GSTRATEVALUATIONTYPE: "Based on Value",
                  GSTRATE: e.cess,
                }),
              a.Util.isNumber(e.cessOnRate) &&
                e.cessOnRate >= 0 &&
                p.push({
                  GSTRATEDUTYHEAD: "Cess on Qty",
                  GSTRATEVALUATIONTYPE: "Based on Quantity",
                  GSTRATE: e.cessOnRate,
                }));
            var c = {
              "STATEWISEDETAILS.LIST": { STATENAME: "#bracket Any", "RATEDETAILS.LIST": p },
            };
            ((u["GSTDETAILS.LIST"] = {
              APPLICABLEFROM: a.DateUtil.format(a.DateUtil.now(), a.DateUtil.FORMAT_YYYYMMDD),
            }),
              r &&
                (u["GSTDETAILS.LIST"].SRCOFGSTDETAILS =
                  o.default.GST_SOURCE_TYPES.SPECIFY_DETAILS_HERE),
              a.Util.isNotEmptyString(e.hsnCode) &&
                (r
                  ? (u["HSNDETAILS.LIST"] = {
                      HSNCODE: e.hsnCode,
                      SRCOFHSNDETAILS: o.default.HSN_SOURCE_TYPES.SPECIFY_DETAILS_HERE,
                      APPLICABLEFROM: a.DateUtil.format(
                        a.DateUtil.now(),
                        a.DateUtil.FORMAT_YYYYMMDD,
                      ),
                    })
                  : (u["GSTDETAILS.LIST"].HSNCODE = e.hsnCode)),
              (u["GSTDETAILS.LIST"] = i({}, u["GSTDETAILS.LIST"], { TAXABILITY: "Taxable" }, c)));
          } else
            ((u.GSTAPPLICABLE = "#bracket Not Applicable"),
              a.Util.isNotEmptyString(e.desc) && (u.DESCRIPTION = e.desc),
              a.Util.isNotEmptyString(e.unit) &&
                ((u.BASEUNITS = e.unit), (u.VATBASEUNIT = e.unit)));
          var m = [];
          if (a.Util.isFilledArray(e.standardCostList)) {
            for (var l = 0, d = e.standardCostList; l < d.length; l++) {
              var y = d[l];
              m.push({
                DATE: a.DateUtil.format(y.date, a.DateUtil.FORMAT_YYYYMMDD),
                RATE: y.rate + "/" + y.rateUnit,
              });
            }
            u["STANDARDCOSTLIST.LIST"] = m;
          }
          var b = [];
          if (a.Util.isFilledArray(e.standardPriceList)) {
            for (var h = 0, g = e.standardPriceList; h < g.length; h++) {
              var S = g[h];
              b.push({
                DATE: a.DateUtil.format(S.date, a.DateUtil.FORMAT_YYYYMMDD),
                RATE: S.rate + "/" + S.rateUnit,
              });
            }
            u["STANDARDPRICELIST.LIST"] = b;
          }
          (a.Util.isFilledArray(b) || a.Util.isFilledArray(m)) && (u.ISCOSTTRACKINGON = "Yes");
          var f = [];
          if (a.Util.isFilledArray(e.mrpDetails)) {
            for (var A = 0, N = e.mrpDetails; A < N.length; A++) {
              var I = N[A],
                T = { FROMDATE: a.DateUtil.format(I.date, a.DateUtil.FORMAT_YYYYMMDD) };
              ((T["MRPRATEDETAILS.LIST"] = { MRPRATE: I.rate + "/" + I.rateUnit }), f.push(T));
            }
            u["MRPDETAILS.LIST"] = f;
          }
          a.Util.isFilledArray(f) && (u.MODIFYMRPRATE = "Yes");
          var M = {
              ENVELOPE: {
                HEADER: { TALLYREQUEST: "Import Data" },
                BODY: {
                  IMPORTDATA: {
                    REQUESTDESC: {
                      REPORTNAME: "All Masters",
                      STATICVARIABLES: { SVCURRENTCOMPANY: t.tallyCompanyName.trim() },
                    },
                    REQUESTDATA: {
                      TALLYMESSAGE: {
                        "@xmlns:UDF": "TallyUDF",
                        STOCKITEM: i(
                          {
                            "@NAME": e.name,
                            "@RESERVEDNAME": "",
                            "LANGUAGENAME.LIST": {
                              "NAME.LIST": { "@TYPE": "String", NAME: e.name },
                              LANGUAGEID: 1033,
                            },
                          },
                          u,
                        ),
                      },
                    },
                  },
                },
              },
            },
            v = s.create(M).end({ pretty: !0 });
          return (v = v.replace(/#bracket/g, "&#4;"));
        }),
        e
      );
    })();
  t.default = n;
};
