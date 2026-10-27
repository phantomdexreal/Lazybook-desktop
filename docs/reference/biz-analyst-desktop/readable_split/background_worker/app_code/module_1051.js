// webpack module #1051 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var n =
    (this && this.__assign) ||
    function () {
      return (n =
        Object.assign ||
        function (e) {
          for (var t, r = 1, n = arguments.length; r < n; r++)
            for (var a in (t = arguments[r]))
              Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
          return e;
        }).apply(this, arguments);
    };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var a = r(0),
    i = r(8),
    o = r(70),
    s = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e, t, r) {
          if (a.Util.isEmptyString(e.name))
            throw new Error("StockItem name or parent group can not be null");
          var s = e.parentGroup;
          (a.Util.isNull(e.parentGroup) || a.Util.isEmptyString(e.parentGroup)) && (s = "");
          var u = { PARENT: s };
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
                  ? i.default.DUTY_HEADS_NEW.CENTRAL_TAX
                  : i.default.DUTY_HEADS_OLD.CENTRAL_TAX,
                GSTRATEVALUATIONTYPE: "Based on Value",
                GSTRATE: e.cgst,
              }),
              a.Util.isNumber(e.sgst) &&
                e.sgst >= 0 &&
                p.push({
                  GSTRATEDUTYHEAD: r
                    ? i.default.DUTY_HEADS_NEW.STATE_TAX
                    : i.default.DUTY_HEADS_OLD.STATE_TAX,
                  GSTRATEVALUATIONTYPE: "Based on Value",
                  GSTRATE: e.sgst,
                }),
              a.Util.isNumber(e.igst) &&
                e.igst >= 0 &&
                p.push({
                  GSTRATEDUTYHEAD: r
                    ? i.default.DUTY_HEADS_NEW.INTEGRATED_TAX
                    : i.default.DUTY_HEADS_OLD.INTEGRATED_TAX,
                  GSTRATEVALUATIONTYPE: "Based on Value",
                  GSTRATE: e.igst,
                }),
              a.Util.isNumber(e.cess) &&
                e.cess >= 0 &&
                p.push({
                  GSTRATEDUTYHEAD: r
                    ? i.default.DUTY_HEADS_NEW.CESS
                    : i.default.DUTY_HEADS_OLD.CESS,
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
                  i.default.GST_SOURCE_TYPES.SPECIFY_DETAILS_HERE),
              a.Util.isNotEmptyString(e.hsnCode) &&
                (r
                  ? (u["HSNDETAILS.LIST"] = {
                      HSNCODE: e.hsnCode,
                      SRCOFHSNDETAILS: i.default.HSN_SOURCE_TYPES.SPECIFY_DETAILS_HERE,
                      APPLICABLEFROM: a.DateUtil.format(
                        a.DateUtil.now(),
                        a.DateUtil.FORMAT_YYYYMMDD,
                      ),
                    })
                  : (u["GSTDETAILS.LIST"].HSNCODE = e.hsnCode)),
              (u["GSTDETAILS.LIST"] = n({}, u["GSTDETAILS.LIST"], { TAXABILITY: "Taxable" }, c)));
          } else
            ((u.GSTAPPLICABLE = "#bracket Not Applicable"),
              a.Util.isNotEmptyString(e.desc) && (u.DESCRIPTION = e.desc),
              a.Util.isNotEmptyString(e.unit) &&
                ((u.BASEUNITS = e.unit), (u.VATBASEUNIT = e.unit)));
          var l = [];
          if (a.Util.isFilledArray(e.standardCostList)) {
            for (var m = 0, d = e.standardCostList; m < d.length; m++) {
              var y = d[m];
              l.push({
                DATE: a.DateUtil.format(y.date, a.DateUtil.FORMAT_YYYYMMDD),
                RATE: y.rate + "/" + y.rateUnit,
              });
            }
            u["STANDARDCOSTLIST.LIST"] = l;
          }
          var b = [];
          if (a.Util.isFilledArray(e.standardPriceList)) {
            for (var h = 0, f = e.standardPriceList; h < f.length; h++) {
              var g = f[h];
              b.push({
                DATE: a.DateUtil.format(g.date, a.DateUtil.FORMAT_YYYYMMDD),
                RATE: g.rate + "/" + g.rateUnit,
              });
            }
            u["STANDARDPRICELIST.LIST"] = b;
          }
          (a.Util.isFilledArray(b) || a.Util.isFilledArray(l)) && (u.ISCOSTTRACKINGON = "Yes");
          var M = [];
          if (a.Util.isFilledArray(e.mrpDetails)) {
            for (var S = 0, A = e.mrpDetails; S < A.length; S++) {
              var O = A[S],
                N = { FROMDATE: a.DateUtil.format(O.date, a.DateUtil.FORMAT_YYYYMMDD) };
              ((N["MRPRATEDETAILS.LIST"] = { MRPRATE: O.rate + "/" + O.rateUnit }), M.push(N));
            }
            u["MRPDETAILS.LIST"] = M;
          }
          a.Util.isFilledArray(M) && (u.MODIFYMRPRATE = "Yes");
          var v = {
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
                        STOCKITEM: n(
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
            T = o.create(v).end({ pretty: !0 });
          return (T = T.replace(/#bracket/g, "&#4;"));
        }),
        e
      );
    })();
  t.default = s;
};
