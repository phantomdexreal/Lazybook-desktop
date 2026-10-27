// webpack module #547 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(119),
    a = r(5),
    o = r(2),
    s = r(241),
    n = r(11),
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
          if ((o.Util.assign(r, t), o.Util.isNotNull(t.rateDetails) && t.rateDetails.length > 0)) {
            r.rateDetails = [];
            for (var i = 0, a = t.rateDetails; i < a.length; i++) {
              var n = a[i];
              r.rateDetails.push(s.default.toObject(n));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          ((a.id = o.TallyUtil.getJsonValue(t, "ledgername")),
            (a.masterId = i.default.getLedgerMasterId(a.id)),
            (a.amount = o.TallyUtil.parseAmount(o.TallyUtil.getJsonValue(t, "amount"))),
            void 0 !== t["basicrateofinvoicetax.list"] &&
            void 0 !== t["basicrateofinvoicetax.list"].basicrateofinvoicetax
              ? (a.tax = o.TallyUtil.parseNumber(
                  o.TallyUtil.getJsonValue(
                    t["basicrateofinvoicetax.list"],
                    "basicrateofinvoicetax",
                  ),
                ))
              : void 0 !== t["rateofinvoicetax.list"] &&
                void 0 !== t["rateofinvoicetax.list"].rateofinvoicetax &&
                (a.tax = o.TallyUtil.parseNumber(
                  o.TallyUtil.getJsonValue(t["rateofinvoicetax.list"], "rateofinvoicetax"),
                )));
          var u = o.TallyUtil.getChargeDescription(t, "udf:userdescription.list");
          (o.Util.isNotNull(u) && (a.desc = u),
            (a.descList = o.TallyUtil.getChargeDescriptionList(t, "udf:userdescription.list")),
            (a.hsnCode = o.TallyUtil.getStringValue(t, "gsthsnname")),
            (a.gstAppropriateTo = o.TallyUtil.getStringValue(t, "gstappropriateto")),
            o.Util.isNotEmptyString(a.gstAppropriateTo) &&
              n.default.GST_APPROPRIATE_TO_NEW === a.gstAppropriateTo &&
              (a.gstAppropriateTo = n.default.GST_APPROPRIATE_TO_OLD),
            (a.appropriateFor = o.TallyUtil.getStringValue(t, "appropriatefor")),
            o.Util.isEmptyString(a.appropriateFor) && (a.appropriateFor = n.default.NOT_APPLICABLE),
            (a.exciseAllocType = o.TallyUtil.getStringValue(t, "excisealloctype")),
            (a.gstTypeOfSupply = o.TallyUtil.getStringValue(t, "gstovrdntypeofsupply")));
          var p = o.TallyUtil.parseArray(o.TallyUtil.getJsonValue(t, "ratedetails.list"));
          if (o.Util.isFilledArray(p)) {
            for (var c = [], m = 0; m < p.length; ++m)
              null !== p[m] && void 0 !== p[m] && c.push(s.default.convert(p[m]));
            a.rateDetails = c;
          }
          return a;
        }),
        e
      );
    })();
  t.default = u;
};
