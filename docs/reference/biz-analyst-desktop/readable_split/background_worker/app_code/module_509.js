// webpack module #509 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(110),
    a = r(5),
    i = r(0),
    o = r(227),
    s = r(8),
    u = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            a.Master.compare(this.id, e.id) &&
            a.Master.compare(this.masterId, e.masterId) &&
            a.Master.compare(this.amount, e.amount) &&
            a.Master.compare(this.tax, e.tax) &&
            a.Master.compare(this.desc, e.desc) &&
            a.Master.compare(this.descList, e.descList) &&
            a.Master.compare(this.hsnCode, e.hsnCode) &&
            a.Master.compare(this.gstAppropriateTo, e.gstAppropriateTo) &&
            a.Master.compare(this.appropriateFor, e.appropriateFor) &&
            a.Master.compare(this.gstTypeOfSupply, e.gstTypeOfSupply) &&
            a.Master.compare(this.exciseAllocType, e.exciseAllocType) &&
            a.Master.compare(this.rateDetails, e.rateDetails)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((i.Util.assign(r, t), i.Util.isNotNull(t.rateDetails) && t.rateDetails.length > 0)) {
            r.rateDetails = [];
            for (var n = 0, a = t.rateDetails; n < a.length; n++) {
              var s = a[n];
              r.rateDetails.push(o.default.toObject(s));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          ((a.id = i.TallyUtil.getJsonValue(t, "ledgername")),
            (a.masterId = n.default.getLedgerMasterId(a.id)),
            (a.amount = i.TallyUtil.parseAmount(i.TallyUtil.getJsonValue(t, "amount"))),
            void 0 !== t["basicrateofinvoicetax.list"] &&
            void 0 !== t["basicrateofinvoicetax.list"].basicrateofinvoicetax
              ? (a.tax = i.TallyUtil.parseNumber(
                  i.TallyUtil.getJsonValue(
                    t["basicrateofinvoicetax.list"],
                    "basicrateofinvoicetax",
                  ),
                ))
              : void 0 !== t["rateofinvoicetax.list"] &&
                void 0 !== t["rateofinvoicetax.list"].rateofinvoicetax &&
                (a.tax = i.TallyUtil.parseNumber(
                  i.TallyUtil.getJsonValue(t["rateofinvoicetax.list"], "rateofinvoicetax"),
                )));
          var u = i.TallyUtil.getChargeDescription(t, "udf:userdescription.list");
          (i.Util.isNotNull(u) && (a.desc = u),
            (a.descList = i.TallyUtil.getChargeDescriptionList(t, "udf:userdescription.list")),
            (a.hsnCode = i.TallyUtil.getStringValue(t, "gsthsnname")),
            (a.gstAppropriateTo = i.TallyUtil.getStringValue(t, "gstappropriateto")),
            i.Util.isNotEmptyString(a.gstAppropriateTo) &&
              s.default.GST_APPROPRIATE_TO_NEW === a.gstAppropriateTo &&
              (a.gstAppropriateTo = s.default.GST_APPROPRIATE_TO_OLD),
            (a.appropriateFor = i.TallyUtil.getStringValue(t, "appropriatefor")),
            i.Util.isEmptyString(a.appropriateFor) && (a.appropriateFor = s.default.NOT_APPLICABLE),
            (a.exciseAllocType = i.TallyUtil.getStringValue(t, "excisealloctype")),
            (a.gstTypeOfSupply = i.TallyUtil.getStringValue(t, "gstovrdntypeofsupply")));
          var p = i.TallyUtil.parseArray(i.TallyUtil.getJsonValue(t, "ratedetails.list"));
          if (i.Util.isFilledArray(p)) {
            for (var c = [], l = 0; l < p.length; ++l)
              null !== p[l] && void 0 !== p[l] && c.push(o.default.convert(p[l]));
            a.rateDetails = c;
          }
          return a;
        }),
        e
      );
    })();
  t.default = u;
};
